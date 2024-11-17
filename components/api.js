
import queryString from 'query-string';
import axios from 'axios';

export function api(module = '', data = {}){
  const urlApi = 'https://api.jacochef.ru/site/public/index.php/';

  return axios.post(urlApi+module, queryString.stringify(data))
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
    const token = '15826a23-3220-4e58-acdf-05db437d0837';
    const urlApi = `https://suggest-maps.yandex.ru/v1/suggest?text=${city},${value}&types=locality,province,area,district,street,house&print_address=1&results=7&apikey=${token}`;

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
