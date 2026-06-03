import React, { useState } from 'react';
import './CommentInput.scss';
import Image from 'next/image';
import { CommentInputProps } from '@stories/features/orders/ui/feedback-order-comment/model/types';

export const PhotoIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
  >
    <path
      d="M12.5 5.5H12.51M0.5 3.5C0.5 2.70435 0.816071 1.94129 1.37868 1.37868C1.94129 0.816071 2.70435 0.5 3.5 0.5H15.5C16.2956 0.5 17.0587 0.816071 17.6213 1.37868C18.1839 1.94129 18.5 2.70435 18.5 3.5V15.5C18.5 16.2956 18.1839 17.0587 17.6213 17.6213C17.0587 18.1839 16.2956 18.5 15.5 18.5H3.5C2.70435 18.5 1.94129 18.1839 1.37868 17.6213C0.816071 17.0587 0.5 16.2956 0.5 15.5V3.5Z"
      stroke="#999999"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M0.5 13.4998L5.5 8.49983C6.428 7.60683 7.572 7.60683 8.5 8.49983L13.5 13.4998"
      stroke="#999999"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.5 11.4998L12.5 10.4998C13.428 9.60683 14.572 9.60683 15.5 10.4998L18.5 13.4998"
      stroke="#999999"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const CommentInput: React.FC<CommentInputProps> = ({
  maxLength = 260,
  placeholder = 'Ваш комментарий',
  onCommentChange,
  onPhotoAdd,
  photoPreviews,
}) => {
  const [comment, setComment] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setComment(value);
      onCommentChange?.(value);
    }
  };

  const handlePhotoClick = (index: number) => {
    onPhotoAdd?.(index);
  };

  return (
    <div className="comment-input">
      <div className="comment-input__wrapper">
        <textarea
          className="comment-input__textarea"
          placeholder={placeholder}
          value={comment}
          onChange={handleChange}
          rows={4}
        />
        <div className="comment-input__counter">
          {comment.length}/{maxLength}
        </div>
      </div>
      <div className="comment-input__actions">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            className="comment-input__photo-btn"
            onClick={() => handlePhotoClick(index)}
            type="button"
          >
            {photoPreviews[index] ? (
              <>
                <Image
                  alt="AboutUs"
                  src={photoPreviews[index]}
                  width={40}
                  height={30}
                  priority={true}
                  style={{
                    width: '10vw',
                    height: '10vw',
                    objectFit: 'scale-down',
                  }}
                />
                <span>Изменить</span>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 17 17"
                    fill="none"
                  >
                    <path
                      d="M16.5 0.5L0.5 16.5"
                      stroke="#999999"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M0.5 0.5L16.5 16.5"
                      stroke="#999999"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : (
              <>
                <PhotoIcon />
                <span>Добавить фото</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommentInput;
