import { HeaderPC } from '../../widgets/Header/HeaderPC';
import { BannerListPC } from '../BannerListPC/BannerListPC';
import { BoxItemHomePC } from '../BoxItemHomePC/BoxItemHomePC';
import { FooterPC } from '../../widgets/Footer/Footer';

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
