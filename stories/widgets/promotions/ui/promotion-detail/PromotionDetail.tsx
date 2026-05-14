import Grid from '@mui/material/Grid';
import { BannerImg } from '@stories/entities/promotion/ui/promotion-image/BannerImg';
import { PromotionProductItem } from '@stories/entities/promotion/ui/promotion-card/PromotionProductItem';

import './PromotionDetail.scss';

export const PromotionDetail = ({
  title,
  img,
  text,
  typePromo,
  count,
  items,
  type,
  viewport = 'desktop',
}: Record<string, any>) => {
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

  const composition = (
    <Grid className={compositionClassName}>
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
            typePrice={parseInt(typePromo) == 2 ? 'text' : 'active'}
            count={count}
          />
        ))}
      </div>

      {parseInt(typePromo) == 0 ? (
        false
      ) : (
        <div className="containerBTN">
          <button className="buttonPromo">Воспользоватся акцией</button>
        </div>
      )}
    </Grid>
  );

  const description = (
    <Grid className={descriptionClassName}>
      <span
        className={isMobile ? 'title' : 'title'}
        style={{ marginBottom: '1.2vw' }}
      >
        {title}
      </span>

      <Grid className="FullText" dangerouslySetInnerHTML={{ __html: text }} />
    </Grid>
  );

  return (
    <Grid
      container
      justifyContent="center"
      className={containerClassName}
      style={{
        backgroundColor: type === 'banner' ? null : 'rgba(0, 0, 0, 0.03)',
        borderRadius: type === 'banner' ? null : '1.1552346570397vw',
      }}
    >
      <Grid className="ImgItem">
        <BannerImg img={img} title={title} type={type} />
        {/* <span className="ItemOther">Условия акции</span> */}
      </Grid>

      <Grid className={descClassName}>
        {isMobile ? description : composition}
        {isMobile ? composition : description}
      </Grid>
    </Grid>
  );
};
