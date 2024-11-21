import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

// Define props to pass media item attributes to EditCard
type EditCardProps = {
  mediaType: string;
  attributes: { label: string; value: string }[];
};

// EditCard component
export default function EditCard({ mediaType, attributes }: EditCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">{mediaType} Details</h2>

        {/* Display each attribute with an edit button */}
        <div className="grid gap-4">
          {attributes.map((attribute, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="font-medium text-muted-foreground">
                {attribute.label}
              </span>
              <div className="flex items-center space-x-4">
                <span className="text-foreground">{attribute.value}</span>
                <Button variant="ghost" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
