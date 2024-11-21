export type MediaType = 'book' | 'cd' | 'game';

export interface Media {
    _id: string;
    title: string;
    mediaType: MediaType;
    genre: string;
    releaseDate: Date;
    stock: number;
    description: string;
    imageUrl: string;
    borrowed: number;
    author?: string | undefined;  // Optional field
    publisher?: string | undefined;
    platform?: string | undefined;  // Optional, can be null
    artist?: string | undefined;  // Optional, can be null
    createdAt: Date;
    isBorrowed?: boolean | undefined;
    borrowingRecord?: BorrowingRecord
}

export interface MediaSearchResponse {
    mediaItems: Media[],
    page: number,
    perPage: number,
    totalItems: number,
    totalPages: number
}

export interface BorrowingRecord {
    ID: string;         // MongoDB ObjectId (usually a string)
    MediaID: string;    // MongoDB ObjectId (usually a string)
    UserID: number;     // UserID as an integer
    BorrowedAt: number; // Unix timestamp (number)
    ReturnAt: number;   // Unix timestamp (number)
}

export interface Genre {
    type: MediaType;
    genres: string[];
}