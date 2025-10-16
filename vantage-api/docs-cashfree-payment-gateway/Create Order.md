**Create Order**

Open in ChatGPT

### **Order**

An order is an entity which has a amount and currency associated with it. It is something for which you want to collect payment for. Use this API to create orders with Cashfree from your backend to get a payment\_sessions\_id. You can use the payment\_sessions\_id to create a transaction for the order.  
**POST**  
https://sandbox.cashfree.com/pghttps://api.cashfree.com/pg  
/  
orders  
Try it

#### **Authorizations**

XClientID & XClientSecretXClientID & XPartnerAPIKeyXClientID & XClientSignatureHeaderXPartnerMerchantID & XPartnerAPIKey  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#authorization-x-client-id)  
x-client-id  
stringheaderrequired  
Client app ID. You can find your app id in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#authorization-x-client-secret)  
x-client-secret  
stringheaderrequired  
Client secret key. You can find your secret key in the [Merchant Dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=prod).

#### **Headers**

[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#parameter-x-api-version)  
x-api-version  
stringdefault:2025-01-01required  
API version to be used. Format is in YYYY-MM-DD.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#parameter-x-request-id)  
x-request-id  
string  
Request ID for the API call. Can be used to resolve tech issues. Communicate this in your tech related queries to Cashfree.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#parameter-x-idempotency-key)  
x-idempotency-key  
string\<UUID\>  
An idempotency key is a unique identifier you include with your API call.  
If the request fails or times out, you can safely retry it using the same key to avoid duplicate actions.

#### **Body**

application/json  
Request body to create an order at Cashfree.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-amount)  
order\_amount  
numberrequired  
Bill amount for the order. Provide upto two decimals. 10.15 means Rs 10 and 15 paisa. For orders in non-INR currency, please refer to [supported amounts](https://www.cashfree.com/docs/payments/cross-border/international-payment-gateway/currencies-supported#decimal-support) per currency.  
Required range: x \>= 1  
Example:  
10.15  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-currency)  
order\_currency  
stringrequired  
Currency for the order. INR if left empty. For support currency list, refer [here](https://www.cashfree.com/docs/payments/cross-border/international-payment-gateway/currencies-supported#full-currency-list). Submit [Support Form](https://merchant.cashfree.com/auth/login) to enable new currencies.  
Example:  
"INR"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-customer-details)  
customer\_details  
objectrequired  
The customer details that are necessary. Note that you can pass dummy details if your use case does not require the customer details.  
Show child attributes  
Example:

{

 "customer\_id": "7112AAA812234",

 "customer\_email": "john@cashfree.com",

 "customer\_phone": "9908734801",

 "customer\_name": "John Doe",

 "customer\_bank\_account\_number": "1518121112",

 "customer\_bank\_ifsc": "XITI0000001",

 "customer\_bank\_code": 3333,

 "customer\_uid": "54deabb4-ba45-4a60-9e6a-9c016fe7ab10"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-id)  
order\_id  
string  
Order identifier present in your system. Alphanumeric, '\_' and '-' only  
Required string length: 3 \- 45  
Example:  
"your-order-id"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-cart-details)  
cart\_details  
object  
The cart details that are necessary like shipping address, billing address and more.  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-cart-details-customer-note)  
cart\_details.customer\_note  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-cart-details-shipping-charge)  
cart\_details.shipping\_charge  
number  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-cart-details-cart-name)  
cart\_details.cart\_name  
string  
Name of the cart.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-cart-details-customer-shipping-address)  
cart\_details.customer\_shipping\_address  
object  
Address given for cart details.  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-cart-details-customer-billing-address)  
cart\_details.customer\_billing\_address  
object  
Address given for cart details.  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-cart-details-cart-items)  
cart\_details.cart\_items  
CartItem · object\[\]  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-terminal)  
terminal  
object  
Use this if you are creating an order for cashfree's softPOS  
Show child attributes  
Example:

