**Get Eligible Cardless EMI Payment Methods for a customer on an order**

Open in ChatGPT  
Use this API to get eligible Cardless EMI Payment Methods available for a customer on an order basis their phone number.  
**POST**  
https://sandbox.cashfree.com/pghttps://api.cashfree.com/pg  
/  
eligibility  
/  
cardlessemi  
Try it

#### **Authorizations**

XClientID & XClientSecretXClientID & XPartnerAPIKeyXClientID & XClientSignatureHeaderXPartnerMerchantID & XPartnerAPIKey  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#authorization-x-client-id)  
x-client-id  
stringheaderrequired  
Client app ID. You can find your app id in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#authorization-x-client-secret)  
x-client-secret  
stringheaderrequired  
Client secret key. You can find your secret key in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).

#### **Headers**

[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#parameter-x-api-version)  
x-api-version  
stringdefault:2025-01-01required  
API version to be used. Format is in YYYY-MM-DD.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#parameter-x-request-id)  
x-request-id  
string  
Request ID for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to Cashfree.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#parameter-x-idempotency-key)  
x-idempotency-key  
string\<UUID\>  
An idempotency key is a unique identifier you include with your API call.  
If the request fails or times out, you can safely retry it using the same key to avoid duplicate actions.

#### **Body**

application/json  
Request Body to get eligible cardless emi options for a customer and order  
eligibilty request for cardless  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#body-queries)  
queries  
objectrequired  
cardless EMI query object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#body-queries-order-id)  
queries.order\_id  
string\<string\>  
OrderId of the order. Either of order\_id or amount is mandatory.  
Required string length: 3 \- 50  
Example:  
"orderYB1X69LgzUQWiSxYDF"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#body-queries-amount)  
queries.amount  
number  
Amount of the order. OrderId of the order. Either of order\_id or amount is mandatory.  
Required range: x \>= 1  
Example:  
100  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#body-queries-customer-details)  
queries.customer\_details  
object  
Details of the customer for whom eligibility is being checked.  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#body-queries-customer-details-customer-phone)  
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
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#response-eligibility)  
eligibility  
boolean  
Example:  
true  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#response-entity-type)  
entity\_type  
string  
Example:  
"cardlessemi"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#response-entity-value)  
entity\_value  
string  
Example:  
"idfc"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#response-entity-details)  
entity\_details  
object  
cardless EMI object  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#response-entity-details-payment-method)  
entity\_details.payment\_method  
string  
Required string length: 3 \- 50  
Example:  
"idfc"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#response-entity-details-emi-plans)  
entity\_details.emi\_plans  
EMIPlansArray · object\[\]  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#response-entity-details-emi-plans-tenure)  
tenure  
integer  
Example:  
3  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#response-entity-details-emi-plans-interest-rate)  
interest\_rate  
number  
Example:  
24  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#response-entity-details-emi-plans-currency)  
currency  
string  
Required string length: 3 \- 50  
Example:  
"INR"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#response-entity-details-emi-plans-emi)  
emi  
integer  
Example:  
3468  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#response-entity-details-emi-plans-total-interest)  
total\_interest  
integer  
Example:  
404  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-cardless-emi-payment-methods-for-a-customer-on-an-order#response-entity-details-emi-plans-total-amount)  
total\_amount  
integer  
Example:  
10404  
Example:

{

 "$ref": "\#/components/schemas/CardlessEMIEntity/example",

 "payment\_method": "idfc",

 "emi\_plans": \[

   {

     "tenure": 1,

     "interest\_rate": 10,

     "currency": "INR",

     "emi": 400,

     "total\_interest": 10,

     "total\_amount": 40

   }

 \]

}

Was this page helpful?  
Yes  
No  
[Vendor Reconciliation API](https://www.cashfree.com/docs/api-reference/payments/latest/reconciliation/vendor-recon)  
[Get Eligible Offers for an Order](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order)  
