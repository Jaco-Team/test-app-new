import { create } from 'zustand';

import { api } from './api.js';

export const useCartStore = create((set, get) => ({
  items: [],
  allItems: [],
  itemsCount: 0,
  allPrice: 0,

  // все товары сайта
  setAllItems: (allItems) => {
    set({ allItems })
  },
  // добаление товара при выборе в карточке товара, модалке товара и корзине
  plus: (item_id) => {
    let check = false;
    let items = get().items;
    const allItems = get().allItems;
    let itemsCount = get().itemsCount;

    items = items.map((item) => {
      if(item.id === item_id){
        item.count++;
        itemsCount++;
        check = true;
        return item;
      }
      return item;
    })

    if(!check){
      const item = allItems.find(item => item.id === item_id);
      if(item){
        item.count = 1;
        itemsCount++;
        items = [...items,...[item]];
      }
    }

    //console.log('plus====>', items);

    const allPrice = items.reduce((all, it) => all + it.count * it.price, 0);

    set({ items, itemsCount, allPrice });

  },
  // удаление товара из карточки товара, модалки товара и корзины
  minus: (item_id) => {
    let items = get().items;
    let itemsCount = get().itemsCount;

    items = items.reduce((newItems, item) => {
      if(item.id === item_id){
        item.count--;
        itemsCount--;
      }
      return item.count ? newItems = [...newItems,...[item]] : newItems;
    }, [])
  
    // console.log('minus====>', items);

    const allPrice = items.reduce((all, it) => all + it.count * it.price, 0);

    set({ items, itemsCount, allPrice });
  },
}))

