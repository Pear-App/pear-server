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
      **Content**: `{}`

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

### /user/friend
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
* **Method**: `DELETE`
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
      
## Invitation API
### /invitation
* **Method**: `POST`
* **URL Params**: None
* **Data Params**:
   ```json
   {
      "nickname": "Batman",
      "sex": "M",
      "sexualOrientation": "F",
      "age": "21",
      "minAge": "18",
      "maxAge": "21",
      "interests": "[{ name: 'Bats', active: false },{ name: 'Caves', active: false }]",
      "desc": "He has a cool Bat Mobile!"
   }
   ```
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**: 
      ```json
      {
          "status": "P",
          "id": 21,
          "inviterId": 3,
          "nickname": "Batman",
          "sex": "M",
          "sexualOrientation": "F",
          "age": "21",
          "minAge": "18",
          "maxAge": "21",
          "interests": "[{ name: 'Bats', active: false },{ name: 'Caves', active: false }]",
          "desc": "He has a cool Bat Mobile!",
          "updatedAt": "2017-10-18T17:46:23.482Z",
          "createdAt": "2017-10-18T17:46:23.482Z"
      }
      ```
* **Error Response**:
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /invitation/:id
* **Method**: `GET`
* **URL Params**: `id=[invitationId]`
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**:
      ```json
      {
          "id": 20,
          "nickname": "Puma",
          "sex": "M",
          "sexualOrientation": "M",
          "age": 51,
          "minAge": 52,
          "maxAge": 63,
          "interests": "[{ name: 'Running', active: false },{ name: 'Sprinting', active: false }]",
          "desc": "I like to Run",
          "status": "Y",
          "createdAt": "2017-10-18T16:58:54.000Z",
          "updatedAt": "2017-10-18T17:11:01.000Z",
          "inviterId": 3,
          "inviter": {
              "id": 3,
              "facebookName": "Ng Si Kai",
              "facebookId": "123456789"
          }
      }
      ```
* **Error Response**:
    * **Code**: 400 <br />
      **Content**: `{ message: 'Invalid Invitation id' }`
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /invitation/me
* **Method**: `POST`
* **URL Params**: None
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**: 
      ```json
      [
          {
              "id": 16,
              "nickname": "Pig",
              "sex": "M",
              "sexualOrientation": "F",
              "age": 21,
              "minAge": 18,
              "maxAge": 22,
              "interests": "[{ name: 'Fishes', active: false },{ name: 'Swimming', active: false }]",
              "desc": "I like to fish",
              "status": "Y",
              "createdAt": "2017-10-18T06:58:28.000Z",
              "updatedAt": "2017-10-18T09:58:05.000Z",
              "inviterId": 3
          },
          {
              "id": 17,
              "nickname": "Mouse",
              "sex": "F",
              "sexualOrientation": "F",
              "age": 41,
              "minAge": 48,
              "maxAge": 52,
              "interests": "[{ name: 'Diving', active: true }]",
              "desc": "I like to dive",
              "status": "Y",
              "createdAt": "2017-10-18T10:11:01.000Z",
              "updatedAt": "2017-10-18T10:13:12.000Z",
              "inviterId": 3
          },
          {
              "id": 18,
              "nickname": "Tiger",
              "sex": "F",
              "sexualOrientation": "F",
              "age": 1,
              "minAge": 2,
              "maxAge": 3,
              "interests": "[{ name: 'Birds', active: false }]",
              "desc": "I like to fly",
              "status": "N",
              "createdAt": "2017-10-18T10:34:02.000Z",
              "updatedAt": "2017-10-18T10:34:09.000Z",
              "inviterId": 3
          }
      ]
      ```
* **Error Response**:
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /invitation/:id/accept
* **Method**: `POST`
* **URL Params**: `id=[invitationId]`
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**: 
      ```json
      {}
      ```
* **Error Response**:
    * **Code**: 400 <br />
      **Content**: `{ message: 'Invalid Invitation id' }`
    * **Code**: 400 <br />
      **Content**: `{ message: 'Invalid User id' }`
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /invitation/:id/reject
* **Method**: `POST`
* **URL Params**: `id=[invitationId]`
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**: 
      ```json
      {}
      ```
* **Error Response**:
    * **Code**: 400 <br />
      **Content**: `{ message: 'Invalid Invitation id' }`
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`
