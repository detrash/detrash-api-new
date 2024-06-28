# API Documentation

## Get Access Token

The "Get Access Token" API facilitates the KYC process on the front-end. This endpoint is involved in user authentication via Auth0 and retrieving an SDK access token from the Sumsub API for authenticated users.

#### Process Flow

1. **User Authentication**: When users access the KYC page, the front-end initiates a request to authenticate via Auth0.
2. **Token Retrieval**: After authentication, `getSDKAccessToken` is called. It connects with the Sumsub API configured with axios to request an access token.
3. **Token Delivery**: The received token from Sumsub is returned to the front-end to proceed with the KYC process.

#### Endpoint

`POST /api/sumsub/get-access-token`

#### Configuration

- **Base URL**: `https://api.sumsub.com/`
- **Headers**:
  - **Content-Type**: `application/json`
  - **X-App-Token**: Token from environment variable `SUMSUB_ACCESS_TOKEN`

#### Authentication

- **Auth0 Authentication**: Ensures that the request is authenticated using Auth0. Users must be logged in to receive the token.

#### Request

- **Headers**:
  - **Content-Type**: `application/json`
  - **Authorization**: `Bearer <Auth0_access_token>`
- **Body**: None

#### Response

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "token": "<sdk_access_token>"
    }
    ```
- **Error Responses**:
  - **401 Unauthorized**: If the Auth0 authentication fails.
  - **500 Internal Server Error**: If there are issues in fetching the token from Sumsub.

## Webhook API

The Webhook API is designed to receive callbacks from the KYC provider to process and update the KYC result status in the system.

#### Process Flow

1. **Digest Verification**: Upon receiving a webhook, the system verifies its authenticity through `checkDigest`.
2. **Parsing and Processing**: The body of the request is parsed, and depending on the `type` of the webhook (e.g., `applicantReviewed`), appropriate actions are taken, such as updating the KYC status in the database using `addKYC`.
3. **Response**: After processing, a response is sent back indicating the success or failure of the operation.

#### Endpoint

`POST /api/sumsub/webhook`

#### Authentication

- **Digest Check**: Validates the integrity of the incoming request using a signature verification method `checkDigest`.

#### Request

- **Headers**:

  - **Content-Type**: `application/json`
  - **Signature**: Verification token or key

- **Body**: JSON object detailing the KYC event.
  ```json
  {
    "type": "applicantReviewed",
    "data": {...}
  }
  ```

#### Response

- **Success Response**:

  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "status": "Ok"
    }
    ```

- **Error Responses**:
  - **401 Unauthorized**: If the digest check fails, indicating that the request may not be authentic.
  - **400 Bad Request**: If the webhook type is unknown or malformed.
