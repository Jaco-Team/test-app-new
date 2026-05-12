import { PromokodyPC } from '../../../entities/profile/ui/promo-code-list/PromokodyPC';
import { BreadСrumbsPC } from '../../../shared/ui/breadcrumbs/BreadСrumbsPC';

import './PromokodyPagePC.scss';

export const PromokodyPagePC = ({ header, promokod, footer, data }: Record<string, any>) => {
  const arrayPromokod = Array.from({ length: 8 }, () => promokod);

  return (
    <>
      {header ? null : null}
      <div className="promokodyPC">
        <div className="promokodyContainerPC">
          <div className="header">Мои промокоды</div>
          <div className="promoListPC">
            {arrayPromokod.map((item, key) => (
              <PromokodyPC key={key} {...item} />
            ))}
          </div>
        </div>
        <div>
          <BreadСrumbsPC {...data} />
        </div>
      </div>
      {footer ? null : null}
    </>
  );
};

