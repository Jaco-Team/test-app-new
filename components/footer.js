import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Typography from '@mui/material/Typography';

import { NewVKIcon, OdnIcon, TGIcon, ArrowUp } from '../ui/Icons.js';
import { useFooterStore } from './store.js';

const this_module = 'contacts';

export default React.memo(function Footer(props) {

  const { cityName } = props;
  const [links, getData] = useFooterStore((state) => [state.links, state.getData]);
  // const [Links, setLinks] = useState({});

  const [cookie, setCookie] = useState(false);
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
    if (JSON.stringify(links) === JSON.stringify({})) {
      getData(this_module, cityName);
    }

    if (localStorage.getItem('setCookie') && localStorage.getItem('setCookie').length > 0) {
      setCookie(true);
    } else {
      setCookie(false);
    }
  }, [cityName, getData, links]);

  // useEffect(() => {
  //   setLinks(links);
  // }, [links, setLinks]);

  return (
    <>
      <div className={showArrow ? 'ArrowPC' : 'ArrowPCHidden'} onClick={scrollUp} style={{ bottom: cookie ? '2.1660649819495vw' : '16.606498194946vw' }}>
        <ArrowUp />
      </div>
      <footer className="footer" style={{ height: cookie ? '36.101083032491vw' : '50.541516245487vw' }}>
        <div className="Container">
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
          <div className="column" style={{ marginRight: '7.9678700361011vw' }}>
            <Typography component="span">Франшиза</Typography>
            <Link href={'/' + cityName + '/about'}>Сайт франшизы</Link>
            <Link href={'/' + cityName + '/about'}>Сайт для инвестиций</Link>
          </div>
          <div className="container">
            <div className="icon">
              <NewVKIcon style={{ width: '2.8364620938628vw', height: '1.684476534296vw' }} />
              <TGIcon style={{ width: '2.5014440433213vw', height: '2.084476534296vw' }} />
              <OdnIcon style={{ width: '1.641155234657vw', height: '2.7281588447653vw' }} />
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
                Мы используем файлы «Cookie» и метрическую систему
                «Яндекс.Метрика» для сбора и анализа информации о
                производительности и использовании сайта. Продолжая пользоваться
                сайтом, вы соглашаетесь на размещение файлов «Cookie» и
                обработку данных метрических систем.
              </div>
              <Link className="buttonDetail" href={'/' + cityName + '/politika-konfidencialnosti'}>
                <span>Подробнее</span>
              </Link>
              <div className="buttonAccept" onClick={acceptCookie}>
                <span>Принять</span>
              </div>
            </div>
          </div>
        )}
      </footer>
    </>
  );
});
