import React from 'react';
import Head from 'next/head'
import Image from 'next/image';

import Grid from '@mui/material/Grid';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Snackbar from '@mui/material/Snackbar';

import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import { Header } from '../../components/header.js';
import { Footer } from '../../components/footer.js';

import { roboto } from '../../ui/Font.js'
import config from '../../components/config.js';

import queryString from 'query-string';

const this_module = 'home';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

class HomeBanners extends React.Component{
  render(){

    let { banners } = this.props;

    return (
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        style={{ width: '100%', marginTop: 100 }}
      >
        {banners.map( (item, key) =>
          <SwiperSlide key={key}>

            <Image alt={item.promo_title} src={"https://storage.yandexcloud.net/site-home-img/"+item.img_new+"3700х1000.jpg"} width={3700} height={1000} priority={true} style={{ width: '100%', height: 'auto' }} />

          </SwiperSlide>
        )}
      
      </Swiper>
    )
  }
}

export default class Akcii extends React.Component {
  constructor(props) {
      super(props);
      
      this.state = {    
          is_load: false,
          
          page: this.props.data1 ? this.props.data1.page : null,
          title: this.props.data1 ? this.props.data1.page.title : '',
          description: this.props.data1 ? this.props.data1.page.description : '',

          city: this.props.data1 ? this.props.data1.city : '',
          city_name: this.props.city,
          cats: this.props.data1?.cats ?? [],
          city_list: this.props.data1?.cities ?? [],

          openMSG: false,
          statusMSG: false,
          textMSG: '',

          banners: []
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

  componentDidMount(){
    this.getBanners()
  }
  
  closeAlert(){

  }

  async getBanners(){
    let data = {
      city_id: this.state.city
    };

    const json = await this.getData('get_banners', data);

    console.log( 'banners', json )

    this.setState({
      banners: json.banners
    })
  }
  
  render() {
    return (
      <div className={roboto.variable}>
        <Header city={this.state.city} cats={this.state.cats} city_list={this.state.city_list} active_page={this_module} />

        <HomeBanners banners={this.state.banners} />

        <Grid container spacing={3} className="Actii mainContainer">
                  
          <Head>
            <title>{this.state.title}</title>
            <meta name="description" content={this.state.description} />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={this.state.openMSG}
            autoHideDuration={3000}
            onClose={this.closeAlert.bind(this)}
            message={this.state.textMSG}
            style={{ backgroundColor: this.state.statusMSG ? 'green' : '#BB0025', borderRadius: 4 }}
          />

          <Grid item xs={12}>
            <Grid container spacing={3}>

            

            </Grid>
          </Grid>

          

        </Grid>

        { this.state.city == '' ? null :
          <Footer cityName={this.state.city} />
        }
      </div>
    )
  }
}

export async function getServerSideProps({ req, res, query }) {
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: '' 
  };

  let res1 = await fetch(config.urlApi+this_module, {
    method: 'POST',
    headers: {
      'Content-Type':'application/x-www-form-urlencoded'},
    body: queryString.stringify(data)
  })
  
  const data1 = await res1.json()
  
  data1['city'] = query.city;

  return { props: { data1 } }
}