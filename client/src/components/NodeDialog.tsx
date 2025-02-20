import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { CameraIcon, Plus } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Camera from "./Camera";

export default function NodeDialog() {
  const { date } = useParams<{ date: string }>();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>();

  const createActivity = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/activities", {
        timestamp: new Date().toISOString(),
        note,
        photoUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      if (date) {
        queryClient.invalidateQueries({ queryKey: ["/api/activities", date] });
      }
      setOpen(false);
      setNote("");
      setPhotoUrl(undefined);
      toast({
        title: "Success",
        description: "Activity created successfully",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Activity</DialogTitle>
        </DialogHeader>

        {showCamera ? (
          <Camera
            onCapture={(url: string) => {
              setPhotoUrl(url);
              setShowCamera(false);
            }}
            onCancel={() => setShowCamera(false)}
          />
        ) : (
          <div className="space-y-4">
            <Textarea
              placeholder="What's happening?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCamera(true)}
              >
                <CameraIcon className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>

            {photoUrl && (
              <img
                src={photoUrl}
                alt="Preview"
                className="rounded-md max-w-full h-auto"
              />
            )}

            <Button
              onClick={() => createActivity.mutate()}
              disabled={createActivity.isPending}
            >
              {createActivity.isPending ? "Creating..." : "Create Activity"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}