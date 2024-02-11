import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import Typography from '@mui/material/Typography';

import { useCartStore, useProfileStore, useFooterStore, useHeaderStore } from '@/components/store.js';

import { NewVKIcon, OdnIcon, TGIcon, ArrowUp, BasketFooterMobile } from '@/ui/Icons.js';

import ModalOrderMobile from '@/modules/profile/zakazy/mobile/modalOrderMobile';

export default function FooterMobile({ cityName, active_page }) {

  const [cookie, setCookie] = useState(true);
  const [showArrow, setShowArrow] = useState(false);
  const [orders, setOrders] = useState(null);

  const [itemsCount, allPrice, allPriceWithoutPromo] = useCartStore((state) => [state.itemsCount, state.allPrice, state.allPriceWithoutPromo]);
  const [orderList, getOrder] = useProfileStore((state) => [state.orderList, state.getOrder]);
  const [links] = useFooterStore((state) => [state.links]);

  const [ token ] = useHeaderStore( state => [ state.token ]);

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

  useEffect(() => {
    const orders = orderList[0]?.orders?.filter(order => parseInt(order.type_status) === 1 || parseInt(order.type_status) === 2 || parseInt(order.type_status) === 3);

    if(orders?.length) {
      setOrders(orders);
    }

  }, [orderList]);

  return (
    <>
      {!orders || active_page !== 'home' ? null :
        orders.length === 1 ?
        <div className='ordersFooter' style={{ bottom: !cookie && showArrow || !cookie && itemsCount ? '50.769230769231vw' : showArrow || itemsCount ? '17.094017094017vw' : cookie ? '3.4188034188034vw' : '37.094017094017vw' }}>
          <div className='ordersSpan'>
            <span>Заказ {orders[0]?.status_order} №{orders[0]?.order_id}</span>
            <span>В 16:00—16:40 доставим</span>
          </div>
          <div className='divBTN' onClick={() => getOrder('zakazy', cityName, token, orders[0]?.order_id, orders[0]?.point_id)}>
            Открыть
          </div>
        </div>
        :
        <div className='containerOrders' style={{ bottom: !cookie && showArrow || !cookie && itemsCount ? '42.222222222222vw' : showArrow || itemsCount ? '8.5470085470085vw' :       cookie ? '-5.1282051282051vw' : '28.547008547009vw' }}>
          <div className='ordersArray'>
            {orders?.map((order, key) => (
              <div className='orders' key={key} style={{ marginRight: order === orders?.at(-1) ? '3.4188034188034vw' : null}}>
                <span>Заказ {order.status_order} №{key + 1}</span>
                <span>В 16:00—16:40 доставим</span>
                <span onClick={() => getOrder('zakazy', cityName, token, orders[0]?.order_id, orders[0]?.point_id)}>Открыть</span>
              </div>
            ))}
          </div>
        </div>
      }

      <div className='containerArrowBasket' 
        style={{ bottom: cookie ? '3.4188034188034vw' : '37.094017094017vw', 
                 width: itemsCount && active_page === 'home' ? '64.529914529915vw' : '10.25641025641vw', 
                 left: itemsCount && active_page === 'home' ? '32.051282051282vw' : '86.324786324786vw', 
                 marginTop: active_page === 'home' ? '3.4188034188034vw' : null }}>

        <Link href={'/' + cityName + '/cart'} className={itemsCount && active_page === 'home' ? 'BasketFooterMobile' : 'BasketFooterMobileHidden'} >
          <span><BasketFooterMobile /></span>
          <span>{new Intl.NumberFormat('ru-RU').format(allPrice ? allPrice : allPriceWithoutPromo)} ₽</span>
        </Link>

        <div className={showArrow && active_page !== 'cart' ? 'ArrowMobile' : 'ArrowHidden'} onClick={scrollUp} 
          style={{marginTop: active_page === 'about' || active_page === 'document' || active_page === 'jobs' || active_page === 'contacts' || active_page === 'profile' || active_page === 'account' || active_page === 'address' || active_page === 'zakazy' ? '-10.25641025641vw' : null}}>
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
            { Object.keys(links).length == 0 ? false :
              <>
                <Link href={links?.link_vk ?? ''} target="_blank"><NewVKIcon /></Link>
                <Link href={links?.link_tg ?? ''} target="_blank"><TGIcon /></Link>
                <Link href={links?.link_ok ?? ''} target="_blank" style={{ marginRight: 0 }}><OdnIcon /></Link>
              </>
            }
          </div>

          <div className="row" style={{ marginBottom: '11.965811965812vw' }}>
            <div className="column" style={{ marginRight: '2.991452991453vw', paddingLeft: '0.85470085470085vw', width: '36.752136752137vw' }}>
              <Typography component="span">Жако</Typography>
              <Link href={'/' + cityName + '/about'}>О Компании</Link>
              <Link href={'/' + cityName + '/about'}>Реквизиты</Link>
              <Link href={'/' + cityName + '/contacts'} style={{ marginBottom: 0 }}>
                Контакты
              </Link>
            </div>
            <div className="column">
              <Typography component="span">Документы</Typography>
              { Object.keys(links).length == 0 ? false :
                <Link href={links?.link_allergens ?? ''} target="_blank">Калорийность, состав, БЖУ</Link>
              }
              <Link href={'/' + cityName + '/publichnaya-oferta'}>Публичная оферта</Link>
              <Link href={'/' + cityName + '/politika-konfidencialnosti'}>Политика конфиденциальности</Link>
              <Link href={'/' + cityName + '/instpayorders'} style={{ marginBottom: 0 }}>Правила оплаты</Link>
            </div>
          </div>

          <div className="row" style={{ marginBottom: '1.7094017094017vw' }}>
            <div className="column" style={{ marginRight: '2.991452991453vw', paddingLeft: '0.85470085470085vw', width: '36.752136752137vw' }}>
              <Typography component="span">Работа в жако</Typography>
              <Link href={'/' + cityName + '/jobs'}>Вакансии</Link>
            </div>
            <div className="column">
              <Typography component="span">Франшиза</Typography>
              <Link href={'https://franchise.jacofood.ru'} target="_blank">Сайт франшизы</Link>
              <Link href={'https://invest.jacofood.ru'} target="_blank">Сайт для инвестиций</Link>
            </div>
          </div>

          <div className="copy">
            <Typography component="span" className="copy">{new Date().getFullYear()} © ООО «Мистер Жако», ИНН: 6321390811</Typography>
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

      <ModalOrderMobile />
    </>
  );
};
