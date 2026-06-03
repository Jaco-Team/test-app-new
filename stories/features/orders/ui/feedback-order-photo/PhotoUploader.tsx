import React, { useState, useRef } from 'react';
import './PhotoUploader.scss';
import { PhotoIcon } from '@stories/features/orders/ui/feedback-order-comment/ModalComment';
import { PhotoUploaderProps } from '@stories/features/orders/ui/feedback-order-photo/model/types';

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPhotosChange,
  onClose,
  maxPhotos = 3,
}) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [consent, setConsent] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const availableSlots = maxPhotos - photos.length;
    const filesToAdd = newFiles.slice(0, availableSlots);

    const newPhotos = [...photos, ...filesToAdd];
    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));

    setPhotos(newPhotos);
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
    onPhotosChange?.(newPhotos);
  };

  const handleAddPhoto = () => {
    if (photos.length >= maxPhotos) return;
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);

    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
    onPhotosChange?.(newPhotos);
  };

  const handleConsentChange = () => {
    setConsent(!consent);
  };

  const handleSubmit = () => {
    if (photos.length > 0 && consent) {
      onClose?.();
    }
  };

  const isSubmitEnabled = photos.length > 0 && consent;

  return (
    <div className="PhotoUploader">
      <div className="PhotoUploader__header">
        <span className="PhotoUploader__title">Добавить фото</span>
        <button
          className={`PhotoUploader__check ${isSubmitEnabled ? 'PhotoUploader__check--active' : ''}`}
          onClick={handleSubmit}
          disabled={!isSubmitEnabled}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3334 4L6.00008 11.3333L2.66675 8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="PhotoUploader__content">
        {photos.length === 0 ? (
          <div className="PhotoUploader__upload-zone" onClick={handleAddPhoto}>
            <div className="PhotoUploader__camera-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="36"
                viewBox="0 0 46 36"
                fill="none"
              >
                <path
                  d="M35.5 0.5H40.5C41.8261 0.5 43.0979 1.02678 44.0355 1.96447C44.9732 2.90215 45.5 4.17392 45.5 5.5V30.5C45.5 31.8261 44.9732 33.0979 44.0355 34.0355C43.0979 34.9732 41.8261 35.5 40.5 35.5H35.5M10.5 35.5H5.5C4.17392 35.5 2.90215 34.9732 1.96447 34.0355C1.02678 33.0979 0.5 31.8261 0.5 30.5V5.5C0.5 4.17392 1.02678 2.90215 1.96447 1.96447C2.90215 1.02678 4.17392 0.5 5.5 0.5H10.5M13 18C13 20.6522 14.0536 23.1957 15.9289 25.0711C17.8043 26.9464 20.3478 28 23 28C25.6522 28 28.1957 26.9464 30.0711 25.0711C31.9464 23.1957 33 20.6522 33 18C33 15.3478 31.9464 12.8043 30.0711 10.9289C28.1957 9.05357 25.6522 8 23 8C20.3478 8 17.8043 9.05357 15.9289 10.9289C14.0536 12.8043 13 15.3478 13 18Z"
                  stroke="#999999"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        ) : (
          <div className="PhotoUploader__photos-grid">
            {photoPreviews.map((preview, index) => (
              <div key={index} className="PhotoUploader__photo-item">
                <img
                  src={preview}
                  alt={`Photo ${index + 1}`}
                  className="PhotoUploader__photo"
                />
                <button
                  className="PhotoUploader__remove-btn"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="10" r="9" fill="rgba(0,0,0,0.6)" />
                    <path
                      d="M13 7L7 13M7 7L13 13"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="PhotoUploader__actions">
        {photos.length > 0 && photos.length < maxPhotos && (
          <button className="PhotoUploader__btn" onClick={handleAddPhoto}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="5"
                width="16"
                height="12"
                rx="2"
                stroke="#999999"
                strokeWidth="1.5"
              />
              <circle cx="7" cy="10" r="2" stroke="#999999" strokeWidth="1.5" />
              <path
                d="M2 13L7 10L11 13L15 10L18 13"
                stroke="#999999"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 8V12M8 10H12"
                stroke="#DD1A32"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Добавить ещё фото</span>
          </button>
        )}

        {photos.length < maxPhotos && (
          <button className="PhotoUploader__btn" onClick={handleAddPhoto}>
            <PhotoIcon />
            <span>Добавить фото</span>
          </button>
        )}
      </div>

      <div className="PhotoUploader__consent">
        <label className="PhotoUploader__checkbox">
          <input
            type="checkbox"
            checked={consent}
            onChange={handleConsentChange}
          />
          <span className="PhotoUploader__checkmark"></span>
          <span className="PhotoUploader__consent-text">
            Даю согласие на использование фото
          </span>
        </label>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default PhotoUploader;
