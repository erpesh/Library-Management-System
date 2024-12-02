import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from 'next/navigation'
import React from "react";
import { WishlistRecord } from "@/lib/types";
import { Trash } from "lucide-react";


interface Props {
  item: WishlistRecord;
}

export function WishlistRemoveButton({ item }: Props) {
  const router = useRouter();

  const removeFromWishlist = async () => {
    try {
      const response = await axios.delete(`/api/wishlist/${item._id}`);
      
      toast.success(`Successfully removed from wishlist`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove the item from wishlist');
    }
  };
  return (
    <Button variant='outline' onClick={removeFromWishlist}>
      <Trash className="h-4 w-4" />
      Remove
    </Button>
  )
}
