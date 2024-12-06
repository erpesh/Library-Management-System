# API Endpoint 

## Table of Contents

### Inventory API
- [POST - /api/inventory](#post-api-inventory)
- [GET - /api/inventory](#get-api-inventory)
- [GET - /api/inventory/:id](#get-api-inventoryid)
- [PUT - /api/inventory/:id](#put-api-inventoryid)
- [DELETE - /api/inventory/:id](#delete-api-inventoryid)
- [GET - /api/inventory/:id/available](#get-api-inventoryidavailable)
- [POST - /api/inventory/:id/borrow](#post-api-inventoryidborrow)
- [POST - /api/inventory/:id/return](#post-api-inventoryidreturn)
### Media API
- [POST - /api/media/notify/:mediaID](#post-api-medianotifymediaid)
- [POST - /api/media/user/:userID/media/:mediaID](#post-api-mediausermediaidmediaid)
- [GET - /api/media/user/:userID/](#get-api-mediauseruserid)
- [POST - /api/media/user/:userID/record/:id/return](#post-api-mediauseruseridrecordidreturn)
- [POST - /api/media/user/:userID/record/:id/renew](#post-api-mediauseruseridrecordidrenew)
- [GET - /api/media/user/:userID/media/:mediaID](#get-api-mediauseruseridmediaid)
---

## API Endpoints - Inventory API

**Endpoint**: `POST` - `/api/inventory` 
**Description**: Adds a new media to the inventory database.

**Headers**:

- `Content-Type`: application/json

**Request Body**:

```json
{
  "title": "The Great Gatsby",
  "mediaType": "book",
  "genre": "Classic",
  "releaseDate": "1925-04-10T00:00:00.000Z",
  "stock": 5,
  "description": "A novel written by American author F. Scott Fitzgerald.",
  "imageUrl": "https://example.com/greatgatsby.jpg",
  "borrowed": 2,
  "author": "F. Scott Fitzgerald",
  "publisher": "Charles Scribner's Sons",
  "platform": "",
  "artist": "",
  "createdAt": "2024-12-05T00:00:00.000Z"
}
```

***Response***:

- Status: 201 Created
- Body:

```json
{
  "_id": "218749yh2f189dy1hd",
  "title": "The Great Gatsby",
  "mediaType": "book",
  "genre": "Classic",
  "releaseDate": "1925-04-10T00:00:00.000Z",
  "stock": 5,
  "description": "A novel written by American author F. Scott Fitzgerald.",
  "imageUrl": "https://example.com/greatgatsby.jpg",
  "borrowed": 2,
  "author": "F. Scott Fitzgerald",
  "publisher": "Charles Scribner's Sons",
  "platform": "",
  "artist": "",
  "createdAt": "2024-12-05T00:00:00.000Z"
}
```
---

**Endpoint**: `GET` - `/api/inventory`
**Description**: Gets media by search params. It includes `page`, `perPage`, `ids`, `title`, `genre`, etc. 

**Headers**:

- `Content-Type`: application/json

***Response***:

- Status: 200 OK
- Body:

```json
[
  {
    "_id": "218749yh2f189dy1hd",
    "title": "The Great Gatsby",
    "mediaType": "book",
    "genre": "Classic",
    "releaseDate": "1925-04-10T00:00:00.000Z",
    "stock": 5,
    "description": "A novel written by American author F. Scott Fitzgerald.",
    "imageUrl": "https://example.com/greatgatsby.jpg",
    "borrowed": 2,
    "author": "F. Scott Fitzgerald",
    "publisher": "Charles Scribner's Sons",
    "platform": "",
    "artist": "",
    "createdAt": "2024-12-05T00:00:00.000Z"
  }
]
```
---

**Endpoint**: `GET` - `/api/inventory/:id`
**Description**: Gets media by id.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `id` (path parameter): The ID of the media.


***Response***:

- Status: 200 OK
- Body:

```json
{
  "_id": "218749yh2f189dy1hd",
  "title": "The Great Gatsby",
  "mediaType": "book",
  "genre": "Classic",
  "releaseDate": "1925-04-10T00:00:00.000Z",
  "stock": 5,
  "description": "A novel written by American author F. Scott Fitzgerald.",
  "imageUrl": "https://example.com/greatgatsby.jpg",
  "borrowed": 2,
  "author": "F. Scott Fitzgerald",
  "publisher": "Charles Scribner's Sons",
  "platform": "",
  "artist": "",
  "createdAt": "2024-12-05T00:00:00.000Z"
}
```
---

**Endpoint**: `PUT` - `/api/inventory/:id`
**Description**: Updates an existing media by id.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `id` (path parameter): The ID of the media.

**Request Body**:

```json
{
  "title": "The Great Gatsby",
  "mediaType": "book",
  "genre": "Classic",
  "releaseDate": "1925-04-10T00:00:00.000Z",
  "stock": 5,
  "description": "A novel written by American author F. Scott Fitzgerald.",
  "imageUrl": "https://example.com/greatgatsby.jpg",
  "borrowed": 2,
  "author": "F. Scott Fitzgerald",
  "publisher": "Charles Scribner's Sons",
  "platform": "",
  "artist": "",
  "createdAt": "2024-12-05T00:00:00.000Z"
}
```

***Response***:

- Status: 200 OK
- Body:

```json
{
  "title": "The Great Gatsby",
  "mediaType": "book",
  "genre": "Classic",
  "releaseDate": "1925-04-10T00:00:00.000Z",
  "stock": 5,
  "description": "A novel written by American author F. Scott Fitzgerald.",
  "imageUrl": "https://example.com/greatgatsby.jpg",
  "borrowed": 2,
  "author": "F. Scott Fitzgerald",
  "publisher": "Charles Scribner's Sons",
  "platform": "",
  "artist": "",
  "createdAt": "2024-12-05T00:00:00.000Z"
}
```
---

**Endpoint**: `DELETE` - `/api/inventory/:id` 
**Description**: Deletes an existing media by id.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `id` (path parameter): The ID of the media.

***Response***:

- Status: 204 No Content
---

**Endpoint**: `GET` - `/api/inventory/:id/available`
**Description**: Checking availability of the media.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `id` (path parameter): The ID of the media.

***Response***:

- Status: 200 OK
- Body:

```json
{
  "available": true
}
```

---

**Endpoint**: `POST` - `/api/inventory/:id/borrow`
**Description**: Increments 'borrowed' count for the specified media. It's used only internally by Media Service.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `id` (path parameter): The ID of the media.

***Response***:

- Status: 200 OK
- Body:

```json
{
  "message": "Media borrowed successfully" 
}
```  
---

**Endpoint**: `POST` - `/api/inventory/:id/return`  
**Description**: Decrements 'borrowed' count for the specified media. It's used only internally by Media Service.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `id` (path parameter): The ID of the media.

***Response***:

- Status: 200 OK
- Body:

```json
{
  "message": "Media borrowed successfully" 
}
```
---

## API Endpoints - Media API

### **POST** - `/api/media/notify/:mediaID`
**Description**: Notifies users to return the specified media.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `mediaID` (path parameter): The ID of the media to notify users about.

**Response**:
```json
{
  "message": "Return notifications sent successfully"
}
```

---

### **POST** - `/api/media/user/:userID/media/:mediaID`
**Description**: Borrow the specified media for the user.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `userID` (path parameter): The ID of the user borrowing the media.
- `mediaID` (path parameter): The ID of the media to borrow.

**Request Body**:
```json
{
  "returnAt": 1700000000
}
```

**Response**:
```json
{
  "message": "Media borrowed successfully"
}
```

---

### **GET** - `/api/media/user/:userID/`
**Description**: Fetch borrowing records for the specified user.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `userID` (path parameter): The ID of the user whose borrowing records are being retrieved.

**Response**:
```json
[
  {
    "_id": "218749yh2f189dy1hd",
    "title": "The Great Gatsby",
    ...,
    "borrowingRecord": {
      "_id": "kljk1241244asdgfg",
      "userId": "asfasfkjlasf12412",
      "mediaId": "218749yh2f189dy1hd",
      "borrowedAt": 1700001000,
      "returnAt": 1700002000,
      "returnedAt": null
    }
  }
]
```

---

### **POST** - `/api/media/user/:userID/record/:id/return`
**Description**: Marks the media as returned for the specified borrowing record.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `userID` (path parameter): The ID of the user returning the media.
- `id` (path parameter): The ID of the borrowing record.

**Response**:
```json
{
  "message": "Media returned successfully",
  "returnedAt": 1700005000
}
```

---

### **POST** - `/api/media/user/:userID/record/:id/renew`
**Description**: Updates the return date for the specified borrowing record.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `userID` (path parameter): The ID of the user renewing the media.
- `id` (path parameter): The ID of the borrowing record.

**Request Body**:
```json
{
  "newReturnDate": 1700100000
}
```

**Response**:
```json
{
  "message": "Borrowing record updated successfully"
}
```

---

### **GET** - `/api/media/user/:userID/media/:mediaID`
**Description**: Checks the borrowing status of a specific media by a specific user. It's only used internally by Inventory Service.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `userID` (path parameter): The ID of the user.
- `mediaID` (path parameter): The ID of the media.

**Response**:
```json
{
  "isBorrowed": true,
  "borrowingRecord": {
    "_id": "kljk1241244asdgfg",
    "userId": "asfasfkjlasf12412",
    "mediaId": "218749yh2f189dy1hd",
    "borrowedAt": 1700001000,
    "returnAt": 1700002000,
    "returnedAt": null
  }
}
```
