import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types";
import { getBackendHeaders } from "@/app/utils/getHeaders";
import { createErrorResponse, ErrorCodes } from "@/lib/api-utils";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export async function GET(request: NextRequest) {
  try {
    const authHeaders = getBackendHeaders(request as unknown as Request);
    if (!authHeaders.Authorization) {
      const errorResponse = createErrorResponse(
        "Authentication required",
        ErrorCodes.AUTHENTICATION_ERROR,
        "Authentication required"
      );
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/users/auth/check`, {
      method: "GET",
      headers: authHeaders,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Authentication failed",
          code: data.code || "AUTHENTICATION_ERROR",
          timestamp: new Date().toISOString(),
        } as ApiResponse,
        { status: response.status }
      );
    }

    // Backend returns { success: true, user: {...} }
    // We want to preserve the user object at the top level for easier access
    return NextResponse.json({
      success: true,
      user: data.user,
      data: data.user,
      message: data.message || "User authenticated successfully",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  } catch (error: unknown) {
    console.error("Auth check API error:", error);

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
