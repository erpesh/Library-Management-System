import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {MediaType, Genre} from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const genres: Genre[] = [
  {
      type: 'book',
      genres: [
          'Fiction',
          'Mystery',
          'Thriller',
          'Fantasy',
          'Science Fiction',
          'Romance',
          'Historical Fiction',
          'Horror',
          'Adventure',
          'Drama',
          'Non-fiction',
          'Biography',
          'Self-help',
          'True Crime',
          'Psychology',
          'Philosophy',
          'Business',
          'Politics',
          'Science',
          'Travel',
          'Cooking',
          'Health',
          'Religion',
          'Poetry',
          'Graphic Novels',
          'Comics',
      ]
  },
  {
      type: 'cd',
      genres: [
          'Pop',
          'Rock',
          'Classical',
          'Jazz',
          'Hip-Hop',
          'R&B',
          'Country',
          'Blues',
          'Electronic',
          'Reggae',
          'Punk',
          'Soul',
          'Folk',
          'Indie',
          'Alternative',
          'Metal',
          'Dance',
          'Gospel',
          'Techno',
          'Latin',
          'Soundtrack',
      ]
  },
  {
      type: 'game',
      genres: [
          'Action',
          'Adventure',
          'Role-Playing',
          'Shooter',
          'Strategy',
          'Simulation',
          'Sports',
          'Racing',
          'Puzzle',
          'Fighting',
          'Horror',
          'Platformer',
          'Multiplayer',
          'Open-World',
          'Survival',
          'Stealth',
          'Rhythm',
          'MOBA',
          'Battle Royale',
          'Simulation',
          'Visual Novel',
      ]
  }
];

export const getGenresForType = (type: MediaType): string[] => {
  const genreData = genres.find((genre) => genre.type === type);
  return genreData ? genreData.genres : [];
}

export const getAllGenres = (): string[] => {
  const allGenresSet = new Set<string>();
  genres.forEach((genreCategory) => {
      genreCategory.genres.forEach((genre) => {
          allGenresSet.add(genre);
      });
  });
  return Array.from(allGenresSet).sort();
}
