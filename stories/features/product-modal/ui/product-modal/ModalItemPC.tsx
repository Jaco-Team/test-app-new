
import { Badge } from '../../../../entities/product/ui/badge/Badge';
import { ModalItemPCimg } from '../product-image/ModalItemPCimg';
import { ModalItemPCdesc } from '../product-description/ModalItemPCdesc';
import { MyButton } from '../../../../shared/ui/button/MyButton';
import { ModalItemPClist } from '../product-list/ModalItemPClist';

import './ModalItemPC.scss';

export const ModalItemPC = ({ img_name, title, is_new, is_hit, desc, count, typeModal, list }: Record<string, any>) => {
  return (
    <div className="modalItemPC" style={{ background: typeModal === 'start' ? '#FFFFFF' : '#E6E6E6' }}>
      {typeModal !== 'start' ? null : (
        <div className="ImgItem">
          <ModalItemPCimg img_name={img_name} />
          {parseInt(is_new) == 0 ? parseInt(is_hit) == 0 ? null : 
            <Badge size={'big'} type={'hit'} view={'pc'} />
             : 
            <Badge size={'big'} type={'new'} view={'pc'} />
          }
        </div>
      )}

      {typeModal === 'start' ? null : (
        <div className="FirstItem">
          <ModalItemPClist {...list} />
        </div>
      )}

      <div className="SecondItem">
        <ModalItemPCdesc {...desc} />
        <MyButton {...count} />
      </div>
    </div>
  );
};

