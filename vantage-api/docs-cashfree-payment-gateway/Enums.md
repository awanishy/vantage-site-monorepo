**Enums**

Open in ChatGPT  
List of all enums used in Payment APIs.

## [**​**](https://www.cashfree.com/docs/api-reference/payments/enums#order-states)

## **Order states**

Order states

| Order State | Description |
| :---- | :---- |
| ACTIVE | Orders are marked as ACTIVE, when an order is created by the merchant through an API request to Cashfree Payments. |
| PAID | Orders are marked PAID when the payment is verified by Cashfree Payments and the payment is successful. |
| EXPIRED | Orders are marked as EXPIRED when the order has exceeded order\_expiry\_time specified by merchant to complete the order. |
| TERMINATED | This status is returned when you request order termination through the [Order Termination API](https://www.cashfree.com/docs/api-reference/payments/latest/orders/terminate). Once terminated, customers can no longer pay for this order. |
| TERMINATION\_REQUESTED | This status is returned after you call the [Order Termination API](https://www.cashfree.com/docs/api-reference/payments/latest/orders/terminate) to end an order. The termination request is acknowledged but still processing. Orders can only be terminated when all transactions have reached terminal states. If a pending transaction completes successfully while termination is processing, the status will change from TERMINATION\_REQUESTED to SUCCESS. |

## [**​**](https://www.cashfree.com/docs/api-reference/payments/enums#payment-states)

## **Payment states**

Payment states

| Payment State | Description |
| :---- | :---- |
| SUCCESS | Transactions are marked as SUCCESS when we get a successful response from the bank, and we can capture the amount in our system. Once payment is marked as SUCCESS, we mark the order as PAID. |
| FAILED | Transactions are marked as FAILED when we get a failed response from the bank. |
| NOT\_ATTEMPTED | Transactions are marked as NOT\_ATTEMPTED initially when a transaction is created and an acknowledgement is awaited from the bank. |
| PENDING | Transactions are marked as PENDING when we have successfully sent the request to the bank but waiting for a response from the bank. |
| FLAGGED | Transactions are marked as FLAGGED if we have identified any risks associated with the transaction. |
| CANCELLED | Transactions are marked as CANCELLED when there is success response post time to live. In this case, the amount will be reversed to the customer without any charge being levied to them or the merchant. |
| VOID | Transactions are marked as VOID when we do not want to capture the transaction amount. This is only applicable for card-based pre-authorized transactions or to UPI one-time mandates. The amount is reversed immediately in these cases by Cashfree. |
| USER\_DROPPED | Transactions are marked as USER\_DROPPED when customers drop out of the payment flow without completing the transaction. It will help you understand if customers attempted to pay or not. Some common scenarios where the transaction will be marked as USER\_DROPPED are: Android UPI intent payments: When a user clicks on the back button in the UPI app without making any payment attempt. Card payments: When a user drops out of the payment flow by closing the OTP verification page. UPI collect transactions: When a user does not enter the UPI PIN and closes the transaction screen. |

## [**​**](https://www.cashfree.com/docs/api-reference/payments/enums#net-banking-codes)

## **Net Banking Codes**

Netbanking codes

| Bank Name | Bank Code | TPV Supported |
| ----- | ----- | ----- |
| Airtel Payments Bank | 3123 | N |
| Andhra Pragathi Grameena Bank | 3094 | N |
| AU Small Finance Bank | 3087 | Y |
| Axis Bank | 3003 | Y |
| Axis Bank \- Corporate | 3071 | N |
| Bandhan Bank \- Retail Banking | 3088 | Y |
| Bank of Bahrain and Kuwait | 3095 | N |
| Bank of Baroda \- Corporate | 3060 | Y |
| Bank of Baroda \- Retail Banking | 3005 | Y |
| Bank of India | 3006 | Y |
| Bank of India \- Corporate | 3061 | N |
| Bank of Maharashtra | 3007 | Y |
| Barclays \- Corporate | 3080 | N |
| Canara Bank | 3009 | Y |
| Capital Small Finance Bank | 3098 | Y |
| Central Bank of India | 3011 | Y |
| City Union Bank | 3012 | Y |
| Cosmos Bank | 3097 | Y |
| CSB Bank Limited | 3010 | Y |
| DBS Bank Ltd | 3017 | N |
| DCB Bank \- Personal | 3018 | N |
| Deutsche Bank | 3016 | Y |
| Dhanlakshmi Bank | 3019 | Y |
| Dhanlaxmi Bank \- Corporate | 3072 | N |
| Equitas Small Finance Bank | 3076 | N |
| ESAF Small Finance Bank | 3100 | N |
| Federal Bank | 3020 | Y |
| Fincare Bank | 3101 | N |
| Gujarat State Co-operative Bank Limited | 3091 | Y |
| HDFC Bank | 3021 | Y |
| HDFC Corporate | 3084 | N |
| HSBC Retail NetBanking | 3092 | Y |
| ICICI Bank | 3022 | Y |
| ICICI Bank \- Corporate | 3073 | N |
| IDBI Bank | 3023 | Y |
| IDBI Bank \- Corporate | 3124 | N |
| IDFC FIRST Bank | 3024 | Y |
| Indian Bank | 3026 | Y |
| Indian Overseas Bank | 3027 | Y |
| Indian Overseas Bank \- Corporate | 3081 | N |
| IndusInd Bank | 3028 | Y |
| Jammu and Kashmir Bank | 3029 | Y |
| Jana Small Finance Bank | 3102 | Y |
| Janata Sahakari Bank Ltd Pune | 3104 | N |
| Kalyan Janata Sahakari Bank | 3105 | N |
| Karnataka Bank Ltd | 3030 | Y |
| Karnataka Gramin Bank | 3113 | N |
| Karnataka Vikas Grameena Bank | 3107 | N |
| Karur Vysya Bank | 3031 | Y |
| Kotak Mahindra Bank | 3032 | Y |
| Maharashtra Gramin Bank | 3108 | N |
| Mehsana urban Co-op Bank | 3109 | N |
| NKGSB Co-op Bank | 3111 | N |
| Nutan Nagarik Sahakari Bank Limited | 3112 | N |
| Punjab & Sind Bank | 3037 | Y |
| Punjab National Bank \- Corporate | 3065 | N |
| Punjab National Bank \- Retail Banking | 3038 | Y |
| RBL Bank | 3039 | Y |
| RBL Bank Limited \- Corporate | 3114 | N |
| Saraswat Bank | 3040 | Y |
| SBM Bank India | 3115 | Y |
| Shamrao Vithal Bank \- Corporate | 3075 | N |
| Shamrao Vitthal Co-operative Bank | 3041 | N |
| Shivalik Small Finance Bank | 3086 | Y |
| South Indian Bank | 3042 | Y |
| Standard Chartered Bank | 3043 | Y |
| State Bank Of India | 3044 | Y |
| State Bank of India \- Corporate | 3066 | N |
| Suryoday Small Finance Bank | 3116 | N |
| Tamil Nadu State Co-operative Bank | 3051 | N |
| Tamilnad Mercantile Bank Ltd | 3052 | Y |
| Thane Bharat Sahakari Bank Ltd | 3118 | N |
| The Kalupur Commercial Co-Operative Bank | 3106 | N |
| The Surat Peoples Co-operative Bank Limited | 3090 | Y |
| The Sutex Co-op Bank Ltd | 3117 | Y |
| TJSB Bank | 3119 | N |
| UCO Bank | 3054 | Y |
| UCO Bank Corporate | 3122 | N |
| Ujjivan Small Finance Bank | 3126 | Y |
| Union Bank of India | 3055 | Y |
| Union Bank of India \- Corporate | 3067 | N |
| Utkarsh Small Finance Bank | 3089 | Y |
| Varachha Co-operative Bank Limited | 3120 | N |
| Yes Bank \- Corporate | 3077 | N |
| Yes Bank Ltd | 3058 | Y |
| Zoroastrian Co-Operative Bank Ltd | 3121 | N |

## [**​**](https://www.cashfree.com/docs/api-reference/payments/enums#wallet-codes)

## **Wallet Codes**

Wallet Codes

| S. No | Wallet Name | Payment Code |
| :---- | :---- | :---- |
| 1 | FreeCharge | 4001 |
| 2 | MobiKwik | 4002 |
| 3 | Ola Money | 4003 |
| 4 | Airtel Money | 4006 |
| 5 | Amazon Pay | 4008 |
| 6 | PayTM | 4007 |
| 7 | PhonePe | 4009 |
| 7 | Test Wallet (Sandbox) | 4010 |

## [**​**](https://www.cashfree.com/docs/api-reference/payments/enums#emi-codes)

## **EMI Codes**

Credit Card EMI Codes

| Card Type | Type of EMI | Bank | card\_bank\_name | Minimum Amount | Maximum Amount | Annual Interest Rate | Tenure |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Credit | Standard | HDFC Bank | hdfc | 1000 | 500000 | 16 | 3 |
| Credit | Standard | HDFC Bank | hdfc | 3000 | 500000 | 16 | 6 |
| Credit | Standard | HDFC Bank | hdfc | 3000 | 500000 | 16 | 9 |
| Credit | Standard | HDFC Bank | hdfc | 3000 | 500000 | 16 | 12 |
| Credit | Standard | Axis Bank | axis | 2500 | 1000000 | 14 | 3 |
| Credit | Standard | Axis Bank | axis | 2500 | 1000000 | 14 | 6 |
| Credit | Standard | Axis Bank | axis | 2500 | 1000000 | 15 | 9 |
| Credit | Standard | Axis Bank | axis | 2500 | 1000000 | 15 | 12 |
| Credit | Standard | Axis Bank | axis | 2500 | 1000000 | 16 | 18 |
| Credit | Standard | Axis Bank | axis | 2500 | 1000000 | 16 | 24 |
| Credit | Standard | Kotak Bank | kotak | 1000 | 1000000 | 16 | 3 |
| Credit | Standard | Kotak Bank | kotak | 2500 | 1000000 | 16 | 6 |
| Credit | Standard | Kotak Bank | kotak | 2500 | 1000000 | 16 | 9 |
| Credit | Standard | Kotak Bank | kotak | 2500 | 1000000 | 16 | 12 |
| Credit | Standard | Kotak Bank | kotak | 2500 | 1000000 | 16 | 18 |
| Credit | Standard | Kotak Bank | kotak | 2500 | 1000000 | 16 | 24 |
| Credit | Standard | ICICI Bank | icici | 1500 | 500000 | 15.99 | 3 |
| Credit | Standard | ICICI Bank | icici | 1500 | 500000 | 15.99 | 6 |
| Credit | Standard | ICICI Bank | icici | 1500 | 500000 | 15.99 | 9 |
| Credit | Standard | ICICI Bank | icici | 1500 | 500000 | 15.99 | 12 |
| Credit | Standard | ICICI Bank | icici | 1500 | 500000 | 15.99 | 18 |
| Credit | Standard | ICICI Bank | icici | 1500 | 500000 | 15.99 | 24 |
| Credit | Standard | Bank of Baroda | bob | 2500 | \- | 13 | 3 |
| Credit | Standard | Bank of Baroda | bob | 2500 | \- | 14 | 6 |
| Credit | Standard | Bank of Baroda | bob | 2500 | \- | 14 | 9 |
| Credit | Standard | Bank of Baroda | bob | 2500 | \- | 15 | 12 |
| Credit | Standard | Bank of Baroda | bob | 2500 | \- | 16 | 24 |
| Credit | Standard | Bank of Baroda | bob | 2500 | \- | 16 | 36 |
| Credit | Standard | Standard Chartered | standard chartered | 2000 | 500000 | 11.88 | 3 |
| Credit | Standard | Standard Chartered | standard chartered | 2000 | 500000 | 14 | 6 |
| Credit | Standard | Standard Chartered | standard chartered | 2000 | 500000 | 15 | 9 |
| Credit | Standard | Standard Chartered | standard chartered | 2000 | 500000 | 15 | 12 |
| Credit | Standard | Standard Chartered | standard chartered | 2000 | 500000 | 15 | 18 |
| Credit | Standard | Standard Chartered | standard chartered | 2000 | 500000 | 15 | 24 |
| Credit | Standard | RBL Bank | rbl | 1500 | \- | 13 | 3 |
| Credit | Standard | RBL Bank | rbl | 1500 | \- | 14 | 6 |
| Credit | Standard | RBL Bank | rbl | 1500 | \- | 15 | 9 |
| Credit | Standard | RBL Bank | rbl | 1500 | \- | 15 | 12 |
| Credit | Standard | RBL Bank | rbl | 1500 | \- | 15 | 18 |
| Credit | Standard | RBL Bank | rbl | 1500 | \- | 15 | 24 |
| Credit | Standard | AU Small Bank | au | 2000 | \- | 14 | 3 |
| Credit | Standard | AU Small Bank | au | 2000 | \- | 14 | 6 |
| Credit | Standard | AU Small Bank | au | 2000 | \- | 14 | 9 |
| Credit | Standard | AU Small Bank | au | 2000 | \- | 14 | 12 |
| Credit | Standard | AU Small Bank | au | 2000 | \- | 14 | 18 |
| Credit | Standard | AU Small Bank | au | 2000 | \- | 14 | 24 |
| Credit | Standard | Yes Bank | yes | 1500 | \- | 14 | 3 |
| Credit | Standard | Yes Bank | yes | 1500 | \- | 14 | 6 |
| Credit | Standard | Yes Bank | yes | 1500 | \- | 14 | 9 |
| Credit | Standard | Yes Bank | yes | 1500 | \- | 15 | 12 |
| Credit | Standard | Yes Bank | yes | 1500 | \- | 15 | 18 |
| Credit | Standard | Yes Bank | yes | 1500 | \- | 15 | 24 |
| Credit | Standard | HSBC | hsbc | 2000 | \- | 12.5 | 3 |
| Credit | Standard | HSBC | hsbc | 2000 | \- | 12.5 | 6 |
| Credit | Standard | HSBC | hsbc | 2000 | \- | 13.5 | 9 |
| Credit | Standard | HSBC | hsbc | 2000 | \- | 13.5 | 12 |
| Credit | Standard | HSBC | hsbc | 2000 | \- | 13.5 | 18 |
| Credit | Standard | American Express | amex | 5000 | \- | 14 | 3 |
| Credit | Standard | American Express | amex | 5000 | \- | 14 | 6 |
| Credit | Standard | American Express | amex | 5000 | \- | 14 | 9 |
| Credit | Standard | American Express | amex | 5000 | \- | 14 | 12 |
| Credit | Standard | American Express | amex | 5000 | \- | 14 | 18 |
| Credit | Standard | American Express | amex | 5000 | \- | 14 | 24 |

Debit Card EMI Codes  
The following card issuer is supported for card-based EMIs. Please send the exact values in the card\_bank\_name parameter.

| Bank Name | Native OTP |
| :---- | :---- |
| HDFC Bank | Yes |

### [**​**](https://www.cashfree.com/docs/api-reference/payments/enums#debit-card-emi-plans)

### **Debit Card EMI Plans**

| Card Type | Type of EMI | Bank | card\_bank\_name | Minimum Amount | Maximum Amount | Annual Interest Rate | Tenure |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Debit | Standard | HDFC Bank | hdfc | 3000 | 500000 | 16 | 3 |
| Debit | Standard | HDFC Bank | hdfc | 5000 | 500000 | 16 | 6 |
| Debit | Standard | HDFC Bank | hdfc | 5000 | 500000 | 16 | 9 |
| Debit | Standard | HDFC Bank | hdfc | 5000 | 500000 | 16 | 12 |
| Debit | Standard | HDFC Bank | hdfc | 5000 | 500000 | 16 | 18 |
| Debit | Standard | HDFC Bank | hdfc | 5000 | 500000 | 16 | 24 |

Cardless EMI

| Card Type | Type of EMI | Bank | provider | Minimum Amount | Maximum Amount | Annual Interest Rate | Tenure |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Cardless | Standard | HDFC Bank | hdfc | 3000 | 500000 | 16 | 3 |
| Cardless | Standard | HDFC Bank | hdfc | 5000 | 500000 | 16 | 6 |
| Cardless | Standard | HDFC Bank | hdfc | 5000 | 500000 | 16 | 9 |
| Cardless | Standard | HDFC Bank | hdfc | 5000 | 500000 | 16 | 12 |
| Cardless | Standard | HDFC Bank | hdfc | 5000 | 500000 | 16 | 18 |
| Cardless | Standard | HDFC Bank | hdfc | 5000 | 500000 | 16 | 24 |
| Cardless | Standard | Kotak Bank | kotak | 3000 | 200000 | 19 | 3 |
| Cardless | Standard | Kotak Bank | kotak | 5000 | 200000 | 19 | 6 |
| Cardless | Standard | Kotak Bank | kotak | 5000 | 200000 | 19 | 9 |
| Cardless | Standard | Kotak Bank | kotak | 5000 | 200000 | 19 | 12 |
| Cardless | Standard | ICICI Bank | icici | 7000 | 500000 | 17 | 3 |
| Cardless | Standard | ICICI Bank | icici | 7000 | 500000 | 17 | 6 |
| Cardless | Standard | ICICI Bank | icici | 7000 | 500000 | 17 | 9 |
| Cardless | Standard | ICICI Bank | icici | 7000 | 500000 | 17 | 12 |
| Cardless | Standard | IDFC Bank | idfc | 5000 | 100000 | 24 | 3 |
| Cardless | Standard | IDFC Bank | idfc | 5000 | 100000 | 24 | 6 |
| Cardless | Standard | IDFC Bank | idfc | 5000 | 100000 | 24 | 9 |
| Cardless | Standard | IDFC Bank | idfc | 5000 | 100000 | 24 | 12 |
| Cardless | Standard | CASHe | cashe | 1000 | 100000 | 23.78 | 3 |
| Cardless | Standard | CASHe | cashe | 6000 | 100000 | 25.28 | 6 |
| Cardless | Standard | CASHe | cashe | 9000 | 100000 | 25.63 | 9 |
| Cardless | Standard | CASHe | cashe | 12000 | 100000 | 25.8 | 12 |
| Cardless | No Cost | ZestMoney | zestmoney | 5000 | 150000 | 0 | 3 |
| Cardless | Standard | ZestMoney | zestmoney | 5000 | 150000 | 36 | 6 |
| Cardless | Standard | ZestMoney | zestmoney | 5000 | 150000 | 36 | 9 |
| Cardless | Standard | ZestMoney | zestmoney | 5000 | 150000 | 36 | 12 |

Paylater providers

| Provider Parameter | Name of the Provider |
| :---- | :---- |
| zestmoney | ZestMoney Paylater |
| lazypay | Lazypay |
| simpl | Simpl |
| mobikwik | mobikwik |

Was this page helpful?  
Yes  
No  
[API Limits](https://www.cashfree.com/docs/api-reference/payments/rate-limits)  
[Best Practices](https://www.cashfree.com/docs/api-reference/payments/api-best-practices)  
