import { memo, useEffect } from 'react';
import { ArrowUpIcon } from '../../icons';
import './ArrowUp.scss';
import useGetPageScroll from '@/src/shared/lib/useGetPageScroll';
import { cn } from '../../foundation/classNames';

function ArrowUp() {
  const { scrollY } = useGetPageScroll();
  const scrollToTop = () => window?.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div
      className={cn('ui-arrow-up', scrollY < 150 && 'ui-arrow-up--hidden')}
      onClick={scrollToTop}
    >
      <ArrowUpIcon fill="#fff" />
    </div>
  );
}
export default memo(ArrowUp);