{

 "terminal\_phone\_no": "6309291183",

 "terminal\_id": "terminal-123",

 "terminal\_type": "SPOS",

 "added\_on": "2023-08-04T13:12:58+05:30",

 "cf\_terminal\_id": "31051123",

 "last\_updated\_on": "2023-09-06T14:07:00+05:30",

 "terminal\_address": "Banglore",

 "terminal\_name": "test",

 "terminal\_note": "POS vertical",

 "terminal\_status": "ACTIVE"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-meta)  
order\_meta  
object  
Optional meta details to control how the customer pays and how payment journey completes  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-meta-return-url)  
order\_meta.return\_url  
string  
This is the [URL](https://www.cashfree.com/devstudio/thankyou?order_id=devstudio_734905336776434862) to which the customer will be redirected after the payment reaches a terminal state (success, failed or cancelled). We recommend keeping context of order\_id in your return\_url so that you can identify the order when customer lands on your page. Cashfree triggers a GET request to this URL.  
Maximum URL length: 250 characters  
Example:  
"https://www.cashfree.com/devstudio/thankyou?order\_id=devstudio\_734905336776434862"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-meta-notify-url)  
order\_meta.notify\_url  
string  
Notification URL for server-server communication. Useful when user's connection drops while re-directing. NotifyUrl should be an https URL. Maximum length: 250\.  
Example:  
"https://example.com/cf\_notify"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-meta-payment-methods)  
order\_meta.payment\_methods  
any  
Allowed payment modes for this order. Pass comma-separated values among following options \- "cc", "dc", "ccc", "ppc","nb","upi","paypal","app","paylater","cardlessemi","dcemi","ccemi","banktransfer". Leave it blank to show all available payment methods  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-meta-payment-methods-filters)  
order\_meta.payment\_methods\_filters  
object  
Allowed payment modes for this order. Along with multiple filters for cards can be added to this key. And this filtering will be honoured during transaction creation.  
Show child attributes  
Example:

{

 "return\_url": "https://www.cashfree.com/devstudio/thankyou",

 "payment\_methods": "cc,dc"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-expiry-time)  
order\_expiry\_time  
string\<ISO8601\>  
Time after which the order expires. Customers will not be able to make the payment beyond the time specified here. We store timestamps in IST, but you can provide them in a valid ISO 8601 time format. Example 2021-07-02T10:20:12+05:30 for IST, 2021-07-02T10:20:12Z for UTC  
Example:  
"2021-07-02T10:20:12+05:30"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-note)  
order\_note  
string  
Order note for reference.  
Required string length: 3 \- 200  
Example:  
"Test order"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-tags)  
order\_tags  
object  
Custom Tags in the form of {"key":"value"} which can be passed for an order. A maximum of 10 tags can be added  
Show child attributes  
Example:

{

 "name": "John Doe",

 "city": "Bangalore",

 "product": "Laptop",

 "shipping\_address": "123 Main St"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-splits)  
order\_splits  
VendorSplit · object\[\]  
If you have Easy split enabled in your Cashfree account then you can use this option to split the order amount.  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-splits-vendor-id)  
vendor\_id  
stringrequired  
Vendor id created in Cashfree system  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-splits-amount)  
amount  
number  
Amount which will be associated with this vendor  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-splits-percentage)  
percentage  
number  
Percentage of order amount which shall get added to vendor account  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-order-splits-tags)  
tags  
object  
Custom Tags in the form of {"key":"value"} which can be passed for an order. A maximum of 10 tags can be added  
Show child attributes  
Example:

\[{ "amount": 10, "vendor": "john" }\]

[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-products)  
products  
object  
Use this to set configurations for the products like One Click Checkout, Verify and Pay, if they are enabled for your account  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-products-one-click-checkout)  
products.one\_click\_checkout  
object  
Specify the required configurations for this feature  
Show child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#body-products-verify-pay)  
products.verify\_pay  
object  
Specify the required configurations for this feature  
Show child attributes

#### Response

200  
application/json  
The complete order entity.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-cf-order-id)  
cf\_order\_id  
string  
unique id generated by cashfree for your order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-id)  
order\_id  
string  
order\_id sent during the api request  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-entity)  
entity  
string  
Type of the entity.  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-currency)  
order\_currency  
string  
Currency of the order. Example INR  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-amount)  
order\_amount  
number  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-status)  
order\_status  
string  
Possible values are

