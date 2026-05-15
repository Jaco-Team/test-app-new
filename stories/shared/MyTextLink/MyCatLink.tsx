import React, { AnchorHTMLAttributes, HTMLAttributes } from 'react';
import './MyCatLink.scss';
import { ArrowDownHeaderPC } from '../Icons';

interface MyCatLinkProps {
  variant?: 'link' | 'text';
  bordered?: boolean;
  arrow?: boolean;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  className?: string;
}

type LinkProps = MyCatLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;
type TextProps = MyCatLinkProps & HTMLAttributes<HTMLParagraphElement>;

export const MyCatLink: React.FC<MyCatLinkProps> = ({
  variant = 'text',
  bordered = false,
  arrow = false,
  children,
  ...props
}) => {
  const className = ['MyCatLink', bordered ? 'bordered' : '']
    .filter(Boolean)
    .join(' ');

  if (variant === 'link') {
    const linkProps = props as LinkProps;
    return (
      <a className={className} {...linkProps}>
        {children}
        {arrow && <ArrowDownHeaderPC />}
      </a>
    );
  }

  const textProps = props as TextProps;
  return (
    <p className={className} {...textProps}>
      {children}
      {arrow && <ArrowDownHeaderPC />}
    </p>
  );
};
