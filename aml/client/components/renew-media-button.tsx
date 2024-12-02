import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { Media } from "@/lib/types";
import {formatUnixTimestamp} from '@/lib/utils';

interface Props {
  item: Media;
}

export function RenewButton({ item }: Props) {
  const router = useRouter();
  const [newReturnDate, setNewReturnDate] = useState("");
  const [isRenewing, setIsRenewing] = useState(false);
  const [startDate, setStartDate] = useState("");

  

  useEffect(() => {
    if (item.borrowingRecord?.ReturnAt) {
      const timestamp = item.borrowingRecord.ReturnAt * 1000;
      const parsedDate = new Date(timestamp);
      const formattedDate = parsedDate.toISOString().split("T")[0];
      setStartDate(formattedDate);
      setNewReturnDate(formattedDate);
    }
  }, [item.borrowingRecord?.ReturnAt]);

  const handleRenew = async () => {
    if (!newReturnDate) {
      toast.error("Please select a new return date.");
      return;
    }

    try {
      setIsRenewing(true);

      const newReturnTimestamp = new Date(newReturnDate).getTime() / 1000; 
      await axios.post(`/api/media/${item.borrowingRecord?.ID}/renew`, {
        newReturnDate: newReturnTimestamp,
      });

      toast.success(
        `${item.title} has been renewed. New return date: ${new Date(
          newReturnTimestamp * 1000
        ).toDateString()}`
      );
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to renew the item");
    } finally {
      setIsRenewing(false);
    }
  };

  if (!item.borrowingRecord) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={isRenewing}>
          <CalendarIcon className="w-4 h-4 mr-2" /> Renew
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reschedule Return Date</AlertDialogTitle>
          <AlertDialogDescription>
            Select a new return date for "{item.title}". The new date must be on
            or after the original return date "{formatUnixTimestamp(item.borrowingRecord?.ReturnAt)}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col items-start p-4">
          <label className="mb-2 text-sm font-medium">New Return Date:</label>
          <input
            type="date"
            className="border rounded p-2 w-full"
            min={startDate}
            value={newReturnDate || formatUnixTimestamp(item.borrowingRecord?.ReturnAt)}
            onChange={(e) => setNewReturnDate(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRenew}>
            Confirm Renewal
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
