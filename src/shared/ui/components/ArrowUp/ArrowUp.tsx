import { memo } from 'react';
import { ArrowUpIcon } from '../../icons';
import './ArrowUp.scss';
import useIsScrolled from '@/src/shared/lib/scroll/useIsScrolled';
import { cn } from '../../foundation/classNames';

function ArrowUp() {
  const isVisible = useIsScrolled(150);
  const scrollToTop = () => window?.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div
      className={cn('ui-arrow-up', !isVisible && 'ui-arrow-up--hidden')}
      onClick={scrollToTop}
    >
      <ArrowUpIcon fill="#fff" />
    </div>
  );
}
export default memo(ArrowUp);
