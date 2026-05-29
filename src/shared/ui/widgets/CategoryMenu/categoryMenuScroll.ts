export type CategoryRowScrollAlign = 'padding' | 'edge';

export function scrollRowToActiveButton(
  row: HTMLDivElement | null,
  align: CategoryRowScrollAlign = 'padding'
): void {
  const activeNode = row?.querySelector<HTMLButtonElement>(
    '.ui-category-button--active'
  );

  if (!row || !activeNode) {
    return;
  }

  const maxScroll = row.scrollWidth - row.clientWidth;
  if (maxScroll <= 0) {
    return;
  }

  const inset =
    align === 'padding'
      ? Number.parseFloat(getComputedStyle(row).paddingLeft) || 0
      : 0;
  const targetLeft = Math.max(
    0,
    Math.min(activeNode.offsetLeft - inset, maxScroll)
  );

  if (Math.abs(row.scrollLeft - targetLeft) < 1) {
    return;
  }

  row.scrollTo({
    left: targetLeft,
    behavior: align === 'padding' ? 'smooth' : 'auto',
  });
}
