'use client'

import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { Media } from '@/types/media'

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
  const { toast } = useToast()
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
    toast({
      title: "Item removed",
      description: "The item has been removed from your wishlist.",
      variant: "destructive",
    })
  }

  const borrowItem = (id: string) => {
    console.log(`Borrowing item ${id}`)
    toast({
      title: "Item borrowed",
      description: "The item has been added to your borrowed items.",
    })
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
      <ScrollArea className="h-[600px] w-full rounded-md border border-primary/20 bg-secondary/30">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
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
                className="flex items-center justify-between py-4 px-6 border-b last:border-b-0 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="relative w-16 h-24 overflow-hidden rounded-md shadow-md"
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
                  <div>
                    <motion.p 
                      className="text-lg font-medium leading-none text-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {item.title}
                    </motion.p>
                    <motion.p 
                      className="text-sm text-muted-foreground mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {item.mediaType}
                    </motion.p>
                    <motion.p 
                      className="text-sm text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {item.author || item.artist || item.publisher}
                    </motion.p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-28 bg-background hover:bg-background border-destructive text-destructive hover:text-destructive flex items-center justify-center gap-2"
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Remove
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="w-28 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
                      onClick={() => borrowItem(item._id)}
                    >
                      Borrow
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
    </motion.div>
  )
}