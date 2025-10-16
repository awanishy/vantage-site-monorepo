# Payment Flow Documentation

## Overview

The payment system follows a **two-step flow** where we create our internal order first, then create a Cashfree payment session only when the user actually wants to pay.

## Architecture Benefits

- **Order-First**: Our orders exist independently of payment attempts
- **Payment-on-Demand**: Only create Cashfree sessions when user clicks "Pay Now"
- **Cost Efficient**: No wasted payment sessions
- **Better Retry Logic**: Fresh payment sessions for each attempt
- **Clean Separation**: Order management vs payment processing

## Complete Payment Flow

### For Authenticated Users

```
1. User clicks "Pay Now"
   ↓
2. Create OUR order
   POST /api/payments
   Body: { programId, selectedCurrency }
   Response: { orderId, orderNumber, merchantOrderId, amount, currency, status, expiresAt }
   ↓
3. Create payment session
   POST /api/payments/orders/{orderId}/payment-session
   Headers: Authorization required
   Response: { orderId, cfOrderId, paymentSessionId, amount, currency, status }
   ↓
4. Open payment modal
   openCheckout(paymentSessionId, { redirectTarget: "_modal" })
   ↓
5. User completes payment
   ↓
6. Verify payment
   POST /api/payments/verify
   Body: { orderId }
   ↓
7. Redirect to My Orders
```

### For Guest Users

```
1. User clicks "Pay as Guest"
   ↓
2. Guest checkout
   POST /api/guest-checkout
   Body: { email, phone, programId, selectedCurrency }
   Response: { orderId, orderNumber, merchantOrderId, amount, currency, status, expiresAt, user, isNewUser }
   ↓
3. Create guest payment session
   POST /api/payments/orders/{orderId}/guest-payment-session
   Body: { email }
   Response: { orderId, cfOrderId, paymentSessionId, amount, currency, status }
   ↓
4. Open payment modal
   openCheckout(paymentSessionId, { redirectTarget: "_modal" })
   ↓
5. User completes payment
   ↓
6. Verify payment
   POST /api/payments/verify
   Body: { orderId }
   ↓
7. Redirect to My Orders
```

### For Retry Payments

```
1. User clicks "Retry Payment"
   ↓
2. Create fresh payment session
   POST /api/payments/orders/{orderId}/payment-session (authenticated)
   OR
   POST /api/payments/orders/{orderId}/guest-payment-session (guest)
   ↓
3. Open payment modal
   openCheckout(paymentSessionId, { redirectTarget: "_modal" })
   ↓
4. User completes payment
   ↓
5. Verify payment
   POST /api/payments/verify
   Body: { orderId }
   ↓
6. Redirect to My Orders
```

## API Endpoints

### Backend Routes

#### Public Routes (No Authentication)

- `POST /api/payments/pricing` - Calculate pricing
- `POST /api/payments/guest-checkout` - Create guest user and order
- `POST /api/payments/webhooks` - Cashfree webhooks
- `POST /api/payments/orders/:orderId/guest-payment-session` - Create payment session for guests
- `POST /api/payments/orders/:orderId/verify` - Verify payment status

#### Authenticated Routes (Authentication Required)

- `POST /api/payments/orders` - Create authenticated user order
- `GET /api/payments/orders/:id` - Get order details
- `GET /api/payments/my-orders` - Get user's orders
- `POST /api/payments/orders/check-active` - Check for active orders
- `POST /api/payments/orders/:orderId/payment-session` - Create payment session
- `GET /api/payments/payments/:id` - Get payment details
- `POST /api/payments/orders/:orderId/refunds` - Create refund

### Client-Side API Routes

#### Next.js API Routes (Proxy to Backend)

- `POST /api/payments` - Proxy to create order
- `POST /api/guest-checkout` - Proxy to guest checkout
- `POST /api/payments/orders/[orderId]/payment-session` - Proxy to create payment session
- `POST /api/payments/orders/[orderId]/guest-payment-session` - Proxy to create guest payment session
- `POST /api/payments/verify` - Proxy to verify payment

## Key Components

### Backend Handlers

- `createOrder.handler.ts` - Creates our internal orders
- `guestCheckout.handler.ts` - Creates guest users and orders
- `createPaymentSession.handler.ts` - Creates Cashfree payment sessions (authenticated)
- `createGuestPaymentSession.handler.ts` - Creates Cashfree payment sessions (guest)
- `verifyPayment.handler.ts` - Verifies payment status with Cashfree
- `webhook.handler.ts` - Processes Cashfree webhooks

### Frontend Components

- `AuthCheckoutForm.tsx` - Authenticated user checkout
- `GuestCheckoutForm.tsx` - Guest user checkout
- `MyOrdersPage.tsx` - Order management page

### Data Flow

1. **Order Creation**: Our system creates orders with `orderId`, `orderNumber`, `merchantOrderId`
2. **Payment Session Creation**: Cashfree creates payment sessions with `cfOrderId`, `paymentSessionId`
3. **Payment Processing**: User completes payment through Cashfree modal
4. **Verification**: Our system verifies payment status with Cashfree
5. **Webhooks**: Cashfree notifies our system of payment status changes

## Error Handling

### Order Creation Errors

- Invalid program ID
- Missing required fields
- User not found (authenticated)
- Email validation (guest)

### Payment Session Creation Errors

- Order not found
- Order expired
- Order not active
- User not authorized
- Cashfree API errors

### Payment Verification Errors

- Order not found
- Cashfree API errors
- Network errors

## Security Considerations

### Authentication

- Authenticated routes require valid JWT tokens
- Guest routes require email verification
- Order ownership verification

### Data Validation

- Input validation on all endpoints
- Email format validation
- Order ID format validation
- Amount validation

### Error Handling

- Graceful error handling
- User-friendly error messages
- Logging for debugging
- No sensitive data exposure

## Testing Checklist

### Happy Path

- [ ] Authenticated user can create order and complete payment
- [ ] Guest user can create order and complete payment
- [ ] Payment modal opens correctly
- [ ] Payment verification works
- [ ] User is redirected to My Orders after payment

### Error Cases

- [ ] Invalid program ID handling
- [ ] Missing authentication handling
- [ ] Order expiration handling
- [ ] Payment session creation failure
- [ ] Payment verification failure

### Edge Cases

- [ ] User abandons payment mid-flow
- [ ] Network errors during payment
- [ ] Multiple payment attempts
- [ ] Order retry scenarios


