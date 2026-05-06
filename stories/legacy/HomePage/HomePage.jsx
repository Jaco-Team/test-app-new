import { HeaderPC } from '../HeaderPC/HeaderPC';
import { BannerListPC } from '../BannerListPC/BannerListPC';
import { BoxItemHomePC } from '../BoxItemHomePC/BoxItemHomePC';
import { FooterPC } from '../FooterPC/FooterPC';

import PropTypes from 'prop-types';
import './HomePage.scss';

export const HomePage = ({ header, banners, container, footer }) => {
  return (
    <div className="homePC">
      <HeaderPC {...header} />
      <div className="containerBanner">
        <BannerListPC {...banners} />
      </div>
      <BoxItemHomePC {...container} />
      <FooterPC {...footer} />
    </div>
  );
};

HomePage.propTypes = {
  header: PropTypes.object,
  banners: PropTypes.array,
  container: PropTypes.object,
  footer: PropTypes.object,
};
