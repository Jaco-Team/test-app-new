import React, {useEffect, useState} from 'react';

import Link from 'next/link'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { NewVKIcon, OdnIcon, TGIcon } from '../ui/Icons.js';
import { useFooterStore } from './store.js';

const this_module = 'contacts';

export default React.memo(function Footer(props) {

  const { cityName } = props;
  const [ links, getData ] = useFooterStore( state => [state.links, state.getData] );
  const [ Links, setLinks ] = useState({});

  useEffect(() => {
    if( JSON.stringify(links) === JSON.stringify({}) ){
      getData(this_module, cityName);
    }
  }, [cityName, getData, links]);

  useEffect(() => {
    setLinks(links);
  }, [links, setLinks]);

  return (
    <footer className="footer">
      <Grid container>
        <Grid item lg={2} md={2} sm={2} xl={2} xs={12}>
          <Typography component="span">Жако</Typography>
          <Link href={ '/'+cityName+'/about' }>О Компании</Link>
          <Link href={ '/'+cityName+'/about' }>История компании</Link>
          <Link href={ '/'+cityName+'/about' }>Реквизиты</Link>
          <Link href={ '/'+cityName+'/about' }>Контакты</Link>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xl={2} xs={12}>
          <Typography component="span">Документы</Typography>
          <Link href={ '/'+cityName+'/about' }>Калорийность, состав, БЖУ</Link>
          <Link href={ '/'+cityName+'/about' }>Публичная оферта</Link>
          <Link href={ '/'+cityName+'/about' }>Политика конфиденциальности</Link>
          <Link href={ '/'+cityName+'/about' }>Правила оплаты</Link>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xl={2} xs={12}>
          <Typography component="span">Работа в жако</Typography>
          <Link href={ '/'+cityName+'/about' }>Вакансии</Link>
          <Link href={ '/'+cityName+'/about' }>Анкета для работы в кафе</Link>
          <Link href={ '/'+cityName+'/about' }>Анкета для работы в Управляющей компании</Link>
          <Link href={ '/'+cityName+'/about' }>Анкета поставщика</Link>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xl={2} xs={12}>
          <Typography component="span">Франшиза</Typography>
          <Link href={ '/'+cityName+'/about' }>Сайт франшизыи</Link>
          <Link href={ '/'+cityName+'/about' }>Сайт для инвестиций</Link>
        </Grid>
        <Grid item lg={4} md={4} sm={4} xl={4} xs={12}>
          <NewVKIcon />
          <TGIcon />
          <OdnIcon />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Typography component="span" className='copy'>{new Date().getFullYear()} © ООО «Мистер Жако»</Typography>
        </Grid>
      </Grid>

      
    </footer>
  )
})