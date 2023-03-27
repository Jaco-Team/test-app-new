import React, { useState, useEffect } from 'react';

import Script from 'next/script'

import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useContactStore } from '@/components/store.js';

import Meta from '@/components/meta.js';

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

function loadMap(points, points_zone){
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

export default function ContactsPage(props){

  const { page } = props;

  const [ points, setPoints ] = useState([]);
  const [ unicPoint, setUnicPoints ] = useState([]);

  let [ myPoints, myUnicPoint, pointsZone ] = useContactStore((state) => [state.myPoints, state.myUnicPoint, state.pointsZone])

  useEffect(() => {
    
    setUnicPoints(myUnicPoint);
    setPoints( myPoints );

    setTimeout(() => {
      if( myPoints.length > 0 ){
        loadMap(myPoints, pointsZone);
      }
    }, 500);
  }, [myPoints, myUnicPoint, pointsZone]);

  return (
    <Meta title={page.title} description={page.description}>
      <Grid container spacing={3} className="Contact mainContainer">
                    
        <Script src="https://api-maps.yandex.ru/2.1/?apikey=ae2bad1f-486e-442b-a9f7-d84fff6296db&lang=ru_RU" />

        <Grid item xs={12}>
          <Typography variant="h5" component="h1">Контакты</Typography>
        </Grid>
        
        <Grid item lg={4} md={4} xl={4} sm={12} xs={12} className="mainContainer">
          <Typography variant="h5" component="h2">Режим работы</Typography>
          <Typography variant="h5" component="span" className="p20">Работаем ежедневно с 10:00 до 21:30</Typography>
          <Typography variant="h5" component="h2">Телефон контакт-центра:</Typography>

          {points[0] ?
            <Typography variant="h5" component="a" className="p20" href={'tel:'+points[0].phone_new}>{points[0].phone}</Typography>
              :
            null
          }

          <Typography variant="h5" component="h2">Адреса кафе:</Typography>
          <ControlledAccordions points={unicPoint}/>
        </Grid>
        <Grid item lg={8} md={8} xl={8} sm={12} xs={12} id="ForMap">
          <div style={{ width: '100%', height: '100%', marginRight: 12, backgroundColor: '#e5e5e5' }} />    
        </Grid>
      </Grid>
    </Meta>
  )
}