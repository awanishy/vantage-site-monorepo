**Get eligible Payment Methods**

Open in ChatGPT  
Use this API to get eligible Payment Methods  
**POST**  
https://sandbox.cashfree.com/pghttps://api.cashfree.com/pg  
/  
eligibility  
/  
payment\_methods  
Try it

#### **Authorizations**

XClientID & XClientSecretXClientID & XPartnerAPIKeyXClientID & XClientSignatureHeaderXPartnerMerchantID & XPartnerAPIKey  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#authorization-x-client-id)  
x-client-id  
stringheaderrequired  
Client app ID. You can find your app id in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#authorization-x-client-secret)  
x-client-secret  
stringheaderrequired  
Client secret key. You can find your secret key in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).

#### **Headers**

[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#parameter-x-api-version)  
x-api-version  
stringdefault:2025-01-01required  
API version to be used. Format is in YYYY-MM-DD.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#parameter-x-request-id)  
x-request-id  
string  
Request ID for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to Cashfree.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#parameter-x-idempotency-key)  
x-idempotency-key  
string\<UUID\>  
An idempotency key is a unique identifier you include with your API call.  
If the request fails or times out, you can safely retry it using the same key to avoid duplicate actions.

#### **Body**

application/json  
Request Body to get eligible payment methods for an account and order  
eligibilty request to find eligible payment method  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#body-queries)  
queries  
objectrequired  
Payment Method Query Object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#body-queries-amount)  
queries.amount  
number  
Amount of the order.  
Required range: x \>= 1  
Example:  
100  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#body-queries-order-id)  
queries.order\_id  
string\<string\>  
OrderId of the order. Either of order\_id or order\_amount is mandatory.  
Required string length: 3 \- 50  
Example:  
"order\_413462PK1RI1IwYB1X69LgzUQWiSxYDF"  
Example:

{ "amount": 100 }

[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#body-filters)  
filters  
object  
Filter for Payment Methods  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#body-filters-payment-methods)  
filters.payment\_methods  
string\[\]  
Array of payment methods to be filtered. This is optional, by default all payment methods will be returned. Possible values in \[ 'debit\_card', 'credit\_card', 'prepaid\_card', 'corporate\_credit\_card', 'upi', 'wallet', 'netbanking', 'banktransfer', 'paylater', 'paypal', 'debit\_card\_emi', 'credit\_card\_emi', 'upi\_credit\_card', 'upi\_ppi', 'cardless\_emi', 'account\_based\_payment' \]  
Methods Type Object  
Example:

{ "payment\_methods": null }

#### Response

200  
application/json  
OK  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#response-eligibility)  
eligibility  
boolean  
Example:  
true  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#response-entity-type)  
entity\_type  
string  
Example:  
"payment\_methods"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#response-entity-value)  
entity\_value  
string  
Example:  
"netbanking"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#response-entity-details)  
entity\_details  
object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#response-entity-details-payment-method-details)  
entity\_details.payment\_method\_details  
object\[\]  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#response-entity-details-payment-method-details-nick)  
nick  
string  
Example:  
"motak\_kahindra\_bank"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#response-entity-details-payment-method-details-display)  
display  
string  
Example:  
"Motak Mahindra Bank"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#response-entity-details-payment-method-details-eligibility)  
eligibility  
boolean  
Example:  
false  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-payment-methods#response-entity-details-payment-method-details-code)  
code  
number  
Example:  
3001  
Example:

{

 "payment\_method\_details": \[

   {

     "nick": "motak\_kahindra\_bank",

     "display": "Motak Kahindra Bank",

     "eligibility": true,

     "code": 3032

   },

   {

     "nick": "bank\_of\_india",

     "display": "Bank Of India",

     "eligibility": true,

     "code": 3031

   }

 \]

}

Was this page helpful?  
Yes  
No  
[Get Eligible Paylater for a customer on an order](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order)  
[Create Offer](https://www.cashfree.com/docs/api-reference/payments/latest/offers/create)  
