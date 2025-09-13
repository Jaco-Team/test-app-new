import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';

var isoWeek = require('dayjs/plugin/isoWeek')

import { api, apiAddress } from './api.js';

import useYandexMetrika from './useYandexMetrika';

import Cookies from 'js-cookie'

export const useHeaderStoreNew = createWithEqualityFn((set, get) => ({
  activePage: '',
  openCityModal: false,
  openAuthModal: false,
  openBasket: false,
  targetBasket: null,

  errTextAuth: '',
  token: '',

  errTitle: '',
  errText1: '',
  errText2: '',

  is_sms: true,

  typeLogin: 'start',
  // typeLogin: 'startTestAuth',
  userName: '',

  timer: 89,
  timerPage: false,

  preTypeLogin: '',
  loginLogin: '',
  pwdLogin: '',
  code: '',
  genPwd: '',
  loading: false,

  matches: null,

  openCityModalList: false,

  openModalAlert: false,
  textAlert: '',
  statusAlert: false,

  isAuth: 'none',

  yandexAuthLink: '',

  doubleClickSMS: false,

  openModalSelectAddress: false,
  chooseAddrStreet: [],

  isShowLoad: false,

  showClosePoint: false,

  YToken: '',

  checkSpam: false,

  saveYToken(token) {
    set({ YToken: token });
  },

  setCheckSpam(is_spam) {
    set({ checkSpam: is_spam });
  },

  setShowClosePoint: (type) => {
    set({ showClosePoint: type })
  },
 
  showLoad: (is_show) => {
    set({
      isShowLoad: is_show,
    });
  },

  // открытие/закрытие модалки выбора адреса доставки при условии что есть два и более похожих адреса
  setActiveModalSelectAddress: (active, chooseAddrStreet) => {
    set({ openModalSelectAddress: active, chooseAddrStreet})
  },

  // установить таймер для формы авторизации
  setTimer: (timer) => {
    set({ timer })

    if(timer === 0) {
      set({ timerPage: true })
    } else {
      set({ timerPage: false })
    }
  },

  // установление таймера 
  toTime: (seconds) => {
    let date = new Date(null);
    date.setSeconds(seconds);
    date.toISOString().substring(14, 19)
    return date.toISOString().substring(14, 19);
  },

  // открытие/закрытие модалки вывода сообщения на клиенте
  setActiveModalAlert: (active, textAlert, statusAlert) => {
    set({ openModalAlert: active, textAlert, statusAlert })
  },

  // установить шиирну экрана устройства, при открытии приложения 
  setMatches: (matches) => {
    set({ matches });
  },

  setMatches11: (matches) => {
    set({ matches });
  },

  setActivePage: (page) => {
    set({ activePage: page });
  },

   // открытие меню со списком городов
  setActiveModalCityList: (active) => {
    set({ openCityModalList: active });
  },

  // открытие меню с выбором города
  setActiveModalCity: (active) => {
    set({ openCityModal: active });
  },

  // открытие модального окна формы авторизации
  setActiveModalAuth: (active) => {
    set({ openAuthModal: active });

    if( active === true ){
      set({ typeLogin: 'start', loginLogin: '', pwdLogin: '' });
    } 
  },

  // навигация между формами авторизации
  navigate: (typeLogin) => {

    // if (typeLogin === 'create' || typeLogin === 'resetPWD') {
    //   get().gen_password();
    // }

    set({ typeLogin, errTextAuth: '', preTypeLogin: get().typeLogin });
  },

  // закрытие форм авторизации
  closeModalAuth: () => {
    set({
      openAuthModal: false,
      errTextAuth: '',
      typeLogin: 'start',
      // typeLogin: 'startTestAuth',
      preTypeLogin: '',
      loginLogin: '',
      pwdLogin: '',
      code: '',
      genPwd: '',
      timer: 89,
      timerPage: false,
    });
  },

  // изменение/введение логина/телефона
  changeLogin: (event) => {

    let data = event.target.value;

    if (parseInt(data[0]) == 9) {
      //data = data.slice(1);
      data = '8' + data;
    }

    if (data[0] == '+' && parseInt(data[1]) == '7') {
      data = data.slice(2);
      data = '8' + data;
    }

    if (parseInt(data[0]) == '7') {
      data = data.slice(1);
      data = '8' + data;
    }

    set({loginLogin: data});
  },

  // установление пароля при авторизации
  setPwdLogin: (event) => {
    if(event) {
      set({pwdLogin: event.target.value.replaceAll(' ', '')});
    } else {
      set({ pwdLogin: event });
    }
  },

  // запуск функции при нажатии enter в зависимости от формы авторизации
  checkLoginKey: (type, event) => {

    if (parseInt(event.keyCode) == 13) {
      if (parseInt(type) == 1) {
        get().logIn();
      }
      if (parseInt(type) == 2) {
        get().navigate('loginSMSCode');
        get().setTimer(89);

        setTimeout( () => {
          get().createProfile();
        }, 300)
      }

      if (parseInt(type) == 3) {
        get().sendsmsNewLogin();
      }

      // if (parseInt(type) == 4) {
      //   get().sendsmsNewLogin();
      // }
    }
  },
  
  // изменение/введение 4-х значного номера подтверждения
  changeCode: (code) => {
    code = code.replaceAll('•', '');

    set({ code });

    if (code.length < 4 || code === '') {
      set({ errTextAuth: '' });
    }

    if (code.length === 4) {
      get().checkCode();
    }
  },

  // генерация случаного пароля при регистарции
  // gen_password: () => {
  //   let genPwd = '';
  //   let symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+?';
  //   for (let i = 0; i < 10; i++) {
  //     genPwd += symbols.charAt(Math.floor(Math.random() * symbols.length));
  //   }

  //   set({ genPwd });
  // },

  // проверка логина, кода при регистрации/логировании
  checkCode: async () => {

    let login = get().loginLogin;

    login = login.split(' ').join('');
    login = login.split('(').join('');
    login = login.split(')').join('');
    login = login.split('-').join('');
    login = login.split('_').join('');

    const isSpecialUser = Cookies.get('isSpecialUser');

    let data = {
      type: 'check_profile',
      number: login,
      cod: get().code,
    };

    if(isSpecialUser){
      data.isSpecialUser = true;
    }

    const res = await api('auth', data);

    if (res?.st === false) {
      set({
        errTextAuth: res?.text,
      });

      get().setActiveModalAlert(true, res.text, false);
    } else {
      set({
        errTextAuth: '',
        errTitle: '',
        errText1: '',
        errText2: '',
      });

      if (get().preTypeLogin === 'create') {
        set({
          typeLogin: 'finish',
        });
      } else {
        get().closeModalAuth();
      }

      set({
        errTextAuth: '',
        token: res?.token,
        userName: get().setNameUser(res?.name),

        isAuth: 'auth'
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res?.token);
        Cookies.set('token', res?.token, { expires: 60 }) //expires 7 days
      }
    }
  },

  signOut: (city) => {

    useProfileStore.getState().saveUserActions('user_log_out', '');

    localStorage.removeItem('token');
    Cookies.remove('token');

    //window.location.href = '/' + city;

    set({
      isAuth: false,
      token: ''
    })
  },

  //логирование в форме регистрации
  logIn: async () => {

    set({ loading: true });

    let login = get().loginLogin;

    login = login.split(' ').join('');
    login = login.split('(').join('');
    login = login.split(')').join('');
    login = login.split('-').join('');
    login = login.split('_').join('');

    const data = {
      type: 'site_login',
      number: login,
      pwd: get().pwdLogin,
    };

    const json = await api('auth', data);

    if (json?.st === false) {
      set({
        errTextAuth: json?.text,
        loading: false,
      });

      get().setActiveModalAlert(true, json.text, false);
    } else {
      set({
        errTextAuth: '',
        is_sms: json?.is_sms,
        token: json?.token,
        userName: get().setNameUser(json?.name),
        openAuthModal: false,
        loading: false,
        isAuth: 'auth'
      });

      if (typeof window !== 'undefined') {

        useProfileStore.getState().saveUserActions('user_log_in', '');

        localStorage.setItem('token', json?.token);
        Cookies.set('token', json?.token, { expires: 60 }) //expires 7 days
      }
    }
  },

  checkToken: async () => {
    if (typeof window !== 'undefined') {

      const token_session = localStorage.getItem('token_tmp');

      if( token_session && token_session.length > 0 ){
        const this_date = get().formatDate(new Date());

        const [session_, token_, date] = token_session.split('_');

        if( this_date !== date ){
          const ses_token = 'session_' + Math.random().toString(36).substr(2, 16)+'_'+this_date;
        
          localStorage.setItem('token_tmp', ses_token);
        }

      }else{
        const date = get().formatDate(new Date());

        const ses_token = 'session_' + Math.random().toString(36).substr(2, 16)+'_'+date;
        
        localStorage.setItem('token_tmp', ses_token);
      }



      const token = localStorage.getItem('token');

      if( token && token.length > 0 ){
        const data = {
          type: 'check_token',
          token: token,
        };

        const json = await api('auth', data);

        if (json?.st === false) {
          set({
            isAuth: 'none'
          });
        }else{
          useProfileStore.getState().setUser(json?.user);

          set({
            token: token,
            userName: get().setNameUser(json?.user?.name),
            // shortName: json?.user?.name ? json?.user?.name?.substring(0, 1).toUpperCase() + json?.user?.fam?.substring(0, 1).toUpperCase() : '',
            shortName: json?.user?.name ? json?.user?.name?.substring(0, 1).toUpperCase() : '',
            isAuth: 'auth'
          });

          localStorage.setItem('token', token);
          Cookies.set('token', token, { expires: 60 }) //expires 7 days
        }

        return ;
      }

      const token2 = Cookies.get('token');

      if( token2 && token2.length > 0 ){
        const data = {
          type: 'check_token',
          token: token2,
        };

        const json = await api('auth', data);

        if (json?.st === false) {
          set({
            isAuth: 'none'
          });
        }else{

          useProfileStore.getState().setUser(json?.user);
          set({
            token: token2,
            userName: get().setNameUser(json?.user?.name),
            // shortName: json?.user?.name ? json?.user?.name?.substring(0, 1).toUpperCase() + json?.user?.fam?.substring(0, 1).toUpperCase() : '',
             shortName: json?.user?.name ? json?.user?.name?.substring(0, 1).toUpperCase() : '',
            isAuth: 'auth'
          });

          localStorage.setItem('token', token2);
          Cookies.set('token', token2, { expires: 60 }) //expires 7 days
        }

        return ;
      }

    }    
  },

  formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
  
    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
  
    var yy = date.getFullYear();
    
    return yy + '-' + mm + '-' + dd;

    return dd + '.' + mm + '.' + yy;
  },

  // защита
  // создание нового аккаунта или получения смс кода для действующего аккаунта
  createProfile: async ( token ) => {

    if( get().doubleClickSMS === true ){
      return ;
    }

    set({
      doubleClickSMS: true
    })

    let login = get().loginLogin;

    login = login.split(' ').join('');
    login = login.split('(').join('');
    login = login.split(')').join('');
    login = login.split('-').join('');
    login = login.split('_').join('');

    const isSpecialUser = Cookies.get('isSpecialUser');

    let data = {
      type: 'create_profile',
      number: login,
      token: token
    };

    if(isSpecialUser){
      data.isSpecialUser = true;
    }

    const json = await api('auth', data);
    
    if (json?.st) {
      set({
        errTextAuth: '',
        errTitle: '',
        errText1: '',
        errText2: '',
      });
    } else {
      set({
        errTextAuth: json?.text,
      });

      get().setActiveModalAlert(true, json?.text, false);
    }

    setTimeout(() => {
      set({
        doubleClickSMS: false
      })
    }, 300);
  },

  // защита
  // подтвреждение новой регистрации/изменения в существующий аккаунт
  sendsmsNewLogin: async () => {

    if( get().doubleClickSMS === true ){
      return ;
    }

    set({
      doubleClickSMS: true
    })

    if(get().typeLogin !== 'loginSMSCode') {
      set({ timerPage: false, timer: 89 })
      get().navigate('loginSMSCode');
    }

    let login = get().loginLogin;

    login = login.split(' ').join('');
    login = login.split('(').join('');
    login = login.split(')').join('');
    login = login.split('-').join('');
    login = login.split('_').join('');

    const data = {
      type: 'sendsmsrp',
      number: login,
      pwd: get().pwdLogin,
      //checkSpam: get().checkSpam === true ? 1 : 0
    };

    const json = await api('auth', data);

    if (json?.st === true) {
      set({
        errTextAuth: '',
        errTitle: '',
        errText1: '',
        errText2: '',
      });
    } else {
      set({
        errTextAuth: json?.text,
      });

      get().setActiveModalAlert(true, json.text, false);
    }

    setTimeout(() => {
      set({
        doubleClickSMS: false
      })
    }, 300);
  },

  getYandexLinkAuth: async(city) => {
    const data = {
      type: 'getYaLinkAuth',
      city: city
    };

    const json = await api('auth', data);

    set({
      yandexAuthLink: json?.link
    })
  },

  yandexAuthCheck: async(code) => {
    const isSpecialUser = Cookies.get('isSpecialUser');

    let data = {
      type: 'checkAuthYandex',
      code
    };

    if(isSpecialUser){
      data.isSpecialUser = true;
    }

    const json = await api('auth', data);

    if (json?.st === false) {
      get().setActiveModalAlert(true, json?.text, false);
    }else{

      if (json?.st === true) {
        set({
          token: json?.token,
          userName: get().setNameUser(json?.name),
          isAuth: 'auth'
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', json?.token);
          Cookies.set('token', json?.token, { expires: 60 }) //expires 7 days
        }
      }
    }
  },

  // открытие/закрытие корзины на главное странице
  setActiveBasket: (active) => {
    
    if(!active) {
      set({ targetBasket: null, openBasket: active });
    } else {
      const anchorEl = document.getElementById('headerNew');
      set({ targetBasket: anchorEl, openBasket: active });
    }

  },

  // определение инициалов из имени клиента при авторизации
  setNameUser: (name) => {
    let userName = '';

    if(name){
      const nameSplit = name.split(' ');

      if(nameSplit.length === 0) {
        return name;
      }

      if(nameSplit.length === 1) {
        //userName = nameSplit[0][0].toUpperCase() + nameSplit[0][1].toUpperCase()
        userName = nameSplit[0].toUpperCase();
      } 
      
      if(nameSplit.length > 1 && nameSplit[0] != '' && nameSplit[1] != '') {
        userName = nameSplit[0][0].toUpperCase() + nameSplit[1][0].toUpperCase()
      }

    }

    return userName;
  }
}), shallow)

