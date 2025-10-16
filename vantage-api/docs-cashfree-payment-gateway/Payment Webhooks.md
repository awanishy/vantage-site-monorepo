**Payment Webhooks**

Open in ChatGPT  
Read about all asyncronous events initiated by Cashfree for this entity  
Webhooks are server callbacks to your server from Cashfree Payments. We send webhooks for three different events for a payment.

* Payment success webhook  
* Payment failed webhook  
* Payment user dropped webhook

## [**​**](https://www.cashfree.com/docs/api-reference/payments/latest/payments/webhooks#webhook-signature)

## **Webhook signature**

Merchant will receive the Webhook signature in the Webhook Header part. Below is a sample header that merchants can expect in the Webhook request.

* Version (2025-01-01)  
* Version (2023-08-01)

| Header Name | Header Value |
| ----- | :---: |
| content-length | 1099 |
| x-webhook-attempt | 1 |
| content-type | application/json |
| x-webhook-signature | 07r5C3VMwsGYeldGOCYxe5zoHhIN1zLfa8O0U/yngHI= |
| x-idempotency-key | n9rn7079wqXcse3GEDEXCYle9ajXmU0SUQY8zrUNAlc= |
| x-webhook-timestamp | 1746427759733 |
| x-webhook-version | 2025-01-01 |

Ensure that the webhook payload is received in raw text format. Converting the webhook into a JSON object can lead to automatic transformation of decimal values—such as the payment\_amount—into integers. This alteration (e.g., payment\_amount: 170 instead of payment\_amount: 170.00) can cause a webhook signature mismatch.

Correct format: payment\_amount: 170.00 ✅  
Incorrect format: payment\_amount: 170 ❌

## [**​**](https://www.cashfree.com/docs/api-reference/payments/latest/payments/webhooks#payment-success-webhook)

## **Payment success webhook**

A payment success webhook is triggered when a payment is successfully completed. You can use this for: Updating order status, triggering fulfillment, send confirmation to customer.

* Version (2025-01-01)  
* Version (2023-08-01)

Version (2025-01-01)  
Copy  
Ask AI  
{  
"data":{  
  "order":{  
     "order\_id":"order\_OFR\_2",  
     "order\_amount":2,  
     "order\_currency":"INR",  
     "order\_tags":null  
  },  
  "payment":{  
     "cf\_payment\_id":"1453002795",  
     "payment\_status":"SUCCESS",  
     "payment\_amount":1,  
     "payment\_currency":"INR",  
     "payment\_message":"00::Transaction success",  
     "payment\_time":"2025-01-15T12:20:29+05:30",  
     "bank\_reference":"234928698581",  
     "auth\_id":null,  
     "payment\_method":{  
        "upi":{  
           "channel":"collect",  
           "upi\_id":"rishab@ybl",  
           "upi\_instrument":"UPI\_CREDIT\_CARD",  
           "upi\_instrument\_number":"masked card number",  
           "upi\_payer\_ifsc":"SBI0025434",  
           "upi\_payer\_account\_number":"XXXXX0231"  
        }  
     },  
     "payment\_group":"upi",  
     "international\_payment":{  
        "international":false  
     },  
     "payment\_surcharge":{  
        "payment\_surcharge\_service\_charge":0.36,  
        "payment\_surcharge\_service\_tax":0.06  
     }  
  },  
  "customer\_details":{  
     "customer\_name":null,  
     "customer\_id":"7112AAA812234",  
     "customer\_email":"test@gmail.com",  
     "customer\_phone":"9908734801"  
  },  
  "payment\_gateway\_details":{  
     "gateway\_name":"CASHFREE",  
     "gateway\_order\_id":"1634766330",  
     "gateway\_payment\_id":"1504280029",  
     "gateway\_order\_reference\_id":"abc\_124",  
     "gateway\_settlement":"CASHFREE",  
     "gateway\_status\_code":null  
  },  
  "payment\_offers":\[  
     {  
        "offer\_id":"0f05e1d0-fbf8-4c9c-a1f0-814c7b2abdba",  
        "offer\_type":"DISCOUNT",  
        "offer\_meta":{  
           "offer\_title":"50% off on UPI",  
           "offer\_description":"50% off for testing",  
           "offer\_code":"UPI50",  
           "offer\_start\_time":"2022-11-09T06:23:25.972Z",  
           "offer\_end\_time":"2025-02-27T18:30:00Z"  
        },  
        "offer\_redemption":{  
           "redemption\_status":"SUCCESS",  
           "discount\_amount":1,  
           "cashback\_amount":0  
        }  
     }  
  \],  
  "terminal\_details":{  
    "cf\_terminal\_id":17269,  
    "terminal\_phone":"8971520311"  
  }  
},  
"event\_time":"2025-01-15T11:16:10+05:30",  
"type":"PAYMENT\_SUCCESS\_WEBHOOK"  
}

