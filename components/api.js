
import queryString from 'query-string';

export function api(module = '', data = {}){
  const urlApi = 'https://api.jacochef.ru/site/public/index.php/';
  //const urlApi = 'https://jacochef.ru/testv2/rest_api2/public/index.php/';

  return fetch(urlApi+module, {
    method: 'POST',
    headers: {
      'Content-Type':'application/x-www-form-urlencoded'},
    body: queryString.stringify(data)
  })
  .then((res) => res.json())
  .then((json) => {
    return json;
  })
  .catch((err) => {
    console.log('error', err);
  });
}

export async function apiAddress(city, value){
  if( city.length > 0 && value.length > 0 ){
    const urlApi = `https://suggest-maps.yandex.ru/v1/suggest?text=${city},${value}&types=locality,province,area,district,street,house&print_address=1&results=10&apikey=94d7bc02-79e2-4139-b1b3-b2d1b10130cc`;

    try {
      const res = await fetch(urlApi);
      const json = await res.json();

      return json;
    } catch (err) {
      console.log('error', err);
    }
  }
}
