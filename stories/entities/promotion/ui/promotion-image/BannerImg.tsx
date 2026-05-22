import Image from 'next/image';
import './BannerImg.scss';
import React, { useRef, useEffect } from 'react';
import { BannerImgProps } from '@/stories/entities/promotion/ui/promotion-image/model/types';

export const BannerImg = ({
  img,
  title,
  type,
  autoPlay = true,
  loop = true,
  muted = true,
  onVideoEnd,
}: BannerImgProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo =
    img?.toLowerCase().endsWith('.mp4') ||
    img?.toLowerCase().endsWith('.webm') ||
    img?.toLowerCase().endsWith('.mov');

  const borderRadius =
    type === 'banner'
      ? '1.1552346570397vw'
      : '1.1552346570397vw 1.1552346570397vw 0 0';

  useEffect(() => {
    if (videoRef.current && isVideo && autoPlay) {
      videoRef.current.play().catch((error) => {
        //console.log('Video autoplay failed:', error);
      });
    }
  }, [isVideo, autoPlay]);

  const handleVideoEnded = () => {
    if (loop && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
    onVideoEnd?.();
  };

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        muted={muted}
        playsInline
        preload="auto"
        autoPlay={autoPlay}
        loop={loop}
        className="BannerPCImg"
        style={{
          borderRadius,
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        onEnded={handleVideoEnded}
      >
        <source src={img} type={`video/${img.split('.').pop()}`} />
      </video>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'auto',
        aspectRatio: '3700/1000',
      }}
    >
      <Image
        alt={title}
        src={img}
        fill
        priority={true}
        className="BannerPCImg"
        style={{ borderRadius, objectFit: 'cover' }}
        sizes="100vw"
      />
    </div>
  );
};
