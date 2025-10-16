**Errors**

Open in ChatGPT  
Learn in detail about errors.

## [**​**](https://www.cashfree.com/docs/api-reference/payments/errors#error-structure)

## **Error structure**

The Payment Gateway response in case of an error includes the following:

* error\_code \- Code associated with every error  
* error\_description \- Description of the error  
* error\_source \- Source of the error  
* error\_reason \- Failure reason

Sample error response from API:

Copy  
Ask AI  
{  
  "message": "bad URL, please check API documentation",  
  "help": "Check latest errors and resolution from Merchant Dashboard API logs: https://bit.ly/4glEd0W Help Document: https://bit.ly/4eeZYO9",  
  "code": "request\_failed",  
  "type": "invalid\_request\_error"  
}

Sample error response from webhook:

Copy  
Ask AI  
{  
    "auth\_id": null,  
    "authorization": null,  
    "bank\_reference": "306118259130",  
    "cf\_payment\_id": 1636676360,  
    "entity": "payment",  
    "error\_details": {  
        "error\_code": "TRANSACTION\_DECLINED",  
        "error\_description": "transaction is rejected at the remitter bank end. Please reach out to issuer bank",  
        "error\_reason": "bank\_rejected",  
        "error\_source": "bank"  
    },  
    "is\_captured": false,  
    "order\_amount": 1.00,  
    "order\_id": "order\_18482MSWq8prPMOW0jTeGsx0B1JmPC1",  
    "payment\_amount": 1.00,  
    "payment\_completion\_time": "2023-03-02T18:24:51+05:30",  
    "payment\_currency": "INR",  
    "payment\_group": "upi",  
    "payment\_message": "01::REJECTED",  
    "payment\_method": {  
        "upi": {  
            "channel": "collect",  
            "upi\_id": "8XXXXXXXX2@upi"  
        }  
    },  
    "payment\_status": "FAILED",  
    "payment\_time": "2023-03-02T18:24:18+05:30"  
}

---

## [**​**](https://www.cashfree.com/docs/api-reference/payments/errors#list-of-error-types-and-error-codes)

## **List of error types and error codes**

Below are the error types and error codes with their descriptions.

### [**​**](https://www.cashfree.com/docs/api-reference/payments/errors#error-types)

### **Error types**

| error\_type | description |
| ----- | ----- |
| api\_connection\_error | Network communication issue with API server. |
| api\_error | General server error during request processing. |
| authentication\_error | Invalid or missing authentication credentials. |
| invalid\_request\_error | Request is malformed or has invalid parameters. |
| feature\_not\_enabled | Requested feature is not enabled for the account. |
| rate\_limit\_error | Too many requests sent in a short time. |
| validation\_error | Request failed validation checks. |
| idempotency\_error | Repeated request with same idempotency key caused conflict. |
| bad\_gateway\_error | Received invalid response from upstream server. |

### [**​**](https://www.cashfree.com/docs/api-reference/payments/errors#error-codes)

### **Error codes**

