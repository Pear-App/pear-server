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
Fetch user with id
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
          "nickname": null,
          "school": null,
          "major": null,
          "sex": null,
          "sexualOrientation": null,
          "age": null,
          "minAge": null,
          "maxAge": null,
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
Modify user with id
* **Method**: `POST`
* **URL Params**: `id=[userId]`
* **Data Params**:
   ```json
   {
      "nickname": "Pete",
      "school": "NUS",
      "major": "School of Engineering",
      "sex": "M",
      "sexualOrientation": "F",
      "age": 22,
      "minAge": 20,
      "maxAge": 30,
      "desc": "I like sports and games"
   }
   ```
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**: Optional fields
      ```json
      {
          "id": 1,
          "isSingle": true,
          "nickname": "Pete",
          "school": "NUS",
          "major": "School of Engineering",
          "sex": "M",
          "sexualOrientation": "F",
          "age": 22,
          "minAge": 20,
          "maxAge": 30,
          "desc": "I like sports and games",
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

### /user/:id/review
Create or modify review for user with id
* **Method**: `POST`
* **URL Params**: `id=[userId]`
* **Data Params**:
   ```json
   {
      "review": "My New Review",
   }
   ```
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**:
      ```json
      {}
      ```
* **Error Response**:
    * **Code**: 400 <br />
      **Content**: `{ message: 'Invalid User id' }` / `{ message: 'Unauthorized edit' }`
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /user/friend
Add friend with friendId
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
Remove friend with friendId
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
Fetch user details and the user's friends, singles, invitations where the status is either pending or rejected, reviews and photos
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
          "school": "NUS",
          "major": "School of Computing",
          "sex": "M",
          "sexualOrientation": "F",
          "age": 22,
          "minAge": 20,
          "maxAge": 30,
          "desc": "I like dance",
          "facebookName": "Ng Si Kai",
          "facebookId": "123456789",
          "facebookToken": "ABCDEFGHIJ",
          "createdAt": "2017-10-18T04:26:46.000Z",
          "updatedAt": "2017-10-18T15:17:02.000Z",
          "friend": [
              {
                  "id": 2,
                  "facebookName": "Goh Wei Wen",
                  "facebookId": "123456789",
                  "Friendships": {
                      "review": "SK IS DA BEST"
                  }
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
          ],
          "inviter": [
              {
                  "id": "123456789-123456789-123456789",
                  "nickname": "Happy Girl 123",
                  "sex": "F",
                  "age": 23,
                  "review": "A Happy Girl",
                  "status": "P",
                  "inviterId": 3
              }
          ],
          "photos": [
              {
                  "order": 0,
                  "photoId": "00000"
              },
              {
                  "order": 1,
                  "photoId": "11111"
              },
              {
                  "order": 2,
                  "photoId": "22222"
              },
              {
                  "order": 3,
                  "photoId": "33333"
              },
              {
                  "order": 4,
                  "photoId": "44444"
              },
              {
                  "order": 5,
                  "photoId": "55555"
              }
          ]
      }
      ```
* **Error Response**:
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

## Match API
### /match/friend/:id
As a friend, fetch a list of candidates for single with id
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
              "school": "NUH",
              "major": "Doctor",
              "sex": "M",
              "age": 22,
              "desc": "Cool Boy A",
              "facebookName": "BoyA",
              "facebookId": "100",
              "friend": [
                  {
                      "id": 8,
                      "facebookName": "BoyB",
                      "facebookId": "101",
                      "Friendships": {
                          "review": "He is a great guy"
                      }
                  },
                  {
                      "id": 9,
                      "facebookName": "BoyC",
                      "facebookId": "102",
                      "Friendships": {
                          "review": "He is a really great guy"
                      }
                  }
              ],
              "photos": [
                  {
                      "order": 0,
                      "photoId": "123"
                  },
                  {
                      "order": 1,
                      "photoId": "456"
                  }
              ]
          },
          {
              "id": 8,
              "isSingle": true,
              "nickname": "B",
              "school": "NUH",
              "major": "Doctor",
              "sex": "M",
              "age": 22,
              "desc": "Cool Boy B",
              "facebookName": "BoyB",
              "facebookId": "101",
              "friend": [
                  {
                      "id": 9,
                      "facebookName": "BoyC",
                      "facebookId": "102",
                      "Friendships": {
                          "review": "He is a great bro"
                      }
                  }
              ],
              "photos": [
                  {
                      "order": 0,
                      "photoId": "789"
                  }
              ]
          }
      ]
      ```
* **Error Response**:
    * **Code**: 400 <br />
      **Content**: `{ message: 'Invalid User id' }` / `{ message: 'Unauthorized access' }`
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /match/friend/:id
As a friend, swipe yes/no to a candidate for single with id
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
As a single, fetch a list of candidates
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
              "id": 8,
              "isSingle": true,
              "nickname": "B",
              "school": "NUH",
              "major": "Doctor",
              "sex": "M",
              "age": 22,
              "desc": "Cool Boy B",
              "facebookName": "BoyB",
              "facebookId": "101",
              "friend": [
                  {
                      "id": 9,
                      "facebookName": "BoyC",
                      "facebookId": "102",
                      "Friendships": {
                          "review": "He is a great bro"
                      }
                  }
              ],
              "photos": [
                  {
                      "order": 0,
                      "photoId": "123"
                  },
                  {
                      "order": 1,
                      "photoId": "456"
                  }
              ]
          }
      ]
      ```
