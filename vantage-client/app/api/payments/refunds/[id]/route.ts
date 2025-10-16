import { NextRequest, NextResponse } from "next/server";
import { GetRefundResponse, ApiResponse } from "@/types";
import { getBackendHeaders } from "@/app/utils/getHeaders";
import { createErrorResponse, ErrorCodes } from "@/lib/api-utils";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      const errorResponse = createErrorResponse(
        "Refund ID is required",
        ErrorCodes.VALIDATION_ERROR,
        "Refund ID is required"
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

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
    const response = await fetch(`${BACKEND_URL}/api/payments/refunds/${id}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = createErrorResponse(
        data.message || "Failed to get refund",
        data.code || ErrorCodes.API_ERROR,
        "Failed to get refund",
        data.details
      );
      return NextResponse.json(errorResponse, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      data: data.data as GetRefundResponse,
      message: "Refund retrieved successfully",
      timestamp: new Date().toISOString(),
    } as ApiResponse<GetRefundResponse>);
  } catch (error: unknown) {
    console.error("Get refund API error:", error);

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
