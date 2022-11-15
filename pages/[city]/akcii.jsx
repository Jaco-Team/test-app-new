import React from 'react';
import Head from 'next/head'
import Script from 'next/script'
import Image from 'next/image';

import { Roboto } from '@next/font/google'

import Grid from '@mui/material/Grid';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Snackbar from '@mui/material/Snackbar';

import { Header } from '../../components/header.js';
import { Footer } from '../../components/footer.js';

import { IconClose } from '../../components/elements.js'

const queryString = require('query-string');

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['sans-serif'],
  variable: '--inter-font',
})

export default class Akcii extends React.Component {
  constructor(props) {
      super(props);
      
      this.state = {      
          actii: [],
          pre_actii: [1, 2, 3, 4],  
          is_load: false,
          showItem: null,
          openDialog: false,
          title: '',
          description: '',
          city: this.props.data1 ? this.props.data1.city : '',
          city_name: this.props.city,
          page: this.props.data ? this.props.data.page : null,
          openMSG: false,
          statusMSG: false,
          textMSG: '',
      };
      
      //itemsStore.setCity(this.props.city);
  }
  
  getData = (method, data = {}) => {
    this.setState({
      //is_load: true,
    });
    
    data.type = method; 

    return fetch('https://jacochef.ru/api/site/site_fast.php', {
      method: 'POST',
      headers: {
          'Content-Type':'application/x-www-form-urlencoded'},
      body: queryString.stringify(data)
    })
      .then((res) => res.json())
      .then((json) => {
        setTimeout(() => {
          this.setState({
            //is_load: false,
          });
        }, 300);

        return json;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /*static fetchData(propsData) {
      let data = {
          type: 'get_page_info', 
          city_id: get_city(propsData),
          page: 'akcii' 
      };
      
      return axios({
          method: 'POST',
          url: config.urlApi,
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: queryString.stringify(data)
      }).then(response => {
          if(response['status'] === 200){
              var json = response['data'];
              
              return {
                  title: json.page.title,
                  description: json.page.description,
                  page: json.page,
                  cats: json.cats,
                  allItems: json.allItems,
                  all: json
              }
          } 
      }).catch(function (error) {
          console.log(error);
      });
  }*/
  
  async componentDidMount(){
    let data = {
      city_id: this.state.city
    };

    const json = await this.getData('get_my_actii_web_fast', data);

    this.setState({ 
      actii: json.actii,  
      is_load: true,
    });

    setTimeout(() => {
      let hash = window.location.search;
      
      if( hash.length > 0 && hash.indexOf('act_') > 0 ){
          let act = hash.split('&')[0];
          let act_id = act.split('act_')[1];
          let this_item = json.actii.find( (item) => item.id == act_id );
          
          this.openDialog(this_item);
      }
    }, 300);

      /*if( document.querySelector('.activeCat') ){
          document.querySelector('.activeCat').classList.remove('activeCat');
      }*/
      window.scrollTo(0, 0);
      //itemsStore.setPage('actii');
      
      /*Actii.fetchData('/'+this.state.city_name).then( data => {
          this.setState( {
              title: data.page.title,
              description: data.page.description,
          } );
      } );*/
      
      /*fetch(config.urlApi, {
          method: 'POST',
          headers: {
              'Content-Type':'application/x-www-form-urlencoded'},
          body: queryString.stringify({
              type: 'get_my_actii_web', 
              city_id: this.state.city_name
          })
      }).then(res => res.json()).then(json => {
          
          this.setState({ 
              actii: json.actii,  
              is_load: true,
          });
          
          setTimeout(() => {
              let hash = window.location.search;
              
              if( hash.length > 0 && hash.indexOf('act_') > 0 ){
                  let act = hash.split('&')[0];
                  let act_id = act.split('act_')[1];
                  let this_item = json.actii.find( (item) => item.id == act_id );
                  
                  this.openDialog(this_item);
              }
          }, 300);
      })
      .catch(err => { });*/
  }
  
  async openDialog(item){
    let data = {
      city_id: this.state.city,
      act_id: item.id
    };

    const json = await this.getData('get_one_actii_web_fast', data);

    let state = {  },
        title = '',
        url = window.location.pathname+'?act_'+item.id;

    window.history.pushState(state, title, url)
    
    this.setState({
      showItem: json.item,
      openDialog: true
    })
  }

  closeDialog(){
      
      let state = {  },
          title = '',
          url = window.location.pathname;

      window.history.pushState(state, title, url)
      
      this.setState({
          showItem: null,
          openDialog: false
      })
  }
  
  openDialog_(item){
    console.log( 'openDialog' )

    /*let allItems = itemsStore.getAllItems();
    
    item.items.map((act_item, key) => {
      item.items[key]['item'] = allItems.find( (item) => item.id == act_item.item_id );
    })*/
    
    let state = {  },
        title = '',
        url = window.location.pathname+'?act_'+item.id;

    window.history.pushState(state, title, url)
    
    this.setState({
      showItem: item,
      openDialog: true
    })
  }
  
  closeAlert(){
    this.setState({
      openMSG: false
    })
  }
  
  activePromo(promo_info, promo_name){
      /*itemsStore.setPromo(JSON.stringify(promo_info), promo_name)
      let res = itemsStore.checkPromo();
      
      setTimeout(() => {
          if( res['st'] ){
              this.setState({
                  openMSG: true,
                  statusMSG: true,
                  textMSG: "Промокод применен"
              })
          }else{
              this.setState({
                  openMSG: true,
                  statusMSG: false,
                  textMSG: res['text']
              })
          }
      }, 300);*/
  }
  
  render() {
    //<FontAwesomeIcon icon={faTimes} style={{ fontSize: '1.8rem', color: '#e5e5e5' }} />
    return (
      <div className={roboto.variable}>
        <Header />

        <Grid container className="Actii mainContainer MuiGrid-spacing-xs-3">
                  
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
            <Typography variant="h5" component="h1">Акции</Typography>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={3}>

              {this.state.is_load === false ?
                this.state.pre_actii.map((item, key) =>
                  <Grid item xs={12} sm={6} md={4} xl={3} key={key}>
                    <div style={{ width: '100%', height: 400, backgroundColor: '#e5e5e5', borderRadius: 25 }} />
                  </Grid>
                )
                  :
                this.state.actii.map((item, key) =>
                  <Grid item xs={12} sm={6} md={4} xl={3} key={key} onClick={this.openDialog.bind(this, item)}>
                    <Image alt={item.promo_title} src={"https://storage.yandexcloud.net/site-aktii/"+item.img_new+"750х750.jpg"} width={750} height={750} priority={true} />
                  </Grid>
                )
              }

            </Grid>
          </Grid>

          
          <Dialog onClose={this.closeDialog.bind(this)} className={"modalActii "+roboto.variable} open={this.state.openDialog}>

            <IconButton style={{ position: 'absolute', top: -43, right: 10 }} onClick={this.closeDialog.bind(this)}>
              <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
            </IconButton>

            <DialogTitle style={{ margin: 0, padding: 8 }}>
              { this.state.showItem ? this.state.showItem.promo_title : ''}
            </DialogTitle>
              
            <DialogContent className="modalActiiContent">
              { this.state.showItem ?
                <div dangerouslySetInnerHTML={{__html: this.state.showItem.text}} />
                  :
                null
              }
            </DialogContent>

            {this.state.showItem && this.state.showItem.promo.length > 0 ?
              <DialogActions style={{ justifyContent: 'center', padding: '15px 0px' }}>
                <ButtonGroup disableElevation={true} disableRipple={true} variant="contained" onClick={this.activePromo.bind(this, this.state.showItem.info, this.state.showItem.promo)}>
                  <Button variant="contained" className="AkciiActivePromo">Применить промокод</Button>
                </ButtonGroup>
              </DialogActions>
                :
              null
            }
          </Dialog>
              

        

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
    page: 'akcii' 
  };

  let res1 = await fetch('https://jacochef.ru/api/site/site_fast.php', {
    method: 'POST',
    headers: {
      'Content-Type':'application/x-www-form-urlencoded'},
    body: queryString.stringify(data)
  })
  
  const data1 = await res1.json()
  
  data1['city'] = query.city;

  return { props: { data1 } }
}