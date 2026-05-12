import { HeaderPC } from '../../widgets/Header/HeaderPC';
import { BannerFullPC } from '../BannerFullPC/BannerFullPC';
import { FooterPC } from '../../widgets/Footer/Footer';

import PropTypes from 'prop-types';
import './AkciiPagePC.scss';

export const AkciiPagePC = ({ header, actia, footer }) => {
  const bannerList = Array.from(Array(4).keys()).fill(actia);

  return (
    <>
      <HeaderPC {...header} />
      <div className="akciiPC">
        <span className="login">Выгодные предложения</span>
        {bannerList?.map((item, key) => (
          <BannerFullPC key={key} {...item} />
        ))}
      </div>
      <FooterPC {...footer} />
    </>
  );
};

AkciiPagePC.propTypes = {
  header: PropTypes.object,
  actia: PropTypes.object,
  footer: PropTypes.object,
};
