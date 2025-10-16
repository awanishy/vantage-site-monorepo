Payments client integration (Cashfree)

1. Create order

- POST /api/payments/orders with { programId, selectedCurrency? }
- Response includes { paymentSessionId, cfOrderId, amount, currency }

2. Initialize Cashfree checkout on client

- Use paymentSessionId with Cashfree JS SDK to render checkout and complete payment

3. Webhooks

- Backend listens on POST /api/payments/webhooks for payment/refund events
- On success: order marked PAID, access granted, email sent
- On failure: order remains ACTIVE, retry email can be sent


