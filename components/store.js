import { create } from 'zustand'

import { api } from './api.js';

export const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))

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