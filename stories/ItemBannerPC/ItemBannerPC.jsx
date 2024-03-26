import PropTypes from 'prop-types';
import Image from 'next/image';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import './ItemBannerPC.scss';

export const ItemBannerPC = ({data_key, title, img_app, marc_desc, tmp_desc, typePromo, price, count}) => {
  return (
    <div className="itemBannerPC BannerFontPC">
      <div className="itemNumber">
        <span className="ItemOther">{data_key + 1}.</span>
      </div>

      <div className="itemImg">
        <Image
          alt={title}
          src={'https://cdnimg.jacofood.ru/' + img_app + '_1420x1420.jpg'}
          width={1420}
          height={1420}
          priority={true}
        />
      </div>

      <div className="itemDesc">
        <Typography className="ItemName" variant="h5" component="span">{title}</Typography>
        <Typography variant="h5" component="span" className="ItemDesk desc">{marc_desc?.length > 0 ? marc_desc : tmp_desc}</Typography>

        {parseInt(typePromo) == 2 ? (
          parseInt(price) == 0 ? (
            false
          ) : (
            <div className="containerBTNitem">
              <span>{new Intl.NumberFormat('ru-RU').format(price)} ₽</span>
            </div>
          )
        ) : (
          false
        )}

        {parseInt(typePromo) == 2 ? (
          false
        ) : count ? (
          <div className="containerBTNitem">
            <div variant="contained">
              <button className="minus">–</button>
              <span>{count}</span>
              <button className="plus">+</button>
            </div>
          </div>
        ) : parseInt(price) == 0 ? (
          false
        ) : (
          <div className="containerBTNitem">
            <Button variant="outlined">
              {new Intl.NumberFormat('ru-RU').format(price)} ₽
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

ItemBannerPC.propTypes = {
  data_key: PropTypes.number,
  title: PropTypes.string.isRequired,
  img_app: PropTypes.string.isRequired,
  marc_desc: PropTypes.string.isRequired,
  tmp_desc: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  count: PropTypes.number,
  typePromo: PropTypes.string.isRequired,
};
