import { ArrowUp } from '../../Icons';

import './ScrollTopButton.scss';

interface ScrollTopButtonProps {
  visible?: boolean;
  page?: string;
}

export function ScrollTopButton({
  visible = false,
  page,
}: ScrollTopButtonProps) {
  return (
    <button
      className={visible ? 'scroll-top-button' : 'ArrowHidden'}
      style={{
        marginTop: page === 'contacts' ? '-4.3321299638989vw' : undefined,
        transform: page === 'contacts' ? 'translate(0, -50%)' : undefined,
      }}
      type="button"
      aria-label="Наверх"
    >
      <ArrowUp />
    </button>
  );
}
