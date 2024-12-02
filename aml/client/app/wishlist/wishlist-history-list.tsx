'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import Link from 'next/link'
import { WishlistRecord } from '@/lib/types' // Importing the types
import MediaIcon from '@/components/media-icon'
import { formatUnixTimestampToFullDate } from '@/lib/utils'
import { RenewButton } from '@/components/renew-media-button'
import { ReturnButton } from '@/components/return-media-button'
import { BorrowButton } from '@/components/borrow-button'
import { WishlistRemoveButton } from '@/components/wishlist-remove-button'

interface WishlistHistoryListProps {
  wishlistRecords: WishlistRecord[]
}

export function WishlistHistoryList({ wishlistRecords }: WishlistHistoryListProps) {
  return (
    <motion.div layout className="space-y-4">
      <AnimatePresence>
        {wishlistRecords.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="flex items-center p-4">
                <div className="mr-4 relative w-[70px] h-[100px]">
                  <Link href={`/media/${item.media._id}`}>
                    <Image
                      src={item.media.imageUrl}
                      alt={item.media.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                      unoptimized
                    />
                  </Link>
                </div>
                <div className="flex-grow">
                  <Link href={`/media/${item.media._id}`} className="hover:underline">
                    <h3 className="font-semibold">{item.media.title}</h3>
                  </Link>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <MediaIcon mediaType={item.media.mediaType} className="mr-1" />
                    <span className="capitalize">{item.media.mediaType}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <BorrowButton item={item.media} />
                  <WishlistRemoveButton item={item} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}