import { NextRequest, NextResponse } from "next/server";
import {
  CreateGuestUserRequest,
  CreateGuestUserResponse,
  ApiResponse,
} from "@/types";
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequiredFields,
  validateEmail,
  logRequest,
  logResponse,
  logError,
  ErrorCodes,
  ValidationPatterns,
} from "@/lib/api-utils";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export async function POST(request: NextRequest) {
  try {
    const body: CreateGuestUserRequest = await request.json();

    logRequest("POST", "/api/payments/guest/user", body);

    // Validate request body
    const validationErrors = validateRequiredFields(
      body,
      ValidationPatterns.guestUser
    );
    if (validationErrors.length > 0) {
      const errorResponse = createErrorResponse(
        validationErrors.join(", "),
        ErrorCodes.VALIDATION_ERROR,
        "Validation failed"
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate email format
    if (!validateEmail(body.email)) {
      const errorResponse = createErrorResponse(
        "Invalid email format",
        ErrorCodes.VALIDATION_ERROR,
        "Please provide a valid email address"
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Forward request to backend guest user endpoint
    const response = await fetch(`${BACKEND_URL}/api/users/auth/guest/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle case where user already exists
      if (data.message && data.message.includes("already exists")) {
        const errorResponse = createErrorResponse(
          "User already exists",
          ErrorCodes.USER_EXISTS,
          "An account with this email already exists. Please sign in instead."
        );
        // Add redirectTo to the error response
        const errorWithRedirect = {
          ...errorResponse,
          redirectTo:
            "/signin?callbackUrl=" +
            encodeURIComponent(
              "/checkout?programId=" +
                (body.programId || "global-banking-finance-fellowship")
            ),
        };
        return NextResponse.json(errorWithRedirect, { status: 409 });
      }

      const errorResponse = createErrorResponse(
        data.message || "Failed to create guest user",
        data.code || ErrorCodes.API_ERROR,
        "Failed to create guest user",
        data.details
      );
      return NextResponse.json(errorResponse, { status: response.status });
    }

    const guestUserData: CreateGuestUserResponse = {
      userId: data.data.userId,
      email: data.data.email,
      name: data.data.name,
      phone: body.phone || "",
      isGuest: data.data.isGuest,
      createdAt: new Date().toISOString(),
    };

    const successResponse = createSuccessResponse(
      guestUserData,
      "Guest user created successfully"
    );
    logResponse(200, "Guest user created successfully");
    return NextResponse.json(
      successResponse as ApiResponse<CreateGuestUserResponse>
    );
  } catch (error: unknown) {
    logError(error, "create guest user");

    const errorResponse = createErrorResponse(
      error,
      ErrorCodes.INTERNAL_ERROR,
      "Internal server error"
    );
    return NextResponse.json(errorResponse as ApiResponse, { status: 500 });
  }
}
