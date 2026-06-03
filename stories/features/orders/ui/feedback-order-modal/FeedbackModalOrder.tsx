import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CommentInput from '@stories/features/orders/ui/feedback-order-comment/ModalComment';
import './FeedbackModalOrder.scss';
import PhotoUploader from '@stories/features/orders/ui/feedback-order-photo/PhotoUploader';
import {
  DriverImage,
  FeedbackData,
  FeedbackModalOrderProps,
  Star,
} from '@stories/features/orders/ui/feedback-order-modal/model/types';

// Константы с данными
const STARS: Star[] = [
  { value: 1, text: 'Ужасно' },
  { value: 2, text: 'Плохо' },
  { value: 3, text: 'Могло быть лучше' },
  { value: 4, text: 'Хорошо' },
  { value: 5, text: 'Отлично' },
];

const FEEDBACK_TAGS: string[] = [
  'Вкус и качество блюд',
  'Быстрая доставка',
  'Упаковка',
  'Внешний вид блюда',
  'Общение с курьером',
  'Соответствие порции',
];

const DRIVER_IMAGES: DriverImage[] = [
  {
    id: 'dishes',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
      >
        <path
          d="M0.749456 8.48978L1.76489 8.42623C2.97229 8.35098 4.18399 8.46414 5.35707 8.76171L7.05924 9.19324C7.51068 9.30798 7.90599 9.58264 8.17278 9.96695C8.43956 10.3513 8.55997 10.8195 8.51196 11.2859C8.3975 12.4165 7.35272 13.2072 6.24337 13.0091L4.6219 12.7165L10.3403 13.7495L16.2642 12.3337C16.7248 12.2246 17.2094 12.3004 17.6154 12.5451C18.0214 12.7899 18.3167 13.1842 18.4389 13.6446C18.6736 14.5358 18.2143 15.4624 17.3677 15.8097L12.628 17.7472C10.3237 18.6898 7.75624 18.7492 5.41136 17.9142L0.5 16.1629M13.347 0.930454C13.3981 0.803275 13.4857 0.694358 13.5987 0.617665C13.7116 0.540973 13.8447 0.5 13.9809 0.5C14.1171 0.5 14.2503 0.540973 14.3632 0.617665C14.4761 0.694358 14.5638 0.803275 14.6148 0.930454L15.4762 3.04825L17.8138 3.25515C18.4242 3.30835 18.6619 4.08276 18.1879 4.47292L16.7983 5.6227C16.7013 5.70361 16.6281 5.80975 16.5867 5.9296C16.5453 6.04944 16.5373 6.17842 16.5635 6.30252L17.0243 8.4484C17.0533 8.58263 17.0418 8.72252 16.9912 8.8501C16.9406 8.97768 16.8533 9.08711 16.7405 9.16433C16.6277 9.24155 16.4946 9.28303 16.3582 9.28345C16.2218 9.28386 16.0884 9.24318 15.9751 9.16664L13.9809 7.82473L11.9867 9.1696C11.8734 9.24632 11.7398 9.28709 11.6032 9.28666C11.4666 9.28622 11.3333 9.24461 11.2204 9.16717C11.1075 9.08973 11.0203 8.98002 10.9698 8.85218C10.9194 8.72433 10.9082 8.58421 10.9376 8.44987L11.3983 6.30252C11.4243 6.17864 11.4161 6.04997 11.3748 5.93041C11.3334 5.81085 11.2603 5.70496 11.1635 5.62418L9.77391 4.47439C9.6686 4.38765 9.59137 4.27123 9.55211 4.14004C9.51285 4.00884 9.51334 3.86883 9.55351 3.73792C9.59369 3.60701 9.67173 3.49114 9.77765 3.40514C9.88357 3.31914 10.0125 3.26692 10.1481 3.25515L12.4857 3.04825L13.347 0.930454Z"
          stroke="#333333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Блюда в заказе',
    imageSrc: '/about/Dish.png',
    imageAlt: 'Блюда в заказе',
  },
  {
    id: 'delivery',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="16"
        viewBox="0 0 21 16"
        fill="none"
      >
        <path
          d="M6.49996 1.48522H0.5M3.49998 13.3992H0.5M1.99999 7.70082H0.5M13.0239 13.5759L16.5369 15.3921C16.6832 15.4721 16.8498 15.5088 17.0167 15.4978C17.1835 15.4867 17.3437 15.4285 17.4779 15.3299C17.615 15.232 17.7214 15.0979 17.7849 14.943C17.8442 14.7903 17.8624 14.625 17.8379 14.4632L17.1609 10.6097C17.1291 10.4686 17.1291 10.3224 17.1609 10.1813C17.2069 10.0425 17.287 9.91709 17.3939 9.81611L20.2289 7.08982C20.3467 6.97304 20.4305 6.8271 20.4715 6.66731C20.5125 6.50752 20.5092 6.33978 20.4619 6.18171C20.4107 6.02467 20.3162 5.88479 20.1891 5.77774C20.0619 5.6707 19.907 5.60072 19.7419 5.57565L15.8169 5.02289C15.6726 4.99992 15.5359 4.94336 15.4182 4.85787C15.3005 4.77239 15.2051 4.66045 15.1399 4.53133L13.3839 1.00156C13.3132 0.854615 13.2026 0.729932 13.0643 0.641398C12.9261 0.552864 12.7657 0.503956 12.6009 0.500124C12.432 0.497243 12.2661 0.544715 12.1249 0.63634C11.9793 0.720837 11.8644 0.848684 11.7969 1.00156L9.99793 4.53133C9.93318 4.65866 9.83929 4.76936 9.72369 4.85468C9.6081 4.94 9.47398 4.99759 9.33193 5.02289L5.45996 5.57565C5.29286 5.59978 5.13557 5.66837 5.00497 5.77405C4.87516 5.88071 4.7796 6.02236 4.72997 6.18171C4.68725 6.34165 4.68816 6.50991 4.73259 6.66939C4.77702 6.82888 4.8634 6.97393 4.98297 7.08982L7.81995 9.81611C7.92328 9.92206 8.00094 10.0438 8.05294 10.1813C8.08472 10.3224 8.08472 10.4686 8.05294 10.6097L7.37595 14.4632C7.32922 14.6198 7.32922 14.7864 7.37595 14.943C7.43911 15.0978 7.54516 15.2318 7.68195 15.3299C7.81624 15.4287 7.97656 15.4871 8.14365 15.4981C8.31075 15.5091 8.47752 15.4723 8.62394 15.3921L12.1369 13.5759C12.2671 13.5074 12.4124 13.4716 12.5599 13.4716C12.7074 13.4716 12.8527 13.5074 12.9829 13.5759H13.0239Z"
          stroke="#333333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Доставка',
    imageSrc: '/about/Delivery.png',
    imageAlt: 'Доставка',
  },
];