export const useCartStore = createWithEqualityFn((set, get) => ({
  items: [],
  //itemsOnDops: [],
  itemsOffDops: [],
  itemsWithPromo: [],
  
  allItems: [],
  freeItems: [],
  needDops: [],
  dopListCart: [],
  itemsCount: 0,
  allPrice: 0,
  allPriceWithoutPromo: null, 

  promoInfo: null,
  checkPromo: null,
  free_drive: 0,
  itemsPromo: [],

  checkNewOrder: null,

  zones: null,
  center_map: null,

  //0 - доставка / 1 - самовывоз
  typeOrder: 'dev',

  //0 - обычный / 1 - пред
  byTime: 0,

  // даты для заказа
  datePreOrder: null,

  // время для заказа
  timePreOrder: null,

  //адрес доставки
  orderAddr: null,

  //точка самовывоза
  orderPic: 0,

  // найти добавляемый промо товар в корзине(items)
  //promoItemsFind: false,

  // открыть модалку оформления заказа на ПК
  openModalBasket: false,

  // открыть модалки в оформлении заказа на Мобилке
  openMenuCart: false,

  // название списка при оформлении заказа
  nameList: null,

  // открытие модалки чтобы выбрать время и дату заказа
  openDataTimePicker: false,

  // открыть модалку чтобы выбрать точку для оформления заказа в мобилке
  openMapPoints: false,

  // список точек для оформления заказа
  pointList: [],

  // список адресов досткаи для оформления заказа
  addrList: [],

  // id точки для оформления заказа
  point_id: null,

  // выбранное время и дата заказа
  dateTimeOrder: null,

  // тип способа оплаты
  typePay: null,

  // комментарий курьеру
  comment: '',

  // сумма доставки заказа
  summDiv: 0,

  // сдача при оплате наличными курьеру
  sdacha: '',

  openPayForm: false,

  openConfirmForm: false,
  dopListConfirm: [],

  DBClick: false,

  // проверка наличия в корзине роллов, пиццы или всего
  cart_is: 'all',

  promoName: '',

  linkPaySBP: '',

  ya_metrik: {
    'togliatti': 47085879,
    'samara': 47085879
  },

  global_checkout: null,

  show_checkFreeDrive: false,

  openMailForm: false,

  openDopsForm: false,

  // открытие/закрытие формы для добавления допов в заказ если в корзине есть роллы и нет соевого или имбиря или вассаби
  setDopsForm: (active) => {
    set({ openDopsForm: active });
  },

  // открытие/закрытие формы указание эл почты клиента
  setMailForm: (active) => {
    set({ openMailForm: active })
  },

  // открытие/закрытие формы подтверждения заказа
  setConfirmForm: (active) => {
    const promoName = Cookies.get('promo_name');
    
    const dopListConfirm = get().dopListCart?.filter(it => it.count)

    if( active === false ){
      if( get().global_checkout !== null ){
        get().global_checkout.destroy();

        set({
          global_checkout: null
        })
      }
    }

    set({ openConfirmForm: active, promoName, dopListConfirm })
  },

  // открытие/закрытие формы оплаты онлайн
  setPayForm: (active) => {
    set({ openPayForm: active })
  },

  clearDataSdacha: (sdacha) => {
    
    sdacha = sdacha+'';

    let numbers = sdacha.replace(/[^0-9]/gi, '');
    numbers = parseInt(numbers.replaceAll(',', ''));

    return numbers;
  },

  // установить размер сдачи при оплате наличными курьеру
  setSdacha: (sdacha) => {

    let val = sdacha.target.value.replace(/^0+/, '')

    //let numbers = val.replace(/[^0-9]/gi, '');
    //numbers = parseInt(numbers.replaceAll(',', ''));

    set({ 
      sdacha: val
    })

    get().setCartLocalStorage();
  },

  // установить стоимость доставки
  setSummDiv: (summDiv) => {
    set({ summDiv })

    get().setCartLocalStorage();
  },

  // установить тип заказа Доставка/Самовывоз
  setTypeOrder: (typeOrder) => {

    set({ typeOrder: typeOrder ? 'pic' : 'dev' })

    const cart = JSON.parse(localStorage.getItem('setCart'));

    if (typeOrder) {
      get().setTypePay({ id: 'cash', name: 'В кафе' });
      get().setSummDiv(0);
      // get().setSdacha(0);
      // get().changeComment('');
    } else {

      if(cart?.typePay?.name === 'В кафе') {
        get().setTypePay(null);
      }

      get().setSummDiv(get().orderAddr?.sum_div ?? 0);
    }

    get().setCartLocalStorage();
  },

  // получение данных корзины и оформления заказа
  getCartLocalStorage: () => {

    const promoName = Cookies.get('promo_name');
    const allItems = get().allItems;
    let cart = localStorage.getItem('setCart');
    
    if( cart && cart.length > 0 ){
      cart = JSON.parse(cart);
    }else{
      return;
    }

    if( allItems.length == 0 ) {
      return;
    }

    if (localStorage.getItem('setCity') && localStorage.getItem('setCity').length > 0) {
      const city = JSON.parse(localStorage.getItem('setCity'));
      
      if(city?.link === cart?.city?.link) {

          let this_item = null;

          cart.items = cart?.items?.reduce((newItems, item) => {
            this_item = allItems?.find(it => parseInt(it.id) === parseInt(item.item_id));

            if(this_item) {
              item.one_price = this_item?.price;
              item.all_price = parseInt(this_item?.price) * parseInt(item.count);
              newItems.push(item);
            }

            return newItems;
          }, [])

          const allPriceWithoutPromo = cart.items.reduce((all, it) => all + it.count * it.one_price, 0);

          const itemsCount = cart.items.reduce((all, item) => all + item.count, 0);
      
          set({ items: cart.items, allPriceWithoutPromo, itemsCount });
          
          if(promoName) {

            get().getInfoPromo(promoName, city?.link)

            //setTimeout(() => {
              get().getItems();
              get().check_need_dops();
            //}, 3000)
          } else {
            get().getItems();
            get().check_need_dops();
          }

        if(cart?.orderAddr) {
          set({ orderAddr: cart?.orderAddr });

          if(cart?.orderAddr?.free_drive) {
            set({ free_drive: cart?.orderAddr?.free_drive });
          }
        }

        if(cart?.orderPic) {
          set({ orderPic: cart?.orderPic });
        }

        if(cart?.comment) {
          set({ comment: cart?.comment });
        }

        if(cart?.typePay) {
          set({ typePay: cart?.typePay });
        }

        if(cart?.sdacha) {
          set({ sdacha: cart?.sdacha });
        }

        if(cart?.typeOrder) {
          set({ typeOrder: cart?.typeOrder });
        }

        if(cart?.dateTimeOrder) {
          set({ dateTimeOrder: cart?.dateTimeOrder });
        }

        if(cart?.summDiv) {
          set({ summDiv: cart?.summDiv });
        }

        
      }
    }
  },

  // сохранить заполненные/выбранные данные корзины в localStorage
  setCartLocalStorage: () => {

    const city = JSON.parse(localStorage.getItem('setCity'));

    const data = {
      city,
      items: get().items,
      sdacha: get().sdacha,
      summDiv: get().summDiv,
      comment: get().comment,
      typePay: get().typePay,
      orderPic: get().orderPic,
      orderAddr: get().orderAddr,
      typeOrder: get().typeOrder,
      dateTimeOrder: get().dateTimeOrder,
    }

    localStorage.setItem('setCart', JSON.stringify(data));
  },

  // комментарий по заказу при доставке товара
  changeComment: (event) => {

    if(event === '') {
      set({ comment: event })
    } else {
      const comment = event?.target?.value ?? event;

      const len = comment.split(/\r?\n|\r|\n/g)

      if(len.length > 2) {
        return ;
      }

      if (comment.length > 50) {
        return ;
      }

      
      set({ comment })
      

    }

    get().setCartLocalStorage();

  },

  // установить способо оплаты заказа
  setTypePay: (typePay) => {
    set({ typePay })

    get().setCartLocalStorage();
  },
  
  // установить дату и время заказа
  setDataTimeOrder: (dateTimeOrder) => {
    set({ dateTimeOrder })

    get().setCartLocalStorage();
  },

  // выбрать адрес доставки
  setAddrDiv: (orderAddr) => {
    set({ orderAddr })

    get().setCartLocalStorage();
  },

  // выбрать точку
  setPoint: (orderPic) => {
    set({ orderPic })

    get().setCartLocalStorage();
  },

  // все товары которые есть на сайте
  setAllItems: (allItems) => {
    set({ allItems })
  },

  getNewPriceItems: async(city) => {
    let data = {
      type: 'get_page_info', 
      city_id: city,
      page: 'zakazy'
    };
  
    let json = await api('zakazy', data);

    let cart = get().items;
    let allItems = json?.all_items;
    let this_item = null;

    cart.map((item, key) => {
      this_item = allItems?.find( it => parseInt(it.id) === parseInt(item.item_id));

      cart[ key ]['one_price'] = this_item?.price;
      cart[ key ]['all_price'] = parseInt(this_item?.price) * parseInt(item.count);
    })

    set({ 
      items: cart,
      allItems: json?.all_items
    });

    //get().setAllItems(json?.all_items);
    //get().changeAllItems();

    if(Cookies.get('promo_name') && Cookies.get('promo_name').length > 0){
      get().getInfoPromo(Cookies.get('promo_name'), city)
    } else {
      get().promoCheck();
    }

    //get().getItems();
  },

  // все товары которые есть на сайте
  setFreeItems: (freeItems) => {
    set({ freeItems })
  },

  // изменение цен при оформлении заказа в зависимости от выбранного города
  changeAllItems: () => {

    let items = get().items;
    const allItems = get().allItems;
    const promoInfo = get().promoInfo;

    items = items.map((item) => {
      allItems.map(it => {
        if(item.item_id === it.id){
          item.one_price = it.price
        return item;
        }
      })
      return item;
    })

    const allPriceWithoutPromo = items.reduce((all, it) => all + it.count * it.one_price, 0);

    set({ items, allPriceWithoutPromo });
    
    if(promoInfo) {
      if(Cookies.get('promo_name') && Cookies.get('promo_name').length > 0){

        const city = useCitiesStore.getState().thisCity;

        get().getInfoPromo(Cookies.get('promo_name'), city)
      } else {
        get().promoCheck();
      }
      // get().promoCheck();
    } else {
      get().getItems();
    }
  },

  // открытие/закрытие карты с выбором точек в Корзине мобильной версии
  setActiveCartMap: (active) => {
    set({ openMapPoints: active });
  },

  // открытие/закрытие меню Корзины c выбором даты/времени доставки в мобильной версии
  setActiveDataTimePicker: (active) => {
    set({ openDataTimePicker: active });
  },

  // открытие/закрытие меню Корзины в мобильной версии
  setActiveMenuCart: async(active, nameList) => {

    if(active) {
      const data = {
        type: 'get_point_list',
      };
      
      const json = await api('cart', data);
      set({ pointList: json?.points});
    }

    set({ openMenuCart: active, nameList });
  },

  // модалка Корзины для оформления/оплаты заказа на ПК
  setActiveModalBasket: async(active) => {

    if(active) {
      const data = {
        type: 'get_point_list',
      };
      
      const json = await api('cart', data);
      set({ pointList: json?.points});
    }

    set({ openModalBasket: active });
  },

  // получение дат заказа в оформлении заказа
  getDataPred: async() => {
    
    const data = {
      type: 'get_date_pred'
    };
    
    let json = await api('cart', data);

    json = json?.map(date => {
      if(date.text !== "Сегодня" && date.text !== "Завтра") {
          date.text = dayjs(date.text).locale('ru').format('DD MMM').replace('.', '');
          return date
        }
      return date;
    })

    set({ datePreOrder: json });
  },

  // получение времени заказа в оформлении заказа
  getTimesPred: async(point_id, date, typeOrder, cart) => {

    const my_cart = get().items;

    let my_cart_ = my_cart.map( item => {
      return {
        id: item?.id ?? item?.item_id,
        item_id: item?.id ?? item?.item_id,
        count: item.count,
      }
    } )

    const setDate = date ?? dayjs().format('YYYY-MM-DD');

    const today = dayjs().format('YYYY-MM-DD');
    
    const data = {
      type: 'get_times_pred',
      date: setDate,
      point_id: point_id ?? get().point_id,
      type_order: get().typeOrder == 'pic' ? 1 : 0,
      cart: JSON.stringify(my_cart_)
    };
    
    let json = await api('cart', data);

    if( json?.st === false ){

      useHeaderStoreNew.getState().setActiveModalAlert(true, json?.text, false);
      return ;
    }

    json = json?.filter((time) => time.name !== 'В ближайшее время');
    
    if(setDate === today && !json?.length) {

      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate()+1);
      tomorrow = dayjs(tomorrow).format('YYYY-MM-DD');

      const data = {
        type: 'get_times_pred',
        date: tomorrow,
        point_id: point_id ?? get().point_id,
        type_order: get().typeOrder == 'pic' ? 1 : 0,
        cart: JSON.stringify(my_cart_)
      };
      
      let json = await api('cart', data);
      json = json?.filter((time) => time.name !== 'В ближайшее время');

      let datePreOrder = get().datePreOrder;
      datePreOrder = datePreOrder?.filter((day) => day.text !== 'Сегодня')

      set({ 
        timePreOrder: json, 
        point_id: point_id ?? get().point_id, 
        datePreOrder 
      })

    } else {

      set({ 
        timePreOrder: json, 
        point_id: point_id ?? get().point_id, 
      })

    }

  },

  // получение адресов доставки в оформлении заказа
  getMySavedAddr: async(city_id, address) => {
    if (typeof window !== 'undefined') {
      //const token1 = localStorage.getItem('token');

      const token1 = useHeaderStoreNew.getState().token;

      if( token1 && token1?.length > 0 ){

        const data = {
          type: 'get_my_saved_addr',
          city_id: city_id,
          token: token1
        };
        
        const json = await api('cart', data);

        if( json && json?.length > 0 ){
          if(address) {

            const findAddr = json?.find(addr => addr.street === address.street && addr.home === address.home);

            if(findAddr) {
              get().setAddrDiv(findAddr);
              get().setSummDiv(findAddr.sum_div ?? 0);
            }

          }

          set({ addrList: json ?? [] });

          get().setCartLocalStorage();
        }
      }
    }
  },

  check_pay_sbp: async(order_id, point_id) => {
    const data = {order_id, point_id};

    const json = await api('cart', data);

    return json;
  },

  // создание заказа
  createOrder: async(token, city_id, funcClose) => {

    if( !token || token?.length == 0 ){

      useHeaderStoreNew.getState().setActiveModalAuth(true);

      set({ DBClick: false });

      return;
    }

    if( get().DBClick === true ){
      return;
    }else{
      set({ DBClick: true });
    }

    let data;
    const typeOrder = get().typeOrder;
    //const promoName = sessionStorage.getItem('promo_name');
    const promoName = Cookies.get('promo_name');

    let sdacha = get().sdacha;

    let ytoken = useHeaderStoreNew.getState().YToken;

    //sdacha = get().clearDataSdacha(sdacha);

    //самовывоз
    if( typeOrder == 'pic' ) {
      data = {
        type: 'create_order_pre',
        token,
        city_id,
        promoName: promoName ?? '',
        sdacha: 0,
        // comment: get().comment,
        comment: '',
        typePay: get().typePay.id,
        typeOrder: 1,
        point_id: get().orderPic.id,
        dateTimeOrder: JSON.stringify(get().dateTimeOrder ?? { date: '', name: 'В ближайшее время', id: -1 }),
        cart: JSON.stringify(get().items),
        free_drive: get().free_drive,
        ytoken: ytoken,
        //rtoken: typeof window !== "undefined" ? window.roistat?.getVisit?.() || 0 : 0,
        rtoken: 0
      };
    } else {
      data = {
        type: 'create_order_pre',
        token,
        city_id,
        promoName: promoName ?? '',
        sdacha: sdacha,
        addr: JSON.stringify(get().orderAddr),
        point_id: get().orderAddr.point_id,
        comment: get().comment,
        typePay: get().typePay.id,
        typeOrder: 0,
        dateTimeOrder: JSON.stringify(get().dateTimeOrder ?? { date: '', name: 'В ближайшее время', id: -1 }),
        cart: JSON.stringify(get().items),
        free_drive: get().free_drive,
        ytoken: ytoken,
        //rtoken: typeof window !== "undefined" ? window.roistat?.getVisit?.() || 0 : 0,
        rtoken: 0
      };
    }

    const json = await api('cart', data);

    setTimeout( () => {
      set({ DBClick: false });
    }, 300 )

    if( json?.st === true ){

      set({
        checkNewOrder: json?.check
      })

      if( get().typePay.id == 'online' || get().typePay.id == 'sbp' ){

        //set({
        //  openPayForm: true
        //})

        if( get().typePay.id == 'sbp' ){
          set({
            linkPaySBP: json?.pay?.pay?.confirmation?.confirmation_data,
          })

          let timerId = setInterval( async () => {

            const data = {
              type: 'check_pay_order',
              order_id: json?.check?.order?.order_id,
              point_id: json?.check?.order?.point_id,
              
            };
        
            const res = await api('cart', data);
        
            if( res?.st === true ){
              clearInterval(timerId);
              funcClose();
            }
          }, 3000);
        }

        if( get().typePay.id == 'online' ){
          const checkout = new window.YooMoneyCheckoutWidget({
            confirmation_token: json.pay.pay.confirmation.confirmation_token,

            error_callback: function(error) {
              console.log(error)
            }
          });

          set({
            global_checkout: checkout
          })

          checkout.on('success', () => {
            useProfileStore.getState().saveUserActions('true_pay_online_order', '', get().allPrice);
            checkout.destroy();
            funcClose();
          });
      
          checkout.on('fail', () => {
            checkout.destroy();
            return 'nothing';
          });

          setTimeout( () => {
            checkout.render('payment-form');
          }, 300 )
        }
      
        return 'wait_payment';
      }else{
        /*try { повтор
          const city = useCitiesStore.getState().thisCity;
          const city_ru = useCitiesStore.getState().thisCityRu;
    
          const ym_data = {
            city: city_ru,
            type_pay: get().typePay.name,
            //summ: get().allPrice,
            typeOrder: typeOrder == 'pic' ? 'Самовывоз' : 'Доставка'
          }
    
          ym(get().ya_metrik[city], 'reachGoal', 'pay_order', ym_data);
    
        } catch (error) {
          console.log('createOrder', error);
        }*/

        return 'to_cart';
      }
    }else{
      //показать ошибку
      useHeaderStoreNew.getState().setActiveModalAlert(true, json?.text, false);

      return 'nothing';
    }

    // return json;

    // get().setCartLocalStorage();
  },

  // подтверждение заказа
  trueOrderCash: async(token, point_id, order_id) => {

    if( get().DBClick === true ){
      return;
    }else{
      set({ DBClick: true });
    }

    let data = {
      type: 'order_true',
      token,
      point_id,
      order_id
    };

    const json = await api('cart', data);

    setTimeout( () => {
      set({ DBClick: false });
    }, 300 )

    if( json?.st === true ){

      
    }else{
      //показать ошибку
      useHeaderStoreNew.getState().setActiveModalAlert(true, json?.text, false);
    }

    return json?.st;
  },

  clearCartData: () => {
    localStorage.removeItem('setCart');
    sessionStorage.removeItem('promo_name');
    Cookies.remove('promo_name');

    set({
      items: [],
      //itemsOnDops: [],
      cart_is: 'all',
      itemsOffDops: [],
      itemsWithPromo: [],

      dopListCart: [],
      itemsCount: 0,
      allPrice: 0,
      allPriceWithoutPromo: null, 

      promoInfo: null,
      checkPromo: null,
      free_drive: 0,
      itemsPromo: [],
    });

    get().setCartLocalStorage();

    get().setDataPromoBasket();
    get().check_need_dops();
  },

  // получения товара для корзины и добавление промоТовара в корзину если есть и разделение корзины на товары без допов и доп товары
  getItems: () => {

    const items = get().items;
    const itemsWithPromo = get().itemsWithPromo;

    const allItems = [...items, ...itemsWithPromo];

    const rolly = !!allItems?.find(item => parseInt(item.cat_id) === 4 || parseInt(item.cat_id) === 10 || parseInt(item.cat_id) === 13 || parseInt(item.cat_id) === 12 || parseInt(item.cat_id) === 9);
    const pizza = !!allItems?.find(item => parseInt(item.cat_id) === 14);

    if(rolly && !pizza) {
      set({ cart_is: 'rolly' })
    } 

    if(!rolly && pizza) {
      set({ cart_is: 'pizza' })
    } 

    if(rolly && pizza || !rolly && !pizza) {
      set({ cart_is: 'all' })
    } 

    let itemsOffDops = allItems?.filter(item => (parseInt(item.cat_id) !== 7 || item.disabled) && item.cat_id !== undefined );

    set({ itemsOffDops });

    get().check_need_dops();

    get().setCartLocalStorage();

  },

  // установка данных для корзины если есть промик, в зависимости от промика
  setDataPromoBasket: () => {

    const items = get().items;
    const promoInfo = get().promoInfo;
    const checkPromo = get().checkPromo;

    const itemsCount = items.reduce((all, item) => all + item.count, 0);
    
    if( checkPromo?.st === true ) {

      if(promoInfo?.promo_action === '2') {
        let itemsWithPromo = get().itemsWithPromo;

        let itemsWithPromo__ = [...items, ...itemsWithPromo];

        const allPriceWithoutPromo = itemsWithPromo__.reduce((all, it) => all + it.count * it.one_price, 0);

        set({ itemsCount: itemsCount + promoInfo.items_add.length, itemsWithPromo, allPriceWithoutPromo });
      } else {
        set({ itemsCount: itemsCount, itemsWithPromo: [] });
      }

      // if(promoInfo?.promo_action === '3') {
      //   const promoId = promoInfo.items_on_price[0].id;
      //   const promo = items.find(item => item.item_id === promoId);
      //   if(promo) {
      //     set({ promoItemsFind: true });
      //   }
      // } else {
      //   set({ promoItemsFind: false });
      // }

    } else {
      set({ itemsCount });
    }

    if(!promoInfo?.status_promo) {
      const allPriceWithoutPromo = items.reduce((all, it) => all + it.count * it.one_price, 0);
      set({ allPriceWithoutPromo, allPrice: 0 });
    } 

    get().getItems();
  },

  setNeedDops: (dops) => {
    set({ needDops: dops });
  },

  check_need_dops: () => {
    let my_cart = get().items;
    let my_cart_promo = get().itemsPromo;
    let all_items = get().allItems;
    
    if( all_items.length == 0 || all_items.length == 0 ){
      return [];
    }
    
    let count_pizza = 0,
        count_rolls = 0;
        
    let need_dops = get().needDops;
        
    my_cart?.forEach(el => {
      let this_item = all_items?.find( (item) => item.id == el.item_id );
      
      if( !this_item ){
        return [];
      }
      
      if( parseInt(this_item['cat_id']) == 14 ){
        count_pizza += parseInt(el.count)
      }else{
        if( parseInt(this_item['cat_id']) !== 14 && parseInt(this_item['cat_id']) !== 5 && parseInt(this_item['cat_id']) !== 6 && parseInt(this_item['cat_id']) !== 7 ){
          count_rolls += parseInt(el.count)
        }
      }
    });
    
    let all_need_dops = [];
    
    if( count_rolls > 0 && count_pizza == 0 ){
      all_need_dops = need_dops['rolls'];
    }
    
    if( count_rolls == 0 && count_pizza > 0 ){
      all_need_dops = need_dops['pizza'];
    }
    
    if( count_rolls > 0 && count_pizza > 0 ){
      all_need_dops = [...need_dops['rolls'], ...need_dops['pizza']];
    }
    
    if( count_rolls == 0 && count_pizza == 0 ){
      all_need_dops = [...need_dops['rolls'], ...need_dops['pizza']];
    }
    
    let my_dops = [],
        add_my_dop = [];
    
    my_cart?.forEach(el => {
      let this_item = all_items?.find( (item) => item.id == el.item_id );
      
      if( !this_item ){
        return [];
      }
      
      if( parseInt(this_item['cat_id']) == 7 ){
        my_dops.push( this_item );
      }
    });
    
    my_dops?.forEach( (my_d) => {
      let check_dop = false;
      
      all_need_dops?.forEach( (need_dop) => {
        if( parseInt( need_dop.id ) == parseInt( my_d.id ) ){
          check_dop = true;
        }
      });
      
      if( !check_dop ){
        add_my_dop.push( my_d );
      }
    });
    
    all_need_dops = [...all_need_dops, ...add_my_dop];
    
    all_need_dops?.forEach( (el, key) => {
      let this_item = my_cart?.find( (item) => el.id == item.item_id );
      
      if( !this_item ){
        all_need_dops[ key ].count = 0;
      }else{
        all_need_dops[ key ].count = this_item.count;
      }
    
      all_need_dops[ key ].one_price = el.price;
      all_need_dops[ key ].item_id = el.id;
    });

    set({
      dopListCart: all_need_dops
    })

 
  },

  check_max_count: (item_id) =>{
    let free_dops_in_cart = [];
    let unic_id = [];
    
    let my_cart = get().items;
    let my_cart_dop = get().itemsOffDops;
    let my_cart_promo = get().itemsPromo;
    let free_items = get().freeItems;
    let all_items = get().allItems;
    
    //let itemsOffDops = get().itemsOffDops;
    //let itemsWithPromo = get().itemsWithPromo;

    let check_item = all_items?.find( (item) => parseInt(item.id) == parseInt(item_id) );
    
    if( parseInt(check_item.id) == 231 || parseInt(check_item.id) == 232 || parseInt(check_item.id) == 233 ){
      return 1;
    }
    
    if( parseInt(check_item.type) != 3 || (parseInt(check_item.id) !== 17 && parseInt(check_item.id) !== 237) ){
      return 99;
    }
    
    if( !free_items ){
      return 99;
    }
    
    let all_max_count = 0;
    let my_free_count = 0;
    let this_my_free_count = 0;
    
    my_cart?.forEach((item_cart, key) => {
      
      let item_info = all_items?.find( (item) => parseInt(item.id) == parseInt(item_cart['item_id']) );
      let check_free = free_items?.find( (item) => parseInt(item['item_id']) == parseInt(item_cart['item_id']) );
      
      if( check_free && check_free.max_count && parseInt(item_info.type) != 3 ){
        all_max_count += parseInt(check_free.max_count);
      }
      
      if( parseInt(item_info.id) == 17 || parseInt(item_info.id) == 237 ){
        my_free_count += parseInt(item_cart['count']);
      }
      
      if( parseInt(item_info.id) == parseInt(item_id) ){
        this_my_free_count += parseInt(item_cart['count']);
      }

      free_items?.forEach( (item) => {
        if( parseInt(item_cart['item_id']) == parseInt(item['item_id']) ){
          item['count_in_cart'] = parseInt(item_cart['count']);
          
          free_dops_in_cart.push( item );
          unic_id.push( parseInt(item['dop_item_id']) );
        }
      });
    });

    my_cart_promo?.forEach((item_cart, key) => {
      
      let item_info = all_items?.find( (item) => parseInt(item.id) == parseInt(item_cart['item_id']) );
      let check_free = free_items?.find( (item) => parseInt(item['item_id']) == parseInt(item_cart['item_id']) );
      
      if( check_free && check_free.max_count && parseInt(item_info.type) != 3 ){
        all_max_count += parseInt(check_free.max_count);
      }
      
      if( parseInt(item_info.id) == 17 || parseInt(item_info.id) == 237 ){
        my_free_count += parseInt(item_cart['count']);
      }
      
      if( parseInt(item_info.id) == parseInt(item_id) ){
        this_my_free_count += parseInt(item_cart['count']);
      }

      free_items?.forEach( (item) => {
        if( parseInt(item_cart['item_id']) == parseInt(item['item_id']) ){
          item['count_in_cart'] = parseInt(item_cart['count']);
          
          free_dops_in_cart.push( item );
          unic_id.push( parseInt(item['dop_item_id']) );
        }
      });
    });

    my_cart_dop?.forEach((item_cart, key) => {
      
      let item_info = all_items?.find( (item) => parseInt(item.id) == parseInt(item_cart['item_id']) );
      let check_free = free_items?.find( (item) => parseInt(item['item_id']) == parseInt(item_cart['item_id']) );
      
      if( check_free && check_free.max_count && parseInt(item_info.type) != 3 ){
        all_max_count += parseInt(check_free.max_count);
      }
      
      if( parseInt(item_info.id) == 17 || parseInt(item_info.id) == 237 ){
        my_free_count += parseInt(item_cart['count']);
      }
      
      if( parseInt(item_info.id) == parseInt(item_id) ){
        this_my_free_count += parseInt(item_cart['count']);
      }

      free_items?.forEach( (item) => {
        if( parseInt(item_cart['item_id']) == parseInt(item['item_id']) ){
          item['count_in_cart'] = parseInt(item_cart['count']);
          
          free_dops_in_cart.push( item );
          unic_id.push( parseInt(item['dop_item_id']) );
        }
      });
    });
    
    unic_id = [...new Set(unic_id)];
    
    let new_free_dop = [];
    
    unic_id?.forEach( (unic_item, key) => {
      free_dops_in_cart?.forEach( (item_free) => {
        if( parseInt(unic_item) == parseInt(item_free['dop_item_id']) ){
          let check = false;
          
          new_free_dop?.forEach( (el, k) => {
            if( parseInt( el['item_id'] ) == parseInt(unic_item) ){
              check = true;
              new_free_dop[k]['count'] += item_free['count_in_cart'] * item_free['max_count'];
            }
          });
          
          if( !check ){
            new_free_dop.push({
              item_id: parseInt(unic_item),
              count_in_cart: item_free['count_in_cart'],
              count: item_free['count_in_cart'] * item_free['max_count']
            });
          }
        }
      })
    });
    
    let max_count = 99;
    
    if( new_free_dop?.length > 0 ){
      
      let max_count2 = new_free_dop?.find( (item) => parseInt(item['item_id']) == 17 || parseInt(item['item_id']) == 237 );
          max_count = new_free_dop?.find( (item) => parseInt(item['item_id']) == parseInt(item_id) );
      
      if( max_count ){
        max_count = parseInt(max_count['count']);
        
        if( my_free_count >= max_count ){
          return max_count - my_free_count;
        }else{
          return max_count;
        }
        
      }
    }
    
    return 0;
  },

  // добавления товара для корзины
  plus: (item_id) => {
    let check = false;
    let items = get().items;
    const allItems = get().allItems;
    let itemsCount = get().itemsCount;
    const promoInfo = get().promoInfo;

    let ym_item;

    const max_count = get().check_max_count(item_id);

    if( max_count <= 0 ){
      return ;
    }

    items = items.map((item) => {
      if( parseInt(item.item_id) === parseInt(item_id) && parseInt(item.count) + 1 <= max_count ){
        item.count++;
        itemsCount++;
        check = true;

        useProfileStore.getState().saveUserActions('plus_item', item.name, item.one_price, item_id);

        ym_item = item;
        return item;
      }
      return item;
    })

    if(!check){
      const item = allItems?.find(item => parseInt(item.id) === parseInt(item_id));

      if( item ){
        item.count = 1;
        itemsCount++;
        item.item_id = item.id;
        item.one_price = item.price;
        //item.cat_id = item.cat_id;
        items = [...items, ...[item]];

        useProfileStore.getState().saveUserActions('plus_item', item.name, item.price, item_id);
      }

      ym_item = item;
    }

    const allPriceWithoutPromo = items.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);

    set({ items, itemsCount, allPriceWithoutPromo });
    
    if(promoInfo) {
      const promoName = Cookies.get('promo_name');
      //if(sessionStorage.getItem('promo_name') && sessionStorage.getItem('promo_name').length > 0){
      if(Cookies.get('promo_name') && Cookies.get('promo_name').length > 0){

        const city = useCitiesStore.getState().thisCity;

        get().getInfoPromo(Cookies.get('promo_name'), city)
      } else {
        get().promoCheck();
      }
      // get().promoCheck();
    } else {
      get().getItems();
    }

    get().check_need_dops();

    get().setCartLocalStorage();
  },

  // вычитание товара из корзины
  minus: (item_id, type) => {
    let items = get().items;
    let itemsCount = get().itemsCount;
    const promoInfo = get().promoInfo;

    let ym_item;

    if(type && type === 'zero') {
      items = items.reduce((newItems, item) => {
        if(parseInt(item.item_id) === parseInt(item_id)){
          itemsCount = itemsCount - item.count;
          item.count = 0;

          useProfileStore.getState().saveUserActions('minus_item', item.name, item.one_price, item_id);

          ym_item = item;
        }
        return item.count > 0 ? newItems = [...newItems,...[item]] : newItems;
      }, [])
    } else {
      items = items.reduce((newItems, item) => {
        if(parseInt(item.item_id) === parseInt(item_id)){
          item.count--;
          itemsCount--;

          useProfileStore.getState().saveUserActions('minus_item', item.name, item.one_price, item_id);

          ym_item = item;
        }
        return item.count > 0 ? newItems = [...newItems,...[item]] : newItems;
      }, [])
    }

    let check_dop = items?.filter( (item, key) => parseInt(item.count) > 0 && (parseInt(item.item_id) == 17 || parseInt(item.item_id) == 237) );

    if( check_dop.length == 0 ){
      check_dop = 1;
    }else{
      check_dop = check_dop.length;
    }

    let max_count = 0;

    items.map( (item, key) => {
      max_count = get().check_max_count(item.item_id);
      
      //max_count = parseInt(max_count / check_dop) - 2;

      if( max_count > 0 && max_count < 1 ){
        max_count = 1;
      }else{
        max_count = parseInt(max_count);
      }

      if( parseInt(max_count) < 0 ){
        items[key]['count'] = parseInt(item.count) + parseInt(max_count) >= 0 ? parseInt(item.count) + parseInt(max_count) : 0;
      }
    })

    const allPriceWithoutPromo = items.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);

    set({ items, itemsCount, allPriceWithoutPromo });
    
    if(promoInfo) {
      if(Cookies.get('promo_name') && Cookies.get('promo_name').length > 0){

        const city = useCitiesStore.getState().thisCity;

        get().getInfoPromo(Cookies.get('promo_name'), city)
      } else {
        get().promoCheck();
      }
      // get().promoCheck();
    } else {
      get().getItems();
    }

    get().check_need_dops();

    get().setCartLocalStorage();
  },

  // получения информации о промике из БД
  getInfoPromo: async (promoName, city) => {
    
    if( promoName?.length == 0 ){
      set({
        promoInfo: null,
        checkPromo: null,
      })
      
      sessionStorage.removeItem('promo_name')
      Cookies.remove('promo_name')

      const res = get().promoCheck();

      setTimeout( () => {
        get().setDataPromoBasket()
      }, 100 )

      setTimeout(() => {
        get().setDataPromoBasket()
      }, 100)
      
      useProfileStore.getState().saveUserActions('remove_promo', '');

      return {
        st: false,
        text: '',
      };

    } else {
      
      const data = {
        type: 'get_promo',
        city_id: city,
        promo_name: promoName
      };
      
      const json = await api('cart', data);

      useProfileStore.getState().saveUserActions('check_promo', promoName);

      set({
        promoInfo: json,
        allPrice: 0,
        allPriceWithoutPromo: null, 
      })
      
      sessionStorage.setItem('promo_name', promoName)
      Cookies.set('promo_name', promoName, { expires: 1 })
      
      const res = get().promoCheck();

      setTimeout( () => {
        get().setDataPromoBasket()
      }, 100 )
      
      set({
        checkPromo: res
      })
      
      return res;
    }
  
  },

  setFreeDrive: (freeDrive) => {
    set({
      free_drive: parseInt(freeDrive)
    })
  },

  // проверка промика
  promoCheck: () => {

    get().setDataPromoBasket();

    set({
      free_drive: 0,
      itemsWithPromo: []
    })
    
    let tmp = 0,
        allPrice = 0;
        
    let promo_info = get().promoInfo;
    let my_cart = get().items;  
    let allItems = get().allItems;
      
    tmp = 0;
    allPrice = 0;
    
    if(!allItems.length || !allItems) return ; 

    let new_my_cart = [];
      
    my_cart?.forEach( (el_cart, key_cart) => {
      new_my_cart.push({
        name: el_cart.name,
        item_id: el_cart.item_id,
        count: el_cart.count,
        one_price: el_cart.one_price,
        all_price: parseInt(el_cart.one_price) * parseInt(el_cart.count),
        img_app: el_cart.img_app,
        cat_id: el_cart.cat_id,
        cat_name: el_cart?.cat_name,
      });
    })
    
    my_cart = new_my_cart;  
      
    set({
      items: my_cart,
      itemsWithPromo: []
    })
      
    let cart_new_promo = [];    
    allPrice = my_cart.reduce( (sum, item) => sum + parseInt(item['all_price']), tmp );
    
    setTimeout( () => {
      set({
        allPrice: allPrice
      })
    }, 100 )

    let type_order = 0,
        point_id_dev = 0,
        point_id_pic = 0;
    
    type_order = get().typeOrder == 'pic' ? 1 : 0;
    point_id_dev = get().orderAddr ? parseInt( get().orderAddr?.point_id ) : 0;
    point_id_pic = parseInt( get().orderPic?.id );
    
    let this_date = '',
        this_time = '',
        this_dow = '';
    
    dayjs.extend(isoWeek)
    
    if( parseInt( get().byTime ) == 0 ){
      this_date = dayjs(new Date()).format("YYYY-MM-DD");
      this_time = dayjs(new Date()).format("HH:mm");
      this_dow = dayjs(new Date()).isoWeekday();
    }else{
      this_date = dayjs( get().datePreOrder ).format("YYYY-MM-DD");
      this_time = dayjs( get().timePreOrder ).format("HH:mm");
      this_dow = parseInt( dayjs( get().datePreOrder ).isoWeekday() );
    }

    if( promo_info ){
      if( promo_info.status_promo === false ){
        return {
          st: false,
          text: 'Не можем найти промокод. Может, его уже кто-то активировал?'
        }
      }
      
      if( promo_info.limits.date.min && promo_info.limits.date.max ){
        if( this_date >= promo_info.limits.date.min && this_date <= promo_info.limits.date.max ){
          
        }else{
          return {
            st: false,
            text: promo_info.promo_text.false
          }
        }
      }
      
      if( promo_info.limits.time.min != 0 && promo_info.limits.time.max != 0 ){
        if( this_time >= promo_info.limits.time.min && this_time <= promo_info.limits.time.max ){
          
        }else{
          return {
            st: false,
            text: promo_info.promo_text.false
          }
        }
      }
      
      // console.log( 'limits', promo_info.limits.point_id )
      // console.log( 'type_order', type_order )
      // console.log( 'point_id_dev', point_id_dev )
      // console.log( 'point_id_pic', point_id_pic, get().orderPic )

      // if( promo_info.limits.point_id != 0 ){
      //   if( (type_order == 0 && point_id_dev == promo_info.limits.point_id) || (type_order == 1 && point_id_pic == promo_info.limits.point_id) ){
          
      //   }else{
      //     return {
      //       st: false,
      //       text: 'Ой, в этом кафе промокод не работает. Проверьте адрес кафе.'
      //     }
      //   }
      // }
      
      if( promo_info.limits.summ.min != 0 || promo_info.limits.summ.max != 0 ){
        if( allPrice >= promo_info.limits.summ.min && (promo_info.limits.summ.max >= allPrice || promo_info.limits.summ.max == 0) ){
          
        }else{
          if( allPrice < promo_info.limits.summ.min ){
            return {
              st: false,
              text: 'Эх, не хватает суммы для активации промокода! Может, добавим в корзину что-нибудь ещё?'
            }
          }

          if( allPrice > promo_info.limits.summ.max ){
            return {
              st: false,
              text: 'Ой, сумма заказа для этого промокода слишком большая. Пожалуйста, проверьте лимит промокода.'
            }
          }
        }
      }
      
      if( promo_info.limits.dows ){
        if( parseInt(promo_info.limits.dows[ this_dow ]) == 0 ){
          return {
            st: false,
            text: 'К сожалению, сегодня промокод не работает. Пожалуйста, проверьте дни работы промокода.'
          }
        }
      }
      
      if( promo_info.limits.type_order ){
        if( 
          parseInt( promo_info.limits.type_order ) == 1
            || 
          (parseInt( promo_info.limits.type_order ) == 3 && type_order == 0)  
            || 
          (parseInt( promo_info.limits.type_order ) == 2 && type_order == 1) ){
          
        }else{
          if( parseInt( promo_info.limits.type_order ) == 1 ){
            return {
              st: false,
              text: 'Вот незадача! Этот промокод действует только на доставку.'
            }
          }

          if( parseInt( promo_info.limits.type_order ) == 2 ){
            return {
              st: false,
              text: 'Вот незадача! Этот промокод действует только на самовывоз.'
            }
          }

          if( parseInt( promo_info.limits.type_order ) == 3 ){
            return {
              st: false,
              text: 'Вот незадача! Этот промокод действует только при заказе в кафе.'
            }
          }
        }
      }
      
      if( promo_info.limits.only_kassa ){
        if( parseInt( promo_info.limits.only_kassa ) == 1 ){
          return {
            st: false,
            text: 'Вот незадача! Этот промокод действует только при заказе в кафе.'
          }
        }
      }
      
      if( promo_info.limits.items.length > 0 ){
        let check = 0;
        let this_item = null;
        
        promo_info.limits.items.map((need_item)=>{
          this_item = new_my_cart?.find( (item) => item.item_id == need_item );
          
          if( this_item ){
            check ++;
          }
        })
        
        if( promo_info.limits.items.length != check ){
          return {
            st: false,
            text: promo_info.promo_text.false
          }
        }
      }
      
      set({
        free_drive: parseInt(promo_info.limits.free_drive)
      })

      let all_price = 0,
          count_sale = 0,
          this_item = null;
      
      //скидка
      if( parseInt(promo_info.promo_action) == 1 ){
        //товары
        if( parseInt(promo_info.sale.cat_sale) == 1 ){
          count_sale = parseInt(promo_info.sale.count_sale);
          
          my_cart?.forEach( (el_cart, key_cart) => {
            this_item = allItems?.find( (item) => item.id == el_cart.item_id );
            
            if( parseInt(this_item.type) != 3 && parseInt(this_item.type) != 4 ){
              promo_info.sale.sale_action?.forEach( (el_promo) => {
                if( parseInt(el_cart.item_id) == parseInt(el_promo) ){
                  
                  if( parseInt(promo_info.sale.type_price) == 1 ){
                    //рубли  
                    
                    if( count_sale > 0 ){
                      all_price = (parseInt(el_cart.one_price) * parseInt(el_cart.count)) - parseInt(count_sale);
                      
                      if( all_price <= 0 ){
                        all_price = 1;
                      }
                      
                      count_sale -= (parseInt(el_cart.one_price) * parseInt(el_cart.count));
                      
                      my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                      my_cart[ key_cart ].all_price = all_price;
                    }
                  }else{
                    //проценты  
                    
                    all_price = parseInt(el_cart.all_price) - ((parseInt(el_cart.all_price) / 100) * parseInt(count_sale));
                    
                    my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                    my_cart[ key_cart ].all_price = parseInt(all_price);
                  }
                }
              })
            }
          })
        }
        
        //категории
        if( parseInt(promo_info.sale.cat_sale) == 2 ){
          count_sale = parseInt(promo_info.sale.count_sale);
          
          my_cart?.forEach( (el_cart, key_cart) => {
            this_item = allItems?.find( (item) => item.id == el_cart.item_id );
            
            if( parseInt(this_item.type) != 3 && parseInt(this_item.type) != 4 ){
              promo_info.sale.sale_action?.forEach( (el_promo) => {
                if( parseInt(this_item.cat_id) == parseInt(el_promo) ){
                  
                  if( parseInt(promo_info.sale.type_price) == 1 ){
                    //рубли  
                    
                    if( count_sale > 0 ){
                      all_price = (parseInt(el_cart.one_price) * parseInt(el_cart.count)) - parseInt(count_sale);
                      
                      if( all_price <= 0 ){
                        all_price = 1;
                      }
                      
                      count_sale -= (parseInt(el_cart.one_price) * parseInt(el_cart.count));
                      
                      my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                      my_cart[ key_cart ].all_price = all_price;
                    }
                  }else{
                    //проценты  

                    all_price = parseInt(el_cart.all_price) - ((parseInt(el_cart.all_price) / 100) * parseInt(count_sale));
                    
                    my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                    my_cart[ key_cart ].all_price = parseInt(all_price);
                  }
                }
              })
            }
          })
        }
        
        //все кроме допов и напитков
        if( parseInt(promo_info.sale.cat_sale) == 3 ){
          count_sale = parseInt(promo_info.sale.count_sale);
          
          my_cart?.forEach( (el_cart, key_cart) => {
            this_item = allItems?.find( (item) => item.id == el_cart.item_id );
            
            if( parseInt(this_item.type) != 3 && parseInt(this_item.type) != 4 ){
              if( parseInt(promo_info.sale.type_price) == 1 ){
                //рубли  
                
                if( count_sale > 0 ){
                  all_price = (parseInt(el_cart.one_price) * parseInt(el_cart.count)) - parseInt(count_sale);
                  
                  if( all_price <= 0 ){
                    all_price = 1;
                  }
                  
                  count_sale -= (parseInt(el_cart.one_price) * parseInt(el_cart.count));
                  
                  my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                  my_cart[ key_cart ].all_price = all_price;
                }
              }else{
                //проценты  

                all_price = parseInt(el_cart.all_price) - ((parseInt(el_cart.all_price) / 100) * parseInt(count_sale));
                
                my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                my_cart[ key_cart ].all_price = parseInt(all_price);

              }
            }
          })
        }

        //на самый деешвый товар в корзине ( кроме допов )
        if (parseInt(promo_info.sale.cat_sale) === 444) {
          count_sale = parseInt(promo_info.sale.count_sale);

          // 1. Находим индекс самой дешёвой позиции,
          //    исключив type 3 и 4 (допы/напитки)
          let minIndex = -1;
          let minPrice = Infinity;

          my_cart.forEach((el_cart, idx) => {
            const this_item = allItems?.find(it => it.id == el_cart.item_id);
            if ([3, 4].includes(parseInt(this_item.type))) return; // пропускаем
            if (parseInt(el_cart.one_price) < minPrice) {
              minPrice = parseInt(el_cart.one_price);
              minIndex = idx;
            }
          });

          // 2. Если нашли товар — применяем скидку
          if (minIndex > -1) {
            const el_cart = my_cart[minIndex];

            if (parseInt(promo_info.sale.type_price) === 1) {
              // --- скидка фикс. суммой ---
              let all_price =
                parseInt(el_cart.one_price) * parseInt(el_cart.count) - count_sale;

              if (all_price <= 0) all_price = 1;

              my_cart[minIndex].new_one_price = parseInt(el_cart.one_price);
              my_cart[minIndex].all_price = all_price;
            } else {
              // --- скидка в процентах ---
              const all_price =
                parseInt(el_cart.all_price) -
                (parseInt(el_cart.all_price) / 100) * count_sale;

              my_cart[minIndex].new_one_price = parseInt(el_cart.one_price);
              my_cart[minIndex].all_price = parseInt(all_price);
            }
          }
        }

        //все
        if( parseInt(promo_info.sale.cat_sale) == 7 ){
          count_sale = parseInt(promo_info.sale.count_sale);
          
          my_cart?.forEach( (el_cart, key_cart) => {
            this_item = allItems?.find( (item) => item.id == el_cart.item_id );
            
            if( parseInt(el_cart.all_price) > 0 && parseInt(el_cart.count) > 0 ){
              if( parseInt(promo_info.sale.type_price) == 1 ){
                //рубли  
                
                if( count_sale > 0 ){
                  all_price = (parseInt(el_cart.one_price) * parseInt(el_cart.count)) - parseInt(count_sale);
                  
                  if( all_price <= 0 ){
                    all_price = 1;
                  }
                  
                  count_sale -= (parseInt(el_cart.one_price) * parseInt(el_cart.count));
                  
                  my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                  my_cart[ key_cart ].all_price = all_price;
                }
              }else{
                //проценты  

                all_price = parseInt(el_cart.all_price) - ((parseInt(el_cart.all_price) / 100) * parseInt(count_sale));
                
                my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                my_cart[ key_cart ].all_price = parseInt(all_price);

              }
            }
          })
        }
        
        tmp = 0;
        allPrice = 0;
        
        allPrice = my_cart.reduce( (sum, item) => sum + item['all_price'], tmp );
        
        set({
          allPrice: allPrice,
          items: my_cart
        })

        get().setDataPromoBasket();

        return {
          st: true,
          text: promo_info.promo_text.true
        }
      }
      
      //добавление товара
      if( parseInt(promo_info.promo_action) == 2 ){

        promo_info?.items_add?.forEach((el) => {
          this_item = allItems?.find( (item) => parseInt(item.id) == parseInt(el.item_id) );
          
          if( this_item ){
            cart_new_promo.push({
              item_id: el.item_id,
              count: el.count,
              one_price: this_item['price'],
              all_price: el.price,
              name: this_item['name'],
              img_app: this_item.img_app,
              disabled: true,
              cat_id: this_item.cat_id
            });
          }
        });
        
        tmp = 0;
        allPrice = 0;
        
        allPrice = my_cart.reduce( (sum, item) => sum + parseInt(item['all_price']), tmp );
        
        tmp = 0;
        
        allPrice += cart_new_promo.reduce( (sum, item) => sum + parseInt(item['all_price']), tmp );
        
        set({
          itemsWithPromo: cart_new_promo,
          allPrice: allPrice
        })

        get().getItems();
      }
      
      //товар за цену
      if( parseInt(promo_info.promo_action) == 3 ){
        if( promo_info.items_on_price.length > 0 ){
          my_cart?.forEach( (el_cart, key_cart) => {
            promo_info?.items_on_price?.forEach( (el_promo) => {
              if( parseInt(el_cart.item_id) == parseInt(el_promo.id) ){
                my_cart[ key_cart ].new_one_price = parseInt(el_promo.price)
                my_cart[ key_cart ].all_price = parseInt(el_promo.price) * parseInt(el_cart.count)
              }
            });
          });
          
          tmp = 0;
          allPrice = 0;
          
          allPrice = my_cart.reduce( (sum, item) => sum + parseInt(item['all_price']), tmp );
          
          set({
            allPrice: allPrice
          })
        }
      }
      
      set({
        items: my_cart
      })

      get().setDataPromoBasket();
      
      return {
        st: true,
        text: promo_info.promo_text.true
      }

    }else{

      get().setDataPromoBasket();

      return {
        st: false,
        text: promo_info?.promo_text?.false,
        test: promo_info
      }
    }
  },

  // получение данных для карты
  getMapCart: async (this_module, city) => {

    if(!city) return;

    const data = {
      type: 'get_addr_zone_web',
      city_id: city,
    };

    const json = await api(this_module, data);

    json?.zones.map((point) => point.image = 'default#image');
    json?.points.map((point) => point.image = 'default#image');

    let zoomSize;

    if(window.innerWidth < 601) {
      zoomSize = 10.6;
    } else {
      zoomSize = 11.5;
    }

    set({
      center_map: {
        center: [json?.zones[0].xy_center_map.latitude, json?.zones[0].xy_center_map.longitude],
        zoom: zoomSize,
        controls: []
      },
      zones: json?.zones,
      points: json?.points,
    })

    setTimeout(() => {
      get().changePointClick(get().orderPic?.name ?? '');
    }, 100)

  },

  // изменение состояния точки по клику на Карте
  changePointClick: (addr) => {
    
    let zones = get().zones;
    const pointList = get().pointList;

    const orderPic = pointList?.find(point => point.name === addr);

    ymaps.ready( () => {

      const img = ymaps.templateLayoutFactory.createClass( 
        "<div class='my-img'>" +
          "<img alt='' src='/Favikon.png' />" +
        "</div>"
      )
    
      zones = zones.map(item => {
        if(item.addr === addr) {
          item.image = img;
        } else {
          item.image = 'default#image';
        }
        return item
      })

      set({ zones, orderPic: orderPic ?? null });

      get().setCartLocalStorage();
    })

  },

  repeatOrder: (order) => {
    const city = useCitiesStore.getState().thisCity;

    const allItems = get().allItems;

    if( allItems.length == 0 ){
      return;
    }

    set({
      items: [],
      //itemsOnDops: [],
      itemsOffDops: [],
      itemsWithPromo: [],

      typeOrder: parseInt(order?.order?.type_order_) == 2 ? 'pic' : 'dev',
      orderPic: parseInt(order?.order?.type_order_) == 2 ? order?.order?.pic_info : null,
      point_id: order?.order?.point_id,

      comment: order?.order?.comment,
      sdacha: order?.order?.sdacha,

      cart_is: 'all'
    })

    if( parseInt(order?.order?.type_order_) == 1 ){
      get().setAddrDiv(order?.order?.street_info);
      get().setSummDiv(order?.order?.street_info?.sum_div ?? 0);
    }

    //if( order?.order?.promo_name?.length > 0 ){
      get().getInfoPromo(order?.order?.promo_name ?? '', city);
    //}

    //const itemsWithPromo = get().itemsWithPromo;
    
    
    let checkItem = null;
    let my_cart = [];

    order.order_items.map((item) => {
      checkItem = allItems?.find( it => parseInt(it.id) === parseInt(item.item_id) );

      checkItem.count = parseInt(item.count);
      checkItem.one_price = parseInt(checkItem.price);
      checkItem.item_id = parseInt(checkItem.id);

      if( checkItem ){
        my_cart.push(checkItem);
      }
    })

    const allPriceWithoutPromo = my_cart.reduce((all, it) => parseInt(all) + parseInt(it.count) * parseInt(it.one_price), 0);
    const itemsCount = my_cart.reduce((all, it) => parseInt(all) + parseInt(it.count), 0);

    set({ 
      items: my_cart, 
      itemsCount, 
      allPriceWithoutPromo 
    });
    
    
    get().getItems();
    
    //get().check_need_dops();

    //get().setCartLocalStorage();

    useProfileStore.getState().closeOrder();

    const matches = useHeaderStoreNew.getState().matches;

    if( matches ){ 
      setTimeout(() => {
        window.location.href = '/' + city + '/cart';
      }, 500)
      
    }else{
      useHeaderStoreNew.getState().setActiveBasket(true);  
    }
    
    
  },

  checkFreeDrive: async (token) => {

    /*if(!token) return;

    const data = {
      type: 'checkFreeDrive',
      token
    };

    const json = await api('cart', data);

    set({
      show_checkFreeDrive: true,
    })*/
  },
}), shallow);

