import {useState} from 'react';
import PropTypes from 'prop-types';
import { Link as ScrollLink } from 'react-scroll';
import './BreadСrumbsPC.scss';

export const BreadСrumbsPC = ({ activePage, list, title }) => {
  const [activeLink, setActiveLink] = useState('');
  const [notActiveLink, setNotActiveLink] = useState('');

  return (
    <div className="breadCrumbsPC">
      <span>{title}</span>
      <ul>
        {list.map((item, key) => (
          <>
            {activePage !== 'about' ? (
              <li key={key} className={activePage === item.link ? 'activeMarker' : ''}>
                <a className={activePage === item.link ? 'active' : ''}>{item.text}</a>
              </li>
            ) : (
              <li key={key} className={activeLink === item.text && activeLink !== notActiveLink ? 'activeMarker' : ''}>
                <ScrollLink 
                  to={`tag${key + 1}`} 
                  activeClass="active" 
                  spy={true} 
                  smooth={true} 
                  offset={-65} 
                  onSetActive={() => setActiveLink(item.text)}
                  onSetInactive={() => setNotActiveLink(item.text)}
                >
                  {item.text}
                </ScrollLink>
              </li>
            )}
          </>
        ))}
      </ul>
    </div>
  );
};

BreadСrumbsPC.propTypes = {
  activePage: PropTypes.string.isRequired,
  list: PropTypes.array,
  title: PropTypes.string.isRequired,
};
