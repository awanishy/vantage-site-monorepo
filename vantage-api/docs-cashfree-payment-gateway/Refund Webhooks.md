**Refund Webhooks**

Open in ChatGPT  
Learn about the async events sent for refunds  
Webhooks are server callbacks to your server from Cashfree Payments. We send refund webhooks for three different events for a payment.

1. Refund is successfully processed  
2. Refund is cancelled by Cashfree \- we were unable to successfully refund to customer even after multiple attempts.  
3. For successful Auto-refunds \- Read more about Auto-Refunds [here](https://www.cashfree.com/docs/payments/manage/refunds#auto-refunds)

## [**​**](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/webhooks#refund-webhook-payload)

## **Refund Webhook Payload**

* Version (2025-01-01)  
* Version (2023-08-01)

Version 2025-01-01  
Copy  
Ask AI  
{  
"data":{  
    "refund":{  
         "cf\_refund\_id":11325632,  
         "cf\_payment\_id":789727431,  
         "refund\_id":"refund\_sampleorder0413",  
         "order\_id":"sampleorder0413",  
         "refund\_amount":2.00,  
         "refund\_currency":"INR",  
         "entity":"Refund",  
         "refund\_type":"MERCHANT\_INITIATED",  
         "refund\_arn":"205907014017",  
         "refund\_status":"SUCCESS",  
         "status\_description":"Refund processed successfully",  
         "created\_at":"2022-02-28T12:54:25+05:30",  
         "processed\_at":"2022-02-28T13:04:27+05:30",  
         "refund\_note":"Test",  
         "refund\_splits":\[  
            {  
               "merchantVendorId":"sampleID12345",  
               "amount":1,  
               "percentage":null  
            },  
            {  
               "merchantVendorId":"otherVendor",  
               "amount":1,  
               "percentage":null  
            }  
         \],  
         "metadata":null,  
         "requested\_speed":"STANDARD",  
         "processed\_speed":"STANDARD",  
         "service\_charge":0.00,  
         "service\_tax":0.00,  
         "forex\_conversion\_handling\_charge":null,  
         "forex\_conversion\_handling\_tax":null,  
         "forex\_conversion\_rate":null,  
         "charges\_currency":null  
      },  
      terminalDetails:{  
         "cf\_terminal\_id":17269,  
         "terminal\_phone":"8971520311"  
      }  
   },  
   "event\_time":"2022-02-28T13:04:28+05:30",  
   "type":"REFUND\_STATUS\_WEBHOOK"  
}

## [**​**](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/webhooks#auto-refund-webhook-payload)

## **Auto Refund Webhook Payload**

Auto-refund webhooks differ from standard refund webhooks because they handle refunds that occur automatically (like failed payment attempts) rather than manual refunds tied to specific orders. Since these automatic refunds may happen before an order is created, they don’t contain the usual order-related data fields that are mandatory in standard refund webhooks,

* Version 2025-01-01  
* Version 2023-08-01

Version 2025-01-01  
Copy  
Ask AI  
{  
  "data": {  
    "auto\_refund": {  
      "event": "AUTO-REFUND",  
      "cf\_refund\_id": 1243460973,  
      "cf\_payment\_id": "2148333968",  
      "bank\_reference": "234928698581",  
      "order\_id": "order\_1944392Tpba8y2fHcHVx0SwREojp51Jgr",  
      "refund\_amount": 39,  
      "refund\_currency": "INR",  
      "refund\_type": "PAYMENT\_AUTO\_REFUND",  
      "refund\_arn": "205907014017",  
      "refund\_status": "SUCCESS",  
      "status\_description": "Auto-Refund processed successfully",  
      "refund\_reason": "Multiple payments were performed against same order.",  
      "created\_at": "2023-08-11T14:08:28+05:30",  
      "processed\_at": null,  
      "refund\_charge": 0,  
      "refund\_splits": null,  
      "metadata": null,  
      "forex\_conversion\_handling\_charge": null,  
      "forex\_conversion\_handling\_tax": null,  
      "forex\_conversion\_rate": null,  
      "charges\_currency": null  
    },  
    terminalDetails:{  
      "cf\_terminal\_id":17269,  
      "terminal\_phone":"8971520311"  
    }  
  },  
  "event\_time": "2023-08-11T14:10:21+05:30",  
  "type": "AUTO\_REFUND\_STATUS\_WEBHOOK"  
}

Was this page helpful?  
Yes  
No  
[Get All Refunds for an Order](https://www.cashfree.com/docs/api-reference/payments/latest/refunds/get-refunds-for-order)  
[Create Customer at Cashfree](https://www.cashfree.com/docs/api-reference/payments/latest/customers/create)  
