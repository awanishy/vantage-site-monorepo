import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types";
import { getBackendHeaders } from "@/app/utils/getHeaders";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    if (!body.email) {
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

    // Forward request to backend
    const response = await fetch(
      `${BACKEND_URL}/api/users/auth/resend-verification`,
      {
        method: "POST",
        headers: getBackendHeaders(request as unknown as Request),
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Failed to resend verification code",
          code: data.code || "RESEND_ERROR",
          timestamp: new Date().toISOString(),
        } as ApiResponse,
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: data.message || "Verification code resent successfully",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  } catch (error: unknown) {
    console.error("Resend verification API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        details: {
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        },
        timestamp: new Date().toISOString(),
      } as ApiResponse,
      { status: 500 }
    );
  }
}
