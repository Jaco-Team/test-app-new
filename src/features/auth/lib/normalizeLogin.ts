export function normalizeLogin(raw: string): string {
  let data = String(raw ?? '');

  data = data.split(' ').join('');
  data = data.split('(').join('');
  data = data.split(')').join('');
  data = data.split('-').join('');
  data = data.split('_').join('');

  if (parseInt(data[0], 10) === 9) {
    data = `8${data}`;
  }

  if (data[0] === '+' && parseInt(data[1], 10) === 7) {
    data = data.slice(2);
    data = `8${data}`;
  }

  if (parseInt(data[0], 10) === 7) {
    data = data.slice(1);
    data = `8${data}`;
  }

  return data;
}
