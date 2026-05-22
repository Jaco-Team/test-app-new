import React from 'react';
import './BreadCrumbsPage.scss';

interface LinkItem {
  text: string;
  href?: string;
  onClick?: () => void;
}

interface BreadCrumbsPageProps {
  links: LinkItem[];
}

const BreadCrumbsPage: React.FC<BreadCrumbsPageProps> = ({ links }) => {
  return (
    <div className="BreadCrumbsPage">
      {links.map((link, index) => (
        <div
          key={index}
          className={`BreadCrumbsPage__item ${link.href || link.onClick ? 'BreadCrumbsPage__item_clickable' : ''}`}
          onClick={link.onClick}
        >
          <span className="BreadCrumbsPage__text">{link.text}</span>
          <svg
            className="BreadCrumbsPage__arrow"
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 13L7 7L1 1"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default BreadCrumbsPage;
