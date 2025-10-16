#!/usr/bin/env bash

# Basic smoke tests for API proxies. Adjust BACKEND_URL and TOKEN as needed.

set -euo pipefail

BASE="http://localhost:3000"
AUTH_HEADER=${AUTH_HEADER:-"Authorization: Bearer $TOKEN"}

echo "== Pricing (public) =="
curl -sS -X POST "$BASE/api/payments/pricing" \
  -H "Content-Type: application/json" \
  -d '{"programId":"demo-program","selectedCurrency":"INR"}' | jq '.success,.code?'

echo "== Auth check (401 when no token) =="
curl -sS -i "$BASE/api/users/auth/check" | head -n 1

if [ -n "${TOKEN:-}" ]; then
  echo "== Auth check (with bearer) =="
  curl -sS -H "$AUTH_HEADER" "$BASE/api/users/auth/check" | jq '.success,.user?'

  echo "== My Orders (with bearer) =="
  curl -sS -H "$AUTH_HEADER" "$BASE/api/payments/my-orders" | jq '.success,.data?.orders? | length'
fi

echo "Done."



