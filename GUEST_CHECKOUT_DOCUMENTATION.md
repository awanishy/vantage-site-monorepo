# Guest Checkout Flow Documentation

## Overview

The guest checkout system allows users to purchase programs without creating an account first. The system automatically creates a temporary user account and sends credentials via email, enabling a seamless checkout experience.

## Flow Diagram

```
Client Request → Create Guest User → Create Order → Create Payment Session → Process Payment
     ↓                ↓                    ↓                ↓                    ↓
  Email/Name      Generate Temp      Generate Order    Create Cashfree      Handle Webhook
  Program ID      Password &         Number &          Order & Payment      & Update Status
                  Send Email         Expiry Date       Session
```

## API Endpoints

### 1. Create Guest User
**POST** `/api/payments/guest/user`

Creates a guest user account and sends credentials via email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "user@example.com",
    "name": "John Doe",
    "isGuest": true,
    "message": "Guest user created and credentials sent to email"
  }
}
```

### 2. Create Guest Order
**POST** `/api/payments/guest/order`

Creates an order for a guest user (includes user creation if needed).

**Request Body:**
```json
{
  "programId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "selectedCurrency": "INR",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "64f8a1b2c3d4e5f6a7b8c9d2",
    "orderNumber": "ORD-2024-001234",
    "amount": 50000,
    "currency": "INR",
    "status": "ACTIVE",
    "expiresAt": "2024-02-15T10:30:00.000Z",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "isGuest": true,
    "message": "Guest order created successfully. User credentials have been sent to your email."
  }
}
```

### 3. Create Guest Payment Session
**POST** `/api/payments/guest/orders/:orderId/payment-session`

Creates a payment session for a guest order.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "64f8a1b2c3d4e5f6a7b8c9d2",
    "orderNumber": "ORD-2024-001234",
    "cfOrderId": "CF_ORDER_123456789",
    "paymentSessionId": "PS_123456789",
    "paymentId": "64f8a1b2c3d4e5f6a7b8c9d3",
    "amount": 50000,
    "currency": "INR",
    "status": "ACTIVE",
    "expiresAt": "2024-02-15T10:30:00.000Z"
  }
}
```

## Implementation Details

### Guest User Creation

1. **Email Validation**: Validates email format using regex
2. **Duplicate Check**: Checks if user already exists
3. **Password Generation**: Creates a secure random password
4. **User Creation**: Creates user with `isActive: true` and `isVerified: false`
5. **Email Sending**: Sends credentials via templated email

### Order Creation

1. **User Resolution**: Gets or creates guest user
2. **Program Validation**: Validates program exists and is active
3. **Pricing Calculation**: Calculates order amount with currency conversion
4. **Order Generation**: Creates order with 30-day expiry
5. **Metadata Tracking**: Marks order source as "guest_user"

### Payment Session Creation

1. **Order Validation**: Validates order exists and is active
2. **Email Verification**: Verifies email matches order's user
3. **Cashfree Integration**: Creates Cashfree order and payment session
4. **Database Records**: Creates CashfreeOrder and Payment records
5. **Order Update**: Links payment to order

## Email Template

The system uses a templated email to send guest credentials:

- **Template Type**: `guest_credentials`
- **Variables**: `name`, `email`, `password`, `loginUrl`
- **Features**: Responsive design, security notes, call-to-action button

## Security Considerations

1. **Temporary Passwords**: Generated using crypto.randomBytes for security
2. **Email Verification**: Required for payment session creation
3. **Order Ownership**: Validated through email matching
4. **Password Reset**: Users should change password after first login

## Error Handling

- **Email Format Validation**: Returns 400 for invalid email
- **User Conflicts**: Returns 409 if user already exists and is active
- **Order Not Found**: Returns 404 for non-existent orders
- **Email Mismatch**: Returns 403 for email/order mismatch
- **Expired Orders**: Returns 400 for expired orders

## Database Schema Updates

The existing schemas support guest checkout without modifications:

- **User Model**: Uses existing fields with `isActive: true`, `isVerified: false`
- **Order Model**: Uses existing `metadata.source` field to track "guest_user"
- **Payment Model**: No changes required
- **CashfreeOrder Model**: No changes required

## Frontend Integration

### Step 1: Guest User Creation
```javascript
const createGuestUser = async (userData) => {
  const response = await fetch('/api/payments/guest/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};
```

### Step 2: Create Order
```javascript
const createGuestOrder = async (orderData) => {
  const response = await fetch('/api/payments/guest/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return response.json();
};
```

### Step 3: Create Payment Session
```javascript
const createGuestPaymentSession = async (orderId, email) => {
  const response = await fetch(`/api/payments/guest/orders/${orderId}/payment-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
};
```

## Testing

### Test Scenarios

1. **New Guest User**: Create user, order, and payment session
2. **Existing Inactive User**: Reactivate user and create order
3. **Email Validation**: Test invalid email formats
4. **Order Expiry**: Test expired order handling
5. **Email Mismatch**: Test security validation

### Sample Test Data

```json
{
  "email": "test@example.com",
  "name": "Test User",
  "phone": "+1234567890",
  "programId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "selectedCurrency": "INR"
}
```

## Monitoring and Analytics

- **Guest Conversion**: Track guest-to-registered user conversion
- **Email Delivery**: Monitor email delivery success rates
- **Payment Completion**: Track guest checkout completion rates
- **User Behavior**: Analyze guest vs authenticated user patterns

## Future Enhancements

1. **Guest Session Management**: Temporary session handling
2. **Social Login Integration**: Quick guest checkout with social providers
3. **Guest Order Tracking**: Allow guests to track orders without login
4. **Account Claiming**: Easy process to claim guest accounts
5. **Guest Analytics**: Enhanced tracking and reporting
