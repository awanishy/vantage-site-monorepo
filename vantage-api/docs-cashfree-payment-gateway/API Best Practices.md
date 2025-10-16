**API Best Practices**

Open in ChatGPT  
Follow these best practices when using Cashfree’s API.

## [**​**](https://www.cashfree.com/docs/api-reference/payments/api-best-practices#avoid-polling)

## **Avoid Polling**

You should subscribe to webhook events instead of polling the API for data. This will help your integration stay within the API rate limit. For more information, see [Webhooks documentation](https://www.cashfree.com/docs/payments/webhooks)

## [**​**](https://www.cashfree.com/docs/api-reference/payments/api-best-practices#handle-rate-limit-errors-appropriately)

## **Handle rate limit errors appropriately**

If you receive a rate limit error, you should stop making requests temporarily according to these guidelines:

* If the x-ratelimit-retry response header is present, you should not retry your request until after that many seconds has elapsed.  
* If the x-ratelimit-remaining header is 0, you should not make another request until after the time specified by the x-ratelimit-reset header.  
* Otherwise, wait for at least one minute before retrying.  
* If you continue to receive rate limit errors and you feel you need a better rate limit then please raise a request through our [merchant dashboard](https://merchant.cashfree.com/merchants/pg/developers/rate-limits).

## [**​**](https://www.cashfree.com/docs/api-reference/payments/api-best-practices#optimize-your-api-requests-with-connection-keep-alive)

## **Optimize Your API Requests with Connection Keep-Alive**

To ensure optimal performance and reduce latency when interacting with our APIs, we recommend using HTTP connection keep-alive. Set the Connection: keep-alive header in your API requests. This allows a single connection to be reused for multiple requests, improving efficiency and reducing resource usage on both sides.

## [**​**](https://www.cashfree.com/docs/api-reference/payments/api-best-practices#use-sdks)

## **Use SDKs**

To simplify integration, Cashfree offers SDKs in popular programming languages like. By using these SDKs, you can significantly reduce development time and effort. They provide pre-built libraries and functions to interact with the Cashfree API, handling authentication, request/response formatting, and error handling. You can find them [here](https://www.cashfree.com/docs/api-reference/payments/sdk)

## [**​**](https://www.cashfree.com/docs/api-reference/payments/api-best-practices#use-api-versioning)

## **Use API Versioning**

Always use the latest version of the API to ensure that you have access to the latest features and improvements. If you are using an older version of the API, consider upgrading to the latest version to take advantage of new features and bug fixes. The payment apis follow a versioning scheme where the version is specified in x-api-version header. The version format is YYYY-MM-DD.

## [**​**](https://www.cashfree.com/docs/api-reference/payments/api-best-practices#secure-your-api-keys)

## **Secure Your API Keys**

Keep your API keys secure and never expose them in public repositories or client-side code. Use environment variables or other secure methods to store and access your API keys.

## [**​**](https://www.cashfree.com/docs/api-reference/payments/api-best-practices#avoid-concurrent-requests)

## **Avoid concurrent requests**

Avoid making multiple requests to the API at the same time from the same account. This can lead to rate limit errors and impact the performance of your integration. If you need to make multiple requests, consider using a queue or other method to manage the requests and ensure they are processed sequentially.

## [**​**](https://www.cashfree.com/docs/api-reference/payments/api-best-practices#use-request-id-header)

## **Use Request ID header**

Include a unique request ID in each API request header x-request-id to help track and troubleshoot issues. This can be useful for debugging and monitoring the performance of your integration.

## [**​**](https://www.cashfree.com/docs/api-reference/payments/api-best-practices#test-in-sandbox-environment)

## **Test in Sandbox Environment**

Before deploying your integration to production, test your application in the Cashfree sandbox environment. This will help you identify and fix any issues before they impact your customers. Make sure you use the sandbox API keys provided in the [merchant dashboard](https://merchant.cashfree.com/merchants/pg/developers/api-keys?env=test) for testing.  
Was this page helpful?  
Yes  
No  
[Enums](https://www.cashfree.com/docs/api-reference/payments/enums)  
[Errors](https://www.cashfree.com/docs/api-reference/payments/errors)  