## [**​**](https://www.cashfree.com/docs/api-reference/payments/latest/payments/webhooks#payment-failed-webhook)

## **Payment failed webhook**

The payment failed webhook notifies you when a payment attempt fails and we receive a failed response from the bank. Use case: Update order status, notify customer, initiate retry flow

* Version 2025-01-01  
* Version 2023-08-01

Version 2025-01-01  
Copy  
Ask AI  
{    
"data": {    
    "order": {    
        "order\_id": "CFPay\_g47u3888d0k0\_tblfm766qc",    
        "order\_amount": 1.8,    
        "order\_currency": "INR",    
        "order\_tags": {    
            "cf\_link\_id": "13746255"    
        }    
    },    
    "payment": {    
        "cf\_payment\_id": "1504280029",    
        "payment\_status": "FAILED",    
        "payment\_amount": 1.8,    
        "payment\_currency": "INR",    
        "payment\_message": "AMOUNT SHOULD BE WITHIN RANGE BETWEEN 20.00 TO 500000.00.",    
        "payment\_time": "2023-01-06T20:00:11+05:30",    
        "bank\_reference": "NA",    
        "auth\_id": "null",    
        "payment\_method": {    
            "netbanking": {    
                "channel": null,    
                "netbanking\_bank\_code": "3054",    
                "netbanking\_bank\_name": "UCO Bank"    
            }    
        },    
        "payment\_group": "net\_banking",  
        "international\_payment":{  
            "international":false  
        },  
        "payment\_surcharge":null  
    },    
    "customer\_details": {    
        "customer\_name": null,    
        "customer\_id": null,    
        "customer\_email": "test@gmail.com",    
        "customer\_phone": "9611199227"    
    },    
    "error\_details": {    
        "error\_code": "GATEWAY\_ERROR",    
        "error\_description": "AMOUNT SHOULD BE WITHIN RANGE BETWEEN 20.00 TO 500000.00. for this bank",    
        "error\_reason": "invalid\_amount",    
        "error\_source": "cashfree",  
        "error\_subcode\_raw": "U09"  
    },    
    "payment\_gateway\_details": {  
        "gateway\_name": "CASHFREE",  
        "gateway\_order\_id": "1634766330",  
        "gateway\_payment\_id": "1504280029",  
        "gateway\_settlement": "CASHFREE",  
        "gateway\_status\_code": null  
    },   
    "payment\_offers": null,  
    "terminal\_details":{  
        "cf\_terminal\_id":17269,  
        "terminal\_phone":"8971520311"  
    }  
},    
"event\_time": "2023-08-01T20:00:12+05:30",    
"type": "PAYMENT\_FAILED\_WEBHOOK"    
}

## [**​**](https://www.cashfree.com/docs/api-reference/payments/latest/payments/webhooks#payment-user-dropped-webhook)

## **Payment user dropped webhook**

The User Dropped Webhook notifies you when your customer abandons the payment flow. It will help you understand if customers attempted to pay or not. Some common scenarios where the transaction will be marked as USER\_DROPPED are:

* User was redirected to the bank’s OTP page, but never entered the OTP.  
* User was redirected to open the UPI app, but never entered the UPI PIN.  
* User was shown the 3ds OTP modal, but did not enter the OTP.  
* Version 2025-01-01  
* Version 2023-08-01

Version 2025-01-01  
Copy  
Ask AI  
{  
"data": {  
"order": {  
  "order\_id": "order\_02",  
  "order\_amount": 2,  
  "order\_currency": "INR",  
  "order\_tags": null  
},  
"payment": {  
  "cf\_payment\_id": "975672265",  
  "payment\_status": "USER\_DROPPED",  
  "payment\_amount": 2,  
  "payment\_currency": "INR",  
  "payment\_message": "User dropped and did not complete the two factor authentication",  
  "payment\_time": "2022-05-25T14:25:34+05:30",  
  "bank\_reference": "1803592531",  
  "auth\_id": "2980",  
  "payment\_method": {  
    "netbanking": {  
      "channel": null,  
      "netbanking\_bank\_code": "3044",  
      "netbanking\_bank\_name": "State Bank Of India"  
    }  
  },  
  "payment\_group": "net\_banking",  
  "international\_payment":{  
    "international":false  
  },  
  "payment\_surcharge":null  
},  
"customer\_details": {  
  "customer\_name": null,  
  "customer\_id": "7112AAA812234",  
  "customer\_email": "test@gmail.com",  
  "customer\_phone": "9611199227"  
},  
"terminal\_details":{  
  "cf\_terminal\_id":17269,  
  "terminal\_phone":"8971520311"  
}  
},  
"event\_time": "2022-05-25T14:35:38+05:30",  
"type": "PAYMENT\_USER\_DROPPED\_WEBHOOK"  
}

