import type { HTMLAttributes } from 'react';
import { cn } from '../../foundation/classNames';
import './Footer.scss';

export interface FooterLinkGroup {
  title: string;
  items: { label: string; href: string }[];
}

export interface FooterSocialLink {
  label: string;
  href: string;
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  citySlug?: string;
  cityLabel?: string;
  linkGroups?: FooterLinkGroup[];
  socialLinks?: FooterSocialLink[];
  copyright?: string;
}

export function Footer({
  citySlug = 'samara',
  cityLabel = 'Самара',
  linkGroups = [],
  socialLinks = [],
  copyright = '© Жако',
  className,
  ...props
}: FooterProps) {
  return (
    <footer className={cn('ui-footer', className)} {...props}>
      <div className="ui-footer__inner">
        <div className="ui-footer__groups">
          {linkGroups.map((group) => (
            <div key={group.title} className="ui-footer__group">
              <h3 className="ui-footer__group-title">{group.title}</h3>
              <ul className="ui-footer__links">
                {group.items.map((item) => (
                  <li key={`${group.title}-${item.label}`}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {socialLinks.length > 0 ? (
          <nav className="ui-footer__social" aria-label="Социальные сети">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>

      <div className="ui-footer__bottom">
        <span className="ui-footer__city">{cityLabel}</span>
        <span className="ui-footer__copy">{copyright}</span>
      </div>
    </footer>
  );
}
