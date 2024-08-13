
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
  const urlApi = `https://suggest-maps.yandex.ru/v1/suggest?text=${city} ${value}&types=street,house&attrs=uri&results=10&print_address=1&apikey=7362dcac-fc34-4224-ac0d-fb2ee70d5839`;

  try {
    const res = await fetch(urlApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.log('error', err);
  }
}
