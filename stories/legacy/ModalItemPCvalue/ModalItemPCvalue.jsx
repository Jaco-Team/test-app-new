import PropTypes from 'prop-types';
import './ModalItemPCvalue.scss';

export const ModalItemPCvalue = ({ number, kkal, title, protein, tmp_desc, fat, carbohydrates }) => {
  return (
    <div className="valueItem">
      <span className="itemNumber">{number}.</span>

      <div className="itemValueColumn">
        <div className="itemValueRowMain">
          <span>{title}</span>
          <div>
            <span>{kkal}</span>
            <span>ккал</span>
          </div>
        </div>

        <div className="itemValueRow">
          <div className="ItemTitleValue">Состав: {tmp_desc}</div>

          <div>
            <div>
              <span>белки</span>
              <span className="dot"></span>
              <span className="ItemTitleValue">{protein} г</span>
            </div>

            <div>
              <span className="ItemTitleValue">жиры</span>
              <span className="dot"></span>
              <span className="ItemTitleValue">{fat} г</span>
            </div>

            <div>
              <span className="ItemTitleValue">углеводы</span>
              <span className="dot"></span>
              <span className="ItemTitleValue">{carbohydrates} г</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ModalItemPCvalue.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  kkal: PropTypes.string.isRequired,
  protein: PropTypes.string.isRequired,
  tmp_desc: PropTypes.string.isRequired,
  fat: PropTypes.string.isRequired,
  carbohydrates: PropTypes.string.isRequired,
};
