import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Pencil } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Activity } from "@shared/schema";

interface EditDialogProps {
  activity: Activity;
}

export default function EditDialog({ activity }: EditDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(activity.note || "");

  const updateActivity = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/activities/${activity.id}`, {
        note,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      // Also invalidate the specific date view if we're in it
      const date = activity.timestamp.split('T')[0];
      queryClient.invalidateQueries({ queryKey: ["/api/activities", date] });
      setOpen(false);
      toast({
        title: "Success",
        description: "Activity updated successfully",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            placeholder="What's happening?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {activity.photoUrl && (
            <img
              src={activity.photoUrl}
              alt="Activity"
              className="rounded-md max-w-full h-auto"
            />
          )}

          <Button
            onClick={() => updateActivity.mutate()}
            disabled={updateActivity.isPending}
          >
            {updateActivity.isPending ? "Updating..." : "Update Activity"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
