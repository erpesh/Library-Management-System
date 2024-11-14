'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Clock, Home, Pencil, Share2 } from "lucide-react";
import Link from "next/link";
import { inventoryApi } from "@/app/api/settings";

// Fetch media item by ID
async function getMedia(id: string) {
  try {
    const response = await inventoryApi.get(`/${id}`);
    return response.data;
  } catch (e) {
    console.error(e);
  }
}

// Page component
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const mediaItem = await getMedia(id); // Fetch media item
  console.log(mediaItem);

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
        <span className="text-foreground font-medium">{mediaItem.title}</span>
      </nav>

      {/* Media Content */}
      <div className="grid md:grid-cols-[400px_1fr] gap-8">
        {/* Media Image and Edit Button */}
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

          {/* Edit Image button */}
          <Button variant="outline" className="w-full">
            <Share2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>

        {/* Media Details Section */}
        <div className="space-y-6">
          {/* Media Status */}
          <div className="grid gap-4 p-6 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-medium">Status</p>
                <p className="text-sm text-muted-foreground">
                  {mediaItem.stock > 0
                    ? `${mediaItem.stock} copies available`
                    : "Currently unavailable"}
                </p>
              </div>
              <div className="flex items-center text-green-600">
                <Clock className="mr-2 h-4 w-4" />
                {mediaItem.stock - mediaItem.borrowed}
              </div>
            </div>

            <Separator />
            {/* Edit and Delete Buttons */}
            <div className="space-y-2">
              <Button className="w-full" disabled={mediaItem.stock === 0}>
                Edit Stock Amount
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-100"
                disabled={mediaItem.stock === 0}
              >
                Delete Media
              </Button>
            </div>
          </div>

          {/* Media Attributes Card */}
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">
                {mediaItem.mediaType} Details
              </h2>

              {/* Media Attributes with Edit Buttons */}
              <div className="grid gap-4">
                {/* Media Item Attribute */}
                {[
                  { label: `${mediaItem.mediaType} Name`, value: mediaItem.title },
                  { label: "Genre", value: mediaItem.genre },
                  { label: "Type", value: mediaItem.mediaType },
                  { label: "Author", value: mediaItem.author },
                  { label: "Publisher", value: mediaItem.publisher },
                  { label: "Description", value: mediaItem.description },
                  { label: "Release Date", value: new Date(mediaItem.releaseDate).toLocaleDateString() },
                  { label: "Platform", value: mediaItem.platform },
                  { label: "Artist", value: mediaItem.artist },
                ].map((attribute, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium text-muted-foreground">{attribute.label}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-foreground">{attribute.value}</span>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
