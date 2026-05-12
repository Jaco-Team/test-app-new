import './MyButton.scss';

import { VectorCity } from '../../Icons.js';

type MyButtonProps = {
  variant?: string;
  size?: string;
  children?: React.ReactNode;
  arrow?: boolean;
  isOpen?: boolean;
  typeModal?: string;
  element?: string;
  count?: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const MyButton = ({ variant, size, children, arrow, isOpen, typeModal, element, count = 0, ...props }: MyButtonProps) => {

  if(!element) {
    const back = variant === 'city' && isOpen ? 'rgba(0, 0, 0, 0.05)' : variant === 'primary' || variant === 'cart' ? '#da1a32' : variant === 'auth' ? 'rgba(0, 0, 0, 0.1)' : '#fff';
  
    return (
      <button type="button" className={['MyButton', variant, size].join(' ')} style={{ backgroundColor: back}} {...props}>
        <span>{children}</span>
        {arrow ? !isOpen ? <VectorCity /> : <VectorCity style={{ transform: 'rotate(180deg)' }} /> : false}
      </button>
    );
  }

  if(element === 'modal') {
    return (
      <>
        {count === 0 ? (
          <button className='modalBTN' disabled={typeModal === 'start' ? false : true}>
            {new Intl.NumberFormat('ru-RU').format(Number(children))} ₽
          </button>
        ) : (
          <div className='containerModalBTN'>
            <button disabled={typeModal === 'start' ? false : true}>–</button>
            <span>{count}</span>
            <button disabled={typeModal === 'start' ? false : true}>+</button>
          </div>
        )}
      </>
    )
  }

};
