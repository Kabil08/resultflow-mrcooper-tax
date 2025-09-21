import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Camera, Upload, X, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ImageVerificationProps {
  onCapture: (type: "selfie" | "idProof", image: string) => void;
  onClose: () => void;
  onNavigateToAddress?: () => void;
  onCancel?: () => void;
}

const ImageVerification = ({
  onCapture,
  onClose,
  onNavigateToAddress,
  onCancel,
}: ImageVerificationProps) => {
  const [mode, setMode] = useState<"selfie" | "idProof">("selfie");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(mode, capturedImage);
      setCapturedImage(null);
      if (mode === "selfie") {
        setMode("idProof");
      } else {
        setShowSuccess(true);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleNavigateToAddress = () => {
    setShowSuccess(false);
    onClose();
    onNavigateToAddress?.();
  };

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  if (showSuccess) {
    return (
      <Dialog open onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-center flex items-center justify-center gap-2">
                <ShieldCheck className="h-6 w-6 text-mrcooper-blue" />
                <span className="text-gray-900">
                  ID Verification Successful
                </span>
              </DialogTitle>
              <DialogClose
                className="h-6 w-6 text-gray-500 hover:text-gray-700"
                onClick={handleClose}
              />
            </div>
          </DialogHeader>
          <div className="py-8 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-mrcooper-blue/10 flex items-center justify-center">
              <Check className="h-6 w-6 text-mrcooper-blue" />
            </div>
            <p className="text-gray-600 text-center">
              Your ID has been successfully verified. You can now proceed with
              address verification.
            </p>
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleNavigateToAddress}
                className="w-full sm:w-auto bg-mrcooper-blue hover:bg-mrcooper-blue-dark text-white"
              >
                Proceed to Address Verification
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-gray-900">
              {mode === "selfie" ? "Take a Selfie" : "Upload ID Proof"}
            </DialogTitle>
            <DialogClose
              className="h-6 w-6 text-gray-500 hover:text-gray-700"
              onClick={handleClose}
            />
          </div>
          <DialogDescription className="text-gray-600">
            {mode === "selfie"
              ? "Please take a clear photo of your face"
              : "Please upload a clear photo of your government-issued ID"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!capturedImage ? (
            <>
              {isUsingCamera ? (
                <div className="relative w-full">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover"
                      videoConstraints={{
                        width: 1280,
                        height: 720,
                        facingMode: "user",
                        aspectRatio: 16 / 9,
                      }}
                      mirrored={mode === "selfie"}
                      audio={false}
                    />
                  </div>
                  <div className="absolute left-0 right-0 bottom-4 flex justify-center pointer-events-none">
                    <Button
                      variant="default"
                      size="icon"
                      onClick={handleCapture}
                      className="bg-mrcooper-blue hover:bg-mrcooper-blue-dark rounded-full h-12 w-12 flex items-center justify-center shadow-lg pointer-events-auto"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-mrcooper-blue transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-mrcooper-blue mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                  </label>
                  <Button
                    variant="outline"
                    onClick={() => setIsUsingCamera(true)}
                    className="mt-4 border-mrcooper-blue text-mrcooper-blue hover:bg-mrcooper-blue/10"
                  >
                    Use Camera Instead
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="relative w-full">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full rounded-lg"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleRetake}
                  className="rounded-full h-10 w-10 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  onClick={handleConfirm}
                  className="bg-mrcooper-blue hover:bg-mrcooper-blue-dark rounded-full h-10 w-10 flex items-center justify-center"
                >
                  <Check className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          )}

          {isUsingCamera && !capturedImage && (
            <Button
              variant="outline"
              onClick={() => setIsUsingCamera(false)}
              className="w-full border-mrcooper-blue text-mrcooper-blue hover:bg-mrcooper-blue/10"
            >
              Switch to Upload
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageVerification;
