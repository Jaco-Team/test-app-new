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

export const useHeaderStore = create((set) => ({
  activePage: '',
  openCityModal: false,
  setActivePage: () => {

  },
  setActiveModalCity: (active) => {
    set({
      openCityModal: active
    })
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