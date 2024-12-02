import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { mediaApi } from '../api/settings'
import { getCurrentUser } from '@/lib/auth'
import { Media } from '@/lib/types'
import { redirect } from 'next/navigation'
import MediaIcon from '@/components/media-icon'
import { BorrowingHistoryList } from './borrowing-history-list'

async function getMediaWithBorrowingRecords(userId: string): Promise<Media[] | null> {
  try {
    const response = await mediaApi.get(`/user/${userId}`);
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/signin');
  }

  const media = await getMediaWithBorrowingRecords(user.id);

  if (!media) {
    toast.error('Failed to fetch borrowing history');
    return
  }

  console.log(media)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Borrowing History</h1>

      {/* <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search borrowed items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button><Search className="w-4 h-4 mr-2" /> Search</Button>
      </div> */}

      <BorrowingHistoryList media={media} />
    </div>
  )
}