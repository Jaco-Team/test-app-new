import React from 'react';
import Head from 'next/head'
import Image from 'next/image';

import Grid from '@mui/material/Grid';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { Header } from '../../components/header.js';
import { Footer } from '../../components/footer.js';

import { IconClose, IconRuble, MyTextInput, MyCheckBox, MySelect, MyAlert, Fade, roboto } from '../../components/elements.js'
import itemsStore from '../../components/items-store.js';

import { api } from '../../components/api.js';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { autorun } from "mobx"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const this_module = 'profile';

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
      <Grid item xs={12} sm={6} md={4} xl={4} onClick={openDialog.bind(this, item)}>
        <Image alt={item.promo_title} src={"https://storage.yandexcloud.net/site-aktii/"+item.img_new+"750х750.jpg"} width={750} height={750} priority={true} />
      </Grid>
    )
  }
}

class ProfilePromosTable extends React.Component{
  render(){
    const { promo_list, activePromo } = this.props;

    return (
      <>
        <Table sx={{ display: { xs: 'none', lg: 'inline-table' } }} className="TablePromoPc">
          <TableHead>
            <TableRow>
              <TableCell>Промокод</TableCell>
              <TableCell>Промокод дает:</TableCell>
              <TableCell>Действует до</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promo_list.map((item, key) => 
              <TableRow key={key}>
                <TableCell onClick={activePromo.bind(this, item.info, item.promo_name)}>{item.promo_name}</TableCell>
                <TableCell>{item.promo_text}</TableCell>
                <TableCell>{item.date_end}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Table sx={{ display: { xs: 'inline-table', lg: 'none' } }} className="TablePromoMobile">
          <TableBody>
            {promo_list.map((item, key) => 
              <TableRow key={key}>
                <TableCell>
                  <div>
                    <Typography variant="h5" component="span" className="PromoName">Промокод: </Typography>
                    <Typography variant="h5" component="span" className="PromoName">{item.promo_name}</Typography>
                  </div>
                  <div style={{ width: '100%', paddingTop: 10 }}>
                    <Typography variant="h5" component="span" className="PromoDate">Действует до: </Typography>
                    <Typography variant="h5" component="span" className="PromoDate">{item.date_end}</Typography>
                  </div>
                  <div style={{ width: '100%', paddingTop: 10, textAlign: 'justify' }}>
                    <Typography variant="h5" component="span" className="PromoText">Промокод дает: </Typography>
                    <Typography variant="h5" component="span" className="PromoText">{item.promo_text}</Typography>
                  </div>
                  <div style={{ width: '100%', paddingTop: 10 }}>
                    <Button variant="contained" style={{ width: '100%' }} onClick={activePromo.bind(this, item.info, item.promo_name)}>Применить промокод</Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </>
    )
  }
}

class ProfileOrdersTable extends React.Component{
  render(){
    const { order_list, openOrder } = this.props;

    return (
      <div className="TableOrders">
        <div className="thead">
          <Typography variant="h5" component="span" style={{ flex: 1 }}>№</Typography>
          <Typography variant="h5" component="span" style={{ flex: 3 }}>Дата</Typography>
          <Typography variant="h5" component="span" style={{ flex: 2 }}>Сумма</Typography>
          <Typography variant="h5" component="span" style={{ flex: 1 }}></Typography>
        </div>
        <div className="tbody">
          {order_list.map((item, key) => 
            <div key={key} onClick={openOrder.bind(this, item.order_id, item.point_id)}>
              <div>
                <Typography variant="h5" component="span" style={{ flex: 1 }}>{item.order_id}</Typography>
                <Typography variant="h5" component="span" style={{ flex: 3 }}>{item.date_time_new}</Typography>
                <Typography variant="h5" component="span" className="CardPriceItem" style={{ flex: 2 }}>{item.sum} <IconRuble style={{ width: 13, height: 13, fill: '#525252', marginBottom: -1 }} /></Typography>
                <Typography variant="h5" component="span" style={{ flex: 1 }}>{parseInt(item.is_delete) == 1 ? <CloseIcon style={{ position: 'relative', top: 3 }} /> : parseInt(item.status_order) == 6 ? <CheckIcon style={{ position: 'relative', top: 3 }} /> : null}</Typography>
              </div>
                
              {(parseInt(item.status_order) == 6 || parseInt(item.is_delete) == 1) ? null :
                <div className="boxSteps">
                  <div>
                    <div className={ parseInt(item.steps[0]['active']) == 0 || parseInt(item.steps[0]['active']) == 2 ? '' : 'active' }>
                      <Typography variant="h5" component="span">{item.steps[0]['name']}</Typography>
                    </div>
                    <div className={ parseInt(item.steps[1]['active']) == 0 || parseInt(item.steps[1]['active']) == 2 ? '' : 'active' }>
                      <Typography variant="h5" component="span">{item.steps[1]['name']}</Typography>
                    </div>
                    <div className={ parseInt(item.steps[2]['active']) == 0 || parseInt(item.steps[2]['active']) == 2 ? '' : 'active' }>
                      <Typography variant="h5" component="span">{item.steps[2]['name']}</Typography>
                    </div>
                    <div className={ parseInt(item.steps[3]['active']) == 0 || parseInt(item.steps[3]['active']) == 2 ? '' : 'active' }>
                      <Typography variant="h5" component="span">{item.steps[3]['name']}</Typography>                                                        
                    </div>
                  </div>
                  { item.time_to_client == 0 ? null :
                    <div>
                      <Typography variant="h5" component="span">Заказ { parseInt(item.type_order) == 1 ? 'привезут до: ' : 'будет готов до: ' }{item.time_to_client}</Typography>
                    </div>
                  }
                </div> 
              }
            </div>
          )}
        </div>
      </div>
    )
  }
}

class ProfileUserTable extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {    
      arr_m: [ 
        {name: 'Января', id: 1},
        {name: 'Февраля', id: 2},
        {name: 'Марта', id: 3},
        {name: 'Апреля', id: 4},
        {name: 'Мая', id: 5},
        {name: 'Июня', id: 6},
        {name: 'Июля', id: 7},
        {name: 'Августа', id: 8},
        {name: 'Сентября', id: 9},
        {name: 'Октября', id: 10},
        {name: 'Ноября', id: 11},
        {name: 'Декабря', id: 12}
      ],

      arr_d: [],
    };
  }

  shouldComponentUpdate(nextProps){
    return nextProps.user !== this.props.user;
  }

  componentDidMount(){
    let arr_d = [];

    for(let i = 1; i <= 31; i ++){
      if( i < 10 ){
        arr_d.push({
          name: '0'+i,
          id: i
        })
      }else{
        arr_d.push({
          name: i,
          id: i
        })
      }
    }

    this.setState({
      arr_d: arr_d
    })
  }

  render(){
    const { user, changeUserData, saveUserData } = this.props;

    return (
      <Grid container spacing={3} className="TableUserForm">

        <Grid item xs={12} sm={6}>
          <MyTextInput label={'Имя'} value={ user?.name ?? '' } func={ changeUserData.bind(this, 'name') } onBlur={saveUserData.bind(this)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MyTextInput label={'Номер телефона'} value={ user?.login ?? '' } func={ changeUserData.bind(this, 'login') } readOnly={true} />
        </Grid>

        { (user?.date_bir ?? '').length > 0 ? null :
          <>
            <Grid item xs={12} sm={2}>
              <MySelect label={'День рождения'} value={ user?.date_bir_d ?? '' } data={this.state.arr_d} func={ changeUserData.bind(this, 'date_bir_d') } />
            </Grid>
            <Grid item xs={12} sm={4}>
              <MySelect label={'Месяц'} value={ user?.date_bir_m ?? '' } data={this.state.arr_m} func={ changeUserData.bind(this, 'date_bir_m') } />
            </Grid>
          </>
        }
        
        { (user?.date_bir ?? '').length == 0 ? null :
          <Grid item xs={12} sm={6}>
            <MyTextInput label={'День рождения'} value={ user?.date_bir ?? '' } func={ changeUserData.bind(this, 'date_bir') } readOnly={true} />
          </Grid>
        }
        <Grid item xs={12} sm={6}>
          <MyTextInput label={'E-mail'} value={ user?.mail ?? '' } func={ changeUserData.bind(this, 'mail') } onBlur={saveUserData.bind(this)} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <MyCheckBox label={'Получать сообщения с акциями'} value={ parseInt(user?.spam ?? 1) == 1 ? true : false } func={ changeUserData.bind(this, 'spam') } />
        </Grid>

      </Grid>
    )
  }
}

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {    
      is_load: false,
      
      cats: this.props.data1?.cats ?? [],
      city_list: this.props.data1?.cities ?? [],

      page: this.props.data1 ? this.props.data1.page : null,
      title: this.props.data1 ? this.props.data1.page.title : '',
      description: this.props.data1 ? this.props.data1.page.description : '',

      city: this.props.data1 ? this.props.data1.city : '',
      city_name: this.props.city,

      openMSG: false,
      statusMSG: false,
      textMSG: '',

      activeTab: 1,
      promo_list: [],
      order_list: [],
      userToken: '',
      user: null,

      openAlert: false,
      err_status: true,
      err_text: '',

      openDialog: false,
      showOrder: null
    };
  }
  