const FeedbackModalOrder: React.FC<FeedbackModalOrderProps> = ({
  more = true,
  orderNumber = '1234',
  deliveryDate = '15 января',
  courierName = 'Алексей',
  onSubmit,
  onClose,
}) => {
  const [selectedRating, setSelectedRating] = useState<Star | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [showPhotoUploader, setShowPhotoUploader] = useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const handlePhotoAdd = (index: number): void => {
    setShowPhotoUploader(true);
  };

  const handlePhotosChange = (photos: File[]) => {
    setUploadedPhotos(photos);

    // Создаём превью для новых фото
    const newPreviews = photos.map((photo) => URL.createObjectURL(photo));

    // Очищаем старые превью
    photoPreviews.forEach((preview) => URL.revokeObjectURL(preview));

    // Устанавливаем новые
    setPhotoPreviews(newPreviews);
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      photoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [photoPreviews]);

  const handleRatingClick = (star: Star): void => {
    setSelectedRating(star);
  };

  const handleTagClick = (tag: string): void => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCommentChange = (value: string): void => {
    setComment(value);
  };

  const handleSubmit = (): void => {
    if (!selectedRating) {
      console.warn('Please select rating');
      return;
    }

    const feedbackData: FeedbackData = {
      rating: selectedRating.value,
      selectedTags,
      comment,
      photos: photos.length > 0 ? photos : undefined,
    };

    onSubmit?.(feedbackData);
  };

  const handleClose = (): void => {
    onClose?.();
  };

  return (
    <div className="Feedback-overlay" onClick={handleClose}>
      <div className="Feedback-unuse" onClick={(e) => e.stopPropagation()}>
        <div className="Feedback-modal">
          <div className="Feedback-modal-swipe">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="52"
              height="4"
              viewBox="0 0 52 4"
              fill="none"
            >
              <rect width="52" height="4" rx="2" fill="#CCCCCC" />
            </svg>
          </div>
          {showPhotoUploader ? (
            <PhotoUploader
              onPhotosChange={handlePhotosChange}
              onClose={() => setShowPhotoUploader(false)}
              maxPhotos={3}
            />
          ) : (
            <>
              <div className="Feedback-modal-title">
                <span>Заказ №{orderNumber}</span>
                <p>Доставлен курьером {deliveryDate}</p>
              </div>

              <div className="Feedback-modal-body">
                <span className="Feedback-modal-body-main">
                  Вам понравился заказ?
                </span>

                <div className="Feedback-modal-body-stars">
                  {STARS.map((star) => (
                    <div
                      key={star.value}
                      className="Feedback-modal-body-star"
                      onClick={() => handleRatingClick(star)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleRatingClick(star);
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="31"
                        viewBox="0 0 32 31"
                        fill={
                          selectedRating?.value &&
                          selectedRating.value >= star.value
                            ? '#FFDB0C'
                            : 'none'
                        }
                      >
                        <path
                          d="M16 0.75C16.1263 0.750029 16.2208 0.778173 16.3008 0.824219C16.3257 0.838598 16.3801 0.877958 16.4346 1.0166L16.4365 1.02246L16.4395 1.0293L20.2939 10.3125L20.4678 10.7324L20.9199 10.7725L30.7568 11.6455C30.9269 11.677 31.003 11.7258 31.0342 11.7529L31.0381 11.7549C31.1028 11.8106 31.1688 11.8947 31.2266 12.0273V12.0283C31.2519 12.0875 31.2593 12.1456 31.2354 12.2324C31.2125 12.315 31.166 12.3966 31.0625 12.4824L31.0537 12.4893L31.0449 12.4971L23.5547 19.1045L23.2188 19.3994L23.3193 19.835L25.585 29.6387L25.5918 29.6699L25.6016 29.7002C25.6392 29.8172 25.6255 29.8771 25.6055 29.9219C25.5575 30.0289 25.4997 30.089 25.4336 30.1299L25.4248 30.1348C25.3115 30.2067 25.2124 30.2391 25.123 30.249C25.0947 30.2522 25.0176 30.2504 24.873 30.1816L16.3926 24.9736L16 24.7324L15.6074 24.9736L7.12793 30.1816C6.98562 30.2492 6.90821 30.2514 6.87695 30.248C6.7845 30.2362 6.68118 30.2027 6.56445 30.1309C6.49814 30.088 6.44251 30.0281 6.39746 29.9268C6.37754 29.8819 6.36263 29.8169 6.40137 29.6904L6.40918 29.665L6.41504 29.6387L8.67969 19.835L8.78027 19.3994L8.44531 19.1045L0.955078 12.4971L0.946289 12.4893L0.9375 12.4824L0.870117 12.418C0.812324 12.3551 0.781759 12.2943 0.764648 12.2324C0.741193 12.1475 0.747926 12.0908 0.773438 12.0322C0.829934 11.9025 0.895144 11.8147 0.961914 11.7529C0.997119 11.7241 1.07634 11.6775 1.24023 11.6455L11.0791 10.7725L11.5322 10.7324L11.7061 10.3125L15.5605 1.0293L15.5625 1.02344C15.6204 0.880603 15.6769 0.83854 15.7031 0.823242C15.7803 0.778436 15.8735 0.75 16 0.75Z"
                          stroke={
                            selectedRating?.value &&
                            selectedRating.value >= star.value
                              ? '#FFDB0C'
                              : '#999'
                          }
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  ))}
                </div>

                {selectedRating?.text && (
                  <p className="Feedback-modal-body-startext">
                    {selectedRating.text}
                  </p>
                )}

                {more ? (
                  <div className="Feedback-modal-body-more">
                    <span>Спасибо! Что вам особенно понравилось?</span>

                    <div className="Feedback-modal-body-tags">
                      {FEEDBACK_TAGS.map((tag, index) => (
                        <div
                          key={index}
                          className={`Feedback-modal-body-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                          onClick={() => handleTagClick(tag)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleTagClick(tag);
                            }
                          }}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                    <div>
                      <CommentInput
                        maxLength={260}
                        onCommentChange={handleCommentChange}
                        onPhotoAdd={handlePhotoAdd}
                        photoPreviews={photoPreviews}
                      />
                    </div>

                    <div className="Feedback-modal-body-driver">
                      <span>Вы можете оценить отдельно</span>
                      <div className="Feedback-modal-body-driver-imgs">
                        {DRIVER_IMAGES.map((item) => (
                          <div
                            key={item.id}
                            className="Feedback-modal-body-driver-img"
                          >
                            <div className="Feedback-modal-body-driver-img-text">
                              {item.icon}
                              <span>{item.title}</span>
                            </div>
                            <Image
                              alt={item.imageAlt}
                              src={item.imageSrc}
                              width={234}
                              height={140}
                              priority={true}
                              style={{ width: '100%', height: 'auto' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>
                    Поделитесь своим мнением.
                    <br /> Это поможет нам стать лучше.
                  </p>
                )}

                <button className="Feedback-button" onClick={handleSubmit}>
                  Отправить
                </button>
              </div>
            </>
          )}
        </div>

        <div className="Feedback-unuse-icon" onClick={handleClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.11 2.697L2.698 4.11 6.586 8l-3.89 3.89 1.415 1.413L8 9.414l3.89 3.89 1.413-1.415L9.414 8l3.89-3.89-1.415-1.413L8 6.586l-3.89-3.89z"
              fill="#fff"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModalOrder;