* ACTIVE: Order does not have a sucessful transaction yet  
* PAID: Order is PAID with one successful transaction  
* EXPIRED: Order was not PAID and not it has expired. No transaction can be initiated for an EXPIRED order. TERMINATED: Order terminated TERMINATION\_REQUESTED: Order termination requested

[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-payment-session-id)  
payment\_session\_id  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-expiry-time)  
order\_expiry\_time  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-note)  
order\_note  
string  
Additional note for order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-created-at)  
created\_at  
string  
When the order was created at cashfree's server  
Example:  
"2022-08-16T14:45:38+05:30"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-splits)  
order\_splits  
VendorSplit · object\[\]  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-splits-vendor-id)  
vendor\_id  
stringrequired  
Vendor id created in Cashfree system  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-splits-amount)  
amount  
number  
Amount which will be associated with this vendor  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-splits-percentage)  
percentage  
number  
Percentage of order amount which shall get added to vendor account  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-splits-tags)  
tags  
object  
Custom Tags in the form of {"key":"value"} which can be passed for an order. A maximum of 10 tags can be added  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-tags-key)  
tags.{key}  
object  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-customer-details)  
customer\_details  
object  
The customer details that are necessary. Note that you can pass dummy details if your use case does not require the customer details.  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-customer-details-customer-id)  
customer\_details.customer\_id  
string  
A unique identifier for the customer. Use alphanumeric values only.  
Required string length: 3 \- 50  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-customer-details-customer-email)  
customer\_details.customer\_email  
string  
Customer email address.  
Required string length: 3 \- 100  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-customer-details-customer-phone)  
customer\_details.customer\_phone  
string  
Customer phone number.  
Required string length: 10  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-customer-details-customer-name)  
customer\_details.customer\_name  
string  
Name of the customer.  
Required string length: 3 \- 100  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-customer-details-customer-bank-account-number)  
customer\_details.customer\_bank\_account\_number  
string  
Customer bank account. Required if you want to do a bank account check (TPV)  
Required string length: 3 \- 20  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-customer-details-customer-bank-ifsc)  
customer\_details.customer\_bank\_ifsc  
string  
Customer bank IFSC. Required if you want to do a bank account check (TPV)  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-customer-details-customer-bank-code)  
customer\_details.customer\_bank\_code  
number  
Customer bank code. Required for net banking payments, if you want to do a bank account check (TPV)  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-customer-details-customer-uid)  
customer\_details.customer\_uid  
string  
Customer identifier at Cashfree. You will get this when you create/get customer  
Example:

{

 "customer\_id": "7112AAA812234",

 "customer\_email": "john@cashfree.com",

 "customer\_phone": "9908734801",

 "customer\_name": "John Doe",

 "customer\_bank\_account\_number": "1518121112",

 "customer\_bank\_ifsc": "XITI0000001",

 "customer\_bank\_code": 3333,

 "customer\_uid": "54deabb4-ba45-4a60-9e6a-9c016fe7ab10"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta)  