  componentDidMount(){
    autorun(() => {
      this.setState({
        userToken: itemsStore.getToken()
      })

      setTimeout( () => {
        if( parseInt(this.state.activeTab) == 0 ){
          this.getPromoList()
        }
    
        if( parseInt(this.state.activeTab) == 1 ){
          this.getOrderList()
        }
    
        if( parseInt(this.state.activeTab) == 2 ){
          this.getUserInfo()
        }
      }, 300 )
    })

    
  }
  
  changeTab(event, value){
    this.setState({
      activeTab: value
    })

    if( parseInt(value) == 0 ){
      this.getPromoList()
    }

    if( parseInt(value) == 1 ){
      this.getOrderList()
    }

    if( parseInt(value) == 2 ){
      this.getUserInfo()
    }
  }
  
  async getPromoList(){
    let data = {
      type: 'get_my_promos',
      city_id: this.state.city,
      user_id: this.state.userToken
    };

    let res = await api(this_module, data);

    this.setState({
      promo_list: res.promo_list
    })
  }

  async getOrderList(){
    let data = {
      type: 'get_my_orders',
      city_id: this.state.city,
      user_id: this.state.userToken
    };

    let res = await api(this_module, data);

    this.setState({
      order_list: res.order_list
    })
  }

  async getUserInfo(){
    let data = {
      type: 'get_my_info',
      city_id: this.state.city,
      user_id: this.state.userToken
    };

    let res = await api(this_module, data);

    console.log( res )

    this.setState({
      user: res.user
    })
  }

