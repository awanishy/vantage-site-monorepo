import { NextRequest, NextResponse } from "next/server";
import {
  createErrorResponse,
  createSuccessResponse,
  logRequest,
  logError,
  logResponse,
  ErrorCodes,
} from "@/lib/api-utils";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    logRequest("GET", `/api/courses/${slug}`);

    if (!slug) {
      const errorResponse = createErrorResponse(
        "Program slug is required",
        ErrorCodes.VALIDATION_ERROR,
        "Program slug is required"
      );
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/programs/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = createErrorResponse(
        data.error?.message || data.message || "Failed to fetch program",
        data.error?.code || data.code || ErrorCodes.API_ERROR,
        "Failed to fetch program"
      );
      return NextResponse.json(errorResponse, { status: response.status });
    }

    const successResponse = createSuccessResponse(
      data,
      "Program retrieved successfully"
    );
    logResponse(200, "Program retrieved successfully");
    return NextResponse.json(successResponse);
  } catch (error: unknown) {
    logError(error, "fetch program");
    const errorResponse = createErrorResponse(
      error,
      ErrorCodes.INTERNAL_ERROR,
      "Internal server error"
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