## [**​**](https://www.cashfree.com/docs/api-reference/payments/latest/payments/webhooks#sample-payload-by-payment-method)

## **Sample Payload by Payment Method**

The instrument used for making a payment will vary by the payment methods used by the customer. Details of the payload by payment method are documented for reference.

* Card  
* Net Banking  
* UPI  
* Wallet  
* Credit Card EMI  
* Debit Card EMI  
* Cardless EMI  
* Pay Later  
* VBA Transfer  
* Bank Transfer

Copy  
Ask AI  
{  
  ...,  
  "payment\_method": {    
    "card": {    
      "channel": null,    
      "card\_number": "470613XXXXXX2123",    
      "card\_network": "visa",    
      "card\_type": "credit\_card",    
      "card\_sub\_type": "C",    
      "card\_country": "IN",    
      "card\_bank\_name": "TEST Bank",  
      "card\_network\_reference\_id": "100212023061200000001014824849",  
      "instrument\_id":"8e9cc167-4fe2-4ece-be8d-c1b224e50a23"  
    }    
  },    
  "payment\_group": "credit\_card",  
  ...  
}

## [**​**](https://www.cashfree.com/docs/api-reference/payments/latest/payments/webhooks#webhook-faqs)

## **Webhook FAQs**

[**Configure webhooks**](https://www.cashfree.com/docs/payments/online/webhooks/configure)  
How do I add or configure webhook URLs for different event types (e.g., success, failed)?  
You can configure webhook URLs for each notification type in your merchant dashboard. To receive notifications, subscribe to specific events, such as PAYMENT\_SUCCESS or PAYMENT\_FAILED. For step-by-step instructions, go through the [official documentation](https://www.cashfree.com/docs/payments/online/webhooks/overview).

Why am I not receiving failed webhooks?  
This may occur if the PAYMENT\_FAILED webhook event is not subscribed. To resolve this, open your dashboard, navigate to the webhook configuration, and ensure that the PAYMENT\_FAILED event is selected.

Note: This applies to all webhook events. Make sure relevant events are enabled as needed.

I’m getting an error while adding the webhook endpoint. What could be wrong?  
Ensure that your endpoint is reachable and returns a 2xx status code. Also, verify that it is properly configured to accept webhook requests.

Why is my webhook not received?  
There could be multiple reasons:

* The webhook URL was not included in the notify\_url parameter during order creation.  
* Make sure you have done webhook configuration for the notification type as you needed.  
* The endpoint URL is returning a 4xx or 5xx error.

Actions to take:

* Verify that your webhook is correctly configured in the [merchant dashboard](https://merchant.cashfree.com/merchants/pg/developers/webhooks) under Webhook Configuration.  
* Ensure that the endpoint is accessible and able to accept requests from Cashfree.

How do I enable or disable specific webhook types?  
You can enable or disable specific webhook types directly from the merchant dashboard. For detailed instructions, refer to the [documentation](https://merchant.cashfree.com/merchants/pg/developers/webhooks).

How to enable the latest webhook version (e.g., 2025-01-01)?  
Once the feature is rolled out in Production, the new version will appear in the version drop-down under Webhook Configuration.

⚠️ Note: If you do not see the new version, the rollout may still be in progress. Please check back later or contact support for assistance.

Webhook is configured, but no real-time data is received. Why?  
This may happen if the webhook URL is configured but no events are selected. Ensure:

* Webhook types are enabled.  
* Your endpoint is healthy and accessible to accept the requests from Cashfree.

Why did the webhook trigger multiple times?  
Duplicate webhook triggers may occur due to misconfiguration or retry logic. This can happen if multiple webhook versions are configured using the same or different endpoint URLs.

✅ Actions to take:

* The Merchant can revisit and delete the duplicate configured endpoint URL from the [merchant dashboard](https://merchant.cashfree.com/merchants/pg/developers/webhooks).

What if I don't pass a notify\_url and only use return URLs?  
Notify URLs are necessary for webhook delivery. Return URLs only redirect the user after the transaction. Ensure you pass both as different URLs, especially if you need server-side notifications.

How can I improve webhook issue handling and reduce to raise support tickets?

* Always subscribe to the necessary webhook event types (SUCCESS, FAILED, USER\_DROPPED).  
* Test your webhook integration in Sandbox before going live.  
* Use publicly accessible HTTPS URLs that return 200 OK responses.  
* Regularly review and update webhook configurations in the merchant dashboard to avoid outdated or incorrect entries.

Was this page helpful?  
Yes  
No  
[Get Payments for an Order](https://www.cashfree.com/docs/api-reference/payments/latest/payments/get-payments-for-order)  
[Create Payment Link](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create)  
