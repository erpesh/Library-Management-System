import { useState } from "react";
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
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function RenewButton({ item, onRenew }) {
  const [newReturnDate, setNewReturnDate] = useState("");

  const handleRenew = () => {
    if (newReturnDate) {
      const selectedDate = new Date(newReturnDate);
      onRenew(item.id, selectedDate); // Use item.id and selected date
      toast.success(`${item.title} has been renewed. New return date: ${selectedDate.toDateString()}`);
    } else {
      toast.error("Please select a new return date.");
    }
  };

  const today = new Date();

  const getFutureDates = (days = 30) => {
    const dates = [];
    for (let i = 0; i <= days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const futureDates = getFutureDates();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline">
          <CalendarIcon className="w-4 h-4 mr-2" /> Renew
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reschedule Return Date</AlertDialogTitle>
          <AlertDialogDescription>
            Select a new return date for "{item.title}". Make sure the new date is within the allowed renewal period.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col items-start p-4">
          <label className="mb-2 text-sm font-medium">New Return Date:</label>
          <select
            className="border rounded p-2 w-full"
            value={newReturnDate}
            onChange={(e) => setNewReturnDate(e.target.value)}
          >
            <option value="" disabled>Select a date</option>
            {futureDates.map((date) => (
              <option key={date.toISOString()} value={date.toISOString()}>
                {date.toDateString()}
              </option>
            ))}
          </select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRenew}>Confirm Renewal</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
