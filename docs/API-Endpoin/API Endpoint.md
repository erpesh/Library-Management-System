# API Endpoint 

**Endpoint**:
[HTTP Method] /api/[resource]  
**Description**: [Brief description of what the endpoint does]  
**Headers**:

- `Authorization`: Bearer [token] (required if the endpoint is protected)

- `Content-Type`: application/json

**Query Parameters** (for `GET` requests only):

- `param_name` (type: string, required/optional): Description of the query parameter.

**Request Body** (for `POST`, `PUT`, `PATCH` requests):

```json
{
  "field_name": "value" 
}
```

## API Endpoints - Inventory API

This `POST` endpoint is used for adding new media.  
**Endpoint**: POST /api/inventory  
**Description**: Add a new media to the inventory database.

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
  "platform": null,
  "artist": null,
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
  "platform": null,
  "artist": null,
  "createdAt": "2024-12-05T00:00:00.000Z"
}

```

This `GET` endpoint is used to get media by its own unique id.  
**Endpoint**: GET /api/inventory/:id
**Description**: Get media by its own unique id from the inventory database.

**Headers**:

- `Content-Type`: application/json

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
  "platform": null,
  "artist": null,
  "createdAt": "2024-12-05T00:00:00.000Z"
}

```

This `PUT` endpoint is used for updating existing media.  
**Endpoint**: PUT /api/inventory/:id 
**Description**: Update an existing media to the inventory database.

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
  "platform": null,
  "artist": null,
  "createdAt": "2024-12-05T00:00:00.000Z"
}
```

***Response***:

- Status: 200 OK
- Body:

```json
{
  "updatedResource": {
    "_id": "218749yh2f189dy1hd",
    "title": "The Great Gatsby (Updated)",
    "mediaType": "book",
    "genre": "Classic",
    "releaseDate": "1925-04-10T00:00:00.000Z",
    "stock": 8,
    "description": "Updated description.",
    "imageUrl": "https://example.com/greatgatsby-updated.jpg",
    "borrowed": 2,
    "author": "F. Scott Fitzgerald",
    "publisher": "Charles Scribner's Sons",
    "platform": null,
    "artist": null,
    "createdAt": "2024-12-05T00:00:00.000Z"
  }
}

```
This `DELETE` endpoint is used for deleting existing media.  
**Endpoint**: POST /api/inventory/:id 
**Description**: Deleting an existing media from the inventory database.

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
  "platform": null,
  "artist": null,
  "createdAt": "2024-12-05T00:00:00.000Z"
}
```

***Response***:

- Status: 204 No Content
- Body:

```json
{
  "deletedResource": {
    "_id": "218749yh2f189dy1hd",
    "title": "The Great Gatsby",
    "mediaType": "book"
  }
}

```
This `GET` endpoint is used for checking media availability.  
**Endpoint**: GET /api/inventory/:id/available
**Description**: Checking availability of the media from the inventory database.

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
  "platform": null,
  "artist": null,
  "createdAt": "2024-12-05T00:00:00.000Z"
}
```

***Response***:

- Status: 204 No Content
- Body:

```json
{
  "available": true;
}

```
This `POST` endpoint is used for borrowing media.  
**Endpoint**: POST /api/inventory/:id/borrow  
**Description**: Borrow a media from the inventory database.

**Headers**:

- `Content-Type`: application/json

***Response***:

- Status: 200 OK
- Body:

```json
{
 message: 'Media borrowed successfully' 
}

```
This `POST` endpoint is used for returning media.  
**Endpoint**: POST /api/inventory/:id/return  
**Description**: Return a media to the inventory database.

**Headers**:

- `Content-Type`: application/json

***Response***:

- Status: 200 OK
- Body:

```json
{
 message: 'Media returned successfully' 
}

```

