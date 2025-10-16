import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types";

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

    const body = await request.json().catch(() => ({}));
    const email = body?.email as string | undefined;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
          code: "VALIDATION_ERROR",
          timestamp: new Date().toISOString(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/api/payments/guest/orders/${orderId}/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Failed to verify payment",
          code: data.code || "API_ERROR",
          details: data.details,
          timestamp: new Date().toISOString(),
        } as ApiResponse,
        { status: response.status }
      );
    }

    // Backend already returns the correct structure: { success, message, data }
    // Just return it as-is to avoid double-nesting
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Verify guest payment API error:", error);
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
