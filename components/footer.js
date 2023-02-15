import React, {useEffect, useState} from 'react';

import Link from 'next/link'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { VKIcon, OdnIcon, TGIcon } from '../ui/Icons.js';
import { useFooterStore } from './store.js';

const this_module = 'contacts';

export function Footer(props) {

  const { cityName } = props;
  const { links, getData } = useFooterStore( state => state );
  const [ Links, setLinks ] = useState({});

  useEffect(() => {
    if( JSON.stringify(links) === JSON.stringify({}) ){
      getData(this_module, cityName);
    }
  }, [getData]);

  useEffect(() => {
    setLinks(links);
  }, [links]);

  //(this.state.page == 'cart' ? this.state.page : '')

  return (
    <footer className={"footer "}>
      <Grid container className="mainContainer">
        <Grid item lg={3} md={3} sm={3} xl={3} xs={12} className="copy">
          <Typography variant="body1" component="h1">© Жако 2017 - {new Date().getFullYear()}</Typography>
        </Grid>
        <Grid item lg={3} md={3} sm={3} xl={3} xs={12}>
          <Link
            href={ '/'+cityName+'/about' }
            style={{ textDecoration: 'none' }}
          >
            <Typography variant="body1">О Компании</Typography>
          </Link>
          <Link
            href={ '/'+cityName+'/jobs' }
            style={{ textDecoration: 'none' }}
          >
            <Typography variant="body1">Вакансии</Typography>
          </Link>
          <Link
            href={ '/'+cityName+'/publichnaya-oferta' }
            style={{ textDecoration: 'none' }}
          >
            <Typography variant="body1">Публичная оферта</Typography>
          </Link>

          { Links !== {} && Links?.link_allergens ?
            <Link
              href={ Links.link_allergens }
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              <Typography variant="body1">Калорийность, состав и аллергены</Typography>
            </Link>
              :
            null
          }
        </Grid>
        <Grid item lg={3} md={3} sm={3} xl={3} xs={12}>
          <Link
            href={ '/'+cityName+'/politika-konfidencialnosti' }
            style={{ textDecoration: 'none' }}
          >
            <Typography variant="body1">Политика конфиденциальности</Typography>
          </Link>
          <Link
            href={ '/'+cityName+'/contacts' }
            style={{ textDecoration: 'none' }}
          >
            <Typography variant="body1">Доставка и контакты</Typography>
          </Link>
          <Link
            href={ '/'+cityName+'/instpayorders' }
            style={{ textDecoration: 'none' }}
          >
            <Typography variant="body1">Правила оплаты товаров</Typography>
          </Link>
        </Grid>
       
          <Grid item lg={3} md={3} sm={3} xl={3} xs={12} className="socIcons">
            { Links && Links.link_ok ?
              <Link
                href={ Links.link_ok }
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                <OdnIcon />
              </Link>
                :
              null
            }
            { Links && Links.link_vk ?
              <Link
                href={ Links.link_vk }
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                <VKIcon />
              </Link>
                :
              null
            }
            
            <Link
              href={ 'https://t.me/jacofood' }
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              <TGIcon />
            </Link>
                      
          </Grid>
            
      </Grid>
    </footer>
  )
}