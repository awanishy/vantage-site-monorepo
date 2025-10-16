import { NextRequest, NextResponse } from "next/server";
import { GetPricingRequest, GetPricingResponse, ApiResponse } from "@/types";
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
import { getBackendHeaders } from "@/app/utils/getHeaders";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export async function POST(request: NextRequest) {
  try {
    const body: GetPricingRequest = await request.json();

    logRequest("POST", "/api/payments/pricing", body);

    // Validate request body
    const validationErrors = validateRequiredFields(
      body,
      ValidationPatterns.getPricing
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
    const response = await fetch(`${BACKEND_URL}/api/payments/pricing`, {
      method: "POST",
      headers: getBackendHeaders(request as unknown as Request),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = createErrorResponse(
        data.message || "Failed to get pricing",
        data.code || ErrorCodes.API_ERROR,
        "Failed to get pricing",
        data.details
      );
      return NextResponse.json(errorResponse, { status: response.status });
    }

    const successResponse = createSuccessResponse(
      data.data as GetPricingResponse,
      "Pricing retrieved successfully"
    );
    logResponse(200, "Pricing retrieved successfully");
    return NextResponse.json(
      successResponse as ApiResponse<GetPricingResponse>
    );
  } catch (error: unknown) {
    logError(error, "get pricing");

    const errorResponse = createErrorResponse(
      error,
      ErrorCodes.INTERNAL_ERROR,
      "Internal server error"
    );
    return NextResponse.json(errorResponse as ApiResponse, { status: 500 });
  }
}
