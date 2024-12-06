# API Documentation

## Table of Contents

### Inventory API
- [POST - /api/inventory](#post---apiinventory)
- [GET - /api/inventory](#get---apiinventory)
- [GET - /api/inventory/:id](#get---apiinventoryid)
- [PUT - /api/inventory/:id](#put---apiinventoryid)
- [DELETE - /api/inventory/:id](#delete---apiinventoryid)
- [GET - /api/inventory/:id/available](#get---apiinventoryidavailable)
- [POST - /api/inventory/:id/borrow](#post---apiinventoryidborrow)
- [POST - /api/inventory/:id/return](#post---apiinventoryidreturn)

### Media API
- [POST - /api/media/notify/:mediaID](#post---apimedianotifymediaid)
- [POST - /api/media/user/:userID/media/:mediaID](#post---apimediauseruseridmediamediaid)
- [GET - /api/media/user/:userID/](#get---apimediauseruserid)
- [POST - /api/media/user/:userID/record/:id/return](#post---apimediauseruseridrecordidreturn)
- [POST - /api/media/user/:userID/record/:id/renew](#post---apimediauseruseridrecordidrenew)
- [GET - /api/media/user/:userID/media/:mediaID](#get---apimediauseruseridmediamediaid)

### Wishlist API
- [GET - /api/wishlist/user/:userId/media/:mediaId](#get---apiwishlistuseruseridmediamediaid)
- [POST - /api/wishlist/user/:userId/media/:mediaId](#post---apiwishlistuseruseridmediamediaid)
- [GET - /api/wishlist/user/:userId](#get---apiwishlistuseruserid)
- [DELETE - /api/wishlist/user/:userId/record/:id](#delete---apiwishlistuseruseridrecordid)
- [POST - /api/wishlist/media/:mediaId](#post---apiwishlistmediamediaid)

### Notification API
- [POST - /api/notification/send-wishlist](#post---apinotificationsend-wishlist)
- [POST - /api/notification/send-return](#post---apinotificationsend-return)

---

## API Endpoints

### Inventory API

#### **POST** - `/api/inventory`
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

**Response**:
- **Status**: 201 Created
- **Body**:
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

#### **GET** - `/api/inventory`
**Description**: Gets media by search parameters. Includes pagination and filters.

**Headers**:
- `Content-Type`: application/json

**Response**:
- **Status**: 200 OK
- **Body**:
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

#### **GET** - `/api/inventory/:id`
**Description**: Gets media by ID.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `id`: The ID of the media.

**Response**:
- **Status**: 200 OK
- **Body**:
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

#### **PUT** - `/api/inventory/:id`
**Description**: Updates media details by ID.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `id`: The ID of the media.

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

**Response**:
- **Status**: 200 OK
- **Body**:
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

#### **DELETE** - `/api/inventory/:id`
**Description**: Deletes media by ID.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `id`: The ID of the media.

**Response**:
- **Status**: 204 No Content

---

#### **GET** - `/api/inventory/:id/available`
**Description**: Checks availability of the media.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `id`: The ID of the media.

**Response**:
- **Status**: 200 OK
- **Body**:
```json
{
  "available": true
}
```

---

#### **POST** - `/api/inventory/:id/borrow`
**Description**: Marks the media as borrowed. Internal use only.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `id`: The ID of the media.

**Response**:
- **Status**: 200 OK
- **Body**:
```json
{
  "message": "Media borrowed successfully"
}
```

---

#### **POST** - `/api/inventory/:id/return`
**Description**: Marks the media as returned. Internal use only.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `id`: The ID of the media.

**Response**:
- **Status**: 200 OK
- **Body**:
```json
{
  "message": "Media returned successfully"
}
```

---

## API Endpoints - Media Service

### **POST** - `/api/media/notify/:mediaID`
**Description**: Notifies users to return the specified media.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `mediaID` (path parameter): The ID of the media to notify users about.

**Response**:
- **Status**: 200 OK
- **Body**:
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
- **Status**: 201 Created
- **Body**:
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
- **Status**: 200 OK
- **Body**:
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
- **Status**: 200 OK
- **Body**:
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
- **Status**: 200 OK
- **Body**:
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
- **Status**: 200 OK
- **Body**:
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
---
## API Endpoints - Wishlist Service

### **GET** - `/api/wishlist/user/:userId/media/:mediaId`
**Description**: Gets a wishlist record by the specified user ID and media ID. It's used only internally by Inventory Service.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `userId` (path parameter): The ID of the user.
- `mediaId` (path parameter): The ID of the media.

**Response**:
- **Status**: 200 OK
- **Body**:
```json
{
  "_id": "78fhasfhkjh124kj",
  "userId": "2gfhasfhkjh124kj",
  "mediaId": "kjhfg823hhf7hj8v",
  "createdAt": "2024-12-05T00:00:00.000Z"
}
```
---
### **POST** - `/api/wishlist/user/:userId/media/:mediaId`
**Description**: Creates a wishlist record for the specified user ID and media ID

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `userId` (path parameter): The ID of the user.
- `mediaId` (path parameter): The ID of the media.

**Response**:
- **Status**: 201 Created
- **Body**:
```json
{
  "_id": "78fhasfhkjh124kj",
  "userId": "2gfhasfhkjh124kj",
  "mediaId": "kjhfg823hhf7hj8v",
  "createdAt": "2024-12-05T00:00:00.000Z"
}
```
---
### **GET** - `/api/wishlist/user/:userId`
**Description**: Gets all wishlist records by the specified user ID

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `userId` (path parameter): The ID of the user.

**Response**:
- **Status**: 200 OK
- **Body**:
```json
[
  {
  "_id": "78fhasfhkjh124kj",
  "userId": "2gfhasfhkjh124kj",
  "mediaId": "kjhfg823hhf7hj8v",
  "createdAt": "2024-12-05T00:00:00.000Z",
  "media": {...}
  }
]
```

---
### **DELETE** - `/api/wishlist/user/:userId/record/:id`
**Description**: Deletes a wishlist record by the specified record id.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `userId` (path parameter): The ID of the user.
- `id` (path parameter): The ID of the wishlist record.

**Response**:
- **Status**: 204 No-Content
- **Body**:
```json
{
  "message": "Wishlist record deleted successfully."
}
```

---
### **POST** - `/api/wishlist/media/:mediaId`
**Description**: Gets all records by the specified media ID and makes a request to Notification Service to send emails about media availability.

**Headers**:
- `Content-Type`: application/json

**Request Parameters**:
- `mediaId` (path parameter): The ID of the media.

**Response**:
- **Status**: 200 OK
- **Body**:
```json
{
  "message": "Request to Notification Service sent successfully."
}
```
---
## API Endpoints - Notification Service

### **POST** - `/api/notification/send-wishlist`
**Description**: Sends emails to users to notify them that a media object in their wishlist is available now.

**Headers**:
- `Content-Type`: application/json

**Request Body**:
```json
{
  "media": {...},
  "wishlistRecords": [
    {
      "_id": "78fhasfhkjh124kj",
      "userId": "2gfhasfhkjh124kj",
      "mediaId": "kjhfg823hhf7hj8v",
      "createdAt": "2024-12-05T00:00:00.000Z",
      "email": "user.email@example.com"
    }
  ]
}
```

**Response**:
- **Status**: 200 OK
- **Body**:
```json
{
  "message": "Emails sent for all wishlist records."
}
```
---
### **POST** - `/api/notification/send-return`
**Description**: Sends emails to users to notify them that a media object in their wishlist is available now.

**Headers**:
- `Content-Type`: application/json

**Request Body**:
```json
{
  "media": {...},
  "borrowingRecords": [
    {
      "_id": "kljk1241244asdgfg",
      "userId": "asfasfkjlasf12412",
      "mediaId": "218749yh2f189dy1hd",
      "borrowedAt": 1700001000,
      "returnAt": 1700002000,
      "returnedAt": null,
      "email": "user.email@example.com"
    }
  ]
}
```

**Response**:
- **Status**: 200 OK
- **Body**:
```json
{
  "message": "Emails sent for all wishlist records."
}
```