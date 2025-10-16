import { NextRequest, NextResponse } from "next/server";
import { getBackendHeaders } from "@/app/utils/getHeaders";
import { createErrorResponse, ErrorCodes } from "@/lib/api-utils";

type Params = { params: Promise<{ orderId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { orderId } = await params;
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
    if (!backendUrl) {
      const errorResponse = createErrorResponse(
        "Backend URL not configured",
        ErrorCodes.INTERNAL_ERROR,
        "Server configuration error"
      );
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const url = `${backendUrl}/api/payments/orders/${orderId}/verify`;
    const res = await fetch(url, {
      method: "POST",
      headers: getBackendHeaders(req as unknown as Request),
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    const errorResponse = createErrorResponse(
      error instanceof Error ? error.message : "Failed to verify payment",
      ErrorCodes.API_ERROR,
      "Failed to verify payment"
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Removed duplicate POST handler to avoid conflicts. Cookie-forwarding POST above is the single source.
