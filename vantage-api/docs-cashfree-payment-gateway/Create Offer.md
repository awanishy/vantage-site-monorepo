**Create Offer**

Open in ChatGPT  
Use this API to create offers with Cashfree from your backend  
**POST**  
https://sandbox.cashfree.com/pghttps://api.cashfree.com/pg  
/  
offers  
Try it

#### **Authorizations**

XClientID & XClientSecretXClientID & XPartnerAPIKeyXClientID & XClientSignatureHeaderXPartnerMerchantID & XPartnerAPIKey  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#authorization-x-client-id)  
x-client-id  
stringheaderrequired  
Client app ID. You can find your app id in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#authorization-x-client-secret)  
x-client-secret  
stringheaderrequired  
Client secret key. You can find your secret key in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).

#### **Headers**

[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#parameter-x-api-version)  
x-api-version  
stringdefault:2023-08-01required  
API version to be used. Format is in YYYY-MM-DD  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#parameter-x-request-id)  
x-request-id  
string  
Request id for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to cashfree  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#parameter-x-idempotency-key)  
x-idempotency-key  
string\<UUID\>  
An idempotency key is a unique identifier you include with your API call.  
If the request fails or times out, you can safely retry it using the same key to avoid duplicate actions.

#### **Body**

application/json  
Request body to create an offer at Cashfree  
create offer backend request object  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-meta)  
offer\_meta  
objectrequired  
Offer meta details object  
Show child attributes  
Example:

{

 "$ref": "\#/components/schemas/OfferMeta/example",

 "offer\_title": "some title",

 "offer\_description": "some offer description",

 "offer\_code": "CFTESTOFFER",

 "offer\_start\_time": "2023-03-21T08:09:51Z",

 "offer\_end\_time": "2023-03-29T08:09:51Z"

}

[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-tnc)  
offer\_tnc  
objectrequired  
Offer terms and condition object  
Show child attributes  
Example:

{

 "$ref": "\#/components/schemas/OfferTnc/example",

 "offer\_tnc\_type": "text",

 "offer\_tnc\_value": "TnC for the Offer."

}

[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-details)  
offer\_details  
objectrequired  
Offer details and type  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-details-offer-type)  
offer\_details.offer\_type  
enum\<string\>required  
Offer Type for the Offer.  
Available options: DISCOUNT, CASHBACK, DISCOUNT\_AND\_CASHBACK, NO\_COST\_EMI  
Example:  
"DISCOUNT\_AND\_CASHBACK"  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-details-discount-details)  
offer\_details.discount\_details  
object  
detils of the discount object of offer  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-details-discount-details-discount-type)  
offer\_details.discount\_details.discount\_type  
enum\<string\>required  
Type of discount  
Available options: flat, percentage  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-details-discount-details-discount-value)  
offer\_details.discount\_details.discount\_value  
numberrequired  
Value of Discount.  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-details-discount-details-max-discount-amount)  
offer\_details.discount\_details.max\_discount\_amount  
numberrequired  
Maximum Value of Discount allowed.  
Example:

{

 "discount\_type": "flat",

 "discount\_value": "10",

 "max\_discount\_amount": "10"

}

[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-details-cashback-details)  
offer\_details.cashback\_details  
object  
Cashback detail boject  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-details-cashback-details-cashback-type)  
offer\_details.cashback\_details.cashback\_type  
enum\<string\>required  
Type of discount  
Available options: flat, percentage  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-details-cashback-details-cashback-value)  
offer\_details.cashback\_details.cashback\_value  
numberrequired  
Value of Discount.  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-details-cashback-details-max-cashback-amount)  
offer\_details.cashback\_details.max\_cashback\_amount  
numberrequired  
Maximum Value of Cashback allowed.  
Example:

{

 "cashback\_type": "percentage",

 "cashback\_value": "20",

 "max\_cashback\_amount": "150"

}

Example:

{

 "$ref": "\#/components/schemas/OfferDetails/example",

 "offer\_type": "DISCOUNT\_AND\_CASHBACK",

 "discount\_details": {

   "discount\_type": "flat",

   "discount\_value": "10",

   "max\_discount\_amount": "10"

 },

 "cashback\_details": {

   "cashback\_type": "percentage",

   "cashback\_value": "20",

   "max\_cashback\_amount": "150"

 }

}

[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-validations)  
offer\_validations  
objectrequired  
Offer validation object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-validations-max-allowed)  
offer\_validations.max\_allowed  
numberrequired  
Maximum Amount for Offer to be Applicable  
Required range: x \>= 1  
Example:  
1  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-validations-payment-method)  
offer\_validations.payment\_method  
objectrequired  
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

