**API Limits**

Open in ChatGPT  
Learn how many number of API calls a user can make over a certain period of time.  
You can view your API usage and rate limits on your dashboard. Go to Developers \> Rate Limits to view various metrics such as: Rate Limit, Latest Usage, Average Usage, Burst limit, Request Count and Violation Count.

## [**​**](https://www.cashfree.com/docs/api-reference/payments/rate-limits#rate-limiting)

## **Rate limiting**

We use rate limiting for all endpoints. Rate limiting is based on your IP and your account Id. By default, the following rate limits are applied per minute. You can also view your rate limits in the response headers.

* Production  
* Sandbox

### [**​**](https://www.cashfree.com/docs/api-reference/payments/rate-limits#rate-limit-in-production)

### **Rate Limit in Production**

| API | Rate limit value per minute | Rate limit type |
| :---- | :---- | :---- |
| Create Order | 200 | Account |
| Get Order | 400 | Account |
| Get Payments | 100 | Account |
| Get Payments by ID | 130 | Account |
| Pay Order | 100 | IP |
| Get Settlements | 30 | Account |
| Initiate Refund | 100 | Account |
| Get Refund | 30 | Account |

## [**​**](https://www.cashfree.com/docs/api-reference/payments/rate-limits#rate-limiting-headers)

## **Rate limiting headers**

All responses will have the following headers to help you understand rate limiting.

| Header name | Example | Description |
| :---- | :---- | :---- |
| x-ratelimit-limit | 100 | Max number of calls that can be made in a minute |
| x-ratelimit-remaining | 30 | Remaining number of calls that can be made in a minute |
| x-ratelimit-retry | 0 | Number of seconds you will have to wait to make the next call |
| x-ratelimit-type | app\_id or ip | Type of rate limiting applied |

Was this page helpful?  
Yes  
No  
[Payment SDK](https://www.cashfree.com/docs/api-reference/payments/sdk)  
[Enums](https://www.cashfree.com/docs/api-reference/payments/enums)  
