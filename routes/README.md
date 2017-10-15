# API Docs
## Authentication with JWT
```
let headers = new Headers()
headers.append("Content-Type", "application/json")
headers.append("Authorization", `bearer ${jwtToken}`)
```
## Auth API
### /authenticate
* **Method**: `POST`
* **Data Params**: `fbToken: 'yourFbAccessToken'`
* **Success Response**: 
    * **Code**: 200 <br />
      **Content**: `{ fbToken : 'longLivedFbAccessToken', jwtToken : 'yourJwtToken' }`
* **Error Response**: 
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request',
      token: null }`