[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#body-offer-validations-min-amount)  
offer\_validations.min\_amount  
number  
Minimum Amount for Offer to be Applicable  
Required range: x \>= 1  
Example:  
1  
Example:

{

 "$ref": "\#/components/schemas/OfferValidations/example",

 "min\_amount": 10,

 "payment\_method": { "wallet": { "issuer": "paytm" } },

 "max\_allowed": 2

}

#### Response

200  
application/json  
OK  
Offer entity object  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-id)  
offer\_id  
string  
Example:  
"d2b430fb-1afe-455a-af31-66d00377b29a"  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-status)  
offer\_status  
string  
Example:  
"active"  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-meta)  
offer\_meta  
object  
Offer meta details object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-meta-offer-title)  
offer\_meta.offer\_title  
stringrequired  
Title for the Offer.  
Required string length: 3 \- 50  
Example:  
"Test Offer"  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-meta-offer-description)  
offer\_meta.offer\_description  
stringrequired  
Description for the Offer.  
Required string length: 3 \- 100  
Example:  
"Lorem ipsum dolor sit amet, consectetur adipiscing elit"  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-meta-offer-code)  
offer\_meta.offer\_code  
stringrequired  
Unique identifier for the Offer.  
Required string length: 1 \- 45  
Example:  
"CFTESTOFFER"  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-meta-offer-start-time)  
offer\_meta.offer\_start\_time  
stringrequired  
Start Time for the Offer  
Required string length: 3 \- 20  
Example:  
"2023-03-21T08:09:51Z"  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-meta-offer-end-time)  
offer\_meta.offer\_end\_time  
stringrequired  
Expiry Time for the Offer  
Example:  
"2023-03-29T08:09:51Z"  
Example:

{

 "$ref": "\#/components/schemas/OfferMeta/example",

 "offer\_title": "some title",

 "offer\_description": "some offer description",

 "offer\_code": "CFTESTOFFER",

 "offer\_start\_time": "2023-03-21T08:09:51Z",

 "offer\_end\_time": "2023-03-29T08:09:51Z"

}

[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-tnc)  
offer\_tnc  
object  
Offer terms and condition object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-tnc-offer-tnc-type)  
offer\_tnc.offer\_tnc\_type  
enum\<string\>required  
TnC Type for the Offer. It can be either text or link  
Available options: text, link  
Example:  
"text"  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-tnc-offer-tnc-value)  
offer\_tnc.offer\_tnc\_value  
stringrequired  
TnC for the Offer.  
Required string length: 3 \- 100  
Example:  
"Lorem ipsum dolor sit amet, consectetur adipiscing elit"  
Example:

{

 "$ref": "\#/components/schemas/OfferTnc/example",

 "offer\_tnc\_type": "text",

 "offer\_tnc\_value": "TnC for the Offer."

}

[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-details)  
offer\_details  
object  
Offer details and type  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-details-offer-type)  
offer\_details.offer\_type  
enum\<string\>required  
Offer Type for the Offer.  
Available options: DISCOUNT, CASHBACK, DISCOUNT\_AND\_CASHBACK, NO\_COST\_EMI  
Example:  
"DISCOUNT\_AND\_CASHBACK"  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-details-discount-details)  
offer\_details.discount\_details  
object  
detils of the discount object of offer  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-details-discount-details-discount-type)  
offer\_details.discount\_details.discount\_type  
enum\<string\>required  
Type of discount  
Available options: flat, percentage  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-details-discount-details-discount-value)  
offer\_details.discount\_details.discount\_value  
numberrequired  
Value of Discount.  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-details-discount-details-max-discount-amount)  
offer\_details.discount\_details.max\_discount\_amount  
numberrequired  
Maximum Value of Discount allowed.  
Example:

{

 "discount\_type": "flat",

 "discount\_value": "10",

 "max\_discount\_amount": "10"

}

[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-details-cashback-details)  
offer\_details.cashback\_details  
object  
Cashback detail boject  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-details-cashback-details-cashback-type)  
offer\_details.cashback\_details.cashback\_type  
enum\<string\>required  
Type of discount  
Available options: flat, percentage  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-details-cashback-details-cashback-value)  
offer\_details.cashback\_details.cashback\_value  
numberrequired  
Value of Discount.  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-details-cashback-details-max-cashback-amount)  
offer\_details.cashback\_details.max\_cashback\_amount  
numberrequired  
Maximum Value of Cashback allowed.  
Example:

{

 "cashback\_type": "percentage",

 "cashback\_value": "20",

 "max\_cashback\_amount": "150"

}

Example:

{

 "$ref": "\#/components/schemas/OfferDetails/example",

 "offer\_type": "DISCOUNT\_AND\_CASHBACK",

 "discount\_details": {

   "discount\_type": "flat",

   "discount\_value": "10",

   "max\_discount\_amount": "10"

 },

 "cashback\_details": {

   "cashback\_type": "percentage",

   "cashback\_value": "20",

   "max\_cashback\_amount": "150"

 }

}

[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-validations)  
offer\_validations  
object  
Offer validation object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-validations-max-allowed)  
offer\_validations.max\_allowed  
numberrequired  
Maximum Amount for Offer to be Applicable  
Required range: x \>= 1  
Example:  
1  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-validations-payment-method)  
offer\_validations.payment\_method  
objectrequired  
returns all offers

* All Offers  
* Card Offer  
* Net Banking Offer  
* Wallet Offer  
* UPI Offer  
* Paylater Offer  
* EMI Offer

Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-validations-payment-method-all)  
offer\_validations.payment\_method.all  
objectrequired  
All offers applicable  
Example:

{

 "wallet": { "issuer": "paytm" },

 "all": {}

}

[​](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/create#response-offer-validations-min-amount)  
offer\_validations.min\_amount  
number  
Minimum Amount for Offer to be Applicable  
Required range: x \>= 1  
Example:  
1  
Example:

{

 "$ref": "\#/components/schemas/OfferValidations/example",

 "min\_amount": 10,

 "payment\_method": { "wallet": { "issuer": "paytm" } },

 "max\_allowed": 2

}

Was this page helpful?  
Yes  
No  
[Get eligible Payment Methods](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/payment-methods/get-payment-methods)  
[Get Offer by ID](https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/offers/get)  