  activePromo(){

  }

  changeUserData(type, event){
    let user = {...this.state.user};

    if( type == 'spam' ){
      user[ [type] ] = event.target.checked ? 1 : 0;  
    }else{
      user[ [type] ] = event.target.value;
    }

    this.setState({
      user: user
    })

    if( type == 'spam' ){
      setTimeout( () => {
        this.saveUserData()
      }, 200 )
    }

    if( user?.date_bir_m > 0 && user?.date_bir_d > 0 ){
      setTimeout( () => {
        this.saveUserData(true)
      }, 200 )
    }
  }

  async saveUserData(reload = false){

    let data = {
      type: 'update_user',
      city_id: this.state.city,
      user_id: this.state.userToken,
      user: JSON.stringify(this.state.user)
    };

    let res = await api(this_module, data);

    setTimeout( () => {
      this.setState({
        openAlert: true,
        err_status: true,
        err_text: 'Данные успешно сохранены',
      });

      if( reload === true ){
        this.getUserInfo();
      }
    }, 300 )
    
  }

  closeDialog(){
    this.setState({
      openDialog: false
    })
  }

  closeOrder(){
    
  }

  repeatOrder(){

  }

  async openOrder(order_id, point_id){
    let data = {
      type: 'get_order',
      city_id: this.state.city,
      user_id: this.state.userToken,
      order_id: order_id,
      point_id: point_id
    };

    let res = await api(this_module, data);

    this.setState({
      showOrder: res,
      openDialog: true
    })
  }

