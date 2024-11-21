'use client'
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


// Function to handle the deletion request (calls the DELETE API endpoint)

async function deleteMediaItem(id: string) {
  try {
    const response = await axios.delete(`/api/media/${id}`); 
    console.log("after response ", response)

   return{ success : response.status >= 200 && response.status < 300, message: "Media item deleted successfully"}
  } catch (error) {
    console.error("Error deleting media item:", error);
    return { success: false, message: "Network error. Please try again later." };
  }
}

// DeleteMedia Component
export default function DeleteMedia({ mediaId }: { mediaId: string }) {
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode
  const [isConfirmed, setIsConfirmed] = useState(false); // State to track if the delete is confirmed
  const [isDeleting, setIsDeleting] = useState(false); // State to track if the delete request is in progress
  const [error, setError] = useState<string | null>(null); // State to track error if any

    const router = useRouter();

  // Handle delete action
  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple delete requests

    setIsDeleting(true); // Set deleting state to true to disable button

    const { success, message } = await deleteMediaItem(mediaId);
    console.log("success", success)
    if (success) {
      setIsConfirmed(true); // Mark as confirmed
      setIsEditing(false); // Exit edit mode
      alert("Media item has been deleted successfully!"); // Show a success popup
      router.push("/media")
      // Optionally, you can redirect the user or show a success message
    } else {
      setError(message || "There was an error deleting the media item.");
    }

    setIsDeleting(false); // Reset deleting state
  };

  return (
    <div className="space-y-2">
      {isEditing ? (
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-red-600">Are you sure you want to delete this media item?</p>
          {error && <p className="text-sm text-red-500">{error}</p>} {/* Show error if any */}
          <div className="flex space-x-4">
            <Button
              onClick={() => {
                setIsEditing(false); // Cancel the deletion process
                setIsConfirmed(false);
              }}
              variant="outline"
              className="w-full border-gray-500 text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete} // Perform the delete action
              variant="outline"
              className="w-full border-red-600 text-red-600 hover:bg-red-100"
              disabled={isDeleting} // Disable button while deleting
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsEditing(true)} // Enter edit mode when clicked
          variant="outline"
          className="w-full border-red-600 text-red-600 hover:bg-red-100"
          disabled={isConfirmed} // Disable if already confirmed
        >
          {isConfirmed ? "Deleted" : "Delete Media"}
        </Button>
      )}
    </div>
  );
}

