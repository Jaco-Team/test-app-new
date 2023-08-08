import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import Typography from '@mui/material/Typography';

import { useCartStore } from '@/components/store.js';

import { NewVKIcon, OdnIcon, TGIcon, ArrowUp, BasketFooterMobile } from '@/ui/Icons.js';

export default React.memo(function FooterMobile({ cityName, active_page }) {
  const [cookie, setCookie] = useState(true);
  const [showArrow, setShowArrow] = useState(false);

  const [itemsCount, allPrice, allPriceWithoutPromo] = useCartStore((state) => [state.itemsCount, state.allPrice, state.allPriceWithoutPromo]);

  const handlerArrow = () => setShowArrow(window.scrollY > 50);

  const scrollUp = () =>
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });

  const acceptCookie = () => {
    localStorage.setItem('setCookie', true);
    setCookie(true);
  };

  useEffect(() => {
    window.addEventListener('scroll', handlerArrow);
    return () => window.removeEventListener('scroll', handlerArrow);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('setCookie') && !localStorage.getItem('setCookie')?.length) setCookie(false);
  }, []);

  return (
    <>
      <div className='containerArrowBasket' style={{ bottom: cookie ? '3.4188034188034vw' : '37.094017094017vw', 
        width: itemsCount && active_page === 'home' ? '64.529914529915vw' : '10.25641025641vw', left: itemsCount && active_page === 'home' ? '32.051282051282vw' : 
        '86.324786324786vw'}}>
        <Link href={'/' + cityName + '/cart'} className={itemsCount && active_page === 'home' ? 'BasketFooterMobile' : 'BasketFooterMobileHidden'} >
          <span><BasketFooterMobile /></span>
          <span>{new Intl.NumberFormat('ru-RU').format(allPrice ? allPrice : allPriceWithoutPromo)} ₽</span>
        </Link>
        <div className={showArrow && active_page !== 'cart' ? 'ArrowMobile' : 'ArrowHidden'} onClick={scrollUp} 
          style={{marginTop: active_page === 'about' || active_page === 'document' || active_page === 'jobs' ? '-10.25641025641vw' : null}}>
          <ArrowUp />
        </div>
      </div>
      <footer className="footerMobile" style={{ height: cookie ? '128.20512820513vw' : '165.29914529915vw' }}>
        <div
          className="ContainerMobileFooter"
          ref={(node) => {
            if (node && cookie) {
              node.style.setProperty('margin-bottom', '13.675213675214vw', 'important');
            }
          }}
        >
          <div className="icon">
            <NewVKIcon />
            <TGIcon />
            <OdnIcon style={{ marginRight: 0 }} />
          </div>

          <div className="row" style={{ marginBottom: '11.965811965812vw' }}>
            <div className="column" style={{ marginRight: '2.991452991453vw', paddingLeft: '0.85470085470085vw', width: '36.752136752137vw' }}>
              <Typography component="span">Жако</Typography>
              <Link href={'/' + cityName + '/about'}>О Компании</Link>
              <Link href={'/' + cityName + '/about'}>История компании</Link>
              <Link href={'/' + cityName + '/about'}>Реквизиты</Link>
              <Link href={'/' + cityName + '/contacts'} style={{ marginBottom: 0 }}>
                Контакты
              </Link>
            </div>
            <div className="column">
              <Typography component="span">Документы</Typography>
              <Link href={'/' + cityName + '/about'}>Калорийность, состав, БЖУ</Link>
              <Link href={'/' + cityName + '/publichnaya-oferta'}>Публичная оферта</Link>
              <Link href={'/' + cityName + '/politika-konfidencialnosti'}>Политика конфиденциальности</Link>
              <Link href={'/' + cityName + '/instpayorders'} style={{ marginBottom: 0 }}>Правила оплаты</Link>
            </div>
          </div>

          <div className="row" style={{ marginBottom: '1.7094017094017vw' }}>
            <div className="column" style={{ marginRight: '2.991452991453vw', paddingLeft: '0.85470085470085vw', width: '36.752136752137vw' }}>
              <Typography component="span">Работа в жако</Typography>
              <Link href={'/' + cityName + '/jobs'}>Вакансии</Link>
              <Link href={'/' + cityName + '/about'}>Анкета для работы в кафе</Link>
              <Link href={'/' + cityName + '/about'}>Анкета для работы в Управляющей компании</Link>
              <Link href={'/' + cityName + '/about'} style={{ marginBottom: 0 }}>Анкета поставщика</Link>
            </div>
            <div className="column">
              <Typography component="span">Франшиза</Typography>
              <Link href={'/' + cityName + '/about'}>Сайт франшизы</Link>
              <Link href={'/' + cityName + '/about'}>Сайт для инвестиций</Link>
            </div>
          </div>

          <div className="copy">
            <Typography component="span" className="copy">{new Date().getFullYear()} © ООО «Мистер Жако»</Typography>
          </div>
        </div>

        {cookie ? null : (
          <div className="FooterLegalMobile">
            <div className="containerLegalMobile">
              <div className="line"></div>
              <div className="text">
                <p>Мы{' '}
                  <Link className="link" href={'/' + cityName + '/politika-konfidencialnosti'}>используем</Link>{' '}
                  файлы «Cookie» и метрическую систему «Яндекс.Метрика» для
                  сбора и анализа информации о производительности и
                  использовании сайта. Продолжая пользоваться сайтом, вы
                  соглашаетесь на размещение файлов «Cookie» и обработку данных
                  метрических систем.
                </p>
              </div>
              <div className="buttonAccept" onClick={acceptCookie}>
                <span>Согласен</span>
              </div>
            </div>
          </div>
        )}
      </footer>
    </>
  );
});
