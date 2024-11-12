import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Book,
  ChevronRight,
  Clock,
  Home,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { inventoryApi } from "@/app/api/settings"
import MediaIcon from "@/components/media-icon"


// Fetch media item by ID
async function getMedia(id: string) {
    try {
      const response = await inventoryApi.get(`/${id}`);
      return response.data;
    }
    catch (e) {
      console.error(e)
    }
  }

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const mediaItem = await getMedia(id);
  
  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="flex items-center hover:text-primary">
          <Home className="h-4 w-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/media" className="hover:text-primary">Media</Link>
        <ChevronRight className="h-4 w-4" />
        {/* <Link href={`/media/${mediaItem.mediaType.toLowerCase()}`} className="hover:text-primary">
          {mediaItem.mediaType}
        </Link>
        <ChevronRight className="h-4 w-4" /> */}
        <span className="text-foreground font-medium">{mediaItem.title}</span>
      </nav>

      <div className="grid md:grid-cols-[400px_1fr] gap-8">
        {/* Media Image */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-2">
              <img
                src={mediaItem.imageUrl}
                alt={mediaItem.title}
                className="w-full h-auto rounded-lg"
              />
            </CardContent>
          </Card>
          <Button variant="outline" className="w-full">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Media Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{mediaItem.title}</h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MediaIcon mediaType={mediaItem.mediaType}/>
              <span className="capitalize">{mediaItem.mediaType}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{mediaItem.genre}</span>
            </div>
          </div>

          <div className="grid gap-4 p-6 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-medium">Status</p>
                <p className="text-sm text-muted-foreground">
                  {mediaItem.stock > 0 ? `${mediaItem.stock} copies available` : "Currently unavailable"}
                </p>
              </div>
              <div className="flex items-center text-green-600">
                <Clock className="mr-2 h-4 w-4" />
                {mediaItem.stock - mediaItem.borrowed}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              {/* <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select library branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">Central Library</SelectItem>
                  <SelectItem value="north">North Branch</SelectItem>
                  <SelectItem value="south">South Branch</SelectItem>
                </SelectContent>
              </Select> */}

              <Button className="w-full" disabled={mediaItem.stock === 0}>
                Borrow Now
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About this {mediaItem.mediaType.toLowerCase()}</h2>
            <p className="text-muted-foreground">{mediaItem.description}</p>

            <div className="grid gap-2">
              {mediaItem.author && (
                <div className="flex justify-between">
                  <span className="font-medium">Author</span>
                  <span className="text-muted-foreground">{mediaItem.author}</span>
                </div>
              )}
              {mediaItem.publisher && (
                <div className="flex justify-between">
                  <span className="font-medium">Publisher</span>
                  <span className="text-muted-foreground">{mediaItem.publisher}</span>
                </div>
              )}
              {mediaItem.releaseDate && (
                <div className="flex justify-between">
                  <span className="font-medium">Release Date</span>
                  <span className="text-muted-foreground">
                    {new Date(mediaItem.releaseDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {mediaItem.platform && (
                <div className="flex justify-between">
                  <span className="font-medium">Platform</span>
                  <span className="text-muted-foreground">{mediaItem.platform}</span>
                </div>
              )}
              {mediaItem.artist && (
                <div className="flex justify-between">
                  <span className="font-medium">Artist</span>
                  <span className="text-muted-foreground">{mediaItem.artist}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}