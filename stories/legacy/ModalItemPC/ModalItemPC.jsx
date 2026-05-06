import PropTypes from 'prop-types';

import { Badge } from '../Badge/Badge';
import { ModalItemPCimg } from '../ModalItemPCimg/ModalItemPCimg';
import { ModalItemPCdesc } from '../ModalItemPCdesc/ModalItemPCdesc';
import { MyButton } from '../MyButton/MyButton';
import { ModalItemPClist } from '../ModalItemPClist/ModalItemPClist';

import './ModalItemPC.scss';

export const ModalItemPC = ({ img_name, title, is_new, is_hit, desc, count, typeModal, list }) => {
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

ModalItemPC.propTypes = {
  title: PropTypes.string.isRequired,
  img_name: PropTypes.string.isRequired,
  is_new: PropTypes.string.isRequired,
  is_hit: PropTypes.string.isRequired,
  desc: PropTypes.object,
  typeModal: PropTypes.string.isRequired,
  list: PropTypes.object,
};
