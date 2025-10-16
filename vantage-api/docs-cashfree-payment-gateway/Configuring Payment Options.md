**Configuring Payment Options**

Open in ChatGPT  
Once you have the components ready you will need to pass on these components along with the payment\_session\_idto cashfree.js. Here is an example of a payment options. You can see there are three properties to it:

1. paymentMethod: This is the component which will be used for the payment.  
2. paymentSessionId: This is the payment\_session\_id which you get once you have created an order.  
3. Other attributes likes returnUrl, savePaymentInstrument etc.

Copy  
Ask AI  
let paymentOptions \= {  
	paymentMethod: component,  
	paymentSessionId: "your-payment-session-id",  
	savePaymentInstrument: true,  
};

### [**​**](https://www.cashfree.com/docs/payments/online/element/payment-options#paymentoptions)

### **paymentOptions**

[​](https://www.cashfree.com/docs/payments/online/element/payment-options#param-payment-method)  
paymentMethod  
objectrequired  
A reference to a payable component. Kindly note that the payable component should be ready and complete before invoking pay on it, otherwise it will throw an error. To get if a payable component is complete or not you can use component.isComplete() which returns a bool.

There are scenarios when one component also requires other components, in that case you will have to also check the completeness of those other component. Example- to process card you would need to make sure cardNumber, cardExpiry, cardCvv and cardHolder are all complete.  
[​](https://www.cashfree.com/docs/payments/online/element/payment-options#param-payment-session-id)  
paymentSessionId  
stringrequired  
To make payment you will need a paymentSessionId, you can get this by making a [create order API](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create) call to POST /orders. Please make sure you are using the correct hostname for the environment you want to process the payment for.

In the response of POST /orders you will find payment\_session\_id. Note that this is a backend call so you will need to have a server. Read how to generate payment\_session\_id [here](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create)  
[​](https://www.cashfree.com/docs/payments/online/element/payment-options#param-return-url)  
returnUrl  
string  
This is the url where your customers will be redirected after they have complete the payment.  
[​](https://www.cashfree.com/docs/payments/online/element/payment-options#param-redirect)  
redirect  
string  
For certain paymentMethod you can choose to not redirect the customer to the returnUrl by passing if\_required. Examples would be Card, UPI and QR. For payment method where redirection is required this flag will be completely ignored. If you decide not to redirect the customer then pay() promise resolves with {paymentDetails: {paymentMessage: "Payment finished. Check status."}}. To confirm the payment it is recommended that you always check the status of your order from your backend server with Cashfree.  
[​](https://www.cashfree.com/docs/payments/online/element/payment-options#param-redirect-target)  
redirectTarget  
string  
We also provide a way for you to decide how to redirect your customer. This takes all the values that are valid for hyperlink. Default is \_self

| Value | Description |
| ----- | ----- |
| \_blank | Opens the linked document in a new window or tab |
| \_self | Opens the linked document in the same frame as it was clicked (this is default) |
| \_parent | Opens the linked document in the parent frame |
| \_top | Opens the linked document in the full body of the window |
| \_framename\_ | Opens the linked document in the named iframe |

[​](https://www.cashfree.com/docs/payments/online/element/payment-options#param-save-payment-instrument)  
savePaymentInstrument  
object  
Assign a savePaymentInstrument to this to save the payment method. Works only for card payment. Default is null.

Copy  
Ask AI  
let saveOptions \= {  
	values: {  
		label: "Save Card for later"  
	}  
};  
let savecard \= cashfree.create("savePaymentInstrument", saveOptions);  
savecard.mount("\#div-id");

let cashfree \= Cashfree();  
.....  
cashfree.pay({  
  ...  
  savePaymentInstrument: savecard  
})

[​](https://www.cashfree.com/docs/payments/online/element/payment-options#param-offer-id)  
offerId  
object  
You can pass an offer in the object which you can fetch using the [get offer api](https://www.cashfree.com/docs/api-reference/payments/latest/eligibility/get-eligible-offers-for-an-order). Please note that you need use the the offer\_id value only. It is a uuid.  
Was this page helpful?  
Yes  
No  
[Customize a Component](https://www.cashfree.com/docs/payments/online/element/customize)  
[Examples](https://www.cashfree.com/docs/payments/online/element/examples)  
