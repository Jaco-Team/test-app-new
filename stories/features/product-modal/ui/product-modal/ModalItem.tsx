import { Badge } from '@stories/entities/product/ui/badge/Badge';
import { ModalItemImg } from '../product-image/ModalItemImg';
import { ModalItemDesc } from '../product-description/ModalItemDesc';
import { MyButton } from '@stories/shared/ui/button/MyButton';
import { ModalItemList } from '../product-list/ModalItemList';

import './ModalItem.scss';

export const ModalItem = ({
  img_name,
  title,
  is_new,
  is_hit,
  desc,
  count,
  typeModal,
  list,
}: Record<string, any>) => {
  return (
    <div
      className={`modal-item modal-item--${typeModal === 'start' ? 'start' : 'detail'}`}
    >
      {typeModal !== 'start' ? null : (
        <div className="modal-item__image">
          <ModalItemImg img_name={img_name} />
          {parseInt(is_new) == 0 ? (
            parseInt(is_hit) == 0 ? null : (
              <Badge size={'big'} type={'hit'} view={'desktop'} />
            )
          ) : (
            <Badge size={'big'} type={'new'} view={'desktop'} />
          )}
        </div>
      )}

      {typeModal === 'start' ? null : (
        <div className="modal-item__list">
          <ModalItemList {...list} />
        </div>
      )}

      <div className="modal-item__details">
        <ModalItemDesc {...desc} />
        <MyButton {...count} />
      </div>
    </div>
  );
};
