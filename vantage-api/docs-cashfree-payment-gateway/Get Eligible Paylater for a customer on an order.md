**Get Eligible Paylater for a customer on an order**

Open in ChatGPT  
Use this API to get eligible Paylater Payment Methods for a customer on an order.  
**POST**  
https://sandbox.cashfree.com/pghttps://api.cashfree.com/pg  
/  
eligibility  
/  
paylater  
Try it

#### **Authorizations**

XClientID & XClientSecretXClientID & XPartnerAPIKeyXClientID & XClientSignatureHeaderXPartnerMerchantID & XPartnerAPIKey  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#authorization-x-client-id)  
x-client-id  
stringheaderrequired  
Client app ID. You can find your app id in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#authorization-x-client-secret)  
x-client-secret  
stringheaderrequired  
Client secret key. You can find your secret key in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).

#### **Headers**

[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#parameter-x-api-version)  
x-api-version  
stringdefault:2025-01-01required  
API version to be used. Format is in YYYY-MM-DD.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#parameter-x-request-id)  
x-request-id  
string  
Request ID for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to Cashfree.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#parameter-x-idempotency-key)  
x-idempotency-key  
string\<UUID\>  
An idempotency key is a unique identifier you include with your API call.  
If the request fails or times out, you can safely retry it using the same key to avoid duplicate actions.

#### **Body**

application/json  
Request Body to get eligible paylater options for a customer and order  
Request to get eligible paylater payment methods  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#body-queries)  
queries  
objectrequired  
cardless EMI query object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#body-queries-order-id)  
queries.order\_id  
string\<string\>  
OrderId of the order. Either of order\_id or amount is mandatory.  
Required string length: 3 \- 50  
Example:  
"orderYB1X69LgzUQWiSxYDF"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#body-queries-amount)  
queries.amount  
number  
Amount of the order. OrderId of the order. Either of order\_id or amount is mandatory.  
Required range: x \>= 1  
Example:  
100  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#body-queries-customer-details)  
queries.customer\_details  
object  
Details of the customer for whom eligibility is being checked.  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#body-queries-customer-details-customer-phone)  
queries.customer\_details.customer\_phone  
stringrequired  
Phone Number of the customer  
Required string length: 3 \- 50  
Example:  
"9898989898"  
Example:

{

 "customer\_details": { "customer\_phone": "93838393833" },

 "customer\_phone": "9898989898"

}

Example:

{

 "order\_id": "orderYB1X69LgzUQWiSxYDF",

 "amount": 20,

 "customer\_details": { "customer\_phone": "93838393833" }

}

#### Response

200  
application/json  
OK  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#response-eligibility)  
eligibility  
boolean  
Example:  
true  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#response-entity-type)  
entity\_type  
string  
Example:  
"paylater"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#response-entity-value)  
entity\_value  
string  
Example:  
"olapostpaid"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#response-entity-details)  
entity\_details  
object  
Paylater Entity  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order#response-entity-details-payment-method)  
entity\_details.payment\_method  
string  
Example:  
"olapostpaid"  
Example:

{

 "payment\_method": {

   "type": "string",

   "example": "olapostpaid"

 }

}

Was this page helpful?  
Yes  
No  
[Get Eligible Offers for an Order](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order)  
[Get eligible Payment Methods](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods)  
