import React, { useEffect, useState } from 'react';

import { useFooterStore } from '@/components/store';

import Link from 'next/link';
import Typography from '@mui/material/Typography';

import { NewVKIcon, OdnIcon, TGIcon, ArrowUp } from '@/ui/Icons.js';

export default React.memo(function FooterPC({ cityName }) {

  const [cookie, setCookie] = useState(true);
  const [showArrow, setShowArrow] = useState(false);

  const [links] = useFooterStore((state) => [state.links]);

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
    if (!localStorage.getItem('setCookie') && !localStorage.getItem('setCookie')?.length){
      setCookie(false);
    } 
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
            <Link href={'/' + cityName + '/company-details'}>Реквизиты</Link>
            <Link href={'/' + cityName + '/contacts'}>Контакты</Link>
          </div>
          <div className="column">
            <Typography component="span">Документы</Typography>
            { Object.keys(links).length == 0 ? false : 
              <Link href={links?.link_allergens ?? ''} target="_blank">Калорийность, состав, БЖУ</Link>
            }
            <Link href={'/' + cityName + '/publichnaya-oferta'}>Публичная оферта</Link>
            <Link href={'/' + cityName + '/politika-konfidencialnosti'}>Политика конфиденциальности</Link>
            <Link href={'/' + cityName + '/legal'}>Согласие на обработку персональных данных</Link>
            <Link href={'/' + cityName + '/politika-legal'}>Политика в отношении обработки метрических данных</Link>
            <Link href={'/' + cityName + '/instpayorders'}>Правила оплаты</Link>
          </div>
          <div className="column">
            <Typography component="span">Работа в жако</Typography>
            <Link href={'/' + cityName + '/jobs'}>Вакансии</Link>
          </div>
          <div className="column">
            <Typography component="span">Франшиза</Typography>
            <Link href={'https://franchise.jacofood.ru'} target="_blank">Сайт франшизы</Link>
            <Link href={'https://invest.jacofood.ru'} target="_blank">Сайт для инвестиций</Link>
          </div>
          <div className="container">
            <div className="icon">
              { Object.keys(links).length == 0 ? false :
                <>
                  <Link href={links?.link_vk ?? ''} target="_blank"><NewVKIcon /></Link>
                  <Link href={links?.link_tg ?? ''} target="_blank"><TGIcon /></Link>
                  <Link href={links?.link_ok ?? ''} target="_blank" style={{ marginRight: 0 }}><OdnIcon /></Link>
                </>
              }
            </div>
            
          </div>
        </div>
        <div className="ContainerCopyFooter">
          <div className="copy">
            <Typography component="span" className="copy">{new Date().getFullYear()} © ООО «Мистер Жако», ИНН: 6321390811</Typography>
          </div>
        </div>

        {cookie ? null : (
          <div className="FooterLegal">
            <div className="containerLegal">
              <div className="text">
                <p>
                  Мы{' '}
                  <Link className="link" href={'/' + cityName + '/politika-legal'}>используем</Link>{' '}
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
