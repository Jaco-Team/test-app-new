import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import './NavBarPC.scss';
import { ArrowDownHeaderPC } from '../Icons';
import { MyCatLink } from '../MyTextLink/MyCatLink';
import { IconHeaderPC } from '../IconHeaderPC/IconHeaderPC';
import { IconCartHeaderPC } from '../IconCartHeaderPC/IconCartHeaderPC';

const category = ['Роллы', 'Пицца', 'Блюда', 'Напитки'];

export const NavBarPC = ({ scroll, count }) => {
  return (
    <>
      <AppBar className={['NavBarPC'].join(' ')}>
        <Toolbar>
          <div>
            <a className="logoPC">
              <img alt="Жако доставка роллов и пиццы" src={'/Jaco-Logo-120.png'} />
            </a>
            {category.map((item, key) => (
              <div className="headerCat" key={key}>
                <MyCatLink children={item} />
                {item === 'Пицца' || item === 'Напитки' ? null : <ArrowDownHeaderPC />}
              </div>
            ))}
            <a className="akcia">
              <MyCatLink children="Акции" bordered={true} />
            </a>
          </div>
          <div>
            <a className="city">
              <MyCatLink children="Тольятти" />
            </a>
            <IconHeaderPC title="contacts" />
            <IconHeaderPC title="docs" />
            <IconHeaderPC title="profile" />
            <IconCartHeaderPC count={count} />
          </div>
        </Toolbar>
      </AppBar>
      {scroll ? <div className="blockShadow" /> : null}
    </>
  );
};

NavBarPC.propTypes = {
  scroll: PropTypes.bool,
  count: PropTypes.string.isRequired,
};
