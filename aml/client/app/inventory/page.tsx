import Image from 'next/image'
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { inventoryApi } from '../api/settings'

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Browse Media</h1>
        <Button asChild>
          <Link href={`/inventory/add`}>Add Media</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mediaItems.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                  unoptimized
                />
              </div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <Badge variant="secondary" className="mb-2">
                {item.genre}
              </Badge>
              <p className="text-sm text-muted-foreground mb-2">
                Released: {new Date(item.releaseDate).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/media/${item._id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}