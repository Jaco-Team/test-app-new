import { NavBarPC } from '../navBarPC/NavBarPC';
import { BannerPC } from '../BannerPC/BannerPC';
import { BoxItemHomePC } from '../BoxItemHomePC/BoxItemHomePC';
import { FooterPC } from '../FooterPC/FooterPC';

import PropTypes from 'prop-types';
import './HomePage.scss';

export const HomePage = ({ header, banner, container, footer }) => {
  return (
    <div className="homePC">
      <NavBarPC {...header} />
      <div className="containerBanner">
        <BannerPC {...banner} />
      </div>
      <BoxItemHomePC {...container} />
      <FooterPC {...footer} />
    </div>
  );
};

HomePage.propTypes = {
  header: PropTypes.object,
  banner: PropTypes.object,
  container: PropTypes.object,
  footer: PropTypes.object,
};
