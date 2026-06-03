export interface PhotoUploaderProps {
  onPhotosChange?: (photos: File[]) => void;
  onClose?: () => void;
  maxPhotos?: number;
}
