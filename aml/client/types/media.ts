export interface Media {
    _id: string;
    title: string;
    mediaType: 'book' | 'cd' | 'game';  // Restricted to specific values
    genre: string;
    releaseDate: Date;
    stock: number;
    description: string;
    imageUrl: string;
    borrowed: number;
    author?: string | null;  // Optional field
    publisher?: string | null;
    platform?: string | null;  // Optional, can be null
    artist?: string | null;  // Optional, can be null
    createdAt: Date;
}
