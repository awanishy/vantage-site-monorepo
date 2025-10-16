**Create Refund**

Open in ChatGPT  
Use this API to initiate refunds.  
Note: You can initiate refunds only within six months of the original successful transaction’s date and time.  
**POST**  
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
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#authorization-x-client-id)  
x-client-id  
stringheaderrequired  
Client app ID. You can find your app id in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#authorization-x-client-secret)  
x-client-secret  
stringheaderrequired  
Client secret key. You can find your secret key in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).

#### **Headers**

[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#parameter-x-api-version)  
x-api-version  
stringdefault:2025-01-01required  
API version to be used. Format is in YYYY-MM-DD.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#parameter-x-request-id)  
x-request-id  
string  
Request ID for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to Cashfree.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#parameter-x-idempotency-key)  
x-idempotency-key  
string\<UUID\>  
An idempotency key is a unique identifier you include with your API call.  
If the request fails or times out, you can safely retry it using the same key to avoid duplicate actions.

#### **Path Parameters**

[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#parameter-order-id)  
order\_id  
stringrequired  
The ID which uniquely identifies your order.

#### **Body**

application/json  
Request Body to Create Refunds  
create refund request object  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#body-refund-amount)  
refund\_amount  
numberrequired  
Amount to be refunded. Should be lesser than or equal to the transaction amount. (Decimals allowed)  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#body-refund-id)  
refund\_id  
stringrequired  
An unique ID to associate the refund with. Provie alphanumeric values  
Required string length: 3 \- 40  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#body-refund-note)  
refund\_note  
string  
A refund note for your reference.  
Required string length: 3 \- 100  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#body-refund-speed)  
refund\_speed  
enum\<string\>  
Speed at which the refund is processed. It's an optional field with default being STANDARD  
Available options: STANDARD, INSTANT  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#body-refund-splits)  
refund\_splits  
VendorSplit · object\[\]  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#body-refund-splits-vendor-id)  
vendor\_id  
stringrequired  
Vendor id created in Cashfree system  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#body-refund-splits-amount)  
amount  
number  
Amount which will be associated with this vendor  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#body-refund-splits-percentage)  
percentage  
number  
Percentage of order amount which shall get added to vendor account  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#body-refund-splits-tags)  
tags  
object  
Custom Tags in the form of {"key":"value"} which can be passed for an order. A maximum of 10 tags can be added  
Show child attributes

#### Response

200  
application/json  
Refund created  
The refund entity  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-cf-payment-id)  
cf\_payment\_id  
string  
Cashfree Payments ID of the payment for which refund is initiated  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-cf-refund-id)  
cf\_refund\_id  
string  
Cashfree Payments ID for a refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-order-id)  
order\_id  
string  
Merchant’s order Id of the order for which refund is initiated  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-id)  
refund\_id  
string  
Merchant’s refund ID of the refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-entity)  
entity  
enum\<string\>  
Type of object  
Available options: refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-amount)  
refund\_amount  
number  
Amount that is refunded  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-currency)  
refund\_currency  
string  
Currency of the refund amount  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-note)  
refund\_note  
string  
Note added by merchant for the refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-status)  
refund\_status  
enum\<string\>  
This can be one of \["SUCCESS", "PENDING", "CANCELLED", "ONHOLD", "FAILED"\]  
Available options: SUCCESS, PENDING, CANCELLED, ONHOLD  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-arn)  
refund\_arn  
string  
The bank reference number for refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-charge)  
refund\_charge  
number  
Charges in INR for processing refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-status-description)  
status\_description  
string  
Description of refund status  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-metadata)  
metadata  
object  
Key-value pair that can be used to store additional information about the entity. Maximum 5 key-value pairs  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-splits)  
refund\_splits  
VendorSplit · object\[\]  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-splits-vendor-id)  
vendor\_id  
stringrequired  
Vendor id created in Cashfree system  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-splits-amount)  
amount  
number  
Amount which will be associated with this vendor  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-splits-percentage)  
percentage  
number  
Percentage of order amount which shall get added to vendor account  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-splits-tags)  
tags  
object  
Custom Tags in the form of {"key":"value"} which can be passed for an order. A maximum of 10 tags can be added  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-type)  
refund\_type  
enum\<string\>  
This can be one of \["PAYMENT\_AUTO\_REFUND", "MERCHANT\_INITIATED", "UNRECONCILED\_AUTO\_REFUND"\]  
Available options: PAYMENT\_AUTO\_REFUND, MERCHANT\_INITIATED, UNRECONCILED\_AUTO\_REFUND  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-mode)  
refund\_mode  
string  
Method or speed of processing refund  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-created-at)  
created\_at  
string  
Time of refund creation  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-processed-at)  
processed\_at  
string  
Time when refund was processed successfully  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-refund-speed)  
refund\_speed  
object  
How fast refund has to be proecessed  
Show child attributes  
Example:

{

 "requested": "STANDARD",

 "accepted": "STANDARD",

 "processed": "STANDARD",

 "message": "Error message, if any"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-forex-conversion-handling-charge)  
forex\_conversion\_handling\_charge  
number  
Cashfree forex conversion charges for refund processing  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-forex-conversion-handling-tax)  
forex\_conversion\_handling\_tax  
number  
Cashfree forex conversion tax for refund processing  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-forex-conversion-rate)  
forex\_conversion\_rate  
number  
Cashfree forex conversion rate for refund processing  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/create#response-charges-currency)  
charges\_currency  
string  
Cashfree refund charges currency for a refund  
Was this page helpful?  
Yes  
No  
[Webhooks](https://www.cashfree.com/docs/api-reference/payments/latest/payment-links/webhooks)  
[Get Refund](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get)  