export const useContactStore = createWithEqualityFn((set, get) => ({
  myAddr: [],
  phone: '',
  disable: true,
  point: '',
  openModalChoose: false,
  location_user: null,
  zones: null,
  center_map: null,
  points_zone: null,

  polygon_options_default: {
    fillColor: 'rgba(53, 178, 80, 0.15)',
    strokeColor: '#35B250',
    strokeWidth: 5,
    fillOpacity: 1,
  },
  polygon_options_active: { 
    strokeColor: '#DD1A32', 
    fillColor: 'rgba(221, 26, 50, 0.15)', 
    fillOpacity: 1, 
    strokeWidth: 5 
  },
  polygon_options_none: { 
    fillColor: "#000000", 
    strokeColor: "#000000", 
    fillOpacity: 0.001, 
    strokeWidth: 0 
  },

  ya_metrik: {
    'togliatti': 47085879,
    'samara': 47085879
  },

  // звонок по телефону при клике на телефон на странице Контакты в мобильной версии
  clickPhoneMobile: (city) => {
    window.location.href = `tel:${get().phone.split(/[\s,(),-]+/).join('')}`;

    try {
      const ym_data = {
        city
      }

      ym(get().ya_metrik[city], 'reachGoal', 'call_from_site', ym_data);

      if( city == 'samara' ){
        ym(100325084, 'reachGoal', 'call_from_site', ym_data);
      }

      if( city == 'togliatti' ){
        ym(100601350, 'reachGoal', 'call_from_site', ym_data);
      }

    } catch (error) {
      console.log('clickPhoneMobile', error);
    }
  },
 
  // получение геопозиции клиента на карте в мобильной версии
  getUserPosition: () => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { latitude, longitude } = coords
        
      set({ location_user: [latitude, longitude] })
     
      setTimeout(() => {
        set({ location_user: null })
      }, 300000);
      
    }, ({ message }) => {
      useHeaderStoreNew.getState().setActiveModalAlert(true, 'Не удалось определить местоположение. '+message )
    }, {
      enableHighAccuracy: true
    })
  },

  // открытие/закрытие карты с выбором точек/городов на странице Адреса в мобильной версии
  setActiveModalChoose: (active) => {
    set({ openModalChoose: active });
  },

  // получение данных для карты
  getMap: async (this_module, city) => {

    if(!city) return;

    //set({ disable: true });

    const data = {
      type: 'get_addr_zone_web',
      city_id: city,
    };

    const json = await api(this_module, data);

    let points_zone = [];

    json?.zones.map((point) => {
      if (point['zone_origin'].length > 0) {
        points_zone.push({ 
          zone: JSON.parse(point['zone_origin']), 
          addr: point.addr, 
          options: get().polygon_options_default,
        })
      return point;
      }
    })

    
    let zoomSize;
    
    if(window.innerWidth < 601) {
      zoomSize = 10.6;
    } else {
      zoomSize = 11.5;
    }

    json?.zones?.forEach((point) => point.image = 'default#image');

    set({
      center_map: {
        center: [json?.zones[0].xy_center_map.latitude, json?.zones[0].xy_center_map.longitude],
        zoom: zoomSize,
        controls: [],
        behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
      },
      zones: json?.zones,
      points_zone,
      phone: json?.zones[0].phone,
      myAddr: json?.zones?.filter((value, index, self) => index === self.findIndex((t) => t.addr === value.addr)),
    })

    const matches = useHeaderStoreNew.getState().matches;

    if(matches) {
      setTimeout(() => {
        get().choosePointMap(false);
      }, 300)
    }

  },
  
  // выбор точки для страницы Контакты в мобильной версии
  choosePointMap: (point) => {
    const pointList = get().myAddr;

    if(point) {
      const pointFind = pointList?.find(item => item.addr === point);

      set({ openModalChoose: false })

      get().changePointClick(pointFind?.addr);

    } else {
      get().changePointClick(pointList[0].addr);
    }

  },

  // изменение состояния точки по клику
  changePointClick: (addr) => {
    
    const disable = get().disable;
    let zones = get().zones;
    let points_zone = get().points_zone;
    let myAddr = get().myAddr;

    

    ymaps.ready( () => {
      const img = ymaps.templateLayoutFactory.createClass( 
        "<div class='my-img'>" +
          "<img alt='' src='/Favikon.png' />" +
        "</div>"
      )
  
      let center;
  
      zones = zones.map(item => {
        if(item.addr === addr) {
          item.image = img;
          center = [item.xy_point.latitude, item.xy_point.longitude]
        } else {
          item.image = 'default#image';
        }
        return item
      })
  
      points_zone = points_zone.map(item => {
        if(disable) {
          if(item.addr === addr) {
            item.options = get().polygon_options_active;
          } else {
            item.options = get().polygon_options_default;
          }
        } 
        return item
      })
  
      myAddr = myAddr.map(item => {
        if (item.addr === addr)  {
          item.color = '#DD1A32'
        } else {
          item.color = null;
        }
        return item
      });
  
      let zoomSize;
          
      if(window.innerWidth < 601) {
        zoomSize = 11;
      } else {
        zoomSize = 12;
      }
  
      set({ 
        points_zone, 
        zones, 
        myAddr, 
        point: addr,
        center_map: {
          center,
          zoom: zoomSize,
          controls: [],
          behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
          duration: 1000
        },
      })
    })

    

  },

  // изменение состояния карты/точек при клике вне точек
  changePointNotHover: (event) => {

    const type = event.get('target').getType();
    
    if(type === 'yandex#map') {

      const disable = get().disable;
      const zones = get().zones;
      const myAddr = get().myAddr;
      let points_zone = get().points_zone;

      zones?.forEach(item => item.image = 'default#image');

      points_zone = points_zone.map(item => {
        if(disable) {
          item.options = get().polygon_options_default;
        } 
        return item
      })
      
      myAddr?.forEach(addr => addr.color = null);
  
      set({ myAddr, zones, points_zone });
    }

  },

  // показывать/не показывать границы зон доставки
  disablePointsZone: () => {

    set({ disable: !get().disable });

    let points_zone = get().points_zone;
    const myAddr = get().myAddr;

    points_zone = points_zone.map(item => {
      if(get().disable) {
          const chooseAddr = myAddr?.find(addr => addr?.color);
          if(chooseAddr?.addr === item.addr) {
            item.options = get().polygon_options_active;
          } else {
            item.options = get().polygon_options_default;
          }
        } else {
          item.options = get().polygon_options_none;
        }
      return item
    })
  
    set({ points_zone });
  },

}), shallow);

