export interface BannerImgProps {
  img: string;
  title: string;
  type: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onVideoEnd?: () => void;
}
