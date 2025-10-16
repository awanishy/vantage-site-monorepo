import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse, ErrorCodes } from "@/lib/api-utils";
import { getBackendHeaders } from "@/app/utils/getHeaders";

export async function GET(req: NextRequest) {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Backend URL not configured",
          code: "SERVER_ERROR",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Get authorization header
    const authorization = req.headers.get("authorization");
    if (!authorization) {
      const errorResponse = createErrorResponse(
        "Authentication required",
        ErrorCodes.AUTHENTICATION_ERROR,
        "Authentication required"
      );
      return NextResponse.json(errorResponse, { status: 401 });
    }
    const url = new URL(`${backendUrl}/api/payments/my-orders`);
    const status = req.nextUrl.searchParams.get("status");
    if (status) url.searchParams.set("status", status);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: getBackendHeaders(req as unknown as Request),
      // Ensure server-to-server fetch includes credentials
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch orders",
        code: "SERVER_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
