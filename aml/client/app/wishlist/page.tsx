'use client'

import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Book, Disc, Gamepad } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { toast, Toaster } from 'sonner'

interface Media {
  _id: string
  title: string
  mediaType: 'book' | 'cd' | 'game'
  genre: string
  releaseDate: Date
  stock: number
  description: string
  imageUrl: string
  borrowed: number
  author?: string
  artist?: string
  publisher?: string
  platform?: string
  createdAt: Date
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Media[]>([
    { 
      _id: '1', 
      title: "The Great Gatsby", 
      mediaType: "book",
      genre: "Classic",
      releaseDate: new Date("1925-04-10"),
      stock: 5,
      description: "A novel by F. Scott Fitzgerald",
      imageUrl: "https://example.com/great-gatsby-cover.jpg",
      borrowed: 2,
      author: "F. Scott Fitzgerald",
      publisher: "Charles Scribner's Sons",
      createdAt: new Date()
    },
    { 
      _id: '2', 
      title: "Inception", 
      mediaType: "cd",
      genre: "Soundtrack",
      releaseDate: new Date("2010-07-13"),
      stock: 3,
      description: "Original motion picture soundtrack",
      imageUrl: "https://example.com/inception-soundtrack.jpg",
      borrowed: 1,
      artist: "Hans Zimmer",
      createdAt: new Date()
    },
    { 
      _id: '3', 
      title: "The Legend of Zelda: Breath of the Wild", 
      mediaType: "game",
      genre: "Action-Adventure",
      releaseDate: new Date("2017-03-03"),
      stock: 2,
      description: "An open-world action-adventure game",
      imageUrl: "https://example.com/botw-cover.jpg",
      borrowed: 1,
      platform: "Nintendo Switch",
      publisher: "Nintendo",
      createdAt: new Date()
    },
  ])

  const removeFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item._id !== id))
    toast.success("Item removed from your wishlist")
  }

  const borrowItem = (id: string) => {
    console.log(`Borrowing item ${id}`)
    toast.success("Item added to your borrowed items")
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-4xl font-bold mb-6 text-primary"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        Your Wishlist
      </motion.h1>
      <ScrollArea className="h-[600px] w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 p-4"
        >
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div 
                key={item._id} 
                variants={itemVariants}
                exit={{ 
                  opacity: 0, 
                  x: -100, 
                  transition: { duration: 0.3 } 
                }}
                className='hover:shadow-md transition-all duration-300'
              >
                <Card>
                  <CardContent className="flex items-center p-4">
                    <motion.div 
                      className="relative w-16 h-24 mr-4 overflow-hidden rounded-md shadow-md"
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        style={{ objectFit: "cover" }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=96&width=64";
                        }}
                        unoptimized
                      />
                    </motion.div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        {item.mediaType === 'book' && <Book className="w-4 h-4 mr-1" />}
                        {item.mediaType === 'cd' && <Disc className="w-4 h-4 mr-1" />}
                        {item.mediaType === 'game' && <Gamepad className="w-4 h-4 mr-1" />}
                        <span className="capitalize">{item.mediaType}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.author || item.artist || item.publisher}
                      </p>
                      <Badge variant="secondary" className="mt-2">{item.genre}</Badge>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-28"
                        onClick={() => removeFromWishlist(item._id)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                      <Button
                        size="sm"
                        className="w-28"
                        onClick={() => borrowItem(item._id)}
                      >
                        Borrow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
      <Toaster />
    </motion.div>
  )
}