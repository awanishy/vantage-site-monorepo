import { NextRequest, NextResponse } from "next/server";
import { GetOrderResponse, ApiResponse } from "@/types";
import { getBackendHeaders } from "@/app/utils/getHeaders";
import { createErrorResponse, ErrorCodes } from "@/lib/api-utils";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      const errorResponse = createErrorResponse(
        "Order ID is required",
        ErrorCodes.VALIDATION_ERROR,
        "Order ID is required"
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Forward request to backend
    const response = await fetch(
      `${BACKEND_URL}/api/payments/orders/${orderId}`,
      {
        method: "GET",
        headers: getBackendHeaders(request as unknown as Request),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = createErrorResponse(
        data.message || "Failed to get order",
        data.code || ErrorCodes.API_ERROR,
        "Failed to get order",
        data.details
      );
      return NextResponse.json(errorResponse, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      data: data.data as GetOrderResponse,
      message: "Order retrieved successfully",
      timestamp: new Date().toISOString(),
    } as ApiResponse<GetOrderResponse>);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorResponse = createErrorResponse(
      errorMessage,
      ErrorCodes.INTERNAL_ERROR,
      "Internal server error"
    );
    return NextResponse.json(errorResponse as ApiResponse, { status: 500 });
  }
}
