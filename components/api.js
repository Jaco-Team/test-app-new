//import queryString from 'query-string';
import qs from 'query-string';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const urlApi   = 'https://api.jacochef.ru/site/public/index.php/';

export function api(module = '', data = {}){
  const now = Math.floor(Date.now() / 1000);
  
  const payload = { ...data, ts: now };
  const bodyStr = qs.stringify(payload);

  const sig = CryptoJS.HmacSHA256(now + bodyStr, 'jaco—food')
                      .toString(CryptoJS.enc.Hex);

  const body = qs.stringify({ ...payload, sig });

  return axios.post(urlApi+module, body)
    .then( (response) => {
      
      if( typeof response.data == 'string' ){
        return {
          st: false,
          text: response.data
        };
      }

      return response.data;
    })
    .catch( (error) => {
      console.log(error);
    });
}

export async function apiAddress(city, value){
  if( city.length > 0 && value.length > 0 ){

    const urlApi = `https://suggest-maps.yandex.ru/v1/suggest?text=${city},${value}&types=geo,locality,province,area,district,street,house&print_address=1&results=7&apikey=${process.env.NEXT_PUBLIC_YANDEX_TOKEN_SUGGEST}`;

    return axios.post(urlApi)
      .then( (response) => {
        
        if( typeof response.data == 'string' ){
          return {
            st: false,
            text: response.data
          };
        }

        return response.data;
      })
      .catch( (error) => {
        console.log(error);
      });
  }
}
