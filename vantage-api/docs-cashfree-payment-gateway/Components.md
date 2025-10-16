Components

**Overview**

Open in ChatGPT  
Learn about the components which are available with Cashfree.js  
Once you have initialized the cashfree.js sdk you can use the create method to create a component

Copy  
Ask AI  
let cashfree \= Cashfree({mode: "sandbox"});  
let options \= {};  
let component \= cashfree.create("componentName", options);

## [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#component-lifecycle)

## **Component Lifecycle**

**![][image1]**

## [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#methods)

## **Methods**

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#mount-component)

### **Mount component**

A component can be mounted in DOM container

Copy  
Ask AI  
Syntax: \`component.mount(querySelector)\`

Example

Copy  
Ask AI  
component.mount("\#componentContainer")

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#update-component)

### **Update component**

The values of a component can be updated

Copy  
Ask AI  
Syntax: \`component.update(values)\`

Example

Copy  
Ask AI

let values \= {  
	keyName: "keyValue"  
}  
component.update(values)

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#unmount-component)

### **Unmount component**

To unmount a component from DOM container. Use component.mount to mount again

Copy  
Ask AI  
component.unmount()

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#get-component-data)

### **Get component data**

To get the data and state of a component

Copy  
Ask AI  
let data \= component.data()

#### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#returns)

#### **Returns**

Copy  
Ask AI  
{  
    value: {},  
	error:  undefined,  
	message: {},  
	invalid: undefined,  
	empty: true,  
	complete: false,  
	ready: false,  
	componentName: "componentName",  
	node: null,  
	mounted: false,  
	loaderror: false,  
	focus: false,  
	disabled: false,  
	kind: "string"  
}

| Name | Description | Default |
| ----- | ----- | ----- |
| value | Contains the value of the component. | {} |
| error | Contains error that has occurred in the component | undefined |
| message | Contains any message that can be shown to the customer | {} |
| invalid | Is true is the component is invalid | undefined |
| empty | Is true if the component is empty | false |
| complete | Is true if the component is complete | false |
| ready | Is true if the component is ready for user input | false |
| componentName | Contains the type of the component | componentName |
| node | Contains the reference to the parent of the component | null |
| mounted | Is true if the component has been mounted | false |

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#blur-component)

### **Blur component**

Trigger blur on component. Can only be applied if kind of the component is input

Copy  
Ask AI  
component.blur()

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#focus-component)

### **Focus component**

Trigger focus on component. Can only be applied if kind of the component is input

Copy  
Ask AI  
component.focus()

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#clear-component)

### **Clear component**

Trigger clear on component to empty it. Can only be applied if kind of the component is input

Copy  
Ask AI  
component.clear()

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#click-component)

### **Click component**

Trigger click on component. Can only be applied if kind of the component is button

Copy  
Ask AI  
component.click()

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#disable-component)

### **Disable component**

Disabling component will apply the classes.disabled and style.base\[":disabled"\] or style.empty\[":disabled"\] to the container and compoent respectively. Can be applied to input and button

Copy  
Ask AI  
component.disable()

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#enable-component)

### **Enable component**

To enable a disabled component. Can be applied to input and button

Copy  
Ask AI  
component.enable()

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#destroy-component)

### **Destroy component**

To destroy a component. Once a component is destroyed it cannot be mounted again

Copy  
Ask AI  
component.destroy()

## [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#events)

## **Events**

You can register a callback function to various events that occur with a component. The basic syntax is component.on(eventName, callBackFunction)

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#ready)

### **ready**

Triggers when a component is ready for user interaction

Copy  
Ask AI  
component.on('ready', function(data){  
	//data is same as component.data()  
})

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#focus)

### **focus**

Triggers on component kind input when focussed

Copy  
Ask AI  
component.on('focus', function(data){  
	//data is same as component.data()  
})

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#blur)

### **blur**

Triggers on component kind input when blurred

Copy  
Ask AI  
component.on('blur', function(data){  
	//data is same as component.data()  
})

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#invalid)

### **invalid**

Triggers on component kind input when value entered by the user is invalid. Callback receives object that has the error. Read more about error here

Copy  
Ask AI  
component.on('invalid', function(data){  
	//data is same as component.data()  
	//data.error has the actual error  
	//you can use data.error.message to show to customer  
})

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#change)

### **change**

Triggers on component kind input whenever change happens for the value

Copy  
Ask AI  
component.on('change', function(data){  
	//data is same as component.data()  
})

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#empty)

### **empty**

Triggers on component kind input when empty

Copy  
Ask AI  
component.on('empty', function(data){  
	//data is same as component.data()  
})

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#complete)

### **complete**

Triggers on component kind input when value entered is complete and valid

Copy  
Ask AI  
component.on('complete', function(data){  
	//data is same as component.data()  
})

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#click)

### **click**

Triggers on component kind button when clicked

Copy  
Ask AI  
component.on('click', function(data){  
	//data is same as component.data()  
})

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#paymentrequested)

### **paymentrequested**

Triggers on component payable components when payment has been successfully initiated

Copy  
Ask AI  
component.on('paymentrequested', function(data){  
	//data is same as component.data()  
})

### [**​**](https://www.cashfree.com/docs/payments/online/element/component-overview#loaderror)

### **loaderror**

Triggers on component which could not be mounted. Callback receives object that has the error. Read more about error here

Copy  
Ask AI  
component.on('loaderror', function(data){  
	//data is same as component.data()  
	//data.error has the actual error  
	//you can use data.error.message to show to customer  
})

Was this page helpful?  
Yes  
No  
[Introducing Cashfree.js](https://www.cashfree.com/docs/payments/online/element/introduction)  
[Cards Component](https://www.cashfree.com/docs/payments/online/element/cards)

Components

**Cards Component**

Open in ChatGPT  
Use the Card Component to collect card information from the customer  
There are four card components as listed below:

## [**​**](https://www.cashfree.com/docs/payments/online/element/cards#cardnumber)

## **cardNumber**

A component to accept card number.

[​](https://www.cashfree.com/docs/payments/online/element/cards#param-card-number)  
cardNumber  
Card Number Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/cards#param-placeholder)  
placeholder  
string  
placeholder for your card number field  
[​](https://www.cashfree.com/docs/payments/online/element/cards#param-hide-brand-icon)  
hideBrandIcon  
booleandefault:"false"  
hide brand icons, default is false

#### Returned Value

You can get the value of a component by calling component.data().value. All returned values of component.data() can be found [here](https://www.cashfree.com/docs/payments/online/element/component-overview#get-component-data)

[​](https://www.cashfree.com/docs/payments/online/element/cards#param-card-number-1)  
cardNumber  
Card Number Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/cards#param-brand)  
brand  
string  
contains the brand of the card visa, amex, mastercard, rupay  
[​](https://www.cashfree.com/docs/payments/online/element/cards#param-cvv-length)  
cvvLength  
string  
contains the cvv length for the given brand eg 4 for amex  
Code Snippet for cardNumber component  
Copy  
Ask AI  
let cashfree \= Cashfree({  
  mode:"sandbox" //or production  
});  
let card \= cashfree.create('cardNumber', {  
	values:{  
		placeholder: "Enter card number"  
	}  
});  
card.on('loaderror', function(data){  
	console.log(data.error)  
})  
card.mount("\#mount-here");  
card.on('ready', function(d){  
    console.log(card.data().value);  //{brand: 'visa', cvvLength: 3}  
    //or  
    //console.log(d.value)   
})

## [​](https://www.cashfree.com/docs/payments/online/element/cards#cardholder)

## cardHolder

A component to accept card holder’s name. You can pass values to a component using **options** cashfree.create(‘componentName’, options)

[​](https://www.cashfree.com/docs/payments/online/element/cards#param-card-number-2)  
cardNumber  
Card Number Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/cards#param-card-holder)  
cardHolder  
string  
name of the card holder

#### Returned Value

You can get the value of a component by calling component.data().value. All returned values of component.data() can be found [here](https://www.cashfree.com/docs/payments/online/element/component-overview#get-component-data)

[​](https://www.cashfree.com/docs/payments/online/element/cards#param-card-holder-1)  
cardHolder  
Card Holder Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/cards#param-card-holder-2)  
cardHolder  
string  
contains the name of the card holder  
Code Snippet for cardHolder component  
Copy  
Ask AI  
let cashfree \= Cashfree({  
  mode:"sandbox" //or production  
});  
let cardHolder \= cashfree.create('cardHolder', {  
	values:{  
		cardHolder: 'Jane Doe'  
	}  
});  
cardHolder.on('loaderror', function(data){  
	console.log(data.error)  
})  
cardHolder.mount("\#mount-here");  
cardHolder.on('ready', function(d){  
    console.log(cardHolder.data().value)//{cardHolder: 'Jane Doe'}  
    //or  
    //console.log(d.value);    
})

## [​](https://www.cashfree.com/docs/payments/online/element/cards#cardexpiry)

## cardExpiry

A component to accept card expiry. This component does not accept any parameters.

#### Returned Value

You can get the value of a component by calling component.data().value. All returned values of component.data() can be found [here](https://www.cashfree.com/docs/payments/online/element/component-overview#get-component-data)

[​](https://www.cashfree.com/docs/payments/online/element/cards#param-card-expiry)  
cardExpiry  
Card Expiry Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/cards#param-card-expiry-1)  
cardExpiry  
string  
Returns the card expiry in MM/YY format.  
Code snippet for cardExpiry component  
Copy  
Ask AI  
let cashfree \= Cashfree({  
  mode:"sandbox" //or production  
});  
let cardExpiry \= cashfree.create('cardExpiry', {  
	values:{  
		//does not accept any value  
	}  
});  
cardExpiry.on('loaderror', function(data){  
	console.log(data.error)  
})  
cardExpiry.mount("\#mount-here");  
cardCvv.on('ready', function(d){  
    console.log(cardCvv.data().value); //{cardExpiry: '12/26'}  
    //or  
    //console.log(d.value)   
});

## [​](https://www.cashfree.com/docs/payments/online/element/cards#cardcvv)

## cardCvv

A component to accept card cvv/cvc. This component does not accept any parameters.

#### Returned Value

This is a secure field and you cannot get values from this field.

Code snippet for cardCVV component  
Copy  
Ask AI  
let cashfree \= Cashfree({  
  mode:"sandbox" //or production  
});  
let cardCvv \= cashfree.create('cardCvv', {});  
cardCvv.on('loaderror', function(data){  
	console.log(data.error)  
})  
cardCvv.mount("\#mount-here");  
cardCvv.on('ready', function(d){  
    console.log(cardCvv.data().value); //{cardCvv: '123'}  
    //or  
    //console.log(d.value)   
});

Was this page helpful?  
Yes  
No  
[Overview](https://www.cashfree.com/docs/payments/online/element/component-overview)  
[UPI Component](https://www.cashfree.com/docs/payments/online/element/upi)

Components

**UPI Component**

Open in ChatGPT  
Use the UPI Component to collect UPI information from the customer  
There are three UPI components as listed below:

## [**​**](https://www.cashfree.com/docs/payments/online/element/upi#upicollect)

## **upiCollect**

A component to accept user’s vpa/upi id

[​](https://www.cashfree.com/docs/payments/online/element/upi#param-upi-collect)  
upiCollect  
UPI Collect Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/upi#param-placeholder)  
placeholder  
string  
placeholder for enter vpa field  
[​](https://www.cashfree.com/docs/payments/online/element/upi#param-upi-id)  
upiId  
string  
vpa/upi id of the customer

#### Returned Value

You can get the value of a component by calling component.data().value. All returned values of component.data() can be found [here](https://www.cashfree.com/docs/component-overview#get-component-data)

[​](https://www.cashfree.com/docs/payments/online/element/upi#param-upi-collect-1)  
upiCollect  
UPI Collect Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/upi#param-upi-id-1)  
upiId  
string  
vpa/upi id of the customer  
Code snippet for upiCollect component  
Copy  
Ask AI  
let cashfree \= Cashfree({  
  mode:"sandbox" //or production  
});  
let upiCollect \= cashfree.create('upiCollect', {  
	values:{  
		upiId: 'janedoe1@okbankname'  
	}  
});  
upiCollect.on('loaderror', function(data){  
	console.log(data.error)  
})  
upiCollect.mount("\#mount-here");  
upiCollect.on('ready', function(d){  
    console.log(upiCollect.data().value); //{upiId: 'janedoe1@okbankname'}  
    //or  
    //console.log(d.value)   
});

## [​](https://www.cashfree.com/docs/payments/online/element/upi#upiapp)

## upiApp

A component to initiate UPI app/intent payment. Only works in mobile phones. If you mount it on desktop it will throw an error in loaderror

Component will not mount on custom webview/inappbrowser Android. It will however mount in popular apps like Facebook, Instagram, Twitter. However, since iOS handles intent differently than android it will always mount in iOS  
[​](https://www.cashfree.com/docs/payments/online/element/upi#param-upi-app)  
upiApp  
UPI App Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/upi#param-upi-app-1)  
upiApp  
stringrequired  
name of the upi app  
[​](https://www.cashfree.com/docs/payments/online/element/upi#param-button-text)  
buttonText  
string  
Text for button, ex Google Pay for upiApp gpay  
[​](https://www.cashfree.com/docs/payments/online/element/upi#param-button-icon)  
buttonIcon  
bool  
Indicate whether to show the app icon or not

#### Returned Value

You can get the value of a component by calling component.data().value. All returned values of component.data() can be found [here](https://www.cashfree.com/docs/component-overview#get-component-data)

[​](https://www.cashfree.com/docs/payments/online/element/upi#param-upi-app-2)  
upiApp  
UPI App Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/upi#param-upi-app-3)  
upiApp  
string  
name of the upi app  
Code snippet for the upiApp component  
Copy  
Ask AI  
let cashfree \= Cashfree({  
  mode:"sandbox" //or production  
});  
let upiApp \= cashfree.create('upiApp', {  
	values:{  
		upiApp: 'gpay',  
		buttonText: 'GPAY',  
		buttonIcon: true  
	}  
});  
upiApp.on('loaderror', function(data){  
	console.log(data.error)  
})  
upiApp.mount("\#mount-here");  
upiApp.on('ready', function(d){  
    console.log(upiApp.data().value); //{upiApp: 'gpay'}  
    //or  
    //console.log(d.value)   
});

## [​](https://www.cashfree.com/docs/payments/online/element/upi#upiqr)

## upiQr

A component to show a UPI qr code

[​](https://www.cashfree.com/docs/payments/online/element/upi#param-upi-qr)  
upiQr  
UPI QR Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/upi#param-size)  
size  
stringrequired  
size of the qr code. ex “220px”

#### Returned Value

You can get the value of a component by calling component.data().value. All returned values of component.data() can be found [here](https://www.cashfree.com/docs/component-overview#get-component-data)

[​](https://www.cashfree.com/docs/payments/online/element/upi#param-upi-qr-1)  
upiQr  
UPI QR Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/upi#param-size-1)  
size  
string  
size of the qr code. ex “220px”  
Code snippet for upiQr component  
Copy  
Ask AI  
let cashfree \= Cashfree({  
  mode:"sandbox" //or production  
});  
let upiQr \= cashfree.create('upiQr', {  
	values:{  
		size: "220px"  
	}  
});  
upiQr.on('loaderror', function(data){  
	console.log(data.error)  
})  
upiQr.mount("\#mount-here");  
upiQr.on('ready', function(d){  
    console.log(upiQr.data().value); //{size: '220px'}  
    //or  
    //console.log(d.value)   
})

Was this page helpful?  
Yes  
No  
[Cards Component](https://www.cashfree.com/docs/payments/online/element/cards)  
[Wallets, Net banking and BNPL components](https://www.cashfree.com/docs/payments/online/element/other-components)

Components

**Wallets, Net banking and BNPL components**

Open in ChatGPT  
Learn to create components for Wallets, Net banking and BNPL.

## [**​**](https://www.cashfree.com/docs/payments/online/element/other-components#wallet)

## **wallet**

A component to show a UPI qr code

[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-wallet)  
wallet  
Wallet Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-provider)  
provider  
stringrequired  
name of the wallet. ex phonepe. All names [here](https://www.cashfree.com/docs/payments/online/element/appendix#wallet-providers).  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-button-text)  
buttonText  
string  
name of the wallet. ex phonepe.  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-button-icon)  
buttonIcon  
boolean  
Decide whether to show app icon or not  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-phone)  
phone  
string  
10 digit phone number of your customer

#### Returned Value

You can get the value of a component by calling component.data().value. All returned values of component.data() can be found [here](https://www.cashfree.com/docs/payments/online/element/other-components)

[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-wallet-1)  
wallet  
Wallet Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-provider-1)  
provider  
string  
name of the wallet. ex PhonePe  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-phone-1)  
phone  
stringrequired  
10 digit phone number of your customer  
Code snippet for wallet component  
Copy  
Ask AI  
let cashfree \= Cashfree({  
  mode:"sandbox" //or production  
});  
let wallet \= cashfree.create('wallet', {  
	values:{  
		provider: 'phonepe',  
		phone: '94140905',  
		buttonText: 'PhonePe',  
		buttonIcon: true  
	}  
});  
wallet.on('loaderror', function(data){  
	console.log(data.error)  
})  
wallet.mount("\#mount-here");  
wallet.on('ready', function(d){  
    console.log(wallet.data().value); //{provide: 'phonepe', phone: '94140905'}  
    //or  
    //console.log(d.value)   
})  
 

## [​](https://www.cashfree.com/docs/payments/online/element/other-components#netbanking)

## netbanking

A component to initiate Net Banking payment.

In case buttonText is not provided the value of buttonIcon would be replaced to true. This has been done so that your customer always sees icon of the app.  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-netbanking)  
netbanking  
Wallet Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-netbanking-bank-name)  
netbankingBankName  
stringrequired  
name of the bank. ex HDFC. All names [here](https://www.cashfree.com/docs/payments/online/element/appendix#netbanking-code-and-names).  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-button-text-1)  
buttonText  
string  
Text for button. ex HDFC Bank.  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-button-icon-1)  
buttonIcon  
boolean  
Decide whether to show app icon or not

#### Returned Value

You can get the value of a component by calling component.data().value. All returned values of component.data() can be found [here](https://www.cashfree.com/docs/payments/online/element/components)

[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-netbanking-1)  
netbanking  
Netbanking Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-netbanking-bank-name-1)  
netbankingBankName  
string  
name of the bank  
Code snippet for wallet component  
Copy  
Ask AI  
let cashfree \= Cashfree({  
  mode:"sandbox" //or production  
});  
let netbanking \= cashfree.create('netbanking', {  
	values:{  
		netbankingBankName: 'HDFCR',  
		buttonText: 'HDFC Bank',  
		buttonIcon: true  
	}  
});  
netbanking.on('loaderror', function(data){  
	console.log(data.error)  
})  
netbanking.mount("\#mount-here");  
netbanking.on('ready', function(d){  
    console.log(netbanking.data().value); //{netbankingBankName: 'HDFCR'}  
    //or  
    //console.log(d.value)   
})

## [​](https://www.cashfree.com/docs/payments/online/element/other-components#paylater)

## paylater

A component to initiate paylater payment.

[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-paylater)  
paylater  
Paylater Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-provider-2)  
provider  
stringrequired  
name of the wallet. ex simpl. All names [here](https://www.cashfree.com/docs/payments/online/element/appendix#paylater-providers).  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-button-text-2)  
buttonText  
string  
Text for button, ex Simpl.  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-button-icon-2)  
buttonIcon  
boolean  
Decide whether to show app icon or not  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-phone-2)  
phone  
stringrequired  
10 digit phone number of your customer

#### Returned Value

You can get the value of a component by calling component.data().value. All returned values of component.data() can be found [here](https://www.cashfree.com/docs/payments/online/element/components)

[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-paylater-1)  
paylater  
Paylater Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-provider-3)  
provider  
string  
name of the wallet  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-phone-3)  
phone  
string  
10 digit phone number  
Code snippet for paylater component  
Copy  
Ask AI  
let cashfree \= Cashfree({  
  mode:"sandbox" //or production  
});  
let p \= cashfree.create('paylater', {  
	values:{  
		provider: 'simpl',  
		phone: '94140905',  
		buttonText: 'Use Simpl',  
		buttonIcon: true  
	}  
});  
p.on('loaderror', function(data){  
	console.log(data.error)  
})  
p.mount("\#mount-here");  
p.on('ready', function(d){  
    console.log(d.value)   
})

## [​](https://www.cashfree.com/docs/payments/online/element/other-components#cardlessemi)

## cardlessEMI

A component to initiate Cardless EMI payment.

[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-cardlessemi)  
cardlessemi  
Cardless EMI Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-provider-4)  
provider  
stringrequired  
name of the wallet. Example- flexmoney. All names [here](https://www.cashfree.com/docs/payments/online/element/appendix#cardless-emi-providers)  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-button-text-3)  
buttonText  
string  
Text for button, ex Flexmoney  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-button-icon-3)  
buttonIcon  
boolean  
Decide whether to show app icon or not  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-phone-4)  
phone  
stringrequired  
10 digit phone number of your customer

#### Returned Value

You can get the value of a component by calling component.data().value. All returned values of component.data() can be found [here](https://www.cashfree.com/docs/payments/online/element/components)

[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-cardlessemi-1)  
cardlessemi  
Cardless EMI Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-provider-5)  
provider  
string  
name of the provider  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-phone-5)  
phone  
string  
10 digit phone number  
Code snippet for paylater component  
Copy  
Ask AI  
let cashfree \= Cashfree({  
  mode:"sandbox" //or production  
});  
let cl \= cashfree.create('cardlessEMI', {  
	values:{  
		provider: 'flexmoney',  
		phone: '94140905',  
		buttonText: 'Flexmoney',  
		buttonIcon: true  
	}  
});  
cl.on('loaderror', function(data){  
	console.log(data.error)  
})  
cl.mount("\#mount-here");  
cl.on('ready', function(d){  
    console.log(d.value)   
})

## [​](https://www.cashfree.com/docs/payments/online/element/other-components#savepaymentinstrument)

## savePaymentInstrument

A component that can be used in .pay() to save a payment method for a customer. This works for only cards. This will tokenize your card

[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-save-payment-instrument)  
savePaymentInstrument  
Save Payment Instrument Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-label)  
label  
string  
Label for the checkbox

#### Returned Value

You can get the value of a component by calling component.data().value. All returned values of component.data() can be found [here](https://www.cashfree.com/docs/payments/online/element/components)

[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-save-payment-instrument-1)  
savePaymentInstrument  
Save Payment Instrument Object  
Hide properties  
[​](https://www.cashfree.com/docs/payments/online/element/other-components#param-save-instrument)  
saveInstrument  
string  
does the user wants to save  
Code snippet for savePaymentInstrument component  
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

Was this page helpful?  
Yes  
No  
[UPI Component](https://www.cashfree.com/docs/payments/online/element/upi)  
[Customize a Component](https://www.cashfree.com/docs/payments/online/element/customize)  


[image1]: <data:image/png;base64,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>