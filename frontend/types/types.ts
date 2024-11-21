export interface CameraFeedProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  initialFacingMode?: "user" | "environment";
}

export interface CameraError {
  message: string;
  code?: string;
}
