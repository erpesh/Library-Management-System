import { toast } from 'sonner'
import { mediaApi } from '../api/settings'
import { getCurrentUser } from '@/lib/auth'
import { Media } from '@/lib/types'
import { redirect } from 'next/navigation'
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
    console.log('Failed to fetch media with borrowing records');
    return
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Borrowing History</h1>
      <BorrowingHistoryList media={media} />
    </div>
  )
}