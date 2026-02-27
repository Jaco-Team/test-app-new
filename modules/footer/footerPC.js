import React, { useEffect, useState } from 'react';
import {useHomeStore} from '@/components/store';

import Link from 'next/link';
import Typography from '@mui/material/Typography';

import { NewVKIcon, OdnIcon, TGIcon, RutubeIcon, ArrowUp } from '@/ui/Icons.js';

export default React.memo(function FooterPC({ cityName, active_page, links }) {

  const [cookie, setCookie] = useState(true);
  const [showArrow, setShowArrow] = useState(false);

  const [badge_filter, tag_filter, text_filter] = useHomeStore((state) => [state.badge_filter, state.tag_filter, state.text_filter]);

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

  const ext = (url) => url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : { href: '/#' };

  return (
    <>
      <div className={showArrow ? 'ArrowPC' : 'ArrowHidden'} onClick={scrollUp} style={{marginTop: active_page === 'sitemap' || active_page === 'contacts' || (active_page === 'home' && (badge_filter || tag_filter || text_filter)) ? '-4.3321299638989vw' : null, transform: active_page === 'contacts' ? 'translate(0, -50%)' : null}}>
        <ArrowUp />
      </div>
      <footer className='footerPC' style={{ minHeight: cookie ? '36.101083032491vw' : '45.126353790614vw', marginTop: active_page === 'contacts' ? null : '1.8050541516245vw' }}>
        <div className="ContainerPCFooter">
          <div className="column">
            <Typography component="span">Жако</Typography>
            <Link href={'/' + cityName + '/about'}>О Компании</Link>
            <Link href={'/' + cityName + '/company-details'}>Реквизиты</Link>
            <Link href={'/' + cityName + '/contacts'}>Контакты</Link>
          </div>
          <div className="column">
            <Typography component="span">Документы</Typography>
            {Object.keys(links || {}).length === 0 ? false :
              <Link {...ext(links?.link_allergens)}>
                Калорийность, состав, БЖУ
              </Link>
            }
            <Link href={'/' + cityName + '/publichnaya-oferta'}>Публичная оферта</Link>
            <Link href={'/' + cityName + '/politika-konfidencialnosti'}>Политика конфиденциальности</Link>
            <Link href={'/' + cityName + '/legal'}>Согласие на обработку персональных данных</Link>
            <Link href={'/' + cityName + '/politika-legal'}>Политика в отношении обработки метрических данных</Link>
            <Link href={'/' + cityName + '/instpayorders'}>Правила оплаты</Link>
            <Link href={'/' + cityName + '/sitemap'}>Карта сайта</Link>
          </div>
          <div className="column">
            <Typography component="span">Работа в жако</Typography>
            <Link href={'/' + cityName + '/jobs'}>Вакансии</Link>
          </div>
          <div className="column">
            <Typography component="span">Франшиза</Typography>
            <Link  {...ext('https://franchise.jacofood.ru')}>
              Сайт франшизы
            </Link>
            <Link {...ext('https://invest.jacofood.ru')}>
              Сайт для инвестиций
            </Link>
          </div>
          <div className="container">
            <div className="icon" role="navigation" aria-label="Мы в социальных сетях">
              {Object.keys(links || {}).length === 0 ? false :
                <>
                  <Link {...ext(links?.link_vk)} aria-label="Мы ВКонтакте">
                    <NewVKIcon aria-hidden="true" focusable="false" />
                  </Link>
                  <Link {...ext(links?.link_tg)} aria-label="Мы в Telegram">
                    <TGIcon aria-hidden="true" focusable="false" />
                  </Link>
                  <Link {...ext(links?.link_ok)} aria-label="Мы в Одноклассниках">
                    <OdnIcon aria-hidden="true" focusable="false" />
                  </Link>
                  <Link {...ext(links?.link_rt)} aria-label="Мы в RuTube">
                    <RutubeIcon aria-hidden="true" focusable="false" />
                  </Link>
                </>
              }
            </div>
            
          </div>
        </div>
        <div className="ContainerCopyFooter">
          <div className="copy">
            <Typography component="span" className="copy">{new Date().getFullYear()} © Жако</Typography>
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
