import React, { useEffect, useState, useRef } from 'react';

import Link from 'next/link';
import Typography from '@mui/material/Typography';

import { NewVKIcon, OdnIcon, TGIcon } from '../ui/Icons.js';
import { useFooterStore } from './store.js';

const this_module = 'contacts';

export default React.memo(function Footer(props) {

  const footerRef = useRef();

  const { cityName } = props;
  const [links, getData, setFooterRef] = useFooterStore((state) => [state.links, state.getData, state.setFooterRef]);
  const [Links, setLinks] = useState({});

  useEffect(() => {
    if (JSON.stringify(links) === JSON.stringify({})) {
      getData(this_module, cityName);
    }

    setFooterRef(footerRef);

  }, [cityName, getData, links]);

  useEffect(() => {
    setLinks(links);
  }, [links, setLinks]);

  return (
    <footer className="footer" ref={footerRef}>
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
            <NewVKIcon style={{ width: '2.8364620938628vw', height: '1.684476534296vw'}}/>
            <TGIcon style={{ width: '2.5014440433213vw', height: '2.084476534296vw'}}/>
            <OdnIcon style={{ width: '1.641155234657vw', height: '2.7281588447653vw'}}/>
          </div>
          <div className="copy">
            <Typography component="span" className="copy">{new Date().getFullYear()} © ООО «Мистер Жако»</Typography>
          </div>
        </div>
      </div>
    </footer>
  );
});
