import './ModalItemSet.scss';

export const ModalItemSet = ({
  number,
  img_app,
  title,
  marc_desc,
  tmp_desc,
}: Record<string, any>) => {
  return (
    <div className="setItem">
      <span className="itemNumber">{number}.</span>

      <picture>
        <source
          type="image/webp"
          srcSet={`
            https://cdnimg.jacofood.ru/${img_app}_292x292.webp 292w,
            https://cdnimg.jacofood.ru/${img_app}_366x366.webp 366w,
            https://cdnimg.jacofood.ru/${img_app}_466x466.webp 466w,
            https://cdnimg.jacofood.ru/${img_app}_585x585.webp 585w,
            https://cdnimg.jacofood.ru/${img_app}_732x732.webp 732w,
            https://cdnimg.jacofood.ru/${img_app}_1168x1168.webp 1168w,
            https://cdnimg.jacofood.ru/${img_app}_1420x1420.webp 1420w,
            https://cdnimg.jacofood.ru/${img_app}_2000x2000.webp 2000w`}
          sizes="(max-width: 667px) 84px, (max-width: 990px) 112px, 132px"
        />
        <source
          type="image/jpeg"
          srcSet={`
            https://cdnimg.jacofood.ru/${img_app}_292x292.jpg 292w,
            https://cdnimg.jacofood.ru/${img_app}_366x366.jpg 366w,
            https://cdnimg.jacofood.ru/${img_app}_466x466.jpg 466w,
            https://cdnimg.jacofood.ru/${img_app}_585x585.jpg 585w,
            https://cdnimg.jacofood.ru/${img_app}_732x732.jpg 732w,
            https://cdnimg.jacofood.ru/${img_app}_1168x1168.jpg 1168w,
            https://cdnimg.jacofood.ru/${img_app}_1420x1420.jpg 1420w,
            https://cdnimg.jacofood.ru/${img_app}_2000x2000.jpg 2000w`}
          sizes="(max-width: 667px) 84px, (max-width: 990px) 112px, 132px"
        />

        <img
          alt={title}
          src={`https://cdnimg.jacofood.ru/${img_app}_292x292.jpg`}
          loading="lazy"
        />
      </picture>

      <div className="itemDesc">
        <span>{title}</span>
        <span>{marc_desc.length > 0 ? marc_desc : tmp_desc}</span>
      </div>
    </div>
  );
};
