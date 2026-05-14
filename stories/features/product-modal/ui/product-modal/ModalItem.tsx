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
      className="modalItemPC"
      style={{ background: typeModal === 'start' ? '#FFFFFF' : '#E6E6E6' }}
    >
      {typeModal !== 'start' ? null : (
        <div className="ImgItem">
          <ModalItemImg img_name={img_name} />
          {parseInt(is_new) == 0 ? (
            parseInt(is_hit) == 0 ? null : (
              <Badge size={'big'} type={'hit'} view={'pc'} />
            )
          ) : (
            <Badge size={'big'} type={'new'} view={'pc'} />
          )}
        </div>
      )}

      {typeModal === 'start' ? null : (
        <div className="FirstItem">
          <ModalItemList {...list} />
        </div>
      )}

      <div className="SecondItem">
        <ModalItemDesc {...desc} />
        <MyButton {...count} />
      </div>
    </div>
  );
};
