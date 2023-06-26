import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Typography from '@mui/material/Typography';

import { NewVKIcon, OdnIcon, TGIcon, ArrowUp } from '@/ui/Icons.js';

export default React.memo(function FooterPC({ cityName }) {

  const [cookie, setCookie] = useState(true);
  const [showArrow, setShowArrow] = useState(false);

  const handlerArrow = () => setShowArrow(window.scrollY > 50);

  const scrollUp = () => window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });

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
      <div className={showArrow ? 'ArrowPC' : 'ArrowHidden'} onClick={scrollUp}>
        <ArrowUp />
      </div>
      <footer className="footerPC" style={{ height: cookie ? '36.101083032491vw' : '45.126353790614vw' }}>
        <div className="ContainerPCFooter">
          <div className="column">
            <Typography component="span">Жако</Typography>
            <Link href={'/' + cityName + '/about'}>О Компании</Link>
            <Link href={'/' + cityName + '/about'}>История компании</Link>
            <Link href={'/' + cityName + '/about'}>Реквизиты</Link>
            <Link href={'/' + cityName + '/contacts'}>Контакты</Link>
          </div>
          <div className="column">
            <Typography component="span">Документы</Typography>
            <Link href={'/' + cityName + '/about'}>Калорийность, состав, БЖУ</Link>
            <Link href={'/' + cityName + '/publichnaya-oferta'}>Публичная оферта</Link>
            <Link href={'/' + cityName + '/politika-konfidencialnosti'}>Политика конфиденциальности</Link>
            <Link href={'/' + cityName + '/instpayorders'}>Правила оплаты</Link>
          </div>
          <div className="column">
            <Typography component="span">Работа в жако</Typography>
            <Link href={'/' + cityName + '/jobs'}>Вакансии</Link>
            <Link href={'/' + cityName + '/about'}>Анкета для работы в кафе</Link>
            <Link href={'/' + cityName + '/about'}>Анкета для работы в Управляющей компании</Link>
            <Link href={'/' + cityName + '/about'}>Анкета поставщика</Link>
          </div>
          <div className="column" style={{ marginRight: '7.5812274368231vw' }}>
            <Typography component="span">Франшиза</Typography>
            <Link href={'/' + cityName + '/about'}>Сайт франшизы</Link>
            <Link href={'/' + cityName + '/about'}>Сайт для инвестиций</Link>
          </div>
          <div className="container">
            <div className="icon">
              <NewVKIcon />
              <TGIcon />
              <OdnIcon style={{ marginRight: 0 }}/>
            </div>
            <div className="copy">
              <Typography component="span" className="copy">{new Date().getFullYear()} © ООО «Мистер Жако»</Typography>
            </div>
          </div>
        </div>
        {cookie ? null : (
          <div className="FooterLegal">
            <div className="containerLegal">
              <div className="text">
                <p>
                  Мы{' '}
                  <Link className="link" href={'/' + cityName + '/politika-konfidencialnosti'}>используем</Link>{' '}
                  файлы «Cookie» и метрическую систему
                  «Яндекс.Метрика» для сбора и анализа информации о
                  производительности и использовании сайта. Продолжая пользоваться
                  сайтом, вы соглашаетесь на размещение файлов «Cookie» и
                  обработку данных метрических систем.
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
