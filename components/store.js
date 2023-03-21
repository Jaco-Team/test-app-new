import { create } from 'zustand'

import { api } from './api.js';

export const useContactStore = create((set) => ({
  myPoints: [],
  myUnicPoint: [],
  pointsZone: [],
  getData: async (this_module, city) => {
    let data = {
      type: 'get_addr_zone_web',
      city_id: city
    };

    const json = await api(this_module, data);
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

    set({
      myPoints: json, 
      myUnicPoint: unic_point,
      pointsZone: points_zone
    })
  },
}))

export const useAkciiStore = create((set) => ({
  actii: [],
  openAkcia: {},
  openModal: false,
  getData: async (this_module, city) => {
    let data = {
      type: 'get_actii',
      city_id: city
    };

    const json = await api(this_module, data);
    
    set({
      actii: json
    })
  },
  getAktia: async (id, city) => {
    let data = {
      type: 'get_one_actii',
      city_id: city,
      act_id: id
    };

    const json = await api('akcii', data);

    set({
      openAkcia: json,
      openModal: true
    })
  },
  closeAktia: () => {
    set({
      openAkcia: {},
      openModal: false
    })
  }
}))

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
      user_id: userToken
    };

    let json = await api(this_module, data);

    set({
      promoList: json.promo_list
    })
  },
  getOrderList: async (this_module, city, userToken) => {
    let data = {
      type: 'get_my_orders',
      city_id: city,
      user_id: userToken
    };

    let json = await api(this_module, data);

    set({
      orderList: json.order_list
    })
  },
  getUserInfo: async (this_module, city, userToken) => {
    let data = {
      type: 'get_my_info',
      city_id: city,
      user_id: userToken
    };

    let json = await api(this_module, data);

    set({
      userInfo: json.user
    })
  },
  setUser: (user) => {
    set({
      userInfo: user
    })
  },
  updateUser: async (this_module, city, userToken, user) => {
    let data = {
      type: 'update_user',
      city_id: city,
      user_id: userToken,
      user: JSON.stringify(user)
    };

    let json = await api(this_module, data);
  },
  getOrder: async (this_module, city, userToken, order_id, point_id) => {
    let data = {
      type: 'get_order',
      city_id: city,
      user_id: userToken,
      order_id: order_id,
      point_id: point_id
    };

    let json = await api(this_module, data);

    set({
      modalOrder: json,
      openModal: true
    })
  },
  closeOrder: () => {
    set({
      openModal: false,
      modalOrder: {}
    })
  }
}))

