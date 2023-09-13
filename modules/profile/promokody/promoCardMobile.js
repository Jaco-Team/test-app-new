import { useState } from 'react';

import Button from '@mui/material/Button';

export default function PromoCardMobile({ item, last, archive }) {
  //console.log('render PromoCardMobile');

  const [desc, setDesc] = useState(false);

  return (
    <div className="promoCardMobile promokodyMain" style={{ background: desc ? 'rgba(0, 0, 0, 0.07)' : item.back, marginBottom: last ? '10.25641025641vw' : '5.1282051282051vw' }}>
      {desc ? (
        <div className="promoDesc promokodyMain">
          <span>{item.term}</span>
          <span>{item.desc}</span>
        </div>
      ) : (
        <>
          <div className="promokodyName promokodyMain">
            <span>{item.name}</span>
            <span>{item.text}</span>
            <span style={{ background: item.color }}></span>
            <span>{archive ? '' : 'Срок действия:'} {item.time}</span>
          </div>

          <Button
            className="promokodyBTN"
            variant={archive ? 'outlined' : 'contained'}
            style={{ backgroundColor: archive ? null : item.color, border: archive ? '0.25641025641026vw solid #FFF' : 'none' }}
            disabled={archive}
            //onClick={}
          >
            <span style={{ textTransform: archive ? 'none' : 'lowercase', color: archive ? '#fff' : 'rgba(0, 0, 0, 0.8)' }}>
              {item.btn}
            </span>
          </Button>
        </>
      )}
      <span className="term" onClick={() => setDesc(!desc)}>
        {desc ? 'Обратно' : 'Условия акции'}
      </span>
    </div>
  );
}
