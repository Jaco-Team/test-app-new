export interface CommentInputProps {
  maxLength?: number;
  placeholder?: string;
  onCommentChange?: (comment: string) => void;
  onPhotoAdd?: (index: number) => void;
  photoPreviews: any;
}
