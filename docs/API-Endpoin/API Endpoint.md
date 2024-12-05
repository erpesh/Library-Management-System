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

## API Endpoints

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
