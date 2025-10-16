import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types";

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
          error: data.message || "Failed to send verification email",
          code: data.code || "EMAIL_SEND_ERROR",
          timestamp: new Date().toISOString(),
        } as ApiResponse,
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: data.message || "Verification email sent successfully",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  } catch (error: unknown) {
    console.error("Send verification API error:", error);

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