| error\_code | description |
| ----- | ----- |
| card\_unsupported | Card type not supported by payment system. |
| payment\_method\_unsupported | Payment method not accepted for this transaction. |
| surcharge\_invalid | Surcharge amount is missing, incorrect, or not allowed. |
| payment\_gateway\_unsupported | Selected payment gateway is not supported. |
| card\_submission\_disabled | Card submission is currently disabled or blocked. |
| order\_amount\_invalid | Order amount is missing, negative, or exceeds limits. |
| order\_inactive | Order is no longer active or has expired. |
| customer\_email\_invalid | Customer email is missing or incorrectly formatted. |
| version\_invalid | Provided API version is not supported or malformed. |
| order\_token\_invalid | Order token is missing, expired, or incorrect. |
| sub\_session\_id\_invalid | Sub-session ID is missing or invalid. |
| payment\_session\_id\_invalid | Payment session ID is missing or does not exist. |
| native\_otp\_session\_id\_invalid | Native OTP session ID is invalid or expired. |
| flash\_upi\_auth\_token\_invalid | Flash UPI auth token is invalid or expired. |
| cookie\_invalid | Session cookie is missing, expired, or malformed. |
| order\_id\_invalid | Order ID is incorrect, missing, or unrecognised. |
| order\_expiry\_time\_invalid | Order expiry time is missing, invalid, or in past. |
| order\_id\_not\_paid | Order ID exists, but payment was not completed. |
| order\_id\_voided | Order was voided and cannot be processed further. |
| refund\_amount\_invalid | Refund amount is missing, invalid, or exceeds original payment. |
| refund\_id\_invalid | Refund ID is missing, incorrect, or unrecognised. |
| netbanking\_bank\_code\_invalid | Invalid or unsupported netbanking bank code provided. |
| payment\_method\_invalid | Specified payment method is invalid or not recognised. |
| refund\_invalid | Refund cannot be processed due to invalid conditions. |
| vendor\_id\_invalid | Vendor ID is missing, malformed, or not recognised. |
| payment\_gateway\_inactive | Payment gateway is inactive or unavailable. |
| customer\_phone\_invalid | Customer phone number is missing or incorrectly formatted. |
| partner\_apikey\_invalid | Partner API key is missing, invalid, or unauthorised. |
| payment\_amount\_invalid | Payment amount is missing, negative, or incorrectly formatted. |
| refund\_unsupported | Refund operation is unsupported for this payment type. |
| order\_already\_paid | Order has already been paid successfully. |
| bank\_processing\_failure | Bank failed to process the payment request. |
| api\_request\_timeout | API request timed out before completion. |
| sdk\_token\_invalid | SDK token is invalid or malformed. |
| sdk\_token\_unknown | Unknown SDK token provided in the request. |
| simulation\_id\_invalid | Simulation ID is invalid or does not exist. |
| entity\_id\_invalid | Entity ID is incorrect, missing, or unrecognised. |
| entity\_unsupported | Entity type is not supported for this operation. |
| simulation\_id\_missing | Simulation ID is required but missing in request. |
| subscription\_id\_missing | Subscription ID is required but missing. |
| payment\_id\_missing | Payment ID is missing or not found. |
| plan\_id\_missing | Plan ID is missing, invalid, or not found. |
| refund\_id\_missing | Refund ID is required but missing. |
| PaymentForm\_form\_creation\_failed | Failed to create payment form due to internal error. |
| PaymentForm\_link\_creation\_failed | Failed to create payment link due to system issue. |
| order\_already\_exists | Order already exists with the given ID or details. |
| orderpay\_already\_exists | OrderPay object already exists for this order. |
| order\_id\_already\_exists | Order ID already exists and cannot be duplicated. |
| domain\_name\_refererString | Invalid or unapproved domain name in referer header. |
| android\_package\_{xRequestedWith} | Invalid or unrecognised Android package name in request. |
| refType\_not\_approved | Referenced entity is not approved for this operation. |
| refType\_ineligible | Referenced entity is not eligible for this operation. |
| payment\_gateway\_inactive\_request\_failed | Payment gateway inactive; request could not be completed. |
| subscription\_id\_missing\_request\_failed\_failed | Subscription ID missing; request failed. |
| simulation\_id\_missing\_request\_failed\_failed | Simulation ID missing; request failed. |
| cod\_eligibility\_failed | COD eligibility check failed for this order. |
| Paymentlink\_create\_failed | Failed to create payment link due to internal issue. |
| headless\_otp\_submit\_request\_failed | OTP submission failed during headless authentication flow. |
| order\_creation\_faied | Order creation failed due to validation or server error. |
| pan\_submit\_failed | PAN submission failed due to invalid data or server error. |
| gstin\_submit\_failed | GSTIN submission failed due to incorrect or missing data. |
| cin\_submit\_failed | CIN submission failed due to invalid or missing data. |
| risk\_data\_ip\_address\_request\_failed | IP address risk check failed during request processing. |
| cart\_create\_failed | Cart creation failed due to invalid input or server issue. |
| order\_create\_failed | Order creation failed; please retry or check input data. |
| order\_pay\_failed | Order payment attempt failed due to processing error. |
| refund\_post\_failed | Refund request failed to post due to system error. |
| link\_post\_failed | Failed to post link request to server. |
| api\_request\_failed | API request failed due to timeout or internal error. |
| form\_post\_failed | Form submission failed due to validation or processing error. |
| aadhar\_otp\_generation\_failed | Aadhaar OTP generation failed during identity verification. |
| aadhar\_otp\_verification\_failed | Aadhaar OTP verification failed or expired. |
| pan\_verification\_failed | PAN verification failed due to a mismatch or system error. |
| bank\_account\_verification\_failed | Bank account verification failed due to invalid input. |
| otp\_generation\_failed | OTP generation failed due to rate limits or server error. |
| otp\_expired\_failed | OTP has expired; please request a new one. |
| otp\_invalid\_failed | OTP is invalid or does not match. |
| ref\_id\_invalid\_failed | Reference ID is invalid or not found. |
| shipping\_fetch\_failed | Shipping info fetch failed due to network or service error. |
| entity\_simulation\_payment\_error\_code\_failed | Entity simulation failed during payment processing. |
| gst\_verification\_failed | GST verification failed due to incorrect or unverified GSTIN. |
| offer\_not\_found | Offer not found or does not exist. |
| customer\_get\_not\_found | Customer not found with given details. |
| payment\_not\_found | Payment record not found for provided ID. |
| payment\_post\_not\_found | Payment request failed; resource not found. |
| entityId\_not\_found | Entity ID not found or unrecognised. |
| order\_get\_not\_found | Order not found for given ID. |
| cart\_get\_not\_found | Cart not found for current session or ID. |
| orderpay\_post\_not\_found | OrderPay request not found or already processed. |
| card\_alias\_not\_found | Card alias not found or invalid. |
| cardbin\_details\_not\_found | Card BIN details not available or missing. |
| card\_not\_found | Card not found or does not exist. |
| order\_id\_post\_not\_found | Order ID not found in post request. |
| modeRates\_get\_not\_found | Mode rate information not available or missing. |
| refund\_get\_not\_found | Refund information not found for provided ID. |
| transaction\_get\_not\_found | Transaction details not found or unavailable. |
| settlement\_get\_not\_found | Settlement not found for provided identifier. |
| link\_get\_not\_found | Payment link not found or deleted. |
| merchant\_get\_not\_found | Merchant account not found or unregistered. |
| terminal\_id\_post\_not\_found | Terminal ID not found in post request. |
| resource\_post\_not\_found | Resource not found during post request. |
| terminal\_post\_not\_found | Terminal not found or inactive. |
| order\_request\_not\_found | Order request not found or expired. |
| payment\_request\_not\_found | Payment request not found or invalid. |
| dispute\_request\_not\_found | Dispute request not found or missing. |
| document\_request\_not\_found | Document request not found or expired. |
| resource\_get\_not\_found | Requested resource not found or unavailable. |
| form\_get\_not\_found | Form not found or has been removed. |
| authentication\_error | Authentication failed due to invalid or missing credentials. |
| customer\_instruments\_authentication\_error | Customer instruments request failed authentication. |
| integrity\_token\_not\_found | Integrity token not found or expired. |
| checkout\_config\_not\_found | Checkout configuration not found or misconfigured. |
| api\_error\_not\_found | API error: requested resource not found. |
| payment\_instrument\_not\_found | Payment instrument not found or unsupported. |
| order\_not\_found | Order does not exist or was deleted. |
| instrument\_not\_found | Instrument not found for current customer or request. |
| request\_failed | Request failed due to server or network error. |
| cryptogram\_request\_failed | Cryptogram generation failed or request is invalid. |
| authorize\_only\_invalid | Authorise-only is not allowed for this transaction. |
| card\_number\_invalid | Card number is invalid or incorrectly formatted. |
| emi\_tenure\_invalid | EMI tenure is invalid or unsupported for selection. |

## [**​**](https://www.cashfree.com/docs/api-reference/payments/errors#list-of-errors-for-payments)

## **List of errors for payments**

Download the list of errors along with their explanation.

[Payment Error List](https://gocashassets.s3.ap-south-1.amazonaws.com/repostmancollection/Error+List.xlsx)  
Note:

Error details will be shown for every failed transaction in the payload of the following APIs and webhooks:

* [Get Payments for an Order](https://www.cashfree.com/docs/api-reference/payments/latest/payments/get-payments-for-order)  
* [Get Payment by ID](https://www.cashfree.com/docs/api-reference/payments/latest/payments/get)  
* [Payment Failed Webhook](https://www.cashfree.com/docs/api-reference/payments/latest/payments/webhooks#payment-failed-webhook)

Was this page helpful?  
Yes  
No  
[Best Practices](https://www.cashfree.com/docs/api-reference/payments/api-best-practices)  
[Overview](https://www.cashfree.com/docs/api-reference/payments/latest/overview)  
