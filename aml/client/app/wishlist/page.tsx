'use client'

import { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Book, Disc, Gamepad } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { toast, Toaster } from 'sonner'

// Media TypeScript Interface
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

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
}

// WishlistItem Component
const WishlistItem = ({
  item,
  onRemove,
  onBorrow
}: {
  item: Media
  onRemove: (id: string) => void
  onBorrow: (id: string) => void
}) => (
  <motion.div
    key={item._id}
    variants={itemVariants}
    exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
    className="hover:shadow-md transition-all duration-300"
  >
    <Card className="border-0 shadow-none">
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
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=96&width=64"
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
            {item.author || item.artist || item.publisher || "Unknown"}
          </p>
          <Badge variant="secondary" className="mt-2">{item.genre}</Badge>
        </div>
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-28"
            onClick={() => onRemove(item._id)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Remove
          </Button>
          <Button
            variant="default"
            size="sm"
            className="w-28"
            onClick={() => onBorrow(item._id)}
          >
            Borrow
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Media[]>([])

  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist')
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist))
    } else {
      // Set default example data if no wishlist is stored in localStorage
      const exampleData = [
        {
          _id: "1",
          title: "The Great Gatsby",
          mediaType: "book",
          genre: "Classic",
          releaseDate: new Date(),
          stock: 5,
          description: "A novel by F. Scott Fitzgerald.",
          imageUrl: "https://via.placeholder.com/150",
          borrowed: 0,
          author: "F. Scott Fitzgerald",
          createdAt: new Date(),
        },
        {
          _id: "2",
          title: "1984",
          mediaType: "book",
          genre: "Dystopian",
          releaseDate: new Date(),
          stock: 3,
          description: "A novel by George Orwell.",
          imageUrl: "https://via.placeholder.com/150",
          borrowed: 0,
          author: "George Orwell",
          createdAt: new Date(),
        },
      ]
      setWishlistItems(exampleData)
      localStorage.setItem("wishlist", JSON.stringify(exampleData))
    }
  }, [])

  const removeFromWishlist = (id: string) => {
    const updatedWishlist = wishlistItems.filter(item => item._id !== id)
    setWishlistItems(updatedWishlist)
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
    toast.success("Item removed from your wishlist")
  }

  const borrowItem = (id: string) => {
    const itemToBorrow = wishlistItems.find(item => item._id === id)
    if (itemToBorrow) {
      // Remove from wishlist
      const updatedWishlist = wishlistItems.filter(item => item._id !== id)
      setWishlistItems(updatedWishlist)
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
      
      // Optionally, you could also save this borrowed item to another list in localStorage
      toast.success("Item added to your borrowed items")
    }
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
      <ScrollArea className="h-[calc(100vh-200px)] w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 p-4"
        >
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <WishlistItem
                key={item._id}
                item={item}
                onRemove={removeFromWishlist}
                onBorrow={borrowItem}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
      <Toaster />
    </motion.div>
  )
}

