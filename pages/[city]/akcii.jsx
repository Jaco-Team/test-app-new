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

import { IconClose, Fade, roboto } from '../../components/elements.js'
import config from '../../components/config.js';

const queryString = require('query-string');

const this_module = 'akcii';

class AkciiModal extends React.Component{
  shouldComponentUpdate(nextProps){
    return (nextProps.showItem !== this.props.showItem || nextProps.openDialog !== this.props.openDialog);
  }

  render(){
    const { closeDialog, openDialog, activePromo, showItem } = this.props;
    
    return (
      <Dialog 
        onClose={closeDialog.bind(this)} 
        className={"modalActii "+roboto.variable} 
        open={openDialog}
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 500,
        }}
      >
        <Fade in={openDialog}>
          <Box>
            <IconButton style={{ position: 'absolute', top: -43, right: 10 }} onClick={closeDialog.bind(this)}>
              <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
            </IconButton>

            <DialogTitle style={{ margin: 0, padding: 8 }}>
              { showItem ? showItem.promo_title : ''}
            </DialogTitle>
              
            <DialogContent className="modalActiiContent">
              { showItem ?
                <div dangerouslySetInnerHTML={{__html: showItem.text}} />
                  :
                null
              }
            </DialogContent>

            {showItem && showItem.promo.length > 0 ?
              <DialogActions style={{ justifyContent: 'center', padding: '15px 0px' }}>
                <ButtonGroup disableElevation={true} disableRipple={true} variant="contained">
                  <Button variant="contained" className="AkciiActivePromo" onClick={activePromo.bind(this, showItem.info, showItem.promo)}>Применить промокод</Button>
                </ButtonGroup>
              </DialogActions>
                :
              null
            }
          </Box>
        </Fade>
      </Dialog>
    )
  }
}

class AkciiItem extends React.Component{
  shouldComponentUpdate(nextProps){
    return nextProps.item !== this.props.item;
  }

  render(){
    const { openDialog, item } = this.props;
    
    return (
      <Grid item xs={12} sm={6} md={4} xl={3} onClick={openDialog.bind(this, item)}>
        <Image alt={item.promo_title} src={"https://storage.yandexcloud.net/site-aktii/"+item.img_new+"750х750.jpg"} width={750} height={750} priority={true} />
      </Grid>
    )
  }
}

export default class Akcii extends React.Component {
  constructor(props) {
      super(props);
      
      this.state = {    
          actii: [],
          pre_actii: [1, 2, 3, 4, 5, 6, 7, 8],  
          is_load: false,
          showItem: null,
          openDialog: false,

          page: this.props.data1 ? this.props.data1.page : null,
          title: this.props.data1 ? this.props.data1.page.title : '',
          description: this.props.data1 ? this.props.data1.page.description : '',

          city: this.props.data1 ? this.props.data1.city : '',
          city_name: this.props.city,
          openMSG: false,
          statusMSG: false,
          textMSG: '',
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
    let data = {
      city_id: this.state.city
    };

    const json = await this.getData('get_actii', data);

    this.setState({ 
      actii: json,  
      is_load: true,
    });

    setTimeout(() => {
      let hash = window.location.search;
      
      if( hash.length > 0 && hash.indexOf('act_') > 0 ){
          let act = hash.split('&')[0];
          let act_id = act.split('act_')[1];
          let this_item = json.find( (item) => item.id == act_id );
          
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

    const json = await this.getData('get_one_actii', data);

    let state = {  },
        title = '',
        url = window.location.pathname+'?act_'+item.id;

    window.history.pushState(state, title, url)
    
    this.setState({
      showItem: json,
      openDialog: true
    })
  }

  closeDialog(){
      
    let state = {  },
        title = '',
        url = window.location.pathname;

    window.history.pushState(state, title, url)
    
    this.setState({
      openDialog: false
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
    return (
      <div className={roboto.variable}>
        <Header city={this.state.city} />

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
                  <AkciiItem 
                    key={item.id}
                    openDialog={this.openDialog.bind(this)}
                    item={item}
                  />
                )
              }

            </Grid>
          </Grid>

          { !this.state.is_load ? null :
            <AkciiModal 
              closeDialog={this.closeDialog.bind(this)}
              activePromo={this.activePromo.bind(this)}
              openDialog={this.state.openDialog}
              showItem={this.state.showItem}
            />
          }

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