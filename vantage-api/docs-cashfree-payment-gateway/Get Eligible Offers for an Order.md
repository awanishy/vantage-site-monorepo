**Get Eligible Offers for an Order**

Open in ChatGPT  
Use this API to get eligible offers for an order\_id or order amount.  
**POST**  
https://sandbox.cashfree.com/pghttps://api.cashfree.com/pg  
/  
eligibility  
/  
offers  
Try it

#### **Authorizations**

XClientID & XClientSecretXClientID & XPartnerAPIKeyXClientID & XClientSignatureHeaderXPartnerMerchantID & XPartnerAPIKey  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#authorization-x-client-id)  
x-client-id  
stringheaderrequired  
Client app ID. You can find your app id in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#authorization-x-client-secret)  
x-client-secret  
stringheaderrequired  
Client secret key. You can find your secret key in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).

#### **Headers**

[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#parameter-x-api-version)  
x-api-version  
stringdefault:2025-01-01required  
API version to be used. Format is in YYYY-MM-DD.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#parameter-x-request-id)  
x-request-id  
string  
Request ID for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to Cashfree.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#parameter-x-idempotency-key)  
x-idempotency-key  
string\<UUID\>  
An idempotency key is a unique identifier you include with your API call.  
If the request fails or times out, you can safely retry it using the same key to avoid duplicate actions.

#### **Body**

application/json  
Request Body to get eligible offers for a customer and order  
Eligiblty API request  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#body-queries)  
queries  
objectrequired  
Offer Query Object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#body-queries-order-id)  
queries.order\_id  
string\<string\>  
OrderId of the order. Either of order\_id or order\_amount is mandatory.  
Required string length: 3 \- 50  
Example:  
"order\_413462PK1RI1IwYB1X69LgzUQWiSxYDF"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#body-queries-amount)  
queries.amount  
number  
Amount of the order. OrderId of the order. Either of order\_id or order\_amount is mandatory.  
Required range: x \>= 1  
Example:  
100  
Example:

{

 "order\_id": "order\_413462PK1RI1IwYB1X69LgzUQWiSxYDF",

 "amount": 100

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#body-filters)  
filters  
object  
Filter for offers  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#body-filters-offer-type)  
filters.offer\_type  
enum\<string\>\[\]  
Array of offer\_type to be filtered.  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#parameter)  
enum\<string\>  
Offer Type Object  
Available options: DISCOUNT, CASHBACK, DISCOUNT\_AND\_CASHBACK, NO\_COST\_EMI  
Example:  
"DISCOUNT\_AND\_CASHBACK"  
Example:

{

 "offer\_type": \["DISCOUNT\_AND\_CASHBACK", "DISCOUNT"\]

}

#### Response

200  
application/json  
OK  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-eligibility)  
eligibility  
boolean  
Example:  
true  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-type)  
entity\_type  
string  
Example:  
"offers"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-value)  
entity\_value  
string  
Example:  
"d2b430fb-1afe-455a-af31-66d00377b29a"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details)  
entity\_details  
object  
Offer entity object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-id)  
entity\_details.offer\_id  
string  
Example:  
"d2b430fb-1afe-455a-af31-66d00377b29a"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-status)  
entity\_details.offer\_status  
string  
Example:  
"active"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-order-amount)  
entity\_details.order\_amount  
number  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-payable-amount)  
entity\_details.payable\_amount  
number  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-meta)  
entity\_details.offer\_meta  
object  
Offer meta response details object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-meta-offer-code)  
entity\_details.offer\_meta.offer\_code  
string  
Unique identifier for the Offer.  
Required string length: 1 \- 45  
Example:  
"CFTESTOFFER"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-meta-offer-description)  
entity\_details.offer\_meta.offer\_description  
string  
Description for the Offer.  
Required string length: 3 \- 100  
Example:  
"Lorem ipsum dolor sit amet, consectetur adipiscing elit"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-meta-offer-end-time)  
entity\_details.offer\_meta.offer\_end\_time  
string  
Expiry Time for the Offer  
Example:  
"2023-03-29T08:09:51Z"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-meta-offer-start-time)  
entity\_details.offer\_meta.offer\_start\_time  
string  
Start Time for the Offer  
Required string length: 3 \- 20  
Example:  
"2023-03-21T08:09:51Z"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-meta-offer-title)  
entity\_details.offer\_meta.offer\_title  
string  
Title for the Offer.  
Required string length: 3 \- 50  
Example:  
"Test Offer"  
Example:

