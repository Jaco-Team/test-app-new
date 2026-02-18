import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import {useCartStore, useHomeStore, useProfileStore} from '@/components/store.js';

import { NewVKIcon, OdnIcon, TGIcon, ArrowUp, BasketFooterMobile } from '@/ui/Icons.js';
import ModalOrderMobile from '@/modules/profile/zakazy/mobile/modalOrderMobile';

export default function FooterMobile({ cityName, active_page, links }) {

  const [cookie, setCookie] = useState(true);
  const [showArrow, setShowArrow] = useState(false);
  
  const [itemsCount, itemsOffDops, dopListCart, checkPromo, allPrice] = useCartStore((state) => [state.itemsCount, state.itemsOffDops, state.dopListCart, state.checkPromo, state.allPrice]);

  const [setMenuCatPosition, isOpenFilter, transition_menu_mobile] = useHomeStore(state => [state.setMenuCatPosition, state.isOpenFilter, state.transition_menu_mobile]);
  const [ saveUserActions ] = useProfileStore((state) => [state.saveUserActions]);

  const handlerArrow = () => {
    setShowArrow(window.scrollY > 50);

    setMenuCatPosition(window.scrollY > 200);
  }

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

  let price1 = itemsOffDops.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);
  let price2 = dopListCart.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);
  
  let baseTotal = price1 + price2;

  const totalToShow = (checkPromo?.st && itemsOffDops.length ? allPrice : null) ?? baseTotal;

  const ext = (url) => url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : { href: '/#' };

  const openCart = () => {
    saveUserActions('open_card', '', 0);
  }

  return (
    <>
      <div className='containerArrowBasket' 
        style={{ bottom: cookie ? '3.4188034188034vw' : '37.094017094017vw', 
                 width: itemsCount && active_page === 'home' ? '64.529914529915vw' : '10.25641025641vw', 
                 left: itemsCount && active_page === 'home' ? '32.051282051282vw' : '86.324786324786vw', 
                 marginTop: active_page === 'home' && isOpenFilter ? transition_menu_mobile : active_page === 'home' ? '3.4188034188034vw' : null
                }}>

        <Link onClick={openCart} href={'/' + cityName + '/cart'} className={itemsCount && active_page === 'home' ? 'BasketFooterMobile' : 'BasketFooterMobileHidden'} >
          <span><BasketFooterMobile /></span>
          <span>{new Intl.NumberFormat('ru-RU').format(totalToShow)} ₽</span>
        </Link>

        <div className={showArrow && active_page !== 'cart' ? 'ArrowMobile' : 'ArrowHidden'} onClick={scrollUp} 
          style={{marginTop: active_page === 'sitemap' || active_page === 'document' || active_page === 'jobs' || active_page === 'contacts' || active_page === 'profile' || active_page === 'account' || active_page === 'address' || active_page === 'zakazy' ? '-10.25641025641vw' : null}}>
          <ArrowUp />
        </div>

      </div>
      
      <footer className="footerMobile" style={{ minHeight: cookie ? '128.20512820513vw' : '165.29914529915vw' }}>
        <div
          className="ContainerMobileFooter"
          ref={(node) => {
            if (node && cookie) {
              node.style.setProperty('margin-bottom', '13.675213675214vw', 'important');
            }
          }}
        >
          <div className="icon" role="navigation" aria-label="Мы в социальных сетях">
            {Object.keys(links || {}).length === 0 ? false :
              <>
                <Link {...ext(links?.link_vk)} aria-label="Мы ВКонтакте"><NewVKIcon aria-hidden="true" focusable="false" /></Link>
                <Link {...ext(links?.link_tg)} aria-label="Мы в Telegram"><TGIcon aria-hidden="true" focusable="false" /></Link>
                <Link {...ext(links?.link_ok)} style={{marginRight:0}} aria-label="Мы в Одноклассниках"><OdnIcon aria-hidden="true" focusable="false" /></Link>
              </>
            }
          </div>

          <div className="row" style={{ marginBottom: '11.965811965812vw' }}>
            <div className="column" style={{ marginRight: '2.991452991453vw', paddingLeft: '0.85470085470085vw', width: '36.752136752137vw' }}>
              <Typography component="span">Жако</Typography>
              <Link href={'/' + cityName + '/about'}>О Компании</Link>
              <Link href={'/' + cityName + '/company-details'}>Реквизиты</Link>
              <Link href={'/' + cityName + '/contacts'} style={{ marginBottom: 0 }}>
                Контакты
              </Link>
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
              <Link href={'/' + cityName + '/sitemap'} style={{ marginBottom: 0 }}>Карта сайта</Link>
            </div>
          </div>

          <div className="row" style={{ marginBottom: '1.7094017094017vw' }}>
            <div className="column" style={{ marginRight: '2.991452991453vw', paddingLeft: '0.85470085470085vw', width: '36.752136752137vw' }}>
              <Typography component="span">Работа в жако</Typography>
              <Link href={'/' + cityName + '/jobs'}>Вакансии</Link>
            </div>
            <div className="column">
              <Typography component="span">Франшиза</Typography>
              <Link {...ext('https://franchise.jacofood.ru')}>Сайт франшизы</Link>
              <Link {...ext('https://invest.jacofood.ru')}>Сайт для инвестиций</Link>
            </div>
          </div>

          <div className="copy">
            <Typography component="span" className="copy">{new Date().getFullYear()} © Жако</Typography>
          </div>
        </div>

        {cookie ? null : (
          <div className="FooterLegalMobile">
            <div className="containerLegalMobile">
              <div className="line"></div>
              <div className="text">
                <p>Мы{' '}
                  <Link className="link" href={'/' + cityName + '/politika-legal'}>используем</Link>{' '}
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

      <ModalOrderMobile />
    </>
  );
};
