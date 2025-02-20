import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Camera as CameraIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraProps {
  onCapture: (photoUrl: string) => void;
  onCancel: () => void;
}

export default function Camera({ onCapture, onCancel }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not access your camera. Please ensure you've granted camera permissions."
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsReady(false);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !isReady) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip horizontally if using front camera
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);

    ctx.drawImage(videoRef.current, 0, 0);
    const photoUrl = canvas.toDataURL("image/jpeg", 0.8);

    stopCamera();
    onCapture(photoUrl);
  };

  return (
    <div className="space-y-4">
      {!stream ? (
        <Button onClick={startCamera}>
          <CameraIcon className="h-4 w-4 mr-2" />
          Start Camera
        </Button>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg transform scale-x-[-1]"
            onLoadedData={() => setIsReady(true)}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => {
              stopCamera();
              onCancel();
            }}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={takePhoto}
              disabled={!isReady}
            >
              <CameraIcon className="h-4 w-4 mr-2" />
              {isReady ? "Take Photo" : "Loading Camera..."}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}