# API Docs
## Authentication with JWT
```javascript
let headers = new Headers()
headers.append("Content-Type", "application/json")
headers.append("Authorization", `bearer ${jwtToken}`)
```
## Auth API
### /authenticate
* **Method**: `POST`
* **URL Params**: None
* **Data Params**: `fbToken: 'yourFbAccessToken'`
* **Require JWT**: `false`
* **Success Response**: 
    * **Code**: 200 <br />
      **Content**: `{ jwt : 'yourJwt' }`
* **Error Response**: 
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request',
      token: null }`

# Coming Soon
### /deauthenticate
* **Method**: `POST`
* **URL Params**: None
* **Data Params**: `signed_request: 'yourFbDeauthRequest'`
* **Require JWT**: `false`
* **Success Response**: 
    * **Code**: 200 <br />
      **Content**: `{}`
* **Error Response**: 
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with your fb deauthentication' }`

## User API
### /user/:id
* **Method**: `GET`
* **URL Params**: `id=[userid]`
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**: 
    * **Code**: 200 <br />
      **Content**: `{ }`
* **Error Response**: 
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`
      
### /user/edit
* **Method**: `POST`
* **URL Params**: None
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**: 
    * **Code**: 200 <br />
      **Content**: `{ }`
* **Error Response**: 
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

