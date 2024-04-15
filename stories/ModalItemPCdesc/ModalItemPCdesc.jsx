import PropTypes from 'prop-types';
import './ModalItemPCdesc.scss';
import { ModalItemPCicon } from '../ModalItemPCicon/ModalItemPCicon';

export const ModalItemPCdesc = ({ title_desk, cat_id, typeModal, count_part_new, size_pizza, count_part, weight, id, foodValue, marc_desc, tmp_desc }) => {
  return (
    <div>
      <div className='titleItem'>{title_desk}</div>

      <div className="dop" >
        <div className="dop_text">
          {parseInt(cat_id) != 4 ? null : <span className="first_text" style={{ cursor: typeModal === 'start' ? 'pointer' : null }}>{count_part_new}</span>}

          {parseInt(cat_id) == 4 ? <span className="divider"/> : null}

          {parseInt(cat_id) == 5 || parseInt(cat_id) == 6 || parseInt(cat_id) == 7 || parseInt(cat_id) == 15 ? null : (
            <span style={{padding: parseInt(cat_id) == 4 ? '0 0.54151624548736vw' : '0 1.4440433212996vw 0 0' }}>
              {parseInt(cat_id) == 14 ? size_pizza : count_part}{' '}
              {parseInt(cat_id) == 14 ? 'см' : parseInt(cat_id) == 6 ? 'л' : 'шт.'}{' '}
            </span>
          )}

          {parseInt(cat_id) == 5 || parseInt(cat_id) == 6 || parseInt(cat_id) == 7 || parseInt(cat_id) == 15 ? null : <span className="divider"/>}

          <span style={{paddingLeft: parseInt(count_part) == 1 ? 0 : '1.4440433212996vw'}}>
            {new Intl.NumberFormat('ru-RU').format(weight)}{' '}
            {parseInt(id) == 17 || parseInt(id) == 237 ? 'шт.' : parseInt(cat_id) == 6 ? 'л' : 'г'}
          </span>
        </div>

        {id === '17' || id === '237' ? null :
          <div className="dop_icon" style={{ cursor: typeModal === 'start' ? 'pointer' : null }}>
            <ModalItemPCicon foodValue={foodValue} />
          </div>
        }

      </div>

      <span className='desc'>{marc_desc.length > 0 ? marc_desc : tmp_desc}</span>

    </div>
  );
};

ModalItemPCdesc.propTypes = {
  title_desk: PropTypes.string.isRequired,
  cat_id: PropTypes.string.isRequired,
  typeModal: PropTypes.string.isRequired,
  count_part_new: PropTypes.string.isRequired,
  size_pizza: PropTypes.string.isRequired,
  count_part: PropTypes.string.isRequired,
  weight: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  marc_desc: PropTypes.string.isRequired,
  tmp_desc: PropTypes.string.isRequired,
};
