import { Button } from "@/components/ui/button"
import { inventoryApi } from '../api/settings'
import {Media, MediaSearchResponse} from '@/lib/types';
import { SearchIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Checkbox } from '@radix-ui/react-checkbox'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import MediaCard from '@/components/media-card'
import SearchInput from "./search-input";
import MediaSelect from "./media-select";
import GenreSelect from "./genre-select";

async function getMedia(filters: { [key: string]: string | string[] | undefined }): Promise<MediaSearchResponse | undefined> {
  try {
    // Construct query parameters from filters
    const queryParams = new URLSearchParams();

    // Iterate through the filters and append them to the query parameters
    for (const key in filters) {
      const value = filters[key];
      if (value !== undefined) {
        // If the value is an array, append each item as a separate query parameter
        if (Array.isArray(value)) {
          value.forEach(val => queryParams.append(key, val));
        } else {
          queryParams.append(key, value);
        }
      }
    }

    // Make the API request with the constructed query string
    const response = await inventoryApi.get(`/?${queryParams.toString()}`);
    return response.data;
  } catch (e) {
    console.error(e);
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams);


  const response = await getMedia(filters);
  const mediaItems = response?.mediaItems;

  return (
    <div className="container mx-auto py-6">
      <SearchInput />
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-6">
          <MediaSelect/>
          <GenreSelect/>
        </aside>
        <main className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaItems ? mediaItems.map((item: Media) => (
              <MediaCard media={item} />
            )) : <div>No results!</div>}
          </div>

          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </div>
    </div>
  )
}