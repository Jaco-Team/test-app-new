import PropTypes from 'prop-types';

import { MyButton } from '../MyButton/MyButton';
import MyTextInput from '../MyTextInput/MyTextInput';
import './ModalOrderDeletePC.scss';

const ans = [
  { id: 1, ans: 'Хочу отредактировать заказ' },
  { id: 2, ans: 'Изменились планы' },
  { id: 3, ans: 'Долгое время ожидания' },
  { id: 4, ans: 'Недостаточно средств' },
  { id: 5, ans: 'Просто отмените' },
  { id: 6, ans: 'Другое' },
];

export const ModalOrderDeletePC = ({ variant, text }) => {
  return (
    <div className="modalOrderDeletePC">
      <span className="header_status">Отменить заказ?</span>
      <div className="header_text">
        <span>Вы можете отменить в любой момент.</span>
        <span>Почему решили отменить сейчас?</span>
      </div>
      <div className="header_table">
        {ans.map((item, key) => (
          <span className={parseInt(variant) === item.id ? 'active' : ''} key={key}>
            {item.ans}
          </span>
        ))}
      </div>
      <div className="header_custom_text" style={{ visibility: parseInt(variant) == 6 ? 'visible' : 'hidden' }}>
        <MyTextInput variant="standard" value={text} />
      </div>
      <div className='header_btn'>
        <MyButton children="Отменить" variant="secondary" size="medium" />
        <MyButton children="Вернуться" variant="primary" size="medium" />
      </div>
    </div>
  );
};

ModalOrderDeletePC.propTypes = {
  variant: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