order\_meta  
object  
Optional meta details to control how the customer pays and how payment journey completes  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-return-url)  
order\_meta.return\_url  
string  
This is the [URL](https://www.cashfree.com/devstudio/thankyou?order_id=devstudio_734905336776434862) to which the customer will be redirected after the payment reaches a terminal state (success, failed or cancelled). We recommend keeping context of order\_id in your return\_url so that you can identify the order when customer lands on your page. Cashfree triggers a GET request to this URL.  
Maximum URL length: 250 characters  
Example:  
"https://www.cashfree.com/devstudio/thankyou?order\_id=devstudio\_734905336776434862"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-notify-url)  
order\_meta.notify\_url  
string  
Notification URL for server-server communication. Useful when user's connection drops while re-directing. NotifyUrl should be an https URL. Maximum length: 250\.  
Example:  
"https://example.com/cf\_notify"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods)  
order\_meta.payment\_methods  
any  
Allowed payment modes for this order. Pass comma-separated values among following options \- "cc", "dc", "ccc", "ppc","nb","upi","paypal","app","paylater","cardlessemi","dcemi","ccemi","banktransfer". Leave it blank to show all available payment methods  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters)  
order\_meta.payment\_methods\_filters  
object  
Allowed payment modes for this order. Along with multiple filters for cards can be added to this key. And this filtering will be honoured during transaction creation.  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-methods)  
order\_meta.payment\_methods\_filters.methods  
object  
Allowed payment modes for this order. credit\_card, debit\_card, netbanking, paylater, etc are the values that can be passed to this parameter.  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-methods-action)  
order\_meta.payment\_methods\_filters.methods.action  
string  
It accepts value of "ALLOW" and allows only those modes present in it's neighbouring parameter "values"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-methods-values)  
order\_meta.payment\_methods\_filters.methods.values  
string\[\]  
The accepted entries for this paramter are "debit\_card, credit\_card, prepaid\_card, upi, wallet, netbanking, banktransfer, paylater, paypal, debit\_card\_emi, credit\_card\_emi, upi\_credit\_card, upi\_ppi, cardless\_emi, account\_based\_payment, corporate\_credit\_card, sbc\_debit\_card, sbc\_emandate, sbc\_upi, sbc\_credit\_card"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters)  
order\_meta.payment\_methods\_filters.filters  
object  
This object takes details of all the filtering that has to be done for this order. Filters on card bins, card schemes, card issuing bank and card suffixes  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-tenure)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_tenure  
object  
Allowed card emi tenure for the order  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-tenure-action)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_tenure.action  
string  
It accepts value of "ALLOW" and allows only those bins present in it's neighbouring parameter "values"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-tenure-values)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_tenure.values  
integer\[\]  
List of tenure to be allowed for the order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-bins)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_bins  
object  
Allowed card bins for the order  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-bins-action)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_bins.action  
string  
It accepts value of "ALLOW" and allows only those bins present in it's neighbouring parameter "values"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-bins-values)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_bins.values  
string\[\]  
List of card bins to be allowed for the order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-schemes)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_schemes  
object  
Allowed card schemes for the order  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-schemes-action)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_schemes.action  
string  
It accepts value of "ALLOW" and allows only those schemes present in it's neighbouring parameter "values"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-schemes-values)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_schemes.values  
string\[\]  
List of card schemes to be allowed for the order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-suffix)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_suffix  
object  
Allowed card suffixes for the order  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-suffix-action)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_suffix.action  
string  
It accepts value of "ALLOW" and allows only those suffixes present in it's neighbouring parameter "values"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-suffix-values)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_suffix.values  
string\[\]  
List of card suffixes to be allowed for the order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-issuing-bank)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_issuing\_bank  
object  
Allowed card issuing bank for the order  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-issuing-bank-action)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_issuing\_bank.action  
string  
It accepts value of "ALLOW" and allows only those issuing bank present in it's neighbouring parameter "values"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-emi-issuing-bank-values)  
order\_meta.payment\_methods\_filters.filters.card\_emi\_issuing\_bank.values  
string\[\]  
List of card issuing bank to be allowed for the order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-bins)  
order\_meta.payment\_methods\_filters.filters.card\_bins  
object  
Allowed card bins for the order  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-bins-action)  
order\_meta.payment\_methods\_filters.filters.card\_bins.action  
string  
It accepts value of "ALLOW" and allows only those bins present in it's neighbouring parameter "values"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-bins-values)  
order\_meta.payment\_methods\_filters.filters.card\_bins.values  
string\[\]  
List of card bins to be allowed for the order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-schemes)  
order\_meta.payment\_methods\_filters.filters.card\_schemes  
object  
Allowed card schemes for the order  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-schemes-action)  
order\_meta.payment\_methods\_filters.filters.card\_schemes.action  
string  
It accepts value of "ALLOW" and allows only those schemes present in it's neighbouring parameter "values"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-schemes-values)  
order\_meta.payment\_methods\_filters.filters.card\_schemes.values  
string\[\]  
List of card schemes to be allowed for the order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-suffix)  
order\_meta.payment\_methods\_filters.filters.card\_suffix  
object  
Allowed card suffixes for the order  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-suffix-action)  
order\_meta.payment\_methods\_filters.filters.card\_suffix.action  
string  
It accepts value of "ALLOW" and allows only those suffixes present in it's neighbouring parameter "values"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-suffix-values)  
order\_meta.payment\_methods\_filters.filters.card\_suffix.values  
string\[\]  
List of card suffixes to be allowed for the order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-issuing-bank)  
order\_meta.payment\_methods\_filters.filters.card\_issuing\_bank  
object  
Allowed card issuing bank for the order  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-issuing-bank-action)  
order\_meta.payment\_methods\_filters.filters.card\_issuing\_bank.action  
string  
It accepts value of "ALLOW" and allows only those issuing bank present in it's neighbouring parameter "values"  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-meta-payment-methods-filters-filters-card-issuing-bank-values)  
order\_meta.payment\_methods\_filters.filters.card\_issuing\_bank.values  
string\[\]  
List of card issuing bank to be allowed for the order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-tags)  
order\_tags  
object  
Custom Tags in the form of {"key":"value"} which can be passed for an order. A maximum of 10 tags can be added  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-order-tags-key)  
order\_tags.{key}  
string  
Required string length: 1 \- 255  
Example:

