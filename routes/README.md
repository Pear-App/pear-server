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

### /user/me
* **Method**: `GET`
* **URL Params**: None
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**:
      ```json
      {
          "id": 3,
          "isSingle": true,
          "nickname": "Si Kai",
          "sex": "M",
          "sexualOrientation": "F",
          "age": 22,
          "minAge": 20,
          "maxAge": 30,
          "interests": "[{ name: 'Art', active: false },{ name: 'Books', active: false }]",
          "desc": "likes art and books",
          "facebookName": "Ng Si Kai",
          "facebookId": "123456789",
          "facebookToken": "ABCDEFGHIJ",
          "createdAt": "2017-10-18T04:26:46.000Z",
          "updatedAt": "2017-10-18T15:17:02.000Z",
          "friend": [
              {
                  "id": 2,
                  "facebookName": "Goh Wei Wen",
                  "facebookId": "123456789"
              }
          ],
          "single": [
              {
                  "id": 1,
                  "facebookName": "Ana LinJing Chua",
                  "facebookId": "123456789"
              },
              {
                  "id": 13,
                  "facebookName": "Karen Albbeegaicdbh Greeneman",
                  "facebookId": "123456789"
              },
              {
                  "id": 14,
                  "facebookName": "Karen Albbeiieahfgd Carrieroberg",
                  "facebookId": "123456789"
              }
          ]
      }
      ```
* **Error Response**:
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

## Match API
### /match/friend/:id
* **Method**: `GET`
* **URL Params**: `id=[userId]`
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**:
      ```json
      [
          {
              "id": 7,
              "isSingle": true,
              "nickname": "A",
              "sex": "M",
              "sexualOrientation": "F",
              "age": 22,
              "minAge": 20,
              "maxAge": 30,
              "interests": "[{ name: 'Art', active: false },{ name: 'Books', active: false }]",
              "desc": "Cool Boy A",
              "facebookName": "BoyA",
              "facebookId": "100",
              "facebookToken": "123",
              "createdAt": "2017-10-17T07:38:50.000Z",
              "updatedAt": "2017-10-17T07:38:50.000Z"
          },
          {
              "id": 8,
              "isSingle": true,
              "nickname": "B",
              "sex": "M",
              "sexualOrientation": "F",
              "age": 22,
              "minAge": 20,
              "maxAge": 30,
              "interests": "[{ name: 'Art', active: false },{ name: 'Books', active: false }]",
              "desc": "Cool Boy B",
              "facebookName": "BoyB",
              "facebookId": "101",
              "facebookToken": "456",
              "createdAt": "2017-10-17T07:38:50.000Z",
              "updatedAt": "2017-10-17T07:38:50.000Z"
          }
      ]
      ```
* **Error Response**:
    * **Code**: 400 <br />
      **Content**: `{ message: 'Invalid User id' }` / `{ message: 'Unauthorized access' }`
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /match/friend/:id
* **Method**: `POST`
* **URL Params**: `id=[userId]`
* **Data Params**:
   ```json
   {
      "candidateId": 7,
      "friendChoice": true
   }
   ```
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**: `{}`
* **Error Response**:
    * **Code**: 400 <br />
      **Content**: `{ message: 'Unauthorized access' }`
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /match/single
* **Method**: `GET`
* **URL Params**: None
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**:
      ```json
      [
          {
              "id": 7,
              "isSingle": true,
              "nickname": "A",
              "sex": "M",
              "sexualOrientation": "F",
              "age": 22,
              "minAge": 20,
              "maxAge": 30,
              "interests": "[{ name: 'Art', active: false },{ name: 'Books', active: false }]",
              "desc": "Cool Boy A",
              "facebookName": "BoyA",
              "facebookId": "100",
              "facebookToken": "123",
              "createdAt": "2017-10-17T07:38:50.000Z",
              "updatedAt": "2017-10-17T07:38:50.000Z"
          },
          {
              "id": 8,
              "isSingle": true,
              "nickname": "B",
              "sex": "M",
              "sexualOrientation": "F",
              "age": 22,
              "minAge": 20,
              "maxAge": 30,
              "interests": "[{ name: 'Art', active: false },{ name: 'Books', active: false }]",
              "desc": "Cool Boy B",
              "facebookName": "BoyB",
              "facebookId": "101",
              "facebookToken": "456",
              "createdAt": "2017-10-17T07:38:50.000Z",
              "updatedAt": "2017-10-17T07:38:50.000Z"
          }
      ]
      ```
* **Error Response**:
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /match/single
* **Method**: `POST`
* **URL Params**: None
* **Data Params**:
   ```json
   {
      "candidateId": 7,
      "singleChoice": false
   }
   ```
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**: `{}`
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

