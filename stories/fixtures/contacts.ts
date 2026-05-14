export const contactsMenuDefaultArgs = {
  city: 'тольятти',
  points: [
    { addr: 'Ленинградская 47' },
    { addr: 'Ворошилова 12а' },
    { addr: 'Цветной 1' },
    { addr: 'Матросова 32' },
  ],
  phone: '8 (8482) 90-30-52',
  disable: true,
  active: false,
};

export const contactsMapDefaultArgs = {
  center_map: {
    center: [53.518271, 49.415377],
    zoom: 11.5,
    controls: [],
    behaviors: [
      'drag',
      'dblClickZoom',
      'rightMouseButtonMagnifier',
      'multiTouch',
    ],
  },
  zones: [
    {
      xy_point: {
        latitude: 53.505389,
        longitude: 49.414321,
      },
      xy_center_map: {
        latitude: 53.518271,
        longitude: 49.415377,
      },
      image: 'default#image',
    },
  ],
  points_zone: [
    {
      zone: [
        [53.539823, 49.380602],
        [53.524208, 49.390132],
        [53.510521, 49.38878],
        [53.496727, 49.384464],
        [53.539823, 49.380602],
      ],
      addr: 'Ленинградская 47',
      options: {
        fillColor: 'rgba(53, 178, 80, 0.15)',
        strokeColor: '#35B250',
        strokeWidth: 5,
        fillOpacity: 1,
      },
    },
  ],
  type_map: 'default',
};