{

 "product": "Laptop",

 "shipping\_address": "123 Main St"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-cart-details)  
cart\_details  
object  
Cart Details in the Order Entity Response  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-cart-details-cart-id)  
cart\_details.cart\_id  
string  
ID of the cart that was created  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-terminal-data)  
terminal\_data  
object  
Terminal Data in the create order response  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-terminal-data-agent-mobile-number)  
terminal\_data.agent\_mobile\_number  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-terminal-data-cf-terminal-id)  
terminal\_data.cf\_terminal\_id  
integer  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-terminal-data-merchant-terminal-id)  
terminal\_data.merchant\_terminal\_id  
string  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-terminal-data-terminal-type)  
terminal\_data.terminal\_type  
string  
Example:

{

 "agent\_mobile\_number": "9876543214",

 "cf\_terminal\_id": 1838,

 "merchant\_terminal\_id": "ahdsgadjhgfaj7137e",

 "terminal\_type": "STOREFRONT"

}

[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products)  
products  
object  
Configurations for the products like One Click Checkout, Verify and Pay, if they are enabled for your account  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products-one-click-checkout)  
products.one\_click\_checkout  
object  
Configurations for this feature  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products-one-click-checkout-enabled)  
products.one\_click\_checkout.enabled  
boolean  
Whether the feature has been enabled for this order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products-one-click-checkout-conditions)  
products.one\_click\_checkout.conditions  
object\[\]  
Configured condtions for the feature  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products-one-click-checkout-conditions-action)  
action  
string  
The Action key in the conditions array specifies whether a condition is allowed or denied for the specified rule or feature  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products-one-click-checkout-conditions-key)  
key  
string  
key of the condition  
Maximum length: 50  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products-one-click-checkout-conditions-values)  
values  
string\[\]  
Values set for the condition  
Maximum length: 10  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products-verify-pay)  
products.verify\_pay  
object  
Configurations for this feature  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products-verify-pay-enabled)  
products.verify\_pay.enabled  
boolean  
Whether the feature has been enabled for this order  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products-verify-pay-conditions)  
products.verify\_pay.conditions  
object\[\]  
Configured condtions for the feature  
Hide child attributes  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products-verify-pay-conditions-action)  
action  
string  
The Action key in the conditions array specifies whether a condition is allowed or denied for the specified rule or feature  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products-verify-pay-conditions-key)  
key  
string  
key of the condition  
Maximum length: 50  
[​](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create#response-products-verify-pay-conditions-values)  
values  
string\[\]  
Values set for the condition  
Maximum length: 10  
