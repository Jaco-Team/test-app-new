import React, { useEffect } from 'react';
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
import { IconClose } from '../../ui/Icons.js'
import { Fade } from '../../ui/Fade.js'

import { api } from '../../components/api.js';

import { useAkciiStore } from '../../components/store.js';

import ActiiPage from '../../modules/akcii/page.js';

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
        <Fade in={openDialog} style={{ overflow: 'auto' }}>
          <Box>
            <IconButton style={{ position: 'absolute', top: -43, right: 10 }} onClick={closeDialog.bind(this)}>
              <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
            </IconButton>

            <DialogTitle style={{ margin: 0, padding: 8 }}>
              {showItem?.promo_title ?? ''}
            </DialogTitle> 
              
            <DialogContent className="modalActiiContent">
              <div dangerouslySetInnerHTML={{__html: showItem?.text ?? ''}} />
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
      <Grid item xs={12} sm={6} md={4} xl={4} onClick={openDialog.bind(this, item)}>
        <Image alt={item.promo_title} src={"https://storage.yandexcloud.net/site-aktii/"+item.img_new+"750х750.jpg"} width={750} height={750} priority={true} />
      </Grid>
    )
  }
}

export default function Akcii(props) {

  const { city, cats, cities, page } = props.data1;

  const getData = useAkciiStore( state => state.getData );
  
  useEffect(() => {
    getData(this_module, city);

    console.log( 'load' )
  }, [getData]);

  

  return (
    <div className={roboto.variable}>
      <Header city={city} cats={cats} city_list={cities} active_page={this_module} />

      <ActiiPage page={page} city={city} />
      
      <Footer cityName={city} />
    </div>
  )
}

class Akcii_old extends React.Component {
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
          cats: this.props.data1?.cats ?? [],
          city_list: this.props.data1?.cities ?? [],

          openMSG: false,
          statusMSG: false,
          textMSG: '',
      };
      
      //itemsStore.setCity(this.props.city);
  }
  
  async componentDidMount(){
    let data = {
      type: 'get_actii',
      city_id: this.state.city
    };

    const json = await api(this_module, data);

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

    window.scrollTo(0, 0);
  }
  
  async openDialog(item){
    let data = {
      type: 'get_one_actii',
      city_id: this.state.city,
      act_id: item.id
    };

    const json = await api(this_module, data);

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
        <Header city={this.state.city} cats={this.state.cats} city_list={this.state.city_list} active_page={this_module} />

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
            <Typography variant="h5" component="h1">Акции</Typography>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={3}>

              {this.state.actii.map((item, key) =>
                <AkciiItem 
                  key={item.id}
                  openDialog={this.openDialog.bind(this)}
                  item={item}
                />
              )}

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

  const data1 = await api(this_module, data);

  data1['city'] = query.city;

  return { props: { data1 } }
}