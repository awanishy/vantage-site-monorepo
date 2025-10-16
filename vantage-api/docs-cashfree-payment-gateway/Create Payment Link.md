**Create Payment Link**

Open in ChatGPT  
Use this API to create a new payment link. The created payment link url will be available in the API response parameter link\_url.  
**POST**  
https://sandbox.cashfree.com/pghttps://api.cashfree.com/pg  
/  
links  
Try it

#### **Authorizations**

XClientID & XClientSecretXClientID & XPartnerAPIKeyXClientID & XClientSignatureHeaderXPartnerMerchantID & XPartnerAPIKey  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#authorization-x-client-id)  
x-client-id  
stringheaderrequired  
Client app ID. You can find your app id in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#authorization-x-client-secret)  
x-client-secret  
stringheaderrequired  
Client secret key. You can find your secret key in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).

#### **Headers**

[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#parameter-x-api-version)  
x-api-version  
stringdefault:2025-01-01required  
API version to be used. Format is in YYYY-MM-DD.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#parameter-x-request-id)  
x-request-id  
string  
Request ID for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to Cashfree.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#parameter-x-idempotency-key)  
x-idempotency-key  
string\<UUID\>  
An idempotency key is a unique identifier you include with your API call.  
If the request fails or times out, you can safely retry it using the same key to avoid duplicate actions.

#### **Body**

application/json  
Request Body to Create Payment Links  
Request paramenters for link creation  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-id)  
link\_id  
stringrequired  
Unique Identifier (provided by merchant) for the Link. Alphanumeric and only \- and \_ allowed (50 character limit). Use this for other link-related APIs.  
Maximum length: 50  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-amount)  
link\_amount  
numberrequired  
Amount to be collected using this link. Provide upto two decimals for paise.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-currency)  
link\_currency  
stringrequired  
Currency for the payment link. Default is INR. Submit [Support Form](https://merchant.cashfree.com/auth/login) to enable new currencies.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-purpose)  
link\_purpose  
stringrequired  
A brief description for which payment must be collected. This is shown to the customer.  
Maximum length: 500  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-customer-details)  
customer\_details  
objectrequired  
Payment link customer entity  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-customer-details-customer-phone)  
customer\_details.customer\_phone  
stringrequired  
Customer phone number  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-customer-details-customer-email)  
customer\_details.customer\_email  
string  
Customer email address  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-customer-details-customer-name)  
customer\_details.customer\_name  
string  
Customer name  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-customer-details-customer-bank-account-number)  
customer\_details.customer\_bank\_account\_number  
string  
Customer Bank Account Number  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-customer-details-customer-bank-ifsc)  
customer\_details.customer\_bank\_ifsc  
string  
Customer Bank Ifsc  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-customer-details-customer-bank-code)  
customer\_details.customer\_bank\_code  
enum\<integer\>  
Customer Bank Code  
Available options: 3003, 3005, 3006, 3010, 3012, 3016, 3019, 3020, 3021, 3022, 3023, 3024, 3026, 3027, 3028, 3029, 3030, 3031, 3032, 3033, 3038, 3039, 3040, 3042, 3044, 3054, 3055, 3058, 3086, 3087, 3088, 3089, 3090, 3091, 3092, 3098, 3115, 3117, 7001  
Example:

{

 "customer\_name": "John Doe",

 "customer\_phone": "9999999999",

 "customer\_email": "john@cashfree.com",

 "customer\_bank\_account\_number": 11111111111,

 "customer\_bank\_ifsc": "SBIN0001882",

 "customer\_bank\_code": 7001

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-partial-payments)  
link\_partial\_payments  
boolean  
If "true", customer can make partial payments for the link.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-minimum-partial-amount)  
link\_minimum\_partial\_amount  
number  
Minimum amount in first installment that needs to be paid by the customer if partial payments are enabled. This should be less than the link\_amount.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-expiry-time)  
link\_expiry\_time  
string  
Time after which the link expires. Customers will not be able to make the payment beyond the time specified here. You can provide them in a valid ISO 8601 time format. Default is 30 days.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-notify)  
link\_notify  
object  
Payment link Notify Object for SMS and Email  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-notify-send-sms)  
link\_notify.send\_sms  
boolean  
If "true", Cashfree will send sms on customer\_phone  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-notify-send-email)  
link\_notify.send\_email  
boolean  
If "true", Cashfree will send email on customer\_email  
Example:

{ "send\_sms": false, "send\_email": true }

[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-auto-reminders)  
link\_auto\_reminders  
boolean  
If "true", reminders will be sent to customers for collecting payments.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-notes)  
link\_notes  
object  
Key-value pair that can be used to store additional information about the entity. Maximum 5 key-value pairs  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-notes-key)  
link\_notes.{key}  
string  
Example:

{ "key\_1": "value\_1", "key\_2": "value\_2" }

[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-meta)  
link\_meta  
object  
Payment link meta information object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-meta-notify-url)  
link\_meta.notify\_url  
string  
Notification URL for server-server communication. It should be an https URL.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-meta-upi-intent)  
link\_meta.upi\_intent  
string  
If "true", link will directly open UPI Intent flow on mobile, and normal link flow elsewhere  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-meta-return-url)  
link\_meta.return\_url  
string  
The URL to which user will be redirected to after the payment is done on the link. Maximum length: 250\.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-link-meta-payment-methods)  
link\_meta.payment\_methods  
string  
Allowed payment modes for this link. Pass comma-separated values among following options \- "cc", "dc", "ccc", "ppc", "nb", "upi", "paypal", "app". Leave it blank to show all available payment methods  
Example:

{

 "notify\_url": "https://ee08e626ecd88c61c85f5c69c0418cb5.m.pipedream.net",

 "upi\_intent": "false",

 "return\_url": "https://www.cashfree.com/devstudio/thankyou"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-order-splits)  
order\_splits  
VendorSplit · object\[\]  
If you have Easy split enabled in your Cashfree account then you can use this option to split the order amount.  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-order-splits-vendor-id)  
vendor\_id  
stringrequired  
Vendor id created in Cashfree system  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-order-splits-amount)  
amount  
number  
Amount which will be associated with this vendor  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-order-splits-percentage)  
percentage  
number  
Percentage of order amount which shall get added to vendor account  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#body-order-splits-tags)  
tags  
object  
Custom Tags in the form of {"key":"value"} which can be passed for an order. A maximum of 10 tags can be added  
Show child attributes  
Example:

\[{ "amount": 10, "vendor": "john" }\]

#### Response

200  
application/json  
OK  
Payment link success creation response object  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-cf-link-id)  
cf\_link\_id  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-id)  
link\_id  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-status)  
link\_status  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-currency)  
link\_currency  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-amount)  
link\_amount  
number  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-amount-paid)  
link\_amount\_paid  
number  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-partial-payments)  
link\_partial\_payments  
boolean  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-minimum-partial-amount)  
link\_minimum\_partial\_amount  
number  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-purpose)  
link\_purpose  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-created-at)  
link\_created\_at  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-customer-details)  
customer\_details  
object  
Payment link customer entity  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-customer-details-customer-phone)  
customer\_details.customer\_phone  
stringrequired  
Customer phone number  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-customer-details-customer-email)  
customer\_details.customer\_email  
string  
Customer email address  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-customer-details-customer-name)  
customer\_details.customer\_name  
string  
Customer name  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-customer-details-customer-bank-account-number)  
customer\_details.customer\_bank\_account\_number  
string  
Customer Bank Account Number  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-customer-details-customer-bank-ifsc)  
customer\_details.customer\_bank\_ifsc  
string  
Customer Bank Ifsc  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-customer-details-customer-bank-code)  
customer\_details.customer\_bank\_code  
enum\<integer\>  
Customer Bank Code  
Available options: 3003, 3005, 3006, 3010, 3012, 3016, 3019, 3020, 3021, 3022, 3023, 3024, 3026, 3027, 3028, 3029, 3030, 3031, 3032, 3033, 3038, 3039, 3040, 3042, 3044, 3054, 3055, 3058, 3086, 3087, 3088, 3089, 3090, 3091, 3092, 3098, 3115, 3117, 7001  
Example:

{

 "customer\_name": "John Doe",

 "customer\_phone": "9999999999",

 "customer\_email": "john@cashfree.com",

 "customer\_bank\_account\_number": 11111111111,

 "customer\_bank\_ifsc": "SBIN0001882",

 "customer\_bank\_code": 7001

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-meta)  
link\_meta  
object  
Payment link meta information object  
Show child attributes  
Example:

{

 "notify\_url": "https://ee08e626ecd88c61c85f5c69c0418cb5.m.pipedream.net",

 "upi\_intent": "false",

 "return\_url": "https://www.cashfree.com/devstudio/thankyou"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-url)  
link\_url  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-expiry-time)  
link\_expiry\_time  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-notes)  
link\_notes  
object  
Key-value pair that can be used to store additional information about the entity. Maximum 5 key-value pairs  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-notes-key)  
link\_notes.{key}  
string  
Example:

{ "key\_1": "value\_1", "key\_2": "value\_2" }

[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-auto-reminders)  
link\_auto\_reminders  
boolean  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-notify)  
link\_notify  
object  
Payment link Notify Object for SMS and Email  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-notify-send-sms)  
link\_notify.send\_sms  
boolean  
If "true", Cashfree will send sms on customer\_phone  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-notify-send-email)  
link\_notify.send\_email  
boolean  
If "true", Cashfree will send email on customer\_email  
Example:

{ "send\_sms": false, "send\_email": true }

[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-link-qrcode)  
link\_qrcode  
string  
Base64 encoded string for payment link. You can scan with camera to open a link in the browser to complete the payment.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-order-splits)  
order\_splits  
VendorSplit · object\[\]  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-order-splits-vendor-id)  
vendor\_id  
stringrequired  
Vendor id created in Cashfree system  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-order-splits-amount)  
amount  
number  
Amount which will be associated with this vendor  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-order-splits-percentage)  
percentage  
number  
Percentage of order amount which shall get added to vendor account  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-order-splits-tags)  
tags  
object  
Custom Tags in the form of {"key":"value"} which can be passed for an order. A maximum of 10 tags can be added  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/create#response-tags-key)  
tags.{key}  
object  
Was this page helpful?  
Yes  
No  
[Payment Webhooks](https://www.cashfree.com/docs/api-reference/payments/latest/payments/webhooks)  
[Fetch Payment Link Details](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/get)  
