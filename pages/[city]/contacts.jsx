import React from 'react';
import Head from 'next/head'
import Script from 'next/script'

import Grid from '@mui/material/Grid';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { roboto } from '../../components/elements.js'

const this_module = 'contacts';

import config from '../../components/config.js';

import { Header } from '../../components/header.js';
import { Footer } from '../../components/footer.js';

const queryString = require('query-string');

function ControlledAccordions(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
  };

  const points = props.points;

  return (
      <div className="Accordion">
          {points.map((item, key) => 
              <Accordion key={key} expanded={expanded === 'panel'+key} onChange={handleChange('panel'+key)}>
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={"panel"+key+"bh-content"}
                      id={"panel"+key+"bh-header"}
                  >
                      <Typography variant="h5" component="span">{item.raion}: {item.addr}</Typography>
                  </AccordionSummary>
                  <AccordionDetails className="AccordionDesc" style={{ flexDirection: 'column', padding: 0 }}>
                      <div>
                          <Typography variant="h5" component="b">Название организации: </Typography>
                          <Typography variant="h5" component="span">{item.organization}</Typography>
                      </div>
                      <div>
                          <Typography variant="h5" component="b">ИНН / КПП: </Typography>
                          <Typography variant="h5" component="span">{item.inn} / {item.kpp}</Typography>
                      </div>
                      <div>
                          <Typography variant="h5" component="b">ОГРН: </Typography>
                          <Typography variant="h5" component="span">{item.ogrn}</Typography>
                      </div>
                      <div>
                          <Typography variant="h5" component="b">Фактический адрес: </Typography>
                          <Typography variant="h5" component="span">{item.full_addr}</Typography>
                      </div>
                      <div>
                          <Typography variant="h5" component="b">Телефон: </Typography>
                          <Typography variant="h5" component="span">{item.phone}</Typography>
                      </div>
                  </AccordionDetails>
              </Accordion>
          )}
      </div>
  );
}

export default class Contacts extends React.Component{
  is_mount = false;

  constructor(props) {
    super(props);
    
    this.state = {      
      points: [],  
      unic_point: [],

      page: this.props.data1 ? this.props.data1.page : null,
      title: this.props.data1 ? this.props.data1.page.title : '',
      description: this.props.data1 ? this.props.data1.page.description : '',
      
      city: this.props.data1 ? this.props.data1.city : '',
      city_name: this.props.city,
      is_load: false,
    };
    
    //itemsStore.setCity(this.props.city);
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

    if( this.is_mount ){
      return ;
    }

    this.is_mount = true;

    let data = {
      city_id: this.state.city
    };

    const json = await this.getData('get_addr_zone_web', data);

    let points_zone = [];
    
    json.map(function(point){
      if(point['zone_origin'].length > 0){
        points_zone.push( JSON.parse(point['zone_origin']) );
      }
    })
          
    let unic_point = [],
        check = false;
    
    json.map(function(point){
      check = false;
      
      unic_point.map(function(new_point){
        if( parseInt(new_point.id) == parseInt(point.id) ){
          check = true;
        }
      })
      
      if( !check ){
        unic_point.push(point)
      }
    })
    
    this.setState({
      points: json,
      unic_point: unic_point,
      is_load: true
    })
    
    setTimeout(() => {
      this.loadMap(json, points_zone);
    }, 500);
  }

  loadMap(points, points_zone){
    let myMap2;
    
    ymaps.ready(function () {
      myMap2 = new ymaps.Map('ForMap', {
        center: [ points[0]['xy_center_map']['latitude'], points[0]['xy_center_map']['longitude'] ],
        zoom: 10.8
      });
        
      let HintLayout = ymaps.templateLayoutFactory.createClass( 
        "<div class='my-hint'>" +
            "<b>{{ properties.address }}</b><br />" +
            "Зона {{ properties.zone }}<br />" +
            "График работы: c 10:00 до 21:30<br />" +
            "Стоимость доставки: {{ properties.sum_div }} руб." +
        "</div>"
      );
  
      points_zone.map((zone, key)=>{
        myMap2.geoObjects.add(
          new ymaps.Polygon([zone], {
            address: points[ key ]['addr'], 
            sum_div: points[ key ]['sum_div'], 
            zone: points[ key ]['test'],
          }, {
            hintLayout: HintLayout,
            fillColor: 'rgba(187, 0, 37, 0.25)',
            strokeColor: 'rgb(187, 0, 37)',
            strokeWidth: 5
          })
        );
      })
        
      points.map(function(point){
        myMap2.geoObjects.add(
          new ymaps.Placemark( [point['xy_point']['latitude'], point['xy_point']['longitude']], 
          {}, 
          {
            iconLayout: 'default#image',
            iconImageHref: '/Favikon.png',
            iconImageSize: [30, 30],
            iconImageOffset: [-12, -24],
            iconContentOffset: [15, 15],
          })
        )
      })
    })
  }

  render(){
    return (
      <div className={roboto.variable}>
        <Header city={this.state.city} />

        <Grid container className="Contact mainContainer MuiGrid-spacing-xs-3">
                  
          <Head>
            <title>{this.state.title}</title>
            <meta name="description" content={this.state.description} />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          
          <Script src="https://api-maps.yandex.ru/2.1/?apikey=ae2bad1f-486e-442b-a9f7-d84fff6296db&lang=ru_RU" />

          <Grid item xs={12}>
            <Typography variant="h5" component="h1">Контакты</Typography>
          </Grid>
          
          <Grid item lg={4} md={4} xl={4} sm={12} xs={12} className="mainContainer">
            <Typography variant="h5" component="h2">Режим работы</Typography>
            <Typography variant="h5" component="span" className="p20">Работаем ежедневно с 10:00 до 21:30</Typography>
            <Typography variant="h5" component="h2">Телефон контакт-центра:</Typography>
            {this.state.points[0] ?
              <Typography variant="h5" component="a" className="p20" href={'tel:'+this.state.points[0].phone_new}>{this.state.points[0].phone}</Typography>
                :
              null
            }

            <Typography variant="h5" component="h2">Адреса кафе:</Typography>
            <ControlledAccordions points={this.state.unic_point}/>
          </Grid>
          <Grid item lg={8} md={8} xl={8} sm={12} xs={12} id="ForMap">
            <div style={{ width: '100%', height: '100%', marginRight: 12, backgroundColor: '#e5e5e5' }} />    
          </Grid>
        </Grid>

        <Footer cityName={this.state.city} />

      </div>
    )
  }
}

export async function getServerSideProps({ req, res, query }) {
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'contacts' 
  };


  let res1 = await fetch(config.urlApi+this_module, {
    method: 'POST',
    headers: {
      'Content-Type':'application/x-www-form-urlencoded'},
    body: queryString.stringify(data)
  })
  
  const data1 = await res1.json()
  
  console.log( 'page', data1 )

  data1['city'] = query.city;

  return { props: { data1 } }
}