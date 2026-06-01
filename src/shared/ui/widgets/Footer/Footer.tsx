import type { HTMLAttributes } from 'react';
import { cn } from '../../foundation/classNames';
import { NewVKIcon, OdnIcon, RutubeIcon, TGIcon } from '../../icons/Icons';
import ArrowUp from '../../components/ArrowUp/ArrowUp';
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

const SOCIAL_ICONS: Record<string, typeof NewVKIcon> = {
  VK: NewVKIcon,
  Telegram: TGIcon,
  OK: OdnIcon,
  RuTube: RutubeIcon,
};

function FooterColumn({ group }: { group: FooterLinkGroup }) {
  return (
    <div className="ui-footer__column">
      <span className="ui-footer__column-title">{group.title}</span>
      {group.items.map((item) => (
        <a key={item.label} className="ui-footer__link" href={item.href}>
          {item.label}
        </a>
      ))}
    </div>
  );
}

export function Footer({
  linkGroups = [],
  socialLinks = [],
  copyright,
  citySlug: _citySlug,
  cityLabel: _cityLabel,
  className,
  ...props
}: FooterProps) {
  const year = new Date().getFullYear();
  const copyText = copyright ?? `© ${year} Жако`;

  const rowOne = linkGroups.filter((group) =>
    ['Жако', 'Документы'].includes(group.title)
  );
  const rowTwo = linkGroups.filter((group) =>
    ['Работа в жако', 'Франшиза'].includes(group.title)
  );

  return (
    <>
      <ArrowUp />
      <footer className={cn('ui-footer', className)} {...props}>
        <div className="ui-footer__inner">
          {socialLinks.length > 0 ? (
            <nav
              className="ui-footer__social"
              aria-label="Мы в социальных сетях"
            >
              {socialLinks.map((item) => {
                const Icon = SOCIAL_ICONS[item.label] ?? NewVKIcon;
                return (
                  <a
                    key={item.label}
                    className="ui-footer__social-link"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                );
              })}
            </nav>
          ) : null}

          <div className="ui-footer__rows">
            <div className="ui-footer__row">
              {rowOne.map((group) => (
                <FooterColumn key={group.title} group={group} />
              ))}
            </div>
            <div className="ui-footer__row">
              {rowTwo.map((group) => (
                <FooterColumn key={group.title} group={group} />
              ))}
            </div>
          </div>

          <p className="ui-footer__copy">{copyText}</p>
        </div>
      </footer>
    </>
  );
}
