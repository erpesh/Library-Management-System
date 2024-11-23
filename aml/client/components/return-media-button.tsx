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
import axios from "axios"; // Import axios
import { useRouter } from 'next/navigation'
import React from "react";

export function ReturnButton({ item }) {
  const router = useRouter();
  const [isReturned, setIsReturned] = React.useState(false); // Track return state

  const handleReturn = async () => {
    try {
      // Make the API request to return the media using axios
      setIsReturned(true); // Set the state to indicate the return action is in progress

      await axios.post(`/api/media/${item.id}/return`);


      toast.success(`Successfully returned "${item.title}"`); // Display success toast
      router.refresh(); // Refresh the page to reflect the changes
    } catch (error) {
      console.error(error);
      toast.error('Failed to return the item'); // Display error toast
    } finally {
      setIsReturned(false); // Reset the state after the process
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