export const useContactStore = create((set, get) => ({
  myPoints: [],
  myUnicPoint: [],
  pointsZone: [],
  myMap2: null,
  myAddr: [],
  phone: '',
  disable: true,

  // получение данных для карты
  getData: async (this_module, city) => {
    set({ disable: true });

    const data = {
      type: 'get_addr_zone_web',
      city_id: city,
    };

    const json = await api(this_module, data);
    
    let points_zone = [];

    json.map(function (point) {
      if (point['zone_origin'].length > 0) {
        points_zone.push(JSON.parse(point['zone_origin']));
      }
    });

    let unic_point = [],
      check = false;

    json.map(function (point) {
      check = false;

      unic_point.map(function (new_point) {
        if (parseInt(new_point.id) == parseInt(point.id)) {
          check = true;
        }
      });

      if (!check) {
        unic_point.push(point);
      }
    });

    set({
      myPoints: json,
      myUnicPoint: unic_point,
      pointsZone: points_zone,
      phone: json[0].phone,
      myAddr: json.filter((value, index, self) => index === self.findIndex((t) => t.addr === value.addr))
    });

    get().loadMap(get().myPoints, get().pointsZone);
  },

  // отрисовка карты по данным
  loadMap: (points, points_zone) => {
    if(!get().myMap2){
      ymaps.ready().then((function () {
    
        get().myMap2 = new ymaps.Map('ForMap', {
          center: [ points[0]['xy_center_map']['latitude'], points[0]['xy_center_map']['longitude'] ],
          zoom: 11.5,
          controls: ['geolocationControl', 'searchControl']
        }, { suppressMapOpenBlock: true },
        );

        points_zone.map((zone, key)=>{
          get().myMap2.geoObjects.add(
            new ymaps.Polygon([zone], 
              {
                address: points[ key ]['addr'],
                raion: points[ key ]['raion'],
              }, 
              {
              fillColor: 'rgba(53, 178, 80, 0.15)',
              strokeColor: '#35B250',
              strokeWidth: 5,
              hideIconOnBalloonOpen: false,
            })
          );
        })
          
        points.map(function(point, key){
          get().myMap2.geoObjects.add(
            new ymaps.Placemark( [point['xy_point']['latitude'], point['xy_point']['longitude']], 
            {
              address: points[ key ]['addr'],
              raion: points[ key ]['raion'],
            }, {
              iconLayout: 'default#image',
              iconImageHref: '/Favikon.png',
              iconImageSize: [50, 50],
              iconImageOffset: [-12, -24],
              hideIconOnBalloonOpen: false,
            })
        )
        })

        get().myMap2.geoObjects.events.add('click', get().changePointClick);
        get().myMap2.events.add('click', get().changePointNotHover);

      }))
    }else{
      get().myMap2.destroy();
      get().myMap2 = null;
      get().loadMap(get().myPoints, get().pointsZone);
    }
  },

  // изменение состояния точки по клику
  changePointClick: (event) => {

    get().myMap2.balloon.close();

    ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Point"').setOptions({ iconLayout: 'default#image' });
  
    if(get().disable) {
      ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Polygon"').setOptions({ strokeColor: '#35B250', fillColor: 'rgba(53, 178, 80, 0.15)', fillOpacity: 1, strokeWidth: 5 });
    } else {
      ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Polygon"').setOptions({ fillColor: "#000000", strokeColor: "#000000", fillOpacity: 0.001, strokeWidth: 0 });
    }

    const img = ymaps.templateLayoutFactory.createClass( 
      "<div class='my-img'>" +
        "<img alt='' src='/Favikon.png' />" +
      "</div>"
    );

    const balloonLayout = ymaps.templateLayoutFactory.createClass( 
      "<div class='my-hint'>" +
        "<img alt='' src='/about/fasad.jpg' /><br />" +
        "<div>{{ properties.raion }}</div><br />" +
        "<div>{{ properties.address }}</div><br />" +
      "</div>"
    );

    const type = event.get('target').geometry.getType();

    if(type === 'Polygon') {

      if(get().disable) {
        event.get('target').options.set({ strokeColor: '#DD1A32', fillColor: 'rgba(221, 26, 50, 0.15)', fillOpacity: 1, strokeWidth: 5 });
      } else {
        event.get('target').options.set({ fillColor: "#000000", strokeColor: "#000000", fillOpacity: 0.001, strokeWidth: 0 });
      }

      const points = ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Point"')

      points.each(function(point) {

      const res = event.get('target').geometry.contains(point.geometry.getCoordinates())

        if(res) {
          if(get().disable) {
            point.options.set({ iconLayout: img, balloonLayout: balloonLayout })
            point.balloon.open();
          }
        }
      });
    }

    if(type === 'Point') {
      event.get('target').options.set({ iconLayout: img, balloonLayout: balloonLayout })

      const polygons = ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Polygon"')

      polygons.each(function(polygon) {

      const res = polygon.geometry.contains(event.get('target').geometry.getCoordinates())

        if(res) {
          if(get().disable) {
            polygon.options.set({ strokeColor: '#DD1A32', fillColor: 'rgba(221, 26, 50, 0.15)', fillOpacity: 1, strokeWidth: 5 });
          } else {
            polygon.options.set({ fillColor: "#000000", strokeColor: "#000000", fillOpacity: 0.001, strokeWidth: 0 });
          }
        }
      });
    }
  },

  // изменение состояния карты/точек при клике вне точек
  changePointNotHover: (event) => {
    get().myMap2.balloon.close();

    const type = event.get('target').getType();

    if(type === 'yandex#map') {
      ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Point"').setOptions({ iconLayout: 'default#image' });

      if(get().disable) {
        ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Polygon"').setOptions({ strokeColor: '#35B250', fillColor: 'rgba(53, 178, 80, 0.15)', fillOpacity: 1,
        strokeWidth: 5 });
      } else {
        ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Polygon"').setOptions({ fillColor: "#000000", strokeColor: "#000000", fillOpacity: 0.001, strokeWidth: 0 });
      }
    }

    const myAddr = get().myAddr.map(addr => {
        addr.color = null;
        return addr;
      }
    );

    set({ myAddr });
  },

  // показывать/не показывать границы зон доставки
  disablePointsZone: () => {
  
    set({ disable: !get().disable });

    if(get().disable) {
      ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Polygon"').setOptions({ strokeColor: '#35B250', fillColor: 'rgba(53, 178, 80, 0.15)', fillOpacity: 1,
      strokeWidth: 5 });
    } else {
      ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Polygon"').setOptions({ fillColor: "#000000", strokeColor: "#000000", fillOpacity: 0.001, strokeWidth: 0 });
    }
  },

  // выбор адреса точки
  chooseAddr: (id) => {

    get().myMap2.balloon.close();

    ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Point"').setOptions({ iconLayout: 'default#image' });

    if(get().disable) {
      ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Polygon"').setOptions({ strokeColor: '#35B250', fillColor: 'rgba(53, 178, 80, 0.15)', fillOpacity: 1,
      strokeWidth: 5, balloonLayout: null });
    } else {
      ymaps.geoQuery(get().myMap2.geoObjects).search('geometry.type = "Polygon"').setOptions({ fillColor: "#000000", strokeColor: "#000000", fillOpacity: 0.001, strokeWidth: 0 });
    }

    const addrHasColor = get().myAddr.find(addr => addr.id === id && addr.color === '#DD1A32');
    
    if(addrHasColor) {
      
      const myAddr = get().myAddr.map(addr => {
        addr.color = null;
        return addr;
      });
      
      set({ myAddr });
      
      return;
    }

    let newAddr = '';

    const myAddr = get().myAddr.map(addr => {
      if (addr.id === id)  {
        addr.color = '#DD1A32'
        newAddr = addr.addr;
        return addr;
      } else {
        addr.color = null;
        return addr;
      }
    });

    const img = ymaps.templateLayoutFactory.createClass( 
      "<div class='my-img'>" +
        "<img alt='' src='/Favikon.png' />" +
      "</div>"
    );

    const balloonLayout = ymaps.templateLayoutFactory.createClass( 
      "<div class='my-hint'>" +
        "<img alt='' src='/about/fasad.jpg' /><br />" +
        "<div>{{ properties.raion }}</div><br />" +
        "<div>{{ properties.address }}</div><br />" +
      "</div>"
    );

    const data = ymaps.geoQuery(get().myMap2.geoObjects);

    data.each(function(item) {

      const addr = item.properties._data.address;

      if(addr === newAddr) {

       if(get().disable) {
         item.options.set({strokeColor: '#DD1A32', fillColor: 'rgba(221, 26, 50, 0.15)', fillOpacity: 1, strokeWidth: 5 });
        } else {
         item.options.set({ fillColor: "#000000", strokeColor: "#000000", fillOpacity: 0.001, strokeWidth: 0 });
        }

        item.options.set({ balloonLayout: balloonLayout, iconLayout: img });
        item.balloon.open();

      }
    });

    set({ myAddr });
  }

}));