  render() {
    return (
      <div className={roboto.variable}>
        <Backdrop open={this.state.is_load} style={{ zIndex: 99 }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <MyAlert 
          isOpen={this.state.openAlert} 
          onClose={() => this.setState({ openAlert: false }) } 
          status={this.state.err_status} 
          text={this.state.err_text} />

        <Header city={this.state.city} cats={this.state.cats} city_list={this.state.city_list} active_page={this_module} />

        <Grid container className="Profile mainContainer MuiGrid-spacing-xs-3">
                  
          <Head>
            <title>{this.state.title}</title>
            <meta name="description" content={this.state.description} />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          
          <Grid item xs={12}>
            <Typography variant="h5" component="h1">Личный кабинет</Typography>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ width: '100%' }}>
              <Box>
                <Tabs value={this.state.activeTab} onChange={ this.changeTab.bind(this) } centered>
                  <Tab label="Промокоды" {...a11yProps(0)} />
                  <Tab label="Заказы" {...a11yProps(1)} />
                  <Tab label="Редактирование" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={this.state.activeTab} index={0} className="Tabs">
                <ProfilePromosTable promo_list={this.state.promo_list} activePromo={this.activePromo.bind(this)} />
              </TabPanel>
              <TabPanel value={this.state.activeTab} index={1} className="Tabs">
                <ProfileOrdersTable order_list={this.state.order_list} openOrder={this.openOrder.bind(this)} />
              </TabPanel>
              <TabPanel value={this.state.activeTab} index={2} className="Tabs">
                <ProfileUserTable user={this.state.user} changeUserData={this.changeUserData.bind(this)} saveUserData={this.saveUserData.bind(this)} />
              </TabPanel>
            </Box>
          </Grid>

        </Grid>

        <Dialog 
          onClose={this.closeDialog.bind(this)} 
          className={"showOrderDialog "+roboto.variable}
          open={this.state.openDialog}
          fullWidth={true}
        >
          <DialogTitle style={{ margin: 0, padding: 8 }}>
            <Typography variant="h6" component="h6">Заказ {this.state.showOrder?.order.order_id}</Typography>
          
            <IconButton aria-label="close" style={{ position: 'absolute', top: 0, right: 0, color: '#000' }} onClick={this.closeDialog.bind(this)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent className="showOrderDialogContent">
            <Typography variant="h6" component="span">{this.state.showOrder?.order.type_order}: {this.state.showOrder?.order.type_order_addr_new}</Typography>
            <Typography variant="h6" component="span">{this.state.showOrder?.order.time_order_name}: {this.state.showOrder?.order.time_order}</Typography>
            <Typography variant="h6" component="span">Статус заказа: {this.state.showOrder?.order.this_status_order}</Typography>
            { parseInt(this.state.showOrder?.order.is_preorder) == 1 ? null :
              <Typography variant="h6" component="span">{this.state.showOrder?.order.text_time}{this.state.showOrder?.order.time_to_client}</Typography>
            }
            { this.state.showOrder?.order.promo_name == null || this.state.showOrder?.order.promo_name.length == 0 ? null :
              <Typography variant="h6" component="span">Промокод: {this.state.showOrder?.order.promo_name}</Typography>
            }
            { this.state.showOrder?.order.promo_name == null || this.state.showOrder?.order.promo_name.length == 0 ? null :
              <Typography variant="h6" component="span" className="noSpace">{this.state.showOrder?.order.promo_text}</Typography>
            }
            { this.state.showOrder?.order.sdacha == null || this.state.showOrder?.order.sdacha.length == 0 || this.state.showOrder?.order.sdacha == 0 ? null :
              <Typography variant="h6" component="span">Сдача с: {this.state.showOrder?.order.sdacha}</Typography>
            }
            <Typography variant="h5" component="span" className="CardPriceItem">Сумма закза: {this.state.showOrder?.order.sum_order}<IconRuble style={{ width: 12, height: 12, fill: '#525252', marginBottom: -1 }} /></Typography>
              
            <Table className="tableOrderCheck" size='small'>
              <TableBody>
                {this.state.showOrder?.order_items.map((item, key) =>
                  <TableRow key={key}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.count}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
  
          </DialogContent>
          
          { parseInt( this.state.showOrder?.order.is_delete ) == 0 && parseInt( this.state.showOrder?.order.status_order ) !== 6 ? 
            <DialogActions style={{ justifyContent: 'flex-end', padding: '15px 0px' }}>
              <ButtonGroup disableElevation={true} disableRipple={true} variant="contained" className="BtnBorderOther" style={{ marginRight: 24 }}>
                <Button variant="contained" className="BtnCardMain CardInCardItem" onClick={ this.closeOrder.bind(this, this.state.showOrder?.order.order_id, this.state.showOrder?.order.point_id) }>Отменить заказ</Button>
              </ButtonGroup>
            </DialogActions>
              :
            null
          }
          { parseInt( this.state.showOrder?.order.is_delete ) == 1 || parseInt( this.state.showOrder?.order.status_order ) == 6 ? 
            <DialogActions style={{ justifyContent: 'flex-end', padding: '15px 0px' }}>
              <ButtonGroup disableElevation={true} disableRipple={true} variant="contained" className="BtnBorderOther" style={{ marginRight: 24 }}>
                <Button variant="contained" className="BtnCardMain CardInCardItem" onClick={ this.repeatOrder.bind(this, this.state.showOrder?.order.order_id, this.state.showOrder?.order.point_id) }>Повторить заказ</Button>
              </ButtonGroup>
            </DialogActions>
              :
            null
          }
        </Dialog>

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
    page: this_module
  };

  const data1 = await api(this_module, data);
  
  data1['city'] = query.city;

  return { props: { data1 } }
}