'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Media } from '@/lib/types'
import MediaIcon from '@/components/media-icon'
import {formatUnixTimestampToFullDate} from '@/lib/utils';
import { RenewButton } from '@/components/renew-media-button'
import { ReturnButton } from '@/components/return-media-button'

interface BorrowingHistoryListProps {
  media: Media[]
}

export function BorrowingHistoryList({ media }: BorrowingHistoryListProps) {
  return (
    <motion.div layout className="space-y-4">
      <AnimatePresence>
        {media.map((item) => (
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
                  <Link href={`/media/${item._id}`}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                      unoptimized
                    />
                  </Link>
                </div>
                <div className="flex-grow">
                  <Link href={`/media/${item._id}`} className="hover:underline">
                    <h3 className="font-semibold">{item.title}</h3>
                  </Link>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <MediaIcon mediaType={item.mediaType} className="mr-1" />
                    <span className="capitalize">{item.mediaType}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Borrowed on: {formatUnixTimestampToFullDate(item.borrowingRecord!.BorrowedAt)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.borrowingRecord!.ReturnedAt ? 'Returned on: ' : 'Due on: '}
                    {formatUnixTimestampToFullDate(item.borrowingRecord!.ReturnAt)}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={item.borrowingRecord!.ReturnedAt ? 'secondary' : 'default'}>
                    {item.borrowingRecord!.ReturnedAt ? 'Returned' : 'Borrowed'}
                  </Badge>
                  {!item.borrowingRecord!.ReturnedAt && (
                    <>
                      <RenewButton item={item} />
                      <ReturnButton item={item} />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

