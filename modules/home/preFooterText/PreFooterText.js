import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconArrowDown } from '@/ui/Icons';

const stripHtmlTags = (html) =>
  String(html || '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export default function PreFooterText({ htmlContent = '' }) {
  const [expanded, setExpanded] = useState(false);
  const [hasToggle, setHasToggle] = useState(false);
  const contentRef = useRef(null);

  const normalizedHtml = useMemo(
    () => String(htmlContent || '').trim(),
    [htmlContent]
  );

  const plainText = useMemo(
    () => stripHtmlTags(normalizedHtml),
    [normalizedHtml]
  );
  const isVisible = plainText.length > 0;

  const measureOverflow = useCallback(() => {
    const contentEl = contentRef.current;
    if (!contentEl) {
      return;
    }

    const hadExpandedClass = contentEl.classList.contains('isExpanded');
    const hadCollapsedClass = contentEl.classList.contains('isCollapsed');

    contentEl.classList.remove('isExpanded');
    contentEl.classList.add('isCollapsed');

    const isOverflowing = contentEl.scrollHeight > contentEl.clientHeight + 1;

    if (hadExpandedClass) {
      contentEl.classList.add('isExpanded');
    } else {
      contentEl.classList.remove('isExpanded');
    }

    if (!hadCollapsedClass) {
      contentEl.classList.remove('isCollapsed');
    }

    setHasToggle(isOverflowing);

    if (!isOverflowing) {
      setExpanded(false);
    }
  }, []);

  useEffect(() => {
    setExpanded(false);
  }, [normalizedHtml]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const handleResize = () => {
      window.requestAnimationFrame(measureOverflow);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible, measureOverflow, normalizedHtml]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="homePreFooterText">
      <div
        ref={contentRef}
        className={`homePreFooterText__content ${
          hasToggle ? (expanded ? 'isExpanded' : 'isCollapsed') : 'isExpanded'
        }`}
        dangerouslySetInnerHTML={{ __html: normalizedHtml }}
      />

      {hasToggle ? (
        <button
          type="button"
          className={`homePreFooterText__toggle ${expanded ? 'isExpanded' : ''}`}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span>{expanded ? 'Свернуть' : 'Подробнее'}</span>
          <IconArrowDown className="homePreFooterText__toggleIcon" />
        </button>
      ) : null}
    </div>
  );
}
