import Grid from '@mui/material/Grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { BannerImg } from '@stories/entities/promotion/ui/promotion-image/BannerImg';
import { BannerItemPC } from '@stories/entities/promotion/ui/promotion-card/BannerItemPC';

import './BannerFullPC.scss';

export const BannerFullPC = ({
  title,
  img,
  text,
  typePromo,
  count,
  items,
  type,
}) => {
  return (
    <Grid
      container
      justifyContent="center"
      className="BannerFull"
      style={{
        backgroundColor: type === 'banner' ? null : 'rgba(0, 0, 0, 0.03)',
        borderRadius: type === 'banner' ? null : '1.1552346570397vw',
      }}
    >
      <Grid className="ImgItem">
        <BannerImg img={img} type={type} />
        <span className="ItemOther">
          Условия акции
          <KeyboardArrowUpIcon />
        </span>
      </Grid>

      <Grid className="DescItem">
        <Grid className="FirstItem">
          <span className="title">Состав</span>

          <div className="List">
            {items?.map((item, key) => (
              <BannerItemPC
                key={key}
                number={key + 1}
                img_app={item.img_app}
                desc={item.desc}
                price={item.price}
                typePrice={parseInt(typePromo) == 2 ? 'active' : 'text'}
                count={count}
              />
            ))}
          </div>

          {parseInt(typePromo) == 0 ? (
            false
          ) : (
            <button className="buttonPromo">Воспользоватся акцией</button>
          )}
        </Grid>

        <Grid className="SecondItem">
          <span className="title" style={{ marginBottom: '1.2vw' }}>
            {title}
          </span>

          <Grid dangerouslySetInnerHTML={{ __html: text }} />
        </Grid>
      </Grid>
    </Grid>
  );
};
