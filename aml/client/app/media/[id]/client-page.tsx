'use client'

import * as React from 'react'
import { Media } from "@/lib/types"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ReturnButton } from '@/components/return-media-button'
import { RenewButton } from '@/components/renew-media-button'
import {
    ChevronRight,
    Clock,
    Edit,
    Heart,
    Home,
    Loader2,
    Share2,
} from "lucide-react"
import Link from "next/link"
import MediaIcon from "@/components/media-icon"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { BorrowButton } from '@/components/borrow-button'
import { WishlistButton } from '@/components/wishlist-button'
import { WishlistRemoveButton } from '@/components/wishlist-remove-button'

interface Props {
    media: Media
}

export default function ClientPage({ media }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto p-4"
        >
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                <Link href="/" className="flex items-center hover:text-primary">
                    <Home className="h-4 w-4 mr-1" />
                    Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/media" className="hover:text-primary">Media</Link>
                <ChevronRight className="h-4 w-4" />
                <span
                    className="text-foreground font-medium"
                >
                    {media.title}
                </span>
            </nav>

            <div className="grid md:grid-cols-[400px_1fr] gap-8">
                {/* Media Image */}
                <motion.div
                    layoutId={`image-container-${media._id}`}
                    className="space-y-4"
                >
                    <Card>
                        <CardContent className="p-2">
                            <motion.div layoutId={`image-${media._id}`}>
                                <img
                                    src={media.imageUrl}
                                    alt={media.title}
                                    className="w-full h-auto rounded-lg"
                                />
                            </motion.div>
                        </CardContent>
                    </Card>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Button variant="outline" className="w-full">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Media Details */}
                <div className="space-y-6">
                    <div>
                        <div className="mb-2 flex justify-between w-full">
                            <h1 className="text-3xl">
                                {media.title}
                            </h1>
                            <Link href={`/media/${media._id}/edit`} className="flex items-center text-primary hover:text-primary/80 transition-colors">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                            </Link>
                        </div>
                        <motion.div
                            layoutId={`type-${media._id}`}
                            className="flex items-center space-x-2 text-muted-foreground"
                        >
                            <MediaIcon mediaType={media.mediaType} />
                            <span className="capitalize">{media.mediaType}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <motion.span layoutId={`genre-${media._id}`}>{media.genre}</motion.span>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid gap-4 p-6 border rounded-lg bg-card"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-lg font-medium">Status</p>
                                <p className="text-sm text-muted-foreground">
                                    {media.stock > 0 ? `${media.stock} copies available` : "Currently unavailable"}
                                </p>
                            </div>
                            <div className="flex items-center text-green-600">
                                <Clock className="mr-2 h-4 w-4" />
                                {media.stock - media.borrowed}
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2 flex justify-end items-end gap-4">
                            {media.isBorrowed ? (
                                <>
                                    <ReturnButton item={media} />
                                    <RenewButton item={media} />
                                </>
                            ) : (
                                <BorrowButton item={media} />
                            )}
                            {media.wishlistRecord ? (
                                <WishlistRemoveButton item={media.wishlistRecord}/>
                            ) : (
                                <WishlistButton item={media} />
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl font-semibold">About this {media.mediaType.toLowerCase()}</h2>
                        <p className="text-muted-foreground">{media.description}</p>

                        <div className="grid gap-2">
                            {media.author && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Author</span>
                                    <span className="text-muted-foreground">{media.author}</span>
                                </div>
                            )}
                            {media.publisher && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Publisher</span>
                                    <span className="text-muted-foreground">{media.publisher}</span>
                                </div>
                            )}
                            {media.releaseDate && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Release Date</span>
                                    <span className="text-muted-foreground">
                                        {new Date(media.releaseDate).toDateString().split(' ').slice(1).join(' ')}
                                    </span>
                                </div>
                            )}
                            {media.platform && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Platform</span>
                                    <span className="text-muted-foreground">{media.platform}</span>
                                </div>
                            )}
                            {media.artist && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Artist</span>
                                    <span className="text-muted-foreground">{media.artist}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}