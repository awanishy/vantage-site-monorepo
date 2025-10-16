Custom Web Checkout

**Component Customization**

Open in ChatGPT  
Understand how to customize a component as per your requirements  
Each Cashfree.js component is initialized with a configuration object that allows you to customize both its behavior and appearance. The configuration object helps you seamlessly integrate the component with your application’s design system.

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#basic-usage)

## **Basic Usage**

Copy  
Ask AI  
// Initialize component with configuration  
const options \= {  
	// Configuration options here  
};

// Create and mount the component  
const cardNumber \= cashfree.create("cardNumber", options);  
cardNumber.mount("\#cardnumber");

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#configuration-options)

## **Configuration Options**

Copy  
Ask AI  
const cardNumberOptions \= {  
	classes: {  
		base: "my-input",  
		focus: "input-focused",  
		invalid: "input-error",  
		complete: "input-complete",  
	},  
	fonts: \[  
		{  
			family: "Roboto",  
			src: "https://fonts.googleapis.com/css2?family=Roboto",  
		},  
	\],  
	style: {  
		base: {  
			color: "\#333",  
			fontSize: "16px",  
			fontFamily: "Roboto, sans-serif",  
			padding: "12px",  
			backgroundColor: "\#fff",  
			border: "1px solid \#ccc",  
			borderRadius: "4px",  
		},  
		focus: {  
			borderColor: "\#0066cc",  
		},  
		invalid: {  
			borderColor: "\#ff3333",  
			color: "\#ff3333",  
		},  
	},  
	disabled: false,  
	loader: true,  
};

const cardNumber \= cashfree.create("cardNumber", cardNumberOptions);  
cardNumber.mount("\#card-number-container");

Notes:

* All configuration options are optional. Components will use default styles if not specified.  
* The style object supports most CSS properties in camelCase format.  
* Custom fonts specified in the fonts array are loaded automatically before the component renders.  
* Use the disabled option to temporarily prevent user interaction (e.g., during form submission).  
* The loader option can be used to show/hide loading states while the component initializes

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#classes)

## **classes**

Type: object

You can use classes which is an object that will have names of classes. The classes you specify will be applied to DOM container where the component is mounted. You have to make sure that these are present in your application css .

Please note that you do not have to add the classes to your DOM container. The sdk will do it when required.

### [**​**](https://www.cashfree.com/docs/payments/online/element/customize#default-values)

### **Default values**

Copy  
Ask AI  
{  
	"base": "cf-base-private",  
	"complete": "cf-complete-private",  
	"empty": "cf-empty-private",  
	"focus": "cf-focus-private",  
	"invalid": "cf-invalid-private",  
	"disabled": "cf-disabled-private"  
}

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#base)

## **base**

The string you provide as a value of base will be applied to the container. This is the base class. If you do not provide a value of base, default value of cf-base-private will be applied.

Copy  
Ask AI  
let options \= {  
	classes: {  
		base: "my-base",  
	},  
};

Your css file

Copy  
Ask AI  
.my-base {  
	padding: 5px;  
}

Your HTML

Copy  
Ask AI  
\<div class\="base" id\="mount-here"\>\</div\>

In this case a padding of 5px will be added to your container once a component is mounted

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#complete)

## **complete**

A complete class will be applied to the container when the component you have mounted has been completed by the customer. This is relevant for example in card number input box when the user has entered a valid card number you would want to make the border of your container green. Default is cf-complete-private.

Please note that not all components will have apply a complete class to your container.

*Example*

Your js file

Copy  
Ask AI  
let options \= {  
	classes: {  
		complete: "my-complete",  
	},  
};

Your css file

Copy  
Ask AI  
.my-complete {  
	border: 1px solid green;  
}

Combining example of base and complete you can figure out that when the component is complete it will have two classes so css of both of the classes wil be applied which are

Copy  
Ask AI  
padding: 5px;  
border: 1px solid green;

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#empty)

## **empty**

An empty class will be applied to the container when the component being mounted is empty. Example would be card number not yet entered by the user means that the card number component will be empty and the empty class that you have specified will be applied. Default is cf-empty-private

*Example*

Your js file

Copy  
Ask AI  
let options \= {  
	classes: {  
		empty: "my-empty",  
	},  
};

Your css file

Copy  
Ask AI  
.my-empty {  
	box-shadow: 1px 1px 4px gray;  
}

When empty a box-shadow will appear in your container

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#focus)

## **focus**

This will be applied to your container when the element inside is focussed. Example would be user has focussed on the card number input area. Default is cf-focus-private

*Example*

Your js file

Copy  
Ask AI  
let options \= {  
	classes: {  
		focus: "my-focus",  
	},  
};

Your css file

Copy  
Ask AI  
.my-empty {  
	transform: translateY(\-5px);  
}

When focussed the container will move up by 5px

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#invalid)

## **invalid**

This will be applied when the component inside is invalid. For example the user has entered a wrong card number. Default is cf-invalid-private

*Example*

Your js file

Copy  
Ask AI  
let options \= {  
	classes: {  
		invalid: "my-invalid",  
	},  
};

Your css file

Copy  
Ask AI  
.my-empty {  
	border: 1px solid red;  
}

When invalid the container will have a red border

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#disabled)

## **disabled**

This will be applied when you want the component inside the container to be disabled. Default is cf-disabled-private

*Example*

Your js file

Copy  
Ask AI  
let options \= {  
	classes: {  
		disabled: "my-disabled",  
	},  
};

Your css file

Copy  
Ask AI  
.my-disabled {  
	opacity: 0.8;  
}

When disabled your container will be dimmer

---

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#fonts)

## **fonts**

Type: array

Using fonts you can make sure that the text inside component has the same font as your web application.

### [**​**](https://www.cashfree.com/docs/payments/online/element/customize#default-value)

### **Default value**

Copy  
Ask AI  
\[\];

There are two ways to specify fonts

1. Using a absolute URL to a css file with [@font-face](https://developer.mozilla.org/en/docs/Web/CSS/@font-face) definitions.F or example:  
   https://fonts.googleapis.com/css?family=Open+Sans

*Example*

Copy  
Ask AI  
let options \= {  
	fonts: \[  
		{  
			cssSrc: "https://fonts.googleapis.com/css?family=Open+Sans",  
		},  
	\],  
};

2. Using a absolute URL for a font file along with other parameters

*Example*

Copy  
Ask AI  
let options \= {  
	fonts: \[  
		{  
			fontFamily: "Nova Mono",  
			fontStyle: "normal",  
			fontWeight: 400,  
			fontDisplay: "swap",  
			src: "url(https://fonts.gstatic.com/s/novamono/v18/Cn-0JtiGWQ5Ajb--MRKvZ2ZZj9AtSw.woff2)",  
			unicodeRange:  
				"U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",  
		},  
	\],  
};

Required: src and fontFamily

You can specify multiple fonts and choose which to use in the component

---

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#style)

## **style**

Type: object

The style object is used to apply css properties to the contents of the component. It is different from classes in the fact that classes are used to apply css to the container that contains the component. There are 4 variants base, complete, empty and invalid.

You are free to add any css property by converting the propery type to camelCase and having the proerty value as string. Example being fontSize: '16px' for font-size: 16px

### [**​**](https://www.cashfree.com/docs/payments/online/element/customize#default-values-2)

### **Default values**

Copy  
Ask AI  
{  
	"base": {  
		"fontSize": "16px"  
	},  
	"complete": {},  
	"empty": {},  
	"invalid": {  
		"color": "\#C1292E"  
	}  
}

The following pseudo-classes and pseudo-elements can also be styled using a nested object inside of a variant:

* :hover  
* :focus  
* :dsiabled  
* ::placeholder

Example

Copy  
Ask AI  
let options \= {  
	fonts: \[  
		{  
			cssSrc: "https://fonts.googleapis.com/css?family=Nova+Mono",  
		},  
	\],  
	style: {  
		base: {  
			fontSize: "18px",  
			fontFamily: "Nova Mono",  
			fontWeight: "300",  
			color: "\#444",  
			backgroundColor: "transparent",  
			"::placeholder": {  
				color: "\#2836d4",  
			},  
			":hover": {  
				color: "\#ff00ff",  
			},  
			":focus": {  
				color: "\#443231",  
			},  
			":disabled": {  
				color: "\#f0d865",  
				backgroundColor: "pink",  
			},  
		},  
		complete: {  
			color: "\#7A9B76",  
		},  
		empty: {  
			backgroundColor: "\#fff",  
			"::placeholder": {  
				color: "\#4e9152",  
			},  
		},  
		invalid: {  
			color: "\#C1292E",  
		},  
	},  
};

---

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#values)

## **values**

Type: object

The values property is used to initialize a component with a particular starting state. The keys of the values object changes according to the component type.

### [**​**](https://www.cashfree.com/docs/payments/online/element/customize#default-value-2)

### **Default value**

Copy  
Ask AI  
{  
}

Examples

Component Name: cardHolder

Copy  
Ask AI  
let options \= {  
	values: {  
		cardHolder: "Jane Doe",  
	},  
};

Component Name: upiCollect

Copy  
Ask AI  
let options.values \= {  
  upiId: "testsuccess@gocash"  
}

Visit sections under different [components](https://www.cashfree.com/docs/payments/online/element/upi) to get all the available keys

---

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#disabled-2)

## **disabled**

Type: bool

You can use this to specify if the component should be loaded in a disabled state. Please note that the classes.disabled and style.base\[":disabled"\] or style.empty\[":disabled"\] will be applied to the container and compoent respectively

### [**​**](https://www.cashfree.com/docs/payments/online/element/customize#default-value-3)

### **Default value**

Copy  
Ask AI  
false;

---

## [**​**](https://www.cashfree.com/docs/payments/online/element/customize#loader)

## **loader**

Type: bool

Display skeleton loader UI while waiting for Elements to be fully loaded, after they are mounted. Not all components might support loader

### [**​**](https://www.cashfree.com/docs/payments/online/element/customize#default-value-4)

### **Default value**

Copy  
Ask AI  
true;

Was this page helpful?  
Yes  
No  
[Wallets, Net banking and BNPL components](https://www.cashfree.com/docs/payments/online/element/other-components)  
[Configuring Payment Options](https://www.cashfree.com/docs/payments/online/element/payment-options)  
