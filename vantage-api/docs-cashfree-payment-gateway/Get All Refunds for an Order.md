**Get All Refunds for an Order**

Open in ChatGPT  
Use this API to fetch all refunds processed against an order.  
**GET**  
https://sandbox.cashfree.com/pghttps://api.cashfree.com/pg  
/  
orders  
/  
{order\_id}  
/  
refunds  
Try it

#### **Authorizations**

XClientID & XClientSecretXClientID & XPartnerAPIKeyXClientID & XClientSignatureHeaderXPartnerMerchantID & XPartnerAPIKey  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#authorization-x-client-id)  
x-client-id  
stringheaderrequired  
Client app ID. You can find your app id in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#authorization-x-client-secret)  
x-client-secret  
stringheaderrequired  
Client secret key. You can find your secret key in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).

#### **Headers**

[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#parameter-x-api-version)  
x-api-version  
stringdefault:2025-01-01required  
API version to be used. Format is in YYYY-MM-DD.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#parameter-x-request-id)  
x-request-id  
string  
Request ID for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to Cashfree.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#parameter-x-idempotency-key)  
x-idempotency-key  
string\<UUID\>  
An idempotency key is a unique identifier you include with your API call.  
If the request fails or times out, you can safely retry it using the same key to avoid duplicate actions.

#### **Path Parameters**

[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#parameter-order-id)  
order\_id  
stringrequired  
The ID which uniquely identifies your order.

#### **Response**

200  
application/json  
OK  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-cf-payment-id)  
cf\_payment\_id  
string  
Cashfree Payments ID of the payment for which refund is initiated  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-cf-refund-id)  
cf\_refund\_id  
string  
Cashfree Payments ID for a refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-order-id)  
order\_id  
string  
Merchant’s order Id of the order for which refund is initiated  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-id)  
refund\_id  
string  
Merchant’s refund ID of the refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-entity)  
entity  
enum\<string\>  
Type of object  
Available options: refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-amount)  
refund\_amount  
number  
Amount that is refunded  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-currency)  
refund\_currency  
string  
Currency of the refund amount  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-note)  
refund\_note  
string  
Note added by merchant for the refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-status)  
refund\_status  
enum\<string\>  
This can be one of \["SUCCESS", "PENDING", "CANCELLED", "ONHOLD", "FAILED"\]  
Available options: SUCCESS, PENDING, CANCELLED, ONHOLD  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-arn)  
refund\_arn  
string  
The bank reference number for refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-charge)  
refund\_charge  
number  
Charges in INR for processing refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-status-description)  
status\_description  
string  
Description of refund status  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-metadata)  
metadata  
object  
Key-value pair that can be used to store additional information about the entity. Maximum 5 key-value pairs  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-splits)  
refund\_splits  
VendorSplit · object\[\]  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-splits-vendor-id)  
vendor\_id  
stringrequired  
Vendor id created in Cashfree system  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-splits-amount)  
amount  
number  
Amount which will be associated with this vendor  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-splits-percentage)  
percentage  
number  
Percentage of order amount which shall get added to vendor account  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-splits-tags)  
tags  
object  
Custom Tags in the form of {"key":"value"} which can be passed for an order. A maximum of 10 tags can be added  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-type)  
refund\_type  
enum\<string\>  
This can be one of \["PAYMENT\_AUTO\_REFUND", "MERCHANT\_INITIATED", "UNRECONCILED\_AUTO\_REFUND"\]  
Available options: PAYMENT\_AUTO\_REFUND, MERCHANT\_INITIATED, UNRECONCILED\_AUTO\_REFUND  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-mode)  
refund\_mode  
string  
Method or speed of processing refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-created-at)  
created\_at  
string  
Time of refund creation  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-processed-at)  
processed\_at  
string  
Time when refund was processed successfully  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-speed)  
refund\_speed  
object  
How fast refund has to be proecessed  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-speed-requested)  
refund\_speed.requested  
string  
Requested speed of refund.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-speed-accepted)  
refund\_speed.accepted  
string  
Accepted speed of refund.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-speed-processed)  
refund\_speed.processed  
string  
Processed speed of refund.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-refund-speed-message)  
refund\_speed.message  
string  
Error message, if any for refund\_speed request  
Example:

{

 "requested": "STANDARD",

 "accepted": "STANDARD",

 "processed": "STANDARD",

 "message": "Error message, if any"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-forex-conversion-handling-charge)  
forex\_conversion\_handling\_charge  
number  
Cashfree forex conversion charges for refund processing  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-forex-conversion-handling-tax)  
forex\_conversion\_handling\_tax  
number  
Cashfree forex conversion tax for refund processing  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-forex-conversion-rate)  
forex\_conversion\_rate  
number  
Cashfree forex conversion rate for refund processing  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order#response-charges-currency)  
charges\_currency  
string  
Cashfree refund charges currency for a refund  
Was this page helpful?  
Yes  
No  
[Get Refund](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get)  
[Webhooks](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/webhooks)  