export const useAkciiStore = createWithEqualityFn((set) => ({
  actii: [],
 
  getAktia: (bannerList) => {
    const all_items = useCartStore.getState().allItems;

    bannerList = bannerList.map(new_banner => {
      if( new_banner?.info && Object.keys(new_banner?.info).length > 0 ){

        //скидка
        if( parseInt(new_banner.info.promo_action) == 1 ){

        }
        
        //добавляет товар
        if( parseInt(new_banner.info.promo_action) == 2 ){
          new_banner.info.items_add.map( (item, key) => {
            let find_item = all_items?.find( f_item => parseInt(f_item.id) == parseInt(item.item_id) );

            new_banner.info.items_add[ key ]['img_app'] = find_item?.img_app
          } )

          return new_banner.actiItems = new_banner.info.items_add
          
        }

        //товар за цену
        if( parseInt(new_banner.info.promo_action) == 3 ){
          new_banner.info.items_on_price.map( (item, key) => {
            new_banner.info.items_on_price[ key ]['img_app'] = all_items?.find( f_item => parseInt(f_item.id) == parseInt(item.id) )['img_app'];
          } )

          return new_banner.actiItems = new_banner.info.items_on_price
        }

        return new_banner.typePromo = new_banner.info.promo_action
        
      } else {

        new_banner?.item?.map( (item, key) => {
          let find_item = all_items?.find( f_item => parseInt(f_item.id) == parseInt(item.item_id) );

          if( find_item ){
            new_banner.item[ key ] = find_item;
          }
        })

        new_banner.actiItems = new_banner?.item ?? []
        new_banner.typePromo = 0
      }

      return new_banner
      
    })

    set({ 
      actii: bannerList
    });
    
  },

}), shallow);

