import React from 'react';

import Link from 'next/link'
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';

import config from './config.js';

import queryString from 'query-string';

const this_module = 'contacts';

import { VKIcon, OdnIcon, TGIcon } from '../ui/Icons.js';

export class Footer extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {      
            soc_link: null,
            cityName: this.props.cityName,
            is_load: false,
            page: ''
        };
    }
    
    getData = (method, data = {}) => {
        data.type = method; 
    
        return fetch(config.urlApi+this_module, {
          method: 'POST',
          headers: {
              'Content-Type':'application/x-www-form-urlencoded'},
          body: queryString.stringify(data)
        })
          .then((res) => res.json())
          .then((json) => {
            return json;
          })
          .catch((err) => {
            console.log(err);
          });
    };

    async componentDidMount(){
        
        let data = {
            city_id: this.state.cityName,
            page: 'info'
        };
      
        const json = await this.getData('get_page_info', data);

        this.setState({
            soc_link: json.page,
            is_load: true
        });
    }
    
    render(){
        return (
            <footer className={"footer "+(this.state.page == 'cart' ? this.state.page : '')}>
                <Grid container className="mainContainer">
                    <Grid item lg={3} md={3} sm={3} xl={3} xs={12} className="copy">
                        <Typography variant="body1" component="h1">© Жако 2017 - {new Date().getFullYear()}</Typography>
                    </Grid>
                    <Grid item lg={3} md={3} sm={3} xl={3} xs={12}>
                        <Link
                            href={ '/'+this.state.cityName+'/about' }
                            style={{ textDecoration: 'none' }}
                        >
                            <Typography variant="body1">О Компании</Typography>
                        </Link>
                        <Link
                            href={ '/'+this.state.cityName+'/jobs' }
                            style={{ textDecoration: 'none' }}
                        >
                            <Typography variant="body1">Вакансии</Typography>
                        </Link>
                        <Link
                            href={ '/'+this.state.cityName+'/publichnaya-oferta' }
                            style={{ textDecoration: 'none' }}
                        >
                            <Typography variant="body1">Публичная оферта</Typography>
                        </Link>

                        { this.state.is_load && this.state.soc_link && this.state.soc_link.link_allergens.length ?
                            <Link
                                href={ this.state.soc_link.link_allergens }
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
                            href={ '/'+this.state.cityName+'/politika-konfidencialnosti' }
                            style={{ textDecoration: 'none' }}
                        >
                            <Typography variant="body1">Политика конфиденциальности</Typography>
                        </Link>
                        <Link
                            href={ '/'+this.state.cityName+'/contacts' }
                            style={{ textDecoration: 'none' }}
                        >
                            <Typography variant="body1">Доставка и контакты</Typography>
                        </Link>
                        <Link
                            href={ '/'+this.state.cityName+'/instpayorders' }
                            style={{ textDecoration: 'none' }}
                        >
                            <Typography variant="body1">Правила оплаты товаров</Typography>
                        </Link>
                    </Grid>
                    { this.state.is_load ?
                        <Grid item lg={3} md={3} sm={3} xl={3} xs={12} className="socIcons">
                            { this.state.soc_link && this.state.soc_link.link_ok ?
                                <Link
                                    href={ this.state.soc_link.link_ok }
                                    target="_blank"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <OdnIcon />
                                </Link>
                                    :
                                null
                            }
                            { this.state.soc_link && this.state.soc_link.link_vk ?
                                <Link
                                    href={ this.state.soc_link.link_vk }
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
                            :
                        null
                    }
                </Grid>
            </footer>
        );
    }
}