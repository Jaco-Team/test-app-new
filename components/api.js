
import queryString from 'query-string';

export function api(module = '', data = {}){
  const urlApi = 'http://api.jacochef.ru/site/public/index.php/';

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
    console.log(err);
  });
}