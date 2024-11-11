import Image from 'next/image'
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { inventoryApi } from '../api/settings'
import { Media } from '@/types/media'
import { BookIcon, DiscIcon, GamepadIcon, SearchIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Checkbox } from '@radix-ui/react-checkbox'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'

async function getMedia() {
  try {
    const response = await inventoryApi.get('/');
    return response.data;
  }
  catch (e) {
    console.error(e)
  }
}

export default async function BrowseMediaPage() {
  const mediaItems = await getMedia();

  return (
    <div className="container mx-auto py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Media Library Search</h1>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search..."
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button><SearchIcon className="w-4 h-4 mr-2" /> Search</Button>
        </div>
      </header>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Media Type</h2>
            <Select
            // onValueChange={(value) => setSelectedType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="book">Books</SelectItem>
                <SelectItem value="cd">CDs</SelectItem>
                <SelectItem value="game">Games</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Genres</h2>
            <div className="space-y-2">
              {['Classic', 'Pop', 'Adventure', 'Rock', 'Action'].map((genre) => (
                <label key={genre} className="flex items-center space-x-2">
                  <Checkbox
                  // checked={selectedGenres.includes(genre)}
                  // onCheckedChange={(checked) => {
                  //   if (checked) {
                  //     setSelectedGenres([...selectedGenres, genre])
                  //   } else {
                  //     setSelectedGenres(selectedGenres.filter(g => g !== genre))
                  //   }
                  // }}
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Availability</h2>
            <label className="flex items-center space-x-2">
              <Checkbox
              // checked={isAvailable}
              // onCheckedChange={(checked) => setIsAvailable(checked)}
              />
              <span>Show only available items</span>
            </label>
          </div>
        </aside>

        <main className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaItems.map((item: Media) => (
              <Link href={`/media/${item._id}`}>
                <Card key={item._id} className="overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {item.stock == item.borrowed && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                        Not Available
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <div className="flex items-center mb-2">
                      {/* {item.type === 'book' && <BookIcon className="w-4 h-4 mr-2" />}
                    {item.type === 'cd' && <DiscIcon className="w-4 h-4 mr-2" />}
                    {item.type === 'game' && <GamepadIcon className="w-4 h-4 mr-2" />} */}
                      <BookIcon className="w-4 h-4 mr-2" />
                      <span className="capitalize">Book</span>
                      {/* <span className="capitalize">{item.type}</span> */}

                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {/* {item.author || item.artist || item.platform} */}
                      Author
                    </p>
                    <Badge variant="secondary" className='capitalize'>{item.genre}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
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