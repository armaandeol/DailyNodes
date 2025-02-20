import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Camera as CameraIcon, X } from "lucide-react";

interface CameraProps {
  onCapture: (photoUrl: string) => void;
  onCancel: () => void;
}

export default function Camera({ onCapture, onCancel }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const photoUrl = canvas.toDataURL("image/jpeg");

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
            className="w-full rounded-lg"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => {
              stopCamera();
              onCancel();
            }}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={takePhoto}>
              <CameraIcon className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
          </div>
        </>
      )}
    </div>
  );
}