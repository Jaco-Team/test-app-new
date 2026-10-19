import './ItemHome.scss';
import { placeholder_img } from '@/public/placeholder_img';
import { createProductImageSources } from '@stories/entities/product/model/productImage';
import { ResponsiveImage } from '@stories/shared/ui/responsive-image/ResponsiveImage';
import { Badge } from '../badge/Badge';
import { ProductItem } from '@stories/entities/product/ui/product-card/model/types';

export const ItemHome = ({
  name,
  img_app,
  weight,
  marc_desc,
  price,
  count,
  is_new,
  is_hit,
  count_part,
}: ProductItem) => {
  const itemCount = Number.parseInt(count || '0', 10) || 0;
  const itemPrice = Number.parseInt(price || '0', 10) || 0;
  const productImage = createProductImageSources(img_app, 'card');

  return (
    <div className={['ItemHomePc', itemCount > 0 ? 'active' : ''].join(' ')}>
      <div className="BlockIMG">
        <ResponsiveImage
          {...productImage}
          alt={name}
          width={585}
          height={585}
          fallbackSrc={placeholder_img}
        />

        {parseInt(is_new) == 0 ? (
          parseInt(is_hit) == 0 ? null : (
            <Badge size={'big'} type={'hit'} view={'pc'} />
          )
        ) : (
          <Badge size={'big'} type={'new'} view={'pc'} />
        )}
      </div>

      <div className="content-wrapper">
        <span className="title">{name}</span>
        <span className="weight">
          {count_part} ролла | {count_part} шт. | {weight} г
        </span>
        <span className="description">{marc_desc}</span>

        {itemCount > 0 ? (
          <div className="btn_count">
            <button className="minus">–</button>
            <span>{count}</span>
            <button className="plus">+</button>
          </div>
        ) : (
          <button className="btn_price">
            {new Intl.NumberFormat('ru-RU').format(itemPrice)} ₽
          </button>
        )}
      </div>
    </div>
  );
};
