import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { BannerPCImg } from '../BannerPCImg/BannerPCImg';
import { BannerItemPC } from '../BannerItemPC/BannerItemPC';

import './BannerFullPC.scss';

export const BannerFullPC = ({ title, img, text, typePromo, count, items }) => {
  return (
    <Grid container justifyContent="center" className='BannerFull'>
      <Grid className="ImgItem">
        <BannerPCImg title={title} img={img} />
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
                title={item.title}
                img_app={item.img_app}
                desc={item.desc}
                price={item.price}
                typePrice={parseInt(typePromo) == 2 ? 'active' : 'text'}
                count={count}                
              />
            ))}
          </div>

          {parseInt(typePromo) == 0 ? false : (
            <button className='buttonPromo'>Воспользоватся акцией</button>
          )}
          
        </Grid>

        <Grid className="SecondItem">
          <span className="title" style={{ marginBottom: '1.2vw' }}>{title}</span>

          <Grid dangerouslySetInnerHTML={{ __html: text }} />
        </Grid>
      </Grid>
    </Grid>
  );
};

BannerFullPC.propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  typePromo: PropTypes.string.isRequired,
  count: PropTypes.number,
  items: PropTypes.array,
};
