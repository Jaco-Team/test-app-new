import { BannerImg } from '@stories/entities/promotion/ui/promotion-image/BannerImg';
import { PromotionProductItem } from '@stories/entities/promotion/ui/promotion-card/PromotionProductItem';

import './PromotionDetail.scss';

type PromotionItem = {
  title: string;
  img_app: string;
  desc: string;
  price: string;
};

export interface PromotionDetailProps {
  title: string;
  img: string;
  text: string;
  typePromo: string | number;
  count: number;
  items: PromotionItem[];
  type?: 'banner' | 'page' | string;
  viewport?: 'mobile' | 'tablet' | 'desktop';
}

export const PromotionDetail = ({
  title,
  img,
  text,
  typePromo,
  count,
  items,
  type,
  viewport = 'desktop',
}: PromotionDetailProps) => {
  const isMobile = viewport === 'mobile';
  const containerClassName = isMobile
    ? 'BannerFull BannerFull--mobile containerAcciaMobile'
    : `BannerFull BannerFull--${viewport} containerAccia`;
  const descClassName = isMobile ? 'DescItem DescItemMobile' : 'DescItem';
  const compositionClassName = isMobile
    ? 'SecondItem SecondItemMobile'
    : 'FirstItem';
  const descriptionClassName = isMobile
    ? 'FirstItem FirstItemMobile'
    : 'SecondItem';
  const promoType = Number.parseInt(String(typePromo), 10);

  const composition = (
    <div className={compositionClassName}>
      {isMobile ? (
        <h2 className="itemTitle">Состав</h2>
      ) : (
        <span className="title">Состав</span>
      )}

      <div className="List">
        {items?.map((item, key) => (
          <PromotionProductItem
            key={key}
            number={key + 1}
            title={item.title}
            img_app={item.img_app}
            desc={item.desc}
            price={item.price}
            typePrice={promoType === 2 ? 'text' : 'active'}
            count={count}
          />
        ))}
      </div>

      {promoType === 0 ? (
        false
      ) : (
        <div className="containerBTN">
          <button className="buttonPromo">Воспользоватся акцией</button>
        </div>
      )}
    </div>
  );

  const description = (
    <div className={descriptionClassName}>
      <span className="title" style={{ marginBottom: '1.2vw' }}>
        {title}
      </span>

      <div className="FullText" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );

  return (
    <div
      className={containerClassName}
      style={{
        backgroundColor: type === 'banner' ? null : 'rgba(0, 0, 0, 0.03)',
        borderRadius: type === 'banner' ? null : '1.1552346570397vw',
      }}
    >
      <div className="ImgItem">
        <BannerImg img={img} title={title} type={type} />
        {/* <span className="ItemOther">Условия акции</span> */}
      </div>

      <div className={descClassName}>
        {isMobile ? description : composition}
        {isMobile ? composition : description}
      </div>
    </div>
  );
};
