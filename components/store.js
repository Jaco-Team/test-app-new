import { create } from 'zustand';

import { api } from './api.js';

export const useContactStore = create((set) => ({
  myPoints: [],
  myUnicPoint: [],
  pointsZone: [],
  getData: async (this_module, city) => {
    let data = {
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
    });
  },
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

export const useProfileStore = create((set) => ({
  promoList: [],
  orderList: [],
  userInfo: {},
  modalOrder: {},
  openModal: false,
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

    set({
      userInfo: json.user,
    });
  },
  setUser: (user) => {
    set({
      userInfo: user,
    });
  },
  updateUser: async (this_module, city, userToken, user) => {
    let data = {
      type: 'update_user',
      city_id: city,
      user_id: userToken,
      user: JSON.stringify(user),
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
}));

export const useHeaderStore = create((set, get) => ({
  activePage: '',
  openCityModal: false,
  openAuthModal: false,

  errTextAuth: '',
  token: '',

  errTitle: '',
  errText1: '',
  errText2: '',

  is_sms: true,

  typeLogin: 'start',
  preTypeLogin: '',
  loginLogin: '',
  pwdLogin: '',
  code: '',
  genPwd: '',

  setActivePage: (page) => {
    set({ activePage: page });
  },

  setActiveModalCity: (active) => {
    set({ openCityModal: active });
  },

  // открытие модального окна формы регистрации
  setActiveModalAuth: (active) => {
    set({ openAuthModal: active });
  },
  
  // установление ошибки 
  setErrTextAuth: (text) => {
    set({ errTextAuth: text });
  },

  // навигация между форма при регистрации/логировании
  navigate: (typeLogin) => {
    if (typeLogin === 'create') {
      get().gen_password();
      set({ preTypeLogin: 'create' });
    }

    set({ typeLogin });
  },

  // закрытие форм в регистрации/логировании
  closeModalAuth: () => {
    set({
      openAuthModal: false,
      errTextAuth: '',
      typeLogin: 'start',
      preTypeLogin: '',
      loginLogin: '',
      pwdLogin: '',
      code: '',
      genPwd: '',
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

  // установление пароля при регистрации/логировании
  setPwdLogin: (event) => {
    set({ pwdLogin: event.target.value });
  },

  // запуск функции при нажатии enter в зависимости от формы
  checkLoginKey: (type, event) => {

    if (parseInt(event.keyCode) == 13) {
      if (parseInt(type) == 1) {
        get().logIn();
      }
      if (parseInt(type) == 2) {
        get().sendSMS();
      }

      if (parseInt(type) == 3) {
        get().checkCode();
      }

      if (parseInt(type) == 4) {
        get().sendsmsNewLogin();
      }
    }
  },

  // направление смс на указанный номер при регистарции/логировании
  sendSMS: () => {
    get().navigate('loginSMSCode');

    get().createProfile();
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

    if (code.length === 4) {
      get().checkCode();
    }
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
    const data = {
      type: 'site_login',
      number: get().loginLogin,
      pwd: get().pwdLogin,
    };

    const json = await api('auth', data);

    if (json.st === false) {
      set({
        errTextAuth: json.text,
      });
    } else {
      set({
        errTextAuth: '',
        is_sms: json.is_sms,
        token: json.token,
        openAuthModal: false,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', json.token);
      }
    }
  },

  // создание нового аккаунта
  createProfile: async () => {
    const data = {
      type: 'create_profile',
      number: get().loginLogin,
      token: get().token,
    };

    const json = await api('auth', data);

    if (json.st) {
      set({
        errTextAuth: '',
        errTitle: '',
        errText1: '',
        errText2: '',
        is_sms: json.is_sms,
      });
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

    get().navigate('loginSMSCode');

    const json = await api('auth', data);

    if (json['st']) {
      set({
        errTextAuth: '',
        errTitle: '',
        errText1: '',
        errText2: '',
        is_sms: json.is_sms ?? false,
      });
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

export const useHomeStore = create((set) => ({
  bannerList: [],
  CatsItems: [],
  openItem: null,
  isOpenModal: false,
  getBanners: async (this_module, city) => {
    let data = {
      type: 'get_banners',
      city_id: city,
    };

    const json = await api(this_module, data);

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
    });
  },
}));
