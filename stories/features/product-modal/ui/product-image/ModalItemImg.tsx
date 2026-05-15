import './ModalItemImg.scss';

export const ModalItemImg = ({ img_name, title }: Record<string, any>) => {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`
          https://cdnimg.jacofood.ru/${img_name}_292x292.webp 292w,
          https://cdnimg.jacofood.ru/${img_name}_366x366.webp 366w,
          https://cdnimg.jacofood.ru/${img_name}_466x466.webp 466w,
          https://cdnimg.jacofood.ru/${img_name}_585x585.webp 585w,
          https://cdnimg.jacofood.ru/${img_name}_732x732.webp 732w,
          https://cdnimg.jacofood.ru/${img_name}_1168x1168.webp 1168w,
          https://cdnimg.jacofood.ru/${img_name}_1420x1420.webp 1420w,
          https://cdnimg.jacofood.ru/${img_name}_2000x2000.webp 2000w`}
        sizes="(max-width: 667px) 320px, (max-width: 990px) 340px, 620px"
      />
      <source
        type="image/jpeg"
        srcSet={`
          https://cdnimg.jacofood.ru/${img_name}_292x292.jpg 292w,
          https://cdnimg.jacofood.ru/${img_name}_366x366.jpg 366w,
          https://cdnimg.jacofood.ru/${img_name}_466x466.jpg 466w,
          https://cdnimg.jacofood.ru/${img_name}_585x585.jpg 585w,
          https://cdnimg.jacofood.ru/${img_name}_732x732.jpg 732w,
          https://cdnimg.jacofood.ru/${img_name}_1168x1168.jpg 1168w,
          https://cdnimg.jacofood.ru/${img_name}_1420x1420.jpg 1420w,
          https://cdnimg.jacofood.ru/${img_name}_2000x2000.jpg 2000w`}
        sizes="(max-width: 667px) 320px, (max-width: 990px) 340px, 620px"
      />

      <img
        alt={title}
        src={`https://cdnimg.jacofood.ru/${img_name}_292x292.jpg`}
        loading="lazy"
      />
    </picture>
  );
};
