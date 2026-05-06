import { HeaderPC } from '../HeaderPC/HeaderPC';
import { BannerFullPC } from '../BannerFullPC/BannerFullPC';
import { FooterPC } from '../FooterPC/FooterPC';

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