* **Error Response**:
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /match/single
As a single, swipe yes/no to a candidate
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
Create an invitation
* **Method**: `POST`
* **URL Params**: None
* **Data Params**:
   ```json
   {
      "nickname": "Batman",
      "sex": "M",
      "age": "21",
      "review": "He has a cool Bat Mobile!"
   }
   ```
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**: 
      ```json
      {
          "id": "123456789-123456789-123456789",
          "status": "P",
          "inviterId": 3,
          "nickname": "Batman",
          "sex": "M",
          "age": "21",
          "review": "He has a cool Bat Mobile!",
          "updatedAt": "2017-10-18T17:46:23.482Z",
          "createdAt": "2017-10-18T17:46:23.482Z"
      }
      ```
* **Error Response**:
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /invitation/:id
Fetch invitation with id
* **Method**: `GET`
* **URL Params**: `id=[invitationId]`
* **Data Params**: None
* **Require JWT**: `false`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**:
      ```json
      {
          "id": "123456789-123456789-123456789",
          "status": "P",
          "inviterId": 3,
          "nickname": "Batman",
          "sex": "M",
          "age": "21",
          "review": "He has a cool Bat Mobile!",
          "updatedAt": "2017-10-18T17:46:23.482Z",
          "createdAt": "2017-10-18T17:46:23.482Z",
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
      
### /invitation/:id
Delete invitation with id
* **Method**: `DELETE`
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
      **Content**: `{ message: 'Invalid Invitation id' }` / `{ message: 'Unauthorised delete' }`
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /invitation/me
Fetch user's invitations which are either pending or rejected
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
              "id": "123456789-123456789-123456789",
              "status": "P",
              "inviterId": 3,
              "nickname": "Pig",
              "sex": "M",
              "age": 21,
              "review": "He likes to fish",
              "createdAt": "2017-10-18T06:58:28.000Z",
              "updatedAt": "2017-10-18T09:58:05.000Z"
          },
          {
              "id": "123456789-123456789-123456789",
              "status": "P",
              "inviterId": 3,
              "nickname": "Mouse",
              "sex": "M",
              "age": 21,
              "review": "He likes to fish",
              "createdAt": "2017-10-18T06:58:28.000Z",
              "updatedAt": "2017-10-18T09:58:05.000Z"
          },
          {
              "id": "123456789-123456789-123456789",
              "status": "P",
              "inviterId": 3,
              "nickname": "Tiger",
              "sex": "M",
              "age": 21,
              "review": "He likes to fish",
              "createdAt": "2017-10-18T06:58:28.000Z",
              "updatedAt": "2017-10-18T09:58:05.000Z"
          }
      ]
      ```
* **Error Response**:
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /invitation/:id/accept
Accept invitation with id
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
Reject invitation with id
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

## Photo API
### /photo
Get profile pictures from Facebook. Access photos using "https://s3-ap-southeast-1.amazonaws.com/pear-server/{photoId}"
* **Method**: `GET`
* **URL Params**: None
* **Data Params**: None
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**:
      ```json
      [
          "00000",
          "11111",
          "22222",
          "33333",
          "44444",
          "55555",
          "66666",
          "77777",
          "88888",
          "99999"
      ]
      ```
* **Error Response**:
    * **Code**: 400 <br />
      **Content**: `{ message: 'Invalid User id' } / { message: 'No Profile Pictures album' }`
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`

### /photo
Modify photos of user. Include up to 6 profile picture ids. Note that the order matters i.e. first id in the list would be assigned order 0, then order 1, order 2...
* **Method**: `POST`
* **URL Params**: None
* **Data Params**:
   ```json
   {
     "photoIds": ["55555","33333","00000","99999","66666","22222"]
   }
   ```
* **Require JWT**: `true`
* **Success Response**:
    * **Code**: 200 <br />
      **Content**:
      ```json
      {}
      ```
* **Error Response**:
    * **Code**: 500 <br />
      **Content**: `{ message: 'An error occurred with processing your request' }`