export const useProfileStore = createWithEqualityFn((set, get) => ({
  promoListActive: [],
  promoListOld: [],
  orderList: [],
  userInfo: {},
  modalOrder: {},
  openModal: false,
  openModalDelete: false,
  isOpenModalAddr: false,
  shortName: '',
  streets: [],
  allStreets: [],
  city: '',
  thisMAP: null,
  is_fetch: false,
  chooseAddrStreet: {},
  infoAboutAddr: null,
  cityList: [],
  is_fetch_save_new_addr: false,
  active_city: 0,

  center_map: null,
  zones: [],

  openModalAccount: false,
  // colorAccount: {id: 6, login: "rgba(111, 190, 248, 1)", item: 'rgba(111, 190, 248, 0.1)'},
  colorAccount: {id: 6, login: "#F86F6F", item: 'rgba(248, 11, 11, 0.1)'},

  openModalProfile: false,
  modalName: null,

  openModalAddress: false,
  streetId: 0,

  year: '',
  yearList: [],
  openModalYear: false,

  openModalGetAddress: false,
  street_list: [],
  choose_street: '',

  count_promo: 0,
  count_orders: 0,

  // получение адресов в модалке выбора адреса доставки
  getAddrList: async (value) => {

    if(!value || value.length == 0) {
      set({street_list: []})
    } else {
      const city_list = useCitiesStore.getState().thisCityList;
      const city = city_list.find(({ id }) => parseInt(id) === parseInt(get().active_city))?.name;

      if(city) {
        const res = await apiAddress(city, value);
        
        const street_list = res?.results?.map(str => str = { name: str?.title?.text, title: str?.subtitle?.text, full: str })
  
        set({
          street_list: street_list ?? [],
        })

      }
    }

  },

  //очистить инпут модалку выбора адреса доставки
  // setStreet: () => {
  //   set({openModalGetAddress: false, street_list: [], choose_street: ''});
  // },

  // выбор улицы в модалке выбора адреса доставки
  chooseStreet: (addr, pd) => {

    if(addr && addr?.full) {

      useHeaderStoreNew.getState().showLoad(true);

      let this_addr = {
        dop_name: '',
        street: '',
        home: '',
      };

      addr?.full?.address?.component.map(item => {
        if(item.kind[0] === 'STREET' || item.kind[0] === 'LOCALITY') {
          this_addr.street = item.name;
        }
        if(item.kind[0] === 'HOUSE') {
          this_addr.home = item.name;
        }
        if(item.kind[0] === 'DISTRICT') {
          this_addr.dop_name = item.name;
        }
      });

      get().checkStreet(this_addr.dop_name+' '+this_addr.street, this_addr.home, pd, get().active_city);

    } 

    if(addr && addr?.name) {
      set({street_list: [], choose_street: addr.name});
    } else {
      set({street_list: [], choose_street: addr});
    }
   
  },

  // открытие/закрытие модалки для выбора Адреса доставки
  setActiveGetAddressModal: (active) => {
    set({openModalGetAddress: active});
  },

  // установить год в Истории заказов в мобильной версии
  setYear: (year) => {
    set({ year })
  },

  // открытие/закрытие модалки выбора года в Истории заказов в мобильной версии
  setActiveModalYear: (active, list) => {
    let yearList = [];

    if(list.length) {
      yearList = list.reduce((arr, item) => {
        return arr = [...arr, ...[{name: item.year}]]
      }, [])
      set({ orderList: list }) // для тестирования
    } 

    set({ openModalYear: active, yearList })
  },

  // открытие/закрытие модалки с указанием адреса в Адресах доставки и при Оформлении заказа
  setActiveAddressModal: async (active, id, city = '') => {

    if (active) {

      if(useHeaderStoreNew.getState().city !== city) {
        const findCity = useCitiesStore.getState().thisCityList.find(item => item.link === city);

        if(findCity) {
          useCitiesStore.getState().setThisCity(findCity?.link);
          useCitiesStore.getState().setThisCityRu(findCity?.name);

          city = findCity?.link;
        }

      }

      set({openModalAddress: active, streetId: id, city});

      get().getMapMobile(id, city);
    } else {
      set({
        openModalAddress: active,
        streetId: 0,
        city: '',
        infoAboutAddr: null,
        chooseAddrStreet_xy: null
      });
    }
  },

  // карта для модалки выбора адреса доставки в мобильной версии
  getMapMobile: async (id, city = '') => {

    let data = {
      type: 'get_data_for_streets',
      city_id: city ? city : get().city,
      street_id: id
    };

    let json = await api('profile', data);

    set({
      allStreets: json?.streets,
      infoAboutAddr: json?.this_info,
      cityList: json?.cities,
      active_city: json?.city,
      chooseAddrStreet: json?.this_info ?? {},
      center_map: {
        center: json?.this_info?.xy ? [json?.this_info?.xy[0], json?.this_info?.xy[1]] : [json?.city_center[0], json?.city_center[1]],
        zoom: 11.5,
        controls: []
      },
      zones: json?.zones
    })

  },

  // открытие/закрытие модалки в Профиле в мобильной версии
  setActiveProfileModal: (active, modalName) => {
    set({ openModalProfile: active, modalName });
  },

  // открытие/закрытие модалки в Аккаунте для выбора цвета или выхода из Аккаунта в мобильной версии
  setActiveAccountModal: (active, modalName) => {
    set({ openModalAccount: active, modalName });
  },

  // изменение цвета в Аккаунте
  setAccountColor: (colorAccount) => {
    set({ colorAccount });
  },


  getPromoList: async (this_module, city, userToken) => {
    let data = {
      type: 'get_my_promos',
      city_id: city,
      user_id: userToken,
    };

    let json = await api(this_module, data);

    set({ 
      promoListActive: json?.active_list,
      promoListOld: json?.old_list,
      city: city
    });
  },
  getOrderList: async (this_module, city, userToken) => {
    let data = {
      type: 'get_my_orders_new_',
      city_id: city,
      user_id: userToken,
    };

    let json = await api(this_module, data);

    set({
      orderList: json?.order_list,
      city: city
    });
  },
  clearOrderList: () => {
    set({
      orderList: []
    });
  },
  getUserInfo: async (this_module, city, userID) => {

    if( userID && userID?.length> 0 ){

      let data = {
        type: 'get_my_info',
        city_id: city,
        user_id: userID,
      };

      let json = await api(this_module, data);

      set({
        // shortName: json?.user?.name ? json?.user?.name?.substring(0, 1).toUpperCase() + json?.user?.fam?.substring(0, 1).toUpperCase() : '',
        shortName: json?.user?.name ? json?.user?.name?.substring(0, 1).toUpperCase() : '',
        userInfo: json?.user,
        streets: json?.streets,
        city: city
      });
    }
  },

  getCountPromos_Orders: async (city) => {
  
    if( useHeaderStoreNew.getState().token.length == 0 ){
      return ;
    }

    let data = {
      type: 'get_my_count_orders_promos',
      city_id: city,
      user_id: useHeaderStoreNew.getState().token,
    };

    let json = await api('zakazy', data);

    set({
      count_promo: parseInt(json?.count_promo),
      count_orders: parseInt(json?.count_orders),
    });
  },

  setUser: (user) => {

    set({
      // shortName: user?.name?.substring(0, 1) + user?.fam?.substring(0, 1),
      shortName: user?.name?.substring(0, 1),
      userInfo: user,
    });

  },

  updateUser: async (this_module, city, userToken) => {
    let data = {
      type: 'update_user',
      city_id: city,
      user_id: userToken,
      user: JSON.stringify(get().userInfo),
    };

    let json = await api(this_module, data);

    get().getUserInfo(this_module, city, userToken)
  },

  getOrder: async (this_module, city, userToken, order_id, point_id) => {
    let data = {
      type: 'get_order',
      city_id: city,
      user_id: userToken,
      order_id: order_id,
      point_id: point_id,
    };

    let json = await api(this_module, data);

    json.order.point_id = point_id;
    json.order.order_id = order_id;

    set({
      modalOrder: json,
      openModal: true,
    });
  },
  closeOrder: () => {
    set({
      openModal: false,
      modalOrder: {},
    });
  },
  openModalDel: () => {
    set({
      openModalDelete: true
    })
  },
  closeModalDel: () => {
    set({
      openModalDelete: false
    })
  },
  closeModalAddr: () => {
    set({
      isOpenModalAddr: false,
      openModalAddress: false
    })
  },
  openModalAddr: async (id, city = '') => {
    let data = {
      type: 'get_data_for_streets',
      city_id: city ? city : get().city,
      street_id: id
    };

    let json = await api('profile', data);

    // в этом методе openModalAddr с сервера в json.this_info приходит street: "19-й квартал, бульвар Татищева", а потом в методе checkStreet с сервера в json.addrs приходит street: "бульвар Татищева" - как пример, для этого изменения
    const street = json?.this_info?.street.split(', ');

    if(json?.this_info?.street && street.length && street.length > 1) {
      json.this_info.street = street[1];
    }

    set({
      // allStreets: [],


      isOpenModalAddr: true,
      allStreets: json?.streets,
      infoAboutAddr: json?.this_info,
      cityList: json?.cities,
      active_city: json?.city,
      chooseAddrStreet: json?.this_info ?? {},
      center_map: {
        center: json?.this_info ? [json?.this_info?.xy[0], json?.this_info?.xy[1]] : [json?.city_center[0], json?.city_center[1]],
        zoom: 11.5,
        controls: []
      },
      zones: json?.zones
    })
  },
  orderDel: async (this_module, userToken, text) => {

    if( text?.length === 0 ){
      useHeaderStoreNew.getState().setActiveModalAlert(true, 'Укажите причину отмены заказа', false);
    }

    let data = {
      type: 'close_order',
      user_id: userToken,
      ans: text,
      order_id: get().modalOrder?.order?.order_id,
      point_id: get().modalOrder?.order?.point_id
    };

    let json = await api(this_module, data);

    if( json?.st === true ){
      get().closeModalDel();
      get().closeOrder();
      get().getOrderList('zakazy', get().city, userToken);

      if( useCitiesStore.getState().thisCityRu == 'Самара' ) {
        ym(100325084, 'reachGoal', 'del_order', { text: text });
      }
      if( useCitiesStore.getState().thisCityRu == 'Тольятти' ) {
        ym(100601350, 'reachGoal', 'del_order', { text: text });
      }

      //roistat.event.send('del_order');
    }else{
      useHeaderStoreNew.getState().setActiveModalAlert(true, json?.text, false);
    }
  },

  // установить выбранный адрес, если похожих адресов больше одного
  setAddress: (chooseAddrStreet) => {

    let zoomSize;

    if(window.innerWidth < 601) {
      zoomSize = 10.6;
    } else {
      zoomSize = 11.5;
    }

    set({
      chooseAddrStreet,
      center_map: {
        center: [chooseAddrStreet?.xy[0], chooseAddrStreet?.xy[1]],
        zoom: zoomSize,
        controls: []
      },
      openModalGetAddress: false
    })
  },

  checkStreet: async(street, home, pd, city_id) => {

    if( home?.length == 0 || home == '' ){
      useHeaderStoreNew.getState().setActiveModalAlert(true, 'Надо ввести улицу и номер дома, например: 40 лет победы 55', false);
      useHeaderStoreNew.getState().showLoad(false);
      return ;
    }

    if( get().is_fetch === true ){
      setTimeout( () => {
        get().checkStreet(street, home, pd, city_id)
      }, 500 )

      return ;

    }else{
      set({
        is_fetch: true,
        //chooseAddrStreet: {}
      })
    }

    let data = {
      type: 'check_street',
      city_id: city_id,
      street: street,
      pd: pd,
      home: home
    };

    let zoomSize;

    if(window.innerWidth < 601) {
      zoomSize = 10.6;
    } else {
      zoomSize = 11.5;
    }

    let json = await api('profile', data);

    useHeaderStoreNew.getState().showLoad(false);

    if( json?.addrs?.length == 1 ){
      json.addrs = json?.addrs[0];

      if( pd?.length > 0 ){
        if( json?.addrs?.addressLine?.includes('подъезд') ){

        }else{
          useHeaderStoreNew.getState().setActiveModalAlert(true, 'Адрес найден, но мы не смогли найти подъезд', false);
        }
      }

      

      set({
        chooseAddrStreet: json?.addrs,
        center_map: {
          center: [json?.addrs?.xy[0], json?.addrs?.xy[1]],
          zoom: zoomSize,
          controls: []
        },
        openModalGetAddress: false,
        choose_street: ''
      })

    } else {

      if(json?.addrs?.length === 0) {
        useHeaderStoreNew.getState().setActiveModalAlert(true, 'Адрес не найден, или указан не точно', false);
      }

      if(json?.addrs?.length > 1) {
        useHeaderStoreNew.getState().setActiveModalSelectAddress(true, json.addrs);
      }

      set({
        chooseAddrStreet: {},
      })

    }

    set({
      is_fetch: false
    })
  },

  setClearAddr: () => {
    set({
      chooseAddrStreet: {}
    });
  },

  saveNewAddr: async(pd, domophome, et, kv, comment, token, is_main, nameAddr, city_id) => {

    if( get().is_fetch_save_new_addr === true ){
      return ;
    }

    if( get().is_fetch === true || Object.keys( get().chooseAddrStreet ).length == 0 ){
      setTimeout( () => {
        get().saveNewAddr(pd, domophome, et, kv, comment, token, is_main, nameAddr, city_id);
      }, 455 )
      
      return;
    }

    set({
      is_fetch_save_new_addr: true
    })

    let data = {
      type: 'save_new_addr',
      token: token,
      city_id: city_id,
      street: JSON.stringify( get().chooseAddrStreet ),
      pd: pd,
      domophome: domophome === true ? 1 : 0,
      et: et,
      kv: kv,
      comment: comment,
      is_main: is_main === true ? 1 : 0,
      nameAddr: nameAddr
    };

    let json = await api('profile', data);

    if( json?.st === true ){

      if( json?.addr ){
        useCartStore.getState().setAddrDiv(json?.addr)
        useCartStore.getState().setSummDiv(json?.addr?.sum_div)
        useCartStore.getState().setActiveMenuCart(false, null)
      }

      get().closeModalAddr();
      get().getUserInfo('profile', get().city, token);

      set({
        openModalAddress: false
      })

      useCartStore.getState().getMySavedAddr(city_id, { street: get().chooseAddrStreet.street, home: get().chooseAddrStreet.home });
    }else{
      useHeaderStoreNew.getState().setActiveModalAlert(true, json?.text, false);
    }

    setTimeout( () => {
      set({
        is_fetch_save_new_addr: false
      })
    }, 500 )
    
  },
  updateAddr: async(pd, domophome, et, kv, comment, token, is_main, nameAddr, city_id) => {

    if( get().is_fetch_save_new_addr === true ){
      return ;
    }

    if( get().is_fetch === true || Object.keys( get().chooseAddrStreet ).length == 0 ){
      setTimeout( () => {
        get().updateAddr(pd, domophome, et, kv, comment, token, is_main, nameAddr, city_id)
      }, 455 )

      return ;
    }

    if( Object.keys( get().chooseAddrStreet ).length == 0 ){
      return ;
    }

    set({
      is_fetch_save_new_addr: true
    })

    let street = get().chooseAddrStreet;

    street.street_id = street.id;

    let data = {
      type: 'update_addr',
      token: token,
      city_id: city_id,
      street: JSON.stringify(street),
      pd: pd,
      domophome: domophome === true ? 1 : 0,
      et: et,
      kv: kv,
      id: get().infoAboutAddr.id,
      comment: comment,
      is_main: is_main === true ? 1 : 0,
      nameAddr: nameAddr
    };

    let json = await api('profile', data);

    if( json?.st === true ){
      get().closeModalAddr();
      get().getUserInfo('profile', get().city, token);

      set({
        openModalAddress: false
      })

      useCartStore.getState().getMySavedAddr(city_id, { street: get().chooseAddrStreet.street, home: get().chooseAddrStreet.home });
    }else{
      useHeaderStoreNew.getState().setActiveModalAlert(true, json?.text, false);
    }

    setTimeout( () => {
      set({
        is_fetch_save_new_addr: false
      })
    }, 500 )
    
  },
  delAddr: async(addr_id, token) => {
    let data = {
      type: 'del_my_addr',
      city_id: get().city,
      token: token,
      addr_id: addr_id,
    };

    let json = await api('profile', data);

    if( json?.st === true ){
      get().getUserInfo('profile', get().city, token);
    }
  },
  updateStreetList: async(city_id) => {
    if( city_id === null || city_id == '' ){
      return ;
    }

    let data = {
      type: 'get_city_street_zone',
      city_id: city_id,
    };

    let json = await api('profile', data);

    set({
      allStreets: json?.streets,
      zones: json?.zones,
      //chooseAddrStreet: {}
    })

    //get().setMapZone(json.zones, json.city_center)
  },
  clearAddr: () => {
    set({
      chooseAddrStreet: {},
      infoAboutAddr: null
    })
  },

  setMapZone: (zones, city_center) => {
    get().thisMAP.geoObjects.removeAll();

    zones.map((zone, key)=>{
      get().thisMAP.geoObjects.add(
        new ymaps.Polygon([zone.zone], 
          {
            address: '',
            raion: '',
          }, 
          {
            fillColor: 'rgba(53, 178, 80, 0.15)',
            strokeColor: '#35B250',
            strokeWidth: 5,
            hideIconOnBalloonOpen: false,
          }
        )
      );
    })

    get().thisMAP.setCenter([city_center[0], city_center[1]], 11);
  },
  setAddrPoint: (point) => {

    let objectManager = new ymaps.ObjectManager();

    let json2 = {
      "type": "FeatureCollection",
      "features": []
    };

    json2.features.push({
      type: "Feature",
      id: -1,
      geometry: {
        type: "Point",
        coordinates: [ point[0], point[1] ]
      },
    })

    objectManager.objects.options.set({
      iconLayout: 'default#image',
      iconImageHref: '/Frame.png',
    });

    objectManager.add(json2);

    get().thisMAP.geoObjects.add(objectManager);
  },
  delAddrPoint: () => {
    let geoObjects = get().thisMAP.geoObjects;

    geoObjects.each(function (object) {
      if( object['geometry'] === null ){
        get().thisMAP.geoObjects.remove(object)
      }
    });
  },
  saveUserActions: async(event, param, price = 0, item_id = 0) => {

    // choose_tag_text
    // choose_tag
    // open_page_false - устаревший баннер ( стр Акции )
    // open_page_banner ( стр Акции )
    // open_banner_home
    // open_item_home
    // user_log_out
    // user_log_in
    // plus_item
    // minus_item
    // remove_promo
    // check_promo

    const city = useCitiesStore.getState().thisCity
    const trackEvent = useYandexMetrika(city);

    if( event == 'plus_item' ){
      trackEvent('add_item', {
        productId: param,
        price: price,
        item_id: item_id
      });
    }

    if( event == 'open_item_home' ){
      trackEvent('open_item', {
        productId: param,
        price: price,
        item_id: item_id
      });
    }

    if( event == 'open_cart' ){
      trackEvent('open_cart', {
        price: price,
      });
    }

    if( event == 'cart_confirm' ){
      trackEvent('cart_confirm', {
        price: price,
      });
    }

    if( event == 'true_pay_online_order' ){
      trackEvent('true_pay_online_order', {
        price: price,
      });
    }
    
    const token_tmp = await useHeaderStoreNew.getState().token_tmp ?? '';

    let data = {
      type: 'save_user_actions',
      user_id: useHeaderStoreNew.getState().token,
      user_token: token_tmp ?? '',
      city_id: city,
      event: event,
      data: param,
    };

    let json = await api('profile', data);
  }
}), shallow);

