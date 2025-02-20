import { useRef, useState, useEffect } from "react";
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

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 }
        }
      });

      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not access your camera. Please ensure you've granted camera permissions."
      });
      onCancel();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsReady(false);
    }
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      // Wait a brief moment to ensure video is actually playing
      setTimeout(() => {
        setIsReady(true);
      }, 500);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !isReady) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Flip horizontally for selfie view
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(video, 0, 0);

      const photoUrl = canvas.toDataURL("image/jpeg", 0.8);
      stopCamera();
      onCapture(photoUrl);
    } catch (err) {
      console.error("Error capturing photo:", err);
      toast({
        variant: "destructive",
        title: "Capture Error",
        description: "Failed to capture photo. Please try again."
      });
    }
  };

  // Start camera automatically when component mounts
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          onLoadedData={handleVideoLoad}
          className="w-full transform scale-x-[-1]"
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button 
          variant="outline" 
          onClick={() => {
            stopCamera();
            onCancel();
          }}
        >
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
    </div>
  );
}