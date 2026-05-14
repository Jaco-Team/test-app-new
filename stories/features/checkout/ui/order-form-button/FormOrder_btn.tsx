import { Icon } from '@stories/shared/Icon/Icon';
import { ArrowDownBasketModalPC } from '@stories/shared/Icons.js';

import MyTextInput from '@stories/shared/ui/text-input/MyTextInput';
import './FormOrder_btn.scss';

export const FormOrder_btn = ({
  text,
  icon,
  placeholder,
  open,
  ...props
}: Record<string, any>) => {
  return (
    <>
      {icon !== 'comment' ? (
        <div className="btnChoice" {...props}>
          <Icon icon={icon} element="form_order" />
          {icon !== 'sdacha' ? (
            <>
              <span
                style={{
                  color: text ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.4)',
                }}
              >
                {text ? text : placeholder}
              </span>
              {open ? (
                <ArrowDownBasketModalPC
                  style={{ transform: 'rotate(180deg)' }}
                />
              ) : (
                <ArrowDownBasketModalPC />
              )}
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
          <Icon icon={icon} element="form_order" />
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
