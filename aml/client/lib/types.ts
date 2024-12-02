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
    borrowingRecord?: BorrowingRecord;
}

export interface MediaSearchResponse {
    mediaItems: Media[],
    page: number,
    perPage: number,
    totalItems: number,
    totalPages: number
}

export interface BorrowingRecord {
    ID: string;
    MediaID: string;
    UserID: string;
    BorrowedAt: number; // Unix timestamp (number)
    ReturnAt: number;   // Unix timestamp (number)
    ReturnedAt: number; // Unix timestamp (number)
}

export interface WishlistRecord {
    _id: string;
    mediaId: string;
    userId: string;
    createdAt: number;
    media: Media;
}

export interface Genre {
    type: MediaType;
    genres: string[];
}