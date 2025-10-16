/**
 * Client-side utility to get authorization headers from localStorage
 */
export function getAuthHeaders(): { Authorization: string } | undefined {
  if (typeof window === "undefined") return undefined;

  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

/**
 * Server-side utility to extract auth headers from NextRequest
 */
export function getServerAuthHeaders(
  request: Request
): { Authorization: string } | undefined {
  const bearer = request.headers.get("authorization");
  const tokenCookie = request.headers
    .get("cookie")
    ?.match(/token=([^;]+)/)?.[1];

  // Use bearer token if available, otherwise use cookie
  const authHeader = bearer || (tokenCookie ? `Bearer ${tokenCookie}` : "");

  return authHeader ? { Authorization: authHeader } : undefined;
}

/**
 * Universal utility that works both client and server-side
 */
export function getHeaders(
  request?: Request
): { Authorization: string } | undefined {
  if (request) {
    return getServerAuthHeaders(request);
  }
  return getAuthHeaders();
}

/**
 * Get headers for backend API calls with proper Content-Type
 */
export function getBackendHeaders(request?: Request): Record<string, string> {
  const authHeaders = getHeaders(request);
  return {
    "Content-Type": "application/json",
    ...authHeaders,
  };
}