export const useFooterStore = createWithEqualityFn((set) => ({
  links: {},

  getData: async (this_module, city) => {
    let data = {
      type: 'get_page_info',
      city_id: city,
      page: 'info',
    };

    const json = await api(this_module, data);

    set({
      links: json?.page,
    });
  },
}), shallow);

export const useCitiesStore = createWithEqualityFn((set) => ({
  thisCity: null,
  thisCityRu: '',
  thisCityList: [],
  setThisCity: (city) => {
    set({
      thisCity: city,
    });
  },
  setThisCityRu: (city) => {
    set({
      thisCityRu: city,
    });
  },
  setThisCityList: (cityList) => {
    set({
      thisCityList: cityList,
    });
  },
}), shallow);

export const useHomeStore = createWithEqualityFn((set, get) => ({
  bannerList: [],
  CatsItems: [],
  category: [],
  openItem: null,
  isOpenModal: false,
  typeModal: 'start',
  typeModal_dop: 'start',
  foodValue: false,

  activeSlider: true,

  openModalBanner: false,
  banner: null,
  swiper: null,

  openBannerItems: [],
  typePromo: 0,

  // стили для меню категории в мобилке, в зависимости от скролла
  cat_position: false,
  
  isOpenFilter: false,
  filterActive: false,
  //transition_menu_pc: '1.1552346570397vw',
  transition_menu_mobile: '0',
  CatsItemsCopy: [],
  // tag_filter: [],
  tag_filter: '',
  badge_filter: '',
  text_filter: '',
  all_tags: [],

  pageBanner: null,

  openItemCard: false,
  item_card: null,

  // закрытие модалки товара в списке сетов
  closeItemModal: () => {

    let state = { },
      title = '',
      url = window.location.pathname;

    window.history.pushState(state, title, url)

    set({
      openItemCard: false,
      foodValue: false,
      item_card: null
    });
  },

  // сброс фильтра на главной странице
  resetFilter: () => {

    const activePage = useHeaderStoreNew.getState().activePage;

    if(activePage === 'home') { 

      
      let all_items = useCartStore.getState().allItems;
      
      if(all_items.length) {

        all_items.map(item => {

          if( document.getElementById(item.link) ){
            document.querySelector('#'+item.link).style.display = 'flex';
          }
          
        });

      }
    }
    
    set({
      badge_filter: '',
      tag_filter: '',
      text_filter: ''
    })
  },

  // установить тэги для фильтра на главной странице
  setAllTags: (tags) => {
    set({
      all_tags: tags,
    });
  },

  // фильтр по наименованию товара на главной странице
  filterText: (event) => {
    
    if(!event) {
      set({ text_filter: '' });
      get().resetFilter();

      return;
    }
    
    let text_filter = event.target.value;
    
    if(text_filter) {
      let all_items = useCartStore.getState().allItems;

      let check = false;

      all_items.map(item => {
       
        if( document.getElementById(item.link) ){

          check = item.name.toLowerCase().includes(text_filter.toLowerCase())
    
          if(check) {
            document.querySelector('#'+item.link).style.display = 'flex';
          } else {
            document.querySelector('#'+item.link).style.display = 'none';
          }
        }
      })

      useProfileStore.getState().saveUserActions('choose_tag_text', text_filter);

      set({ text_filter });
    } else {
      get().resetFilter();
    }
    
  },

  // фильтр товаров по badges на главной странице
  filterItemsBadge: (res) =>  {
    let all_items = useCartStore.getState().allItems;
    const badge_filter = get().badge_filter;

    set({ tag_filter: '', text_filter: '' })

    if(parseInt(res) !== parseInt(badge_filter)) {

      if(parseInt(res) === 2){

        useProfileStore.getState().saveUserActions('choose_tag', 'Новинка');

        if( useCitiesStore.getState().thisCityRu == 'Самара' ) {
          ym(100325084, 'reachGoal', 'choose_tag', { tag: 'Новинка' })
          ym(100325084, 'reachGoal', 'Тэг Новинка', { tag: 'Новинка' })
        }

        if( useCitiesStore.getState().thisCityRu == 'Тольятти' ) {
          ym(100601350, 'reachGoal', 'choose_tag', { tag: 'Новинка' })
          ym(100601350, 'reachGoal', 'Тэг Новинка', { tag: 'Новинка' })
        }

        all_items.map( item => {
          if( document.getElementById(item.link) ){
            if( parseInt(item.is_new) ===  1 ){
              document.querySelector('#'+item.link).style.display = 'flex';
            }else{
              document.querySelector('#'+item.link).style.display = 'none';
            }
          }
        } )
      }
  
      if(parseInt(res) === 1){
        all_items.map( item => {
          if( document.getElementById(item.link) ){
            if( parseInt(item.is_hit) ===  1 ){
              document.querySelector('#'+item.link).style.display = 'flex';
            }else{
              document.querySelector('#'+item.link).style.display = 'none';
            }
          }
        } )
      } 

      get().scrollToTargetAdjusted();

      set({ badge_filter: res })
    } else {
      get().resetFilter();
    }

  },

  // фильтр товаров по тэгам на главной странице
  filterItems: (res) => {
    set({ badge_filter: '', text_filter: '' })
    
    let all_items = useCartStore.getState().allItems;
    let tag_filter = get().tag_filter;

    if(parseInt(res) !== parseInt(tag_filter)) {

      let check = false;

      let all_tags = get().all_tags;

      let find_tag = all_tags?.find(tag => parseInt(tag.id) === parseInt(res));

      ym(47085879, 'reachGoal', 'choose_tag', { tag: find_tag?.name })

      if( useCitiesStore.getState().thisCityRu == 'Самара' ) {
        ym(100325084, 'reachGoal', 'choose_tag', { tag: find_tag?.name })

        ym(100325084, 'reachGoal', 'Тэг '+find_tag?.name, { tag: find_tag?.name })
      }

      if( useCitiesStore.getState().thisCityRu == 'Тольятти' ) {
        ym(100601350, 'reachGoal', 'choose_tag', { tag: find_tag?.name })

        ym(100601350, 'reachGoal', 'Тэг '+find_tag?.name, { tag: find_tag?.name })
      }

      useProfileStore.getState().saveUserActions('choose_tag', find_tag?.name);

      all_items.map(item => {
        //check = this_filter.some(r=> item.tags.includes(r)) -- или
        //check = this_filter.every(r=> item.tags.includes(r)) -- и

        if( document.getElementById(item.link) ){
          check = item.tags.includes(res)

          if(check){
            //arr.push(item)
            document.querySelector('#'+item.link).style.display = 'flex';
          }else{
            document.querySelector('#'+item.link).style.display = 'none';
          }
        }
      })

      get().scrollToTargetAdjusted();

      set({ tag_filter: res })
    } else {
      get().resetFilter();
    }

    //console.log(arr)
  },

  // скролл к списку товаров на главной при выборе тега или баджа в фильтре
  scrollToTargetAdjusted: () => {

    let offsetPosition;

    const matches = useHeaderStoreNew.getState().matches;

    if(matches) {

      const header = document.querySelector('.headerMobile')?.getBoundingClientRect().height;
      
      const banner = document.querySelector('.BannerMobile')?.getBoundingClientRect().height;

      const menu = document.querySelector('.menuCatMobile')?.getBoundingClientRect().height * 0.75;
      
      //const filter = document.querySelector('.filterMobile')?.getBoundingClientRect().height;
      const filter = 0;
  
      offsetPosition = (filter + banner) - (header + menu);
    
    } else {

      const header = document.querySelector('.headerNew')?.getBoundingClientRect().height / 2;
      
      const banner = document.querySelector('.BannerPC')?.getBoundingClientRect().height;
      
      //const filter = document.querySelector('.filterPC')?.getBoundingClientRect().height;
      const filter = 0;

      offsetPosition = filter + banner + header;
    }
  
    window.scrollTo({
      top: offsetPosition,
      //top: 0,
      behavior: "smooth"
    });
  },

  // открыть/закрыть фильтр на главной странице
  setActiveFilter: (value) => {
    
    //const matches = useHeaderStoreNew.getState().matches;

    if(value) {

      // if(matches) {
        //const filter = document.querySelector('.filterMobile')?.getBoundingClientRect().height;

        //const width = document.querySelector('.headerMobile')?.getBoundingClientRect().width;

        //const transition_menu_mobile = (100 * ((filter) / width)) + 3.4188034188034 + 'vw';

        //set({transition_menu_mobile})

      // } else {
      //   const filter = document.querySelector('.filterPC')?.getBoundingClientRect().height;
  
      //   const width = document.getElementById('headerNew')?.getBoundingClientRect().width;

      //   const transition_menu_pc = (100 * ((filter) / width)) + 2.3104693140794 + 'vw';

      //   set({transition_menu_pc})
      // }

      setTimeout(() => {
        set({filterActive: value})
      }, 500);
      
    } else {
      set({ filterActive: value })
      // set({ filterActive: value, transition_menu_mobile: '0', transition_menu_pc: '1.1552346570397vw' })
    }

    set({isOpenFilter: value});
    
    if(!value) {
      //get().resetFilter();
    }
  },

  // установить стили для меню категории в мобилке, в зависимости от скролла
  setMenuCatPosition: (value) => {
    set({cat_position: value})
  },
  
  setActiveModalCardItemMobile: (active, type) => {
    if( active == false ){
      let state = { },
        title = '',
        url = window.location.pathname;

      window.history.pushState(state, title, url);

      if(type && type === 'dop'){
        set({ item_card: null });
      } else {
        set({
          openItem: null
        })
      }

    }

    if(type && type === 'dop'){
      set({ openItemCard: active });
    } else {
      set({ isOpenModal: active });
    }

  },

  // getBanners: async (this_module, city) => {
  //   let token = '';

  //   if (typeof window !== 'undefined') {
  //     token = localStorage.getItem('token');
  //   }

  //   let data = {
  //     type: 'get_banners',
  //     city_id: city,
  //     token: token
  //   };

  //   let activePage = useHeaderStoreNew.getState().activePage;

  //   const json = await api(this_module, data);

  //   let bannerList = [];

  //   if( activePage == 'akcii' ){
  //     bannerList = json?.banners?.filter( (item) => parseInt(item.is_active_actii) == 1 );
  //   }

  //   if( activePage == 'home' || activePage == 'category' ){
  //     bannerList = json?.banners?.filter( (item) => parseInt(item.is_active_home) == 1 );
  //   }

  //   set({
  //     bannerList,
  //   });
  // },

  getBanners: async (this_module, city) => {
    let token = '';

    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }

    let data = {
      type: 'get_banners',
      city_id: city,
      token: token
    };

    const json = await api(this_module, data);

    set({
      bannerList: json?.banners ?? [],
    });
  },

  getOneBanner: async (this_module, city, link) => {
    let token = '';

    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }

    let data = {
      type: 'get_banner_one',
      city_id: city,
      name: link,
      token: token
    };

    const json = await api(this_module, data);

    if(!json?.banner){
      useProfileStore.getState().saveUserActions('open_page_false', '');

      window.location.href = '/' + city + '/akcii';
    }else{

      useProfileStore.getState().saveUserActions('open_page_banner', json?.banner?.name);

      set({
        pageBanner: json?.banner,
      });
    }
  },
  
  getItemsCat: async (this_module, city) => {
    let data = {
      type: 'get_items_cat',
      city_id: city,
    };

    const json = await api(this_module, data);

    set({
      CatsItems: json?.items,
      category: json?.main_cat,

      // для тестов фильтра на главной
      CatsItemsCopy:  json?.items,
    });
  },

  setCategory: (cats) => {
    set({
      category: cats
    });
  },

  // получение данных выбранного товара
  getItem: async (this_module, city, item_id, type) => {

    let data = {
      type: 'get_item',
      city_id: city,
      item_id: item_id
    };

    const json = await api(this_module, data);

    if( json?.link ){
      let state = { 'item_id': item_id, 'item_name': json?.name },
          title = json?.name,
          url = window.location.pathname+'?item='+json?.link;

      window.history.pushState(state, title, url);
    } else {

      if(type && type === 'set') {
        get().closeItemModal();
      } else {
        get().closeModal();
      }
 
    }

    useProfileStore.getState().saveUserActions('open_item_home', json?.name, json?.price, item_id);
  
    ymDataLayer.push({
      "ecommerce": {
        "currencyCode": "RUB",
        "detail": {
          "products": [
            {
              "id": item_id,
              "name" : json?.name,
              "price": json?.price,
              //"brand": "Яндекс / Яndex",
              "category": json?.cat_name,
              //"variant" : "Красный цвет",
              //"list": "Результаты поиска",
              "position": 1
            }
          ]
        }
      }
    });

    if(type && type === 'set') {
      set({
        openItemCard: true,
        item_card: json,
        typeModal_dop: 'start',
      });
    } else {
      set({
        isOpenModal: true,
        openItem: json,
        typeModal: 'start',
      });
    }

    //set({
      // isOpenModal: true,
      // openItem: json,
      // typeModal: 'start',
    //});
  },

  // закрытие модального окна товара на главной странице
  closeModal: () => {

    let state = { },
      title = '',
      url = window.location.pathname;

    window.history.pushState(state, title, url)

    set({
      isOpenModal: false,
      foodValue: false,
      openItem: null
    });
  },

  // навигация между модальными окнами товара
  navigate: (typeModal) => {

    if(typeModal === 'value') {
      set({ typeModal, foodValue: true  });
    } else {
      set({ typeModal, foodValue: false });
    } 
  },

  // навигация между модальными окнами товара открытыми в модалке сета
  navigate_dop: (typeModal_dop) => {

    if(typeModal_dop === 'value') {
      set({ typeModal_dop, foodValue: true  });
    } else {
      set({ typeModal_dop, foodValue: false });
    } 
  },

  // закрытие БЖУ/Cета товара
  closeTypeModal: (event) => {

    if(event.target.classList.contains("first_text") || 
      !event.target.classList.value || 
       event.target.classList.contains('MuiDialog-container') || 
       event.target.classList.contains('minus') || 
       event.target.classList.contains('plus') || 
       event.target.classList.contains('ItemName') || 
       event.target.classList.contains('ItemDesk')) {

      return;

    } else {
      get().navigate('start');
    }
  },

  // закрытие БЖУ/Cета товара при открытии в сете товара
  closeTypeModal_dop: (event) => {

    if(event.target.classList.contains("first_text") || 
      !event.target.classList.value || 
       event.target.classList.contains('MuiDialog-container') || 
       event.target.classList.contains('minus') || 
       event.target.classList.contains('plus')) {

      return;

    } else {
      get().navigate_dop('start');
    }
  },

  // открытие/закрытие модального окна баннер на главное странице
  setActiveBanner: (active, banner, swiper) => {

    let new_banner = {...banner};

    const all_items = useCartStore.getState().allItems;
    //const all_items = items;

    if( banner ){
      if( new_banner?.info && Object.keys(new_banner?.info).length > 0 ){

        //скидка
        if( parseInt(new_banner.info.promo_action) == 1 ){

        }

        //добавляет товар
        if( parseInt(new_banner.info.promo_action) == 2 ){
          new_banner.info.items_add.map( (item, key) => {
            let find_item = all_items?.find( f_item => parseInt(f_item.id) == parseInt(item.item_id) );

            new_banner.info.items_add[ key ]['img_app'] = find_item?.img_app;
            new_banner.info.items_add[ key ]['price'] = find_item?.price;
          } )

          set({
            openBannerItems: new_banner.info.items_add
          })
        }

        //товар за цену
        if( parseInt(new_banner.info.promo_action) == 3 ){
          new_banner.info.items_on_price.map( (item, key) => {
            let find_item = all_items?.find( f_item => parseInt(f_item.id) == parseInt(item.id) );

            new_banner.info.items_on_price[ key ]['img_app'] = find_item['img_app'];
            new_banner.info.items_on_price[ key ]['price'] = find_item['price'];
          } )

          set({
            openBannerItems: new_banner.info.items_on_price
          })
        }

        set({
          typePromo: new_banner.info.promo_action
        })
      }else{

        new_banner?.item?.map( (item, key) => {
          let find_item = all_items?.find( f_item => parseInt(f_item.id) == parseInt(item.item_id) );

          if( find_item ){
            new_banner.item[ key ] = find_item;
          }
        })

        set({
          openBannerItems: new_banner?.item ?? [],
          typePromo: 0
        })
      }

      useProfileStore.getState().saveUserActions('open_banner_home', new_banner?.name);

      set({ 
        banner: new_banner
      });
    }

    if(swiper) set({ swiper });

    if(active) {
      get().swiper.autoplay.stop();
    } else {
      get().swiper.autoplay.start();
    }
    
    set({ 
      activeSlider: !active,
      openModalBanner: active 
    });

  },

  dataForActia: (banner) => {
    let new_banner = {...banner};

    const all_items = useCartStore.getState().allItems;

    let openBannerItems = [];
    let typePromo = 0;

    if( banner ){
      if( new_banner?.info && Object.keys(new_banner?.info).length > 0 ){

        //скидка
        if( parseInt(new_banner.info.promo_action) == 1 ){

        }

        //добавляет товар
        if( parseInt(new_banner.info.promo_action) == 2 ){
          new_banner.info.items_add.map( (item, key) => {
            let find_item = all_items?.find( f_item => parseInt(f_item.id) == parseInt(item.item_id) );

            new_banner.info.items_add[ key ]['img_app'] = find_item?.img_app
          } )

          openBannerItems = new_banner.info.items_add;
        }

        //товар за цену
        if( parseInt(new_banner.info.promo_action) == 3 ){
          new_banner.info.items_on_price.map( (item, key) => {
            new_banner.info.items_on_price[ key ]['img_app'] = all_items?.find( f_item => parseInt(f_item.id) == parseInt(item.id) )['img_app'];
          } )

          openBannerItems = new_banner.info.items_on_price;
        }

        typePromo = new_banner.info.promo_action;
      }else{

        new_banner?.item?.map( (item, key) => {
          let find_item = all_items?.find( f_item => parseInt(f_item.id) == parseInt(item.item_id) );

          if( find_item ){
            new_banner.item[ key ] = find_item;
          }
        })

        typePromo = 0;
        openBannerItems = new_banner?.item ?? [];
      }

      return {
        banner: new_banner,
        typePromo,
        openBannerItems
      };
    }
  },

}), shallow);
