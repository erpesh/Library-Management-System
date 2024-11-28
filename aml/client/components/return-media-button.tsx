import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from 'next/navigation'
import React from "react";
import { Media } from "@/lib/types";


interface Props {
  item: Media;
}

export function ReturnButton({ item }: Props) {
  const router = useRouter();
  const [isReturned, setIsReturned] = React.useState(false);

  const handleReturn = async () => {
    try {
      setIsReturned(true);

      await axios.post(`/api/media/${item.borrowingRecord?.ID}/return`);

      toast.success(`Successfully returned "${item.title}"`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to return the item');
    } finally {
      setIsReturned(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={isReturned}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Return
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will mark "{item.title}" as returned. You won't be able to undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReturn}>Confirm Return</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
