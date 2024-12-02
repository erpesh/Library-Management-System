import { toast } from 'sonner'
import { mediaApi, wishlistApi } from '../api/settings'
import { getCurrentUser } from '@/lib/auth'
import { Media, WishlistRecord } from '@/lib/types'
import { redirect } from 'next/navigation'
import { BorrowingHistoryList } from './borrowing-history-list'
import { WishlistHistoryList } from './wishlist-history-list'

async function getWishlistMedia(userId: string): Promise<WishlistRecord[] | null> {
  try {
    const response = await wishlistApi.get(`/user/${userId}`);
    console.log(response.data);
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

  const wishlistRecords = await getWishlistMedia(user.id);

  if (!wishlistRecords) {
    // toast.error('Failed to fetch wishlist media');
    return
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Wishlist</h1>
      <WishlistHistoryList wishlistRecords={wishlistRecords} />
    </div>
  )
}