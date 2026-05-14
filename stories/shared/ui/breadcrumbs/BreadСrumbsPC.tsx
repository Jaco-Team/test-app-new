import { Fragment, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import './BreadСrumbsPC.scss';

export interface BreadCrumbsItem {
  link?: string;
  text: string;
}

export interface BreadCrumbsPCProps {
  activePage: string;
  list: BreadCrumbsItem[];
  title: string;
}

export const BreadСrumbsPC = ({
  activePage,
  list,
  title,
}: BreadCrumbsPCProps) => {
  const [activeLink, setActiveLink] = useState('');
  const [notActiveLink, setNotActiveLink] = useState('');

  return (
    <div className="breadCrumbsPC">
      <span>{title}</span>
      <ul>
        {list.map((item, key) => (
          <Fragment key={`${item.text}-${key}`}>
            {activePage !== 'about' ? (
              <li className={activePage === item.link ? 'activeMarker' : ''}>
                <a className={activePage === item.link ? 'active' : ''}>
                  {item.text}
                </a>
              </li>
            ) : (
              <li
                className={
                  activeLink === item.text && activeLink !== notActiveLink
                    ? 'activeMarker'
                    : ''
                }
              >
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
          </Fragment>
        ))}
      </ul>
    </div>
  );
};
