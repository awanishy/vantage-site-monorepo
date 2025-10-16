import { NextRequest, NextResponse } from "next/server";
import {
  CreateGuestOrderRequest,
  CreateGuestOrderResponse,
  ApiResponse,
} from "@/types";
import {
  createErrorResponse,
  createSuccessResponse,
  validateRequiredFields,
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
    const body: CreateGuestOrderRequest = await request.json();

    logRequest("POST", "/api/payments/guest/order", body);

    // Validate request body
    const validationErrors = validateRequiredFields(
      body,
      ValidationPatterns.createGuestOrder
    );
    if (validationErrors.length > 0) {
      const errorResponse = createErrorResponse(
        validationErrors.join(", "),
        ErrorCodes.VALIDATION_ERROR,
        "Validation failed"
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/payments/guest/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = createErrorResponse(
        data.message || "Failed to create guest order",
        data.code || ErrorCodes.API_ERROR,
        "Failed to create guest order",
        data.details
      );
      return NextResponse.json(errorResponse, { status: response.status });
    }

    const successResponse = createSuccessResponse(
      data.data as CreateGuestOrderResponse,
      "Guest order created successfully"
    );
    logResponse(200, "Guest order created successfully");
    return NextResponse.json(
      successResponse as ApiResponse<CreateGuestOrderResponse>
    );
  } catch (error: unknown) {
    logError(error, "create guest order");

    const errorResponse = createErrorResponse(
      error,
      ErrorCodes.INTERNAL_ERROR,
      "Internal server error"
    );
    return NextResponse.json(errorResponse as ApiResponse, { status: 500 });
  }
}
