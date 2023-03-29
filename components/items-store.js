import { makeAutoObservable } from 'mobx';
import moment from "moment";
import queryString from 'query-string';

import config from './config';

class ItemsStoreNew {
  userToken = '';

  constructor() {
    if (typeof window !== 'undefined') {

      if( localStorage.getItem('token') ){
        setTimeout( () => {
          this.setToken( localStorage.getItem('token') );  
        }, 300 )
      }

    }
    
    makeAutoObservable (this);
  }

  setToken(userToken){
    this.userToken = userToken;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', userToken);
    }
  }

  getToken(){
    return this.userToken;
  };
}

const itemsStoreNew = new ItemsStoreNew();

export default itemsStoreNew;
export { ItemsStoreNew };