import { Promokody } from '@stories/entities/profile/ui/promo-code-list/Promokody';
import { BreadCrumbs } from '@stories/shared/ui/breadcrumbs/BreadCrumbs';
import type { BreadcrumbsData } from '@stories/fixtures/breadcrumbs';

import './PromokodyPage.scss';

interface PromokodyPageProps {
  header?: unknown;
  promokod: {
    promokody: Record<string, unknown>;
  };
  footer?: unknown;
  data: BreadcrumbsData;
}

export const PromokodyPage = ({
  header,
  promokod,
  footer,
  data,
}: PromokodyPageProps) => {
  const arrayPromokod = Array.from({ length: 8 }, () => promokod);

  return (
    <>
      {header ? null : null}
      <div className="promokodyPC">
        <div className="promokodyContainerPC">
          <div className="header">Мои промокоды</div>
          <div className="promoListPC">
            {arrayPromokod.map((item, key) => (
              <Promokody key={key} {...item} />
            ))}
          </div>
        </div>
        <div>
          <BreadCrumbs {...data} />
        </div>
      </div>
      {footer ? null : null}
    </>
  );
};