{

 "$ref": "\#/components/schemas/OfferMetaResponse/example",

 "offer\_code": "CFTESTOFFER",

 "offer\_description": "some offer description",

 "offer\_end\_time": "2023-03-29T08:09:51Z",

 "offer\_start\_time": "2023-03-21T08:09:51Z",

 "offer\_title": "some title"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-tnc)  
entity\_details.offer\_tnc  
object  
Offer terms and condition object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-tnc-offer-tnc-type)  
entity\_details.offer\_tnc.offer\_tnc\_type  
enum\<string\>  
TnC Type for the Offer. It can be either text or link  
Available options: text, link  
Example:  
"text"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-tnc-offer-tnc-value)  
entity\_details.offer\_tnc.offer\_tnc\_value  
string  
TnC for the Offer.  
Required string length: 3 \- 100  
Example:  
"Lorem ipsum dolor sit amet, consectetur adipiscing elit"  
Example:

{

 "$ref": "\#/components/schemas/OfferTncResponse/example",

 "offer\_tnc\_type": "text",

 "offer\_tnc\_value": "TnC for the Offer."

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-details)  
entity\_details.offer\_details  
object  
Offer details response and type  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-details-cashback-details)  
entity\_details.offer\_details.cashback\_details  
object  
Cashback detail boject  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-details-cashback-details-cashback-type)  
entity\_details.offer\_details.cashback\_details.cashback\_type  
enum\<string\>required  
Type of discount  
Available options: flat, percentage  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-details-cashback-details-cashback-value)  
entity\_details.offer\_details.cashback\_details.cashback\_value  
numberrequired  
Value of Discount.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-details-cashback-details-max-cashback-amount)  
entity\_details.offer\_details.cashback\_details.max\_cashback\_amount  
numberrequired  
Maximum Value of Cashback allowed.  
Example:

{

 "cashback\_type": "percentage",

 "cashback\_value": "20",

 "max\_cashback\_amount": "150"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-details-discount-details)  
entity\_details.offer\_details.discount\_details  
object  
detils of the discount object of offer  
Show child attributes  
Example:

{

 "discount\_type": "flat",

 "discount\_value": "10",

 "max\_discount\_amount": "10"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-details-offer-type)  
entity\_details.offer\_details.offer\_type  
enum\<string\>  
Offer Type for the Offer.  
Available options: DISCOUNT, CASHBACK, DISCOUNT\_AND\_CASHBACK, NO\_COST\_EMI  
Example:  
"DISCOUNT\_AND\_CASHBACK"  
Example:

{

 "$ref": "\#/components/schemas/OfferDetailsResponse/example",

 "cashback\_details": {

   "cashback\_type": "percentage",

   "cashback\_value": "20",

   "max\_cashback\_amount": "150"

 },

 "discount\_details": {

   "discount\_type": "flat",

   "discount\_value": "10",

   "max\_discount\_amount": "10"

 },

 "offer\_type": "DISCOUNT\_AND\_CASHBACK"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-validations)  
entity\_details.offer\_validations  
object  
Offer validation object  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-validations-max-allowed)  
entity\_details.offer\_validations.max\_allowed  
number  
Maximum Amount for Offer to be Applicable  
Required range: x \>= 1  
Example:  
1  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-validations-min-amount)  
entity\_details.offer\_validations.min\_amount  
number  
Minimum Amount for Offer to be Applicable  
Required range: x \>= 1  
Example:  
1  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order#response-entity-details-offer-validations-payment-method)  
entity\_details.offer\_validations.payment\_method  
object  
returns all offers

* All Offers  
* Card Offer  
* Net Banking Offer  
* Wallet Offer  
* UPI Offer  
* Paylater Offer  
* EMI Offer

Show child attributes  
Example:

{

 "wallet": { "issuer": "paytm" },

 "all": {}

}

Example:

{

 "$ref": "\#/components/schemas/OfferValidationsResponse/example",

 "max\_allowed": 2,

 "min\_amount": 10,

 "payment\_method": { "wallet": { "issuer": "paytm" } }

}

Example:

{

 "$ref": "\#/components/examples/offer\_entity\_example/value/0"

}

Was this page helpful?  
Yes  
No  
[Get Eligible Cardless EMI Payment Methods for a customer on an order](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order)  
[Get Eligible Paylater for a customer on an order](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-paylater-for-a-customer-on-an-order)  
