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

## User API
### /user/:id
* **Method**: `GET`
* **URL Params**: `id=[userId]`
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**: 
    * **Code**: 200 <br />
      **Content**: 
      ```json
      {
          "id": 1,
          "isSingle": false,
          "nickname": "",
          "sex": null,
          "sexualOrientation": null,
          "age": null,
          "minAge": null,
          "maxAge": null,
          "interests": null,
          "desc": null,
          "facebookName": "Peter Pan",
          "facebookId": "123456789",
          "facebookToken": "ABCDEFGHIJ",
          "createdAt": "2017-10-17T07:38:50.000Z",
          "updatedAt": "2017-10-17T09:26:19.000Z"
      }
      ```
* **Error Response**: 
    * **Code**: 400 <br />
      **Content**: `{ message: 'Invalid User id' }`
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`
      
### /user/:id/edit
* **Method**: `POST`
* **URL Params**: `id=[userId]`
* **Data Params**:
   ```json
   {
      "nickname": "Pete",
      "sex": "M",
      "sexualOrientation": "F",
      "age": 22,
      "minAge": 20,
      "maxAge": 30,
      "interests": "[{ name: 'Art', active: false },{ name: 'Books', active: false }]",
      "desc": "Great guy!"
   }
   ```
* **Require JWT**: `true`
* **Success Response**: 
    * **Code**: 200 <br />
      **Content**:
      ```json
      {
          "id": 1,
          "isSingle": true,
          "nickname": "Pete",
          "sex": "M",
          "sexualOrientation": "F",
          "age": 22,
          "minAge": 20,
          "maxAge": 30,
          "interests": "[{ name: 'Art', active: false },{ name: 'Books', active: false }]",
          "desc": "Great guy!",
          "facebookName": "Peter Pan",
          "facebookId": "123456789",
          "facebookToken": "ABCDEFGHIJ",
          "createdAt": "2017-10-17T07:38:50.000Z",
          "updatedAt": "2017-10-17T09:26:19.000Z"
      }
      ```
* **Error Response**: 
    * **Code**: 400 <br />
      **Content**: `{ message: 'Invalid User id' }` / `{ message: 'Unauthorized edit' }`
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /user/friend/add
* **Method**: `POST`
* **URL Params**: None
* **Data Params**:
   ```json
   {
      "friendId": "123"
   }
   ```
* **Require JWT**: `true`
* **Success Response**: 
    * **Code**: 200 <br />
      **Content**: `{}`
* **Error Response**: 
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /user/friend/remove
* **Method**: `POST`
* **URL Params**: None
* **Data Params**:
   ```json
   {
      "friendId": "123"
   }
   ```
* **Require JWT**: `true`
* **Success Response**: 
    * **Code**: 200 <br />
      **Content**: `{}`
* **Error Response**: 
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /user/friend
* **Method**: `GET`
* **URL Params**: None
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**: 
    * **Code**: 200 <br />
      **Content**: 
      ```json
      {
          "id": 1,
          "isSingle": true,
          "nickname": "Pete",
          "sex": "M",
          "sexualOrientation": "F",
          "age": 22,
          "minAge": 20,
          "maxAge": 30,
          "interests": "[{ name: 'Art', active: false },{ name: 'Books', active: false }]",
          "desc": "Great guy!",
          "facebookName": "Peter Pan",
          "facebookId": "123456789",
          "facebookToken": "ABCDEFGHIJ",
          "createdAt": "2017-10-17T07:38:50.000Z",
          "updatedAt": "2017-10-17T09:26:19.000Z",
          "friend": [
             {
               "id": 2,
               "facebookName": "Wonder Woman"
             },
             {
               "id" 3,
               "facebookName": "Superman"
             }
          ]
      }
      ```
* **Error Response**: 
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /user/single
* **Method**: `GET`
* **URL Params**: None
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**: 
    * **Code**: 200 <br />
      **Content**: 
      ```json
      {
          "id": 1,
          "isSingle": true,
          "nickname": "Pete",
          "sex": "M",
          "sexualOrientation": "F",
          "age": 22,
          "minAge": 20,
          "maxAge": 30,
          "interests": "[{ name: 'Art', active: false },{ name: 'Books', active: false }]",
          "desc": "Great guy!",
          "facebookName": "Peter Pan",
          "facebookId": "123456789",
          "facebookToken": "ABCDEFGHIJ",
          "createdAt": "2017-10-17T07:38:50.000Z",
          "updatedAt": "2017-10-17T09:26:19.000Z",
          "friend": [
             {
               "id": 2,
               "facebookName": "Wonder Woman"
             },
             {
               "id" 4,
               "facebookName": "Aquaman"
             }
          ]
      }
      ```
* **Error Response**: 
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

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

## Invitation API
### /invitation/create

### /invitation/:id

### /invitation/accept

### /invitation/reject

