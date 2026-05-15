import React from 'react';
import Link from 'next/link';

import './Footer.scss';
import { NewVKIcon, OdnIcon, TGIcon } from '../../../shared/Icons';
import Typography from '@mui/material/Typography';
import { FooterProps } from '@/stories/widgets/footer/model/types';
import { FooterArrowUp } from '@/stories/widgets/FooterArrowUp/FooterArrowUp';
import { FooterCookie } from '@/stories/widgets/FooterCookie/FooterCookie';
export const Footer: React.FC<FooterProps> = ({
  cookie = false,
  arrow = false,
  cityName,
  links = {
    link_allergens: undefined,
    link_vk: undefined,
    link_tg: undefined,
  },
  page,
}) => {
  const hasLinks = Object.keys(links).length > 0;
  const footerMinHeight = cookie ? '36.101083032491vw' : '45.126353790614vw';
  const marginTop = page === 'contacts' ? undefined : '1.8050541516245vw';

  return (
    <>
      <FooterArrowUp arrow={arrow} page={page} />
      {!cookie && <FooterCookie cityName={cityName} />}

      <footer
        className="footer"
        style={{
          minHeight: footerMinHeight,
          marginTop,
        }}
      >
        <div className="footer__container">
          {/* Колонка 1: Жако */}
          <div className="column">
            <Typography component="span">Жако</Typography>
            <Link href={`/${cityName}/about`}>О Компании</Link>
            <Link href={`/${cityName}/company-details`}>Реквизиты</Link>
            <Link href={`/${cityName}/contacts`}>Контакты</Link>
          </div>

          {/* Колонка 2: Документы */}
          <div className="column">
            <Typography component="span">Документы</Typography>
            {hasLinks && links.link_allergens && (
              <Link href={links.link_allergens} target="_blank">
                Калорийность, состав, БЖУ
              </Link>
            )}
            <Link href={`/${cityName}/publichnaya-oferta`}>
              Публичная оферта
            </Link>
            <Link href={`/${cityName}/politika-konfidencialnosti`}>
              Политика конфиденциальности
            </Link>
            <Link href={`/${cityName}/legal`}>
              Согласие на обработку персональных данных
            </Link>
            <Link href={`/${cityName}/politika-legal`}>
              Политика в отношении обработки метрических данных
            </Link>
            <Link href={`/${cityName}/instpayorders`}>Правила оплаты</Link>
          </div>

          {/* Колонка 3: Работа в жако */}
          <div className="column">
            <Typography component="span">Работа в жако</Typography>
            <Link href={`/${cityName}/jobs`}>Вакансии</Link>
          </div>

          {/* Колонка 4: Франшиза */}
          <div className="column">
            <Typography component="span">Франшиза</Typography>
            <Link href="https://franchise.jacofood.ru" target="_blank">
              Сайт франшизы
            </Link>
            <Link href="https://invest.jacofood.ru" target="_blank">
              Сайт для инвестиций
            </Link>
          </div>

          {/* Иконки социальных сетей */}
          <div className="container">
            <div className="icon">
              {hasLinks && (
                <>
                  {links.link_vk && (
                    <Link href={links.link_vk} target="_blank">
                      <NewVKIcon />
                    </Link>
                  )}
                  {links.link_tg && (
                    <Link href={links.link_tg} target="_blank">
                      <TGIcon />
                    </Link>
                  )}
                  {links.link_ok && (
                    <Link
                      href={links.link_vk}
                      target="_blank"
                      style={{ marginRight: 0 }}
                    >
                      <OdnIcon />
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Копирайт */}
        <div className="ContainerCopyFooter">
          <div className="copy">
            <Typography component="span" className="copy">
              {new Date().getFullYear()} © Жако
            </Typography>
          </div>
        </div>
      </footer>
    </>
  );
};
