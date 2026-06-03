import React from 'react';

export interface Star {
  value: number;
  text: string;
}

export interface DriverImage {
  id: string;
  icon: React.ReactNode;
  title: string;
  imageSrc: string;
  imageAlt: string;
}

export interface FeedbackModalOrderProps {
  more?: boolean;
  orderNumber?: string;
  deliveryDate?: string;
  courierName?: string;
  onSubmit?: (data: FeedbackData) => void;
  onClose?: () => void;
}

export interface FeedbackData {
  rating: number;
  selectedTags: string[];
  comment: string;
  photos?: File[];
}