export const useAkciiStore = create((set) => ({
  actii: [],
  openAkcia: {},
  openModal: false,
  getData: async (this_module, city) => {
    let data = {
      type: 'get_actii',
      city_id: city,
    };

    const json = await api(this_module, data);

    set({
      actii: json,
    });
  },
  getAktia: async (id, city) => {
    let data = {
      type: 'get_one_actii',
      city_id: city,
      act_id: id,
    };

    const json = await api('akcii', data);

    set({
      openAkcia: json,
      openModal: true,
    });
  },
  closeAktia: () => {
    set({
      openAkcia: {},
      openModal: false,
    });
  },
}));

export const useProfileStore = create((set, get) => ({
  promoList: [],
  orderList: [],
  userInfo: {},
  modalOrder: {},
  openModal: false,
  shortName: '',
  streets: [],
  getPromoList: async (this_module, city, userToken) => {
    let data = {
      type: 'get_my_promos',
      city_id: city,
      user_id: userToken,
    };

    let json = await api(this_module, data);

    set({
      promoList: json.promo_list,
    });
  },
  getOrderList: async (this_module, city, userToken) => {
    let data = {
      type: 'get_my_orders_new',
      city_id: city,
      user_id: userToken,
    };

    let json = await api(this_module, data);

    set({
      orderList: json.order_list,
    });
  },
  getUserInfo: async (this_module, city, userToken) => {
    let data = {
      type: 'get_my_info',
      city_id: city,
      user_id: userToken,
    };

    let json = await api(this_module, data);

    console.log( 'getUserInfo', json )

    set({
      shortName: json.user?.name.substring(0, 1) + json.user?.fam.substring(0, 1),
      userInfo: json.user,
      streets: json.streets
    });
  },
  setUser: (user) => {
    set({
      shortName: user?.name.substring(0, 1) + user?.fam.substring(0, 1),
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
}));

export const useFooterStore = create((set) => ({
  links: {},
  footerRef: null,

  getData: async (this_module, city) => {
    let data = {
      type: 'get_page_info',
      city_id: city,
      page: 'info',
    };

    const json = await api(this_module, data);

    set({
      links: json.page,
    });
  },

  setFooterRef: (footerRef) => {
    set({ footerRef })
  }
}));

export const useHeaderStore = create((set, get) => ({
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

  // typeLogin: 'start',
  typeLogin: 'startTestAuth',
  userName: '',

  preTypeLogin: '',
  loginLogin: '',
  pwdLogin: '',
  code: '',
  genPwd: '',
  showPassword: false,
  loading: false,

  // показывать/скрывать пароль в форме авторизации
  clickShowPassword: () => {
    set({ showPassword: !get().showPassword });
  },

  setActivePage: (page) => {
    set({ activePage: page });
  },

  setActiveModalCity: (active) => {
    set({ openCityModal: active });
  },

  // открытие модального окна формы авторизации
  setActiveModalAuth: (active) => {
    set({ openAuthModal: active });
  },
  
  // установление ошибки 
  setErrTextAuth: (text) => {
    set({ errTextAuth: text });
  },

  // навигация между формами авторизации
  navigate: (typeLogin) => {

    if (typeLogin === 'create' || typeLogin === 'resetPWD') {
      get().gen_password();
    }

    set({ typeLogin, errTextAuth: '', preTypeLogin: get().typeLogin });
  },

  // закрытие форм авторизации
  closeModalAuth: () => {
    set({
      openAuthModal: false,
      errTextAuth: '',
      // typeLogin: 'start',
      typeLogin: 'startTestAuth',
      preTypeLogin: '',
      loginLogin: '',
      pwdLogin: '',
      code: '',
      genPwd: '',
      showPassword: false,
    });
  },

  // изменение/введение логина/телефона
  changeLogin: (event) => {
    let data = event.target.value;

    if (isNaN(data) && data != '+') {
      return;
    }

    if (parseInt(data[0]) == 9) {
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

    data = data.split(' ').join('');
    data = data.split('(').join('');
    data = data.split(')').join('');
    data = data.split('-').join('');
    data = data.split('_').join('');

    if (data.length < 12) {
      set({ loginLogin: data });
    }
  },

  // установление пароля при авторизации
  setPwdLogin: (event) => {
    set({ pwdLogin: event.target.value });
  },

  // запуск функции при нажатии enter в зависимости от формы авторизации
  checkLoginKey: (type, event) => {

    if (parseInt(event.keyCode) == 13) {
      if (parseInt(type) == 1) {
        get().logIn();
      }
      if (parseInt(type) == 2) {
        get().createProfile();
      }

      if (parseInt(type) == 3) {
        get().sendsmsNewLogin();
      }
    }
  },

  // установление таймера 
  toTime: (seconds) => {
    let date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substring(14, 19);
  },

  // изменение/введение 4-х значного номера подтверждения
  changeCode: (code) => {

    set({ code });

    if (code.length < 4) {
      set({ errTextAuth: '' });
    }

    if (code.length === 4) {
      get().checkCode();
    }
  },

  // сбрасывает/очищает поля ввода 4-х значного кода
  clearCode: () => {
    set({ code: '', errTextAuth: '' });
  },

  // генерация случаного пароля при регистарции
  gen_password: () => {
    let genPwd = '';
    let symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+?';
    for (let i = 0; i < 10; i++) {
      genPwd += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }

    set({ genPwd });
  },

  // проверка логина, кода при регистрации/логировании
  checkCode: async () => {
    const data = {
      type: 'check_profile',
      number: get().loginLogin,
      cod: get().code,
    };

    const res = await api('auth', data);

    // console.log('checkCode ===>', res);

    if (res.st === false) {
      if (res.type === 'modal') {
        set({
          typeLogin: 'error',
          errTitle: res.title,
          errText1: res.text1,
          errText2: res.text2,
        });
      } else {
        set({
          errTextAuth: res.text,
        });
      }
    } else {
      set({
        errTextAuth: '',
        errTitle: '',
        errText1: '',
        errText2: '',
      });

      // itemsStore.setToken( res.token, res.name );
      // itemsStore.setUserName(res.name);

      if (get().preTypeLogin === 'create') {
        set({
          typeLogin: 'finish',
        });
      } else {
        get().closeModalAuth();
      }
    }
  },

  //логирование в форме регистрации
  logIn: async () => {

    set({ loading: true });

    const data = {
      type: 'site_login',
      number: get().loginLogin,
      pwd: get().pwdLogin,
    };

    const json = await api('auth', data);

    if (json.st === false) {
      set({
        errTextAuth: json.text,
        loading: false,
      });
    } else {
      set({
        errTextAuth: '',
        is_sms: json.is_sms,
        token: json.token,
        openAuthModal: false,
        loading: false,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', json.token);
      }
    }
  },

  // создание нового аккаунта или получения смс кода для действующего аккаунта
  createProfile: async () => {
    const data = {
      type: 'create_profile',
      number: get().loginLogin,
      // token: get().token,
    };

    const json = await api('auth', data);

    // console.log('createProfile =====>', json);

    if (json.st) {
      set({
        errTextAuth: '',
        errTitle: '',
        errText1: '',
        errText2: '',
        is_sms: json.is_sms,
      });
      if(get().typeLogin !== 'loginSMSCode') {
        get().navigate('loginSMSCode');
      }
    } else {
      if (json.type == 'modal') {
        set({
          typeLogin: 'error',
          errTitle: json.title,
          errText1: json.text1,
          errText2: json.text2,
        });
      } else {
        set({
          errTextAuth: json.text,
        });
      }
    }
  },

  // подтвреждение новой регистрации/изменения в существующий аккаунт
  sendsmsNewLogin: async () => {
    const data = {
      type: 'sendsmsrp',
      number: get().loginLogin,
      pwd: get().pwdLogin,
      token: get().token,
    };

    const json = await api('auth', data);

    // console.log('sendsmsNewLogin', json)

    if (json['st']) {
      set({
        errTextAuth: '',
        errTitle: '',
        errText1: '',
        errText2: '',
        is_sms: json.is_sms ?? false,
      });
      if(get().typeLogin !== 'loginSMSCode') {
        get().navigate('loginSMSCode');
      }
    } else {
      if (json.type == 'modal') {
        set({
          typeLogin: 'error',
          errTitle: json.title,
          errText1: json.text1,
          errText2: json.text2,
        });
      } else {
        set({
          errTextAuth: json.text,
        });
      }
    }

    // setTimeout( () => {
    //     this.setState({
    //         is_load_new: false
    //     })
    // }, 300 )
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

  // тестовая аутенфикация
  setActiveUser: (name) => {

  let userName = '';
  const nameSplit = name.split(' ');

  if(nameSplit.length === 1) {
    userName = nameSplit[0][0].toUpperCase() + nameSplit[0][1].toUpperCase()
  } else {
    userName = nameSplit[0][0].toUpperCase() + nameSplit[1][0].toUpperCase()
  }

  // console.log('setActiveUser ===>', userName);

  set({ userName });
  }
}));

export const useCitiesStore = create((set) => ({
  thisCity: '',
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
}));

export const useHomeStore = create((set, get) => ({
  bannerList: [],
  CatsItems: [],
  openItem: null,
  isOpenModal: false,
  typeModal: 'start',
  foodValue: false,

  openModalBanner: false,
  banner: null,
  swiper: null,

  getBanners: async (this_module, city) => {
    let data = {
      type: 'get_banners',
      city_id: city,
    };

    const json = await api(this_module, data);

    // console.log('getBanners ====>', json)

    set({
      bannerList: json.banners,
    });
  },
  
  getItemsCat: async (this_module, city) => {
    let data = {
      type: 'get_items_cat',
      city_id: city,
    };

    const json = await api(this_module, data);

    set({
      CatsItems: json.items,
    });
  },

  // получение данных выбранного товара
  getItem: async (this_module, city, item_id) => {

    let data = {
      type: 'get_item',
      city_id: city,
      item_id: item_id
    };

    const json = await api(this_module, data);

    set({
      isOpenModal: true,
      openItem: json,
      typeModal: 'start',
    });
  },

  // закрытие модального окна товара на главной странице
  closeModal: () => {
    set({
      isOpenModal: false,
      foodValue: false,
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

  // закрытие БЖУ/Cета товара
  closeTypeModal: (event) => {

    if(event.target.classList.contains("first_text") || !event.target.classList.value || 
       event.target.classList.contains('MuiDialog-container') || event.target.classList.contains('minus') || 
       event.target.classList.contains('plus')) {

      return;

    } else {
      get().navigate('start');
    }
  },

  // открытие/закрытие модального окна баннер на главное странице
  setActiveBanner: (active, banner, swiper) => {

    if(swiper) set({ swiper });

    if(active) {
      get().swiper.autoplay.stop();
    } else {
      get().swiper.autoplay.start();
    }
    
    set({ banner, openModalBanner: active });

  }

}));
