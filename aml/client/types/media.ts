export interface Media {
    _id: string;
    title: string;
    description: string;
    genre: string;
    releaseDate: Date;
    imageUrl: string;
    stock: number;
    borrowed: number;
    createdAt: Date;
}