export const useFooterStore = create((set) => ({
  links: {},
  getData: async (this_module, city) => {
    let data = {
      type: 'get_page_info',
      city_id: city,
      page: 'info'
    };

    const json = await api(this_module, data);

    set({
      links: json.page
    })
  }
}))

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
  loginLogin: '',
  pwdLogin: '',
  code: '',

  navigate: (typeLogin) => {
    set({
      typeLogin
    })
  },

  closeModalAuth: () => {
    set({
      openAuthModal: false,
      typeLogin: 'start',
      errTextAuth: '',
      loginLogin: '',
      pwdLogin: '',
    })
  },

  changeLogin: (event) => {
    let data = event.target.value;

    console.log('changeLogin====>', event.target.value);

    if(isNaN(data) && data != '+'){
      return ;
    }

    if(parseInt(data[0]) == 9){
      data = '8' + data;
    }

    if(data[0] == '+' && parseInt(data[1]) == '7'){
      data = data.slice(2);
      data = '8' + data;
    }

    if( parseInt(data[0]) == '7' ){
      data = data.slice(1);
      data = '8' + data;
    }

    data = data.split(' ').join('');
    data = data.split('(').join('');
    data = data.split(')').join('');
    data = data.split('-').join('');
    data = data.split('_').join('');

    console.log('changeLogin===>', data);

    set({
      loginLogin: data,
    })
  },

  setPwdLogin: (event) => {
    set({
      pwdLogin: event.target.value,
    })
  },

  checkLoginKey: (type, event) => {
    // console.log(type, event)

    console.log('checkLoginKey====>', type, event)

    if(parseInt(event.keyCode) == 13){
      if(parseInt(type) == 1){
        //this.logIn();
      }
      if(parseInt(type) == 2){
        get().sendSMS();
      }

      if(parseInt(type) == 3){
        //this.checkCode();
      }

      if(parseInt(type) == 4){
        //this.sendsmsNewLogin();
      }
    }
  },

  sendSMS: () => {

      get().navigate('loginSMSCode');

      console.log('sendSMS')

      get().createProfile();
  },

  toTime: (seconds) => {
    let date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substring(14, 19);
  },

  changeCode: (code) =>{
    set({
      code,
    })

    if(code.length === 4){
      get().checkCode();
    }
  },

  checkCode: async () => {
    const data = {
        number: get().loginLogin,
        cod: get().code, 
    };

    const res = await api('check_profile', data);

    console.log('checkCode===>', res);

    if(res.st === false){
        if(res.type === 'modal'){
          set({
              typeLogin: 'error',
              errTitle: res.title,
              errText1: res.text1,
              errText2: res.text2,
            });
        } else {
            set({
              errTextAuth: res.text
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

        // if(this.state.fromType == 'create'){
        //     setState({ 
        //         fromType: this.state.typeLogin,
        //         typeLogin: 'finish'
        //     })
        // } else {
        //     this.close();
        // }
    }
  },

  setActivePage: () => {

  },
  setActiveModalCity: (active) => {
    set({
      openCityModal: active
    })
  },
  setActiveModalAuth: (active) => {
    set({
      openAuthModal: active
    })
  },
  setErrTextAuth: (text) => {
    set({
      errTextAuth: text
    })
  },

  logIn: async (this_module, loginLogin, pwdLogin) => {
    let data = {
      type: 'site_login',
      number: loginLogin,
      pwd: pwdLogin 
    };

    let json = await api(this_module, data);

    if( json.st === false ){
      set({
        errTextAuth: json.text
      })    
    }else{
      set({
        errTextAuth: '',
        is_sms: json.is_sms,
        token: json.token,
        openAuthModal: false
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', json.token);
      }
    }
  },

  createProfile: async () => {
    const data = {
      type: 'create_profile',
      number: get().loginLogin,
      // token: get().token,
    };

    const json = await api('create_profile', data);

    console.log("createProfile=====>", json);

    if(json.st){
      set({ 
        errTextAuth: '',
        errTitle: '',
        errText1: '',
        errText2: '',
        is_sms: json.is_sms
      })
    }else{
      if( json.type == 'modal' ){
        set({
          typeLogin: 'error',
          errTitle: json.title,
          errText1: json.text1,
          errText2: json.text2,
        });
      }else{
        set({
          errTextAuth: json.text
        });
      }
    }
  },

  sendsmsNewLogin: async () => {
    let data = {
        number: get().loginLogin,
        pwd: get().pwdLogin,
        token: get().token,
    };

    get().navigate('loginSMSCode');

    const json = await api('sendsmsrp', data);

    console.log('sendsmsNewLogin ====>', json)

    if( json['st'] ){
        this.setState({ 
            errTextAuth: '',
            errTitle: '',
            errText1: '',
            errText2: '',
            is_sms: json.is_sms ?? false
        })
    }else{
        if( json.type == 'modal' ){
            this.setState({
                typeLogin: 'error',
                errTitle: json.title,
                errText1: json.text1,
                errText2: json.text2,
            });
        }else{
            this.setState({
                errTextAuth: json.text
            });
        }
    }
    
    // setTimeout( () => {
    //     this.sms1 = false;
    //     this.setState({
    //         is_load_new: false
    //     })
    // }, 300 )
}

}))

export const useCitiesStore = create((set) => ({
  thisCity: '',
  thisCityRu: '',
  thisCityList: [],
  setThisCity: (city) => {
    set({
      thisCity: city
    })
  },
  setThisCityRu: (city) => {
    set({
      thisCityRu: city
    })
  },
  setThisCityList: (cityList) => {
    set({
      thisCityList: cityList
    })
  }
}))

export const useHomeStore = create((set) => ({
  bannerList: [],
  CatsItems: [],
  getBanners: async (this_module, city) => {
    let data = {
      type: 'get_banners',
      city_id: city
    };

    const json = await api(this_module, data);
    
    set({
      bannerList: json.banners
    })
  },
  getItemsCat: async (this_module, city) => {
    let data = {
      type: 'get_items_cat',
      city_id: city
    };

    const json = await api(this_module, data);
    
    set({
      CatsItems: json.items
    })
  },
}))
