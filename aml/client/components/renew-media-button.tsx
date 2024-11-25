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

export function RenewButton({ item }) {
  const router = useRouter();
  const [newReturnDate, setNewReturnDate] = useState(""); // State for the selected new return date
  const [isRenewing, setIsRenewing] = useState(false);
  const [startDate, setStartDate] = useState(""); // State for the parsed original return date

  // Parse the ReturnAt Unix timestamp into a valid date object
  useEffect(() => {
    if (item.borrowingRecord?.ReturnAt) {
      const timestamp = item.borrowingRecord.ReturnAt * 1000; // Convert Unix timestamp to milliseconds
      const parsedDate = new Date(timestamp);
      const formattedDate = parsedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD for the date input
      setStartDate(formattedDate); // Set startDate
      setNewReturnDate(formattedDate); // Set default newReturnDate to the original return date
    }
  }, [item.borrowingRecord?.ReturnAt]);

  // Handle renewing the item with the selected return date
  const handleRenew = async () => {
    if (!newReturnDate) {
      toast.error("Please select a new return date.");
      return;
    }

    try {
      setIsRenewing(true);

      // Convert the new return date to a Unix timestamp
      const newReturnTimestamp = new Date(newReturnDate).getTime() / 1000; // Convert to Unix timestamp (seconds)
      // Make the API request to renew the media
      await axios.post(`/api/media/${item.id}/renew`, {
        newReturnDate: newReturnTimestamp, // Send the timestamp to the backend
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
            or after the original return date "{item.returnDate?.split('T')[0]}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col items-start p-4">
          <label className="mb-2 text-sm font-medium">New Return Date:</label>
          <input
            type="date"
            className="border rounded p-2 w-full"
            min={startDate} // Ensure the date cannot be before the original return date
            value={newReturnDate || item.returnDate?.split('T')[0]} // Format to YYYY-MM-DD
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
