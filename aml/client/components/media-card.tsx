'use client'

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Media } from '@/lib/types';
import Link from 'next/link';
import MediaIcon from './media-icon';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion'


interface Props {
    media: Media
}

export default function MediaCard({ media }: Props) {
    return (
        <Link href={`/media/${media._id}`} key={media._id}>
            <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative will-change-transform">
                <motion.div className='relative h-64' layoutId={`image-${media._id}`}>
                    <img
                        src={media.imageUrl}
                        alt={media.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {media.stock === media.borrowed && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                            Not Available
                        </div>
                    )}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() => {/* Add to wishlist functionality */ }}
                    >
                        <Heart className="h-4 w-4" />
                        <span className="sr-only">Add to wishlist</span>
                    </Button>
                </motion.div>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{media.title}</h3>
                    <div className="flex items-center mb-2">
                        <MediaIcon mediaType={media.mediaType} className='mr-2' />
                        <span className="capitalize">{media.mediaType}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                        {media.author || media.artist || media.publisher}
                    </p>
                    <Badge variant="secondary" className='capitalize'>{media.genre}</Badge>
                </CardContent>
            </Card>
        </Link>
    )
}