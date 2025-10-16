import { NextRequest, NextResponse } from "next/server";
import { CreatePaymentSessionResponse, ApiResponse } from "@/types";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
          code: "VALIDATION_ERROR",
          timestamp: new Date().toISOString(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Get the request body
    const body = await request.json();

    // Forward request to backend
    const response = await fetch(
      `${BACKEND_URL}/api/payments/guest/orders/${orderId}/payment-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Failed to create guest payment session",
          code: data.code || "API_ERROR",
          details: data.details,
          timestamp: new Date().toISOString(),
        } as ApiResponse,
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data as CreatePaymentSessionResponse,
      message: "Guest payment session created successfully",
      timestamp: new Date().toISOString(),
    } as ApiResponse<CreatePaymentSessionResponse>);
  } catch (error: unknown) {
    console.error("Create guest payment session API error:", error);

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
