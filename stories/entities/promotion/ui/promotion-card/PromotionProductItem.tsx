import Image from 'next/image';

import './PromotionProductItem.scss';

export const PromotionProductItem = ({
  number,
  title,
  img_app,
  desc,
  typePrice,
  price,
  count,
}: Record<string, any>) => {
  return (
    <div className="promotionProductItem promotion-card--banner promotionProductItemFont">
      <span className="number itemNumber">{number}.</span>

      <div className="itemImg">
        <Image
          alt={title}
          src={'https://cdnimg.jacofood.ru/' + img_app + '_1420x1420.jpg'}
          width={1420}
          height={1420}
          priority={true}
        />
      </div>

      <div className="itemDesc">
        <span className="ItemName">{title}</span>
        <span className="ItemDesk">{desc}</span>

        {typePrice == 'text' ? (
          <div className="price text containerBTNitem">
            <span>{new Intl.NumberFormat('ru-RU').format(price)} ₽</span>
          </div>
        ) : (
          false
        )}

        {typePrice == 'active' ? (
          parseInt(count) == 0 ? (
            <div className="containerBTNitem">
              <button className="price button">
                {new Intl.NumberFormat('ru-RU').format(price)} ₽
              </button>
            </div>
          ) : (
            <div className="containerBTNitem">
              <div className="price button">
                <button className="minus">–</button>
                <span>{count}</span>
                <button className="plus">+</button>
              </div>
            </div>
          )
        ) : (
          false
        )}
      </div>
    </div>
  );
};
