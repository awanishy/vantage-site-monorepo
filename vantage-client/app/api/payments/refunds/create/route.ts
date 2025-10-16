import { NextRequest, NextResponse } from "next/server";
import {
  CreateRefundRequest,
  CreateRefundResponse,
  ApiResponse,
} from "@/types";
import { getBackendHeaders } from "@/app/utils/getHeaders";
import { createErrorResponse, ErrorCodes } from "@/lib/api-utils";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export async function POST(request: NextRequest) {
  try {
    const body: CreateRefundRequest = await request.json();

    // Validate request body
    if (!body.refundAmount || !body.refundId) {
      return NextResponse.json(
        {
          success: false,
          error: "Refund amount and refund ID are required",
          code: "VALIDATION_ERROR",
          timestamp: new Date().toISOString(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Get authorization header
    const headers = getBackendHeaders(request as unknown as Request);
    if (!headers.Authorization) {
      const errorResponse = createErrorResponse(
        "Authentication required",
        ErrorCodes.AUTHENTICATION_ERROR,
        "Authentication required"
      );
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/payments/refunds/create`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = createErrorResponse(
        data.message || "Failed to create refund",
        data.code || ErrorCodes.API_ERROR,
        "Failed to create refund",
        data.details
      );
      return NextResponse.json(errorResponse, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      data: data.data as CreateRefundResponse,
      message: "Refund created successfully",
      timestamp: new Date().toISOString(),
    } as ApiResponse<CreateRefundResponse>);
  } catch (error: unknown) {
    console.error("Create refund API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
        timestamp: new Date().toISOString(),
      } as ApiResponse,
      { status: 500 }
    );
  }
}
