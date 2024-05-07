import PropTypes from 'prop-types';

import { IconPC } from '../IconPC/IconPC';
import { ArrowDownBasketModalPC } from '../Icons';

import MyTextInput from '../MyTextInput/MyTextInput';
import './FormOrderPC_btn.scss';

export const FormOrderPC_btn = ({text, icon, placeholder, open, ...props}) => {
  return (
    <>
      {icon !== 'comment' ? (
        <div className="btnChoice" {...props}>
          <IconPC icon={icon} element="form_order" />
          {icon !== 'sdacha' ? (
            <>
              <span className={text?.length > 25 ? 'shadowSpan' : null} style={{color: text ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.4)'}}>{text ? text : placeholder}</span>
              {open ? <ArrowDownBasketModalPC style={{ transform: 'rotate(180deg)' }} /> : <ArrowDownBasketModalPC />}
            </>
          ) : (
            <MyTextInput
              autoFocus
              type="number"
              value={text}
              variant="outlined"
              className="sdacha"
              placeholder={placeholder}
            />
          )}
        </div>
      ) : (
        <div className="comment">
          <IconPC icon={icon} element="form_order" />
          <MyTextInput
            autoFocus
            value={text}
            multiline
            maxRows={3}
            variant="outlined"
            className="message"
            placeholder={placeholder}
          />
        </div>
      )}
    </>
  );
};

FormOrderPC_btn.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  open: PropTypes.bool,
};
