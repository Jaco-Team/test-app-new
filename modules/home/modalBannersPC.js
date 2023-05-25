import { useState, useEffect } from 'react';

import Image from 'next/image';

import { shallow } from 'zustand/shallow';
import { useHomeStore } from '@/components/store';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { IconClose } from '@/ui/Icons';

import { roboto } from '@/ui/Font';

const ban1 = {
  id: '84',
  name: 'Состав комбо',
  title: 'Пицца Пепперони и большой сет Атлантида из 4 роллов всего за  1 330  1 125 ₽',
  for: 'Для кого',
  desk1:'Универсальное комбо на компанию из четырёх–шести человек с разными вкусами и предпочтениями — и вкусно, и сытно.',
  how: 'Как заказать',
  desk2:
    'Нажмите кнопку с ценой прямо на баннере или введите промокод «ДЖАМБО» в специальном поле для промокода в Корзине. Товары из комбо добавятся в корзину автоматически. Вы можете добавить в заказ и другие товары, скидка на комбо сохранится.',
  time: 'Акция действует до 30.03.2023 г. с понедельника по четверг (кроме дат: 14 февраля, 22 февраля, 23 февраля, 24 февраля, 7 марта, 8 марта) на доставку, самовывоз и заказы в кафе. Возможны изменения или приостановление акции. Один промокод можно применить неограниченное количество раз. Промокод не суммируется с другими акциями.',

  items: [
    {
      id: '172',
      name: 'Атлантида сет',
      tmp_desc:
        'Филадельфия Лайт, Калифорния с лососем Люкс, Акваланг запечённый унаги, Цезарь с курицей запечённый унаги',
      marc_desc: '',
      marc_desc_full: '',
      size_pizza: '0',
      count_part: '32',
      weight: '1128',
      price: '965',
      link: 'Atlantida_set',
      type: '2',
      img_new: 'Set_Atlantida',
      img_app: 'Atlantida_set',
      img_new_update: '2022_08_31_13_38_32',
      cat_id: '4',
      protein: '0,0',
      fat: '0,0',
      carbohydrates: '0,0',
      kkal: '0',
      is_new: '0',
      is_hit: '0',
      count_part_new: '4 ролла',
      info_weight: '32 шт / 1128 г',
      info_weight_dop: '32 шт, 1128 г',
    },
    {
      id: '135',
      name: 'Пепперони',
      tmp_desc: 'Колбаски пепперони, сыр моцарелла, томатный соус',
      marc_desc:
        'Остренькие колбаски пепперони, сыр моцарелла с нежным сливочным вкусом, томатный соус с базиликом',
      marc_desc_full:
        'Благодаря пикантной остроте колбасок пепперони и нежной текстуре сливочного сыра моцарелла пицца имеет свой яркий, заманчивый вкус, который превосходно дополняет традиционный томатный соус с пряностями',
      size_pizza: '35',
      count_part: '8',
      weight: '519',
      price: '465',
      link: 'Pepperoni',
      type: '1',
      img_new: 'pepperoni',
      img_app: 'Pepperoni',
      img_new_update: '2022_08_15_12_33_13',
      cat_id: '14',
      protein: '9,9',
      fat: '11,6',
      carbohydrates: '24,4',
      kkal: '240',
      is_new: '0',
      is_hit: '0',
      info_weight: '35 см / 519 г',
      info_weight_dop: '35 см, 519 г',
    },
  ],
};

const ban2 = {
  id: '80',
  name: 'Выберите пасту:',
  title: 'Паста к обеду со скидкой 15%',
  for: 'Для кого',
  desk1:
    'Лучший способ для бизнес-ланча — хоть в офисе, хоть в кафе. Сытно, вкусно, удобно, да ещё и супер-выгодно с хорошей скидкой.',
  how: 'Как заказать',
  desk2:
    'Нажмите кнопку «В корзину» прямо на баннере или введите промокод «МАМБО» в специальном поле для промокода в Корзине. Товары из комбо добавятся в корзину автоматически. Вы можете добавить в заказ и другие товары, скидка на комбо сохранится.',
  time: 'Акция действует до 30.03.2023 г. с понедельника по четверг (кроме дат: 14 февраля, 22 февраля, 23 февраля, 24 февраля, 7 марта, 8 марта) на доставку, самовывоз и заказы в кафе. Возможны изменения или приостановление акции. Один промокод можно применить неограниченное количество раз. Промокод не суммируется с другими акциями.',
  items: [
    {
      id: '269',
      name: 'Паста с курицей',
      tmp_desc: 'куриное филе, пармезан, соус белый, паста, орегано',
      marc_desc:
        'Паста из твёрдых сортов пшеницы в сочетании с кусочками нежного запечённого куриного филе, ароматным тёртым пармезаном, душистым орегано и фирменным белым соусом',
      marc_desc_full:
        'Паста из твёрдых сортов пшеницы в сочетании с кусочками нежного запечённого куриного филе, ароматным тёртым пармезаном, душистым орегано и фирменным белым соусом',
      size_pizza: '0',
      count_part: '1',
      weight: '281',
      price: '235',
      link: 'Pasta_s_kuricei',
      type: '1',
      img_new: '',
      img_app: 'Pasta_s_kuricei',
      img_new_update: '2022_12_07_12_03_00',
      cat_id: '15',
      protein: '8,7',
      fat: '11,2',
      carbohydrates: '12,4',
      kkal: '184',
      is_new: '0',
      is_hit: '0',
      info_weight: '',
      info_weight_dop: '',
    },
    {
      id: '270',
      name: 'Паста с беконом',
      tmp_desc: 'бекон, пармезан, соус белый, паста, орегано',
      marc_desc:
        'Сытная паста с кусочками ароматного бекона, фирменным белым соусом и пармезаном, обладающим приятным орехово-фруктовым послевкусием, и пряным орегано',
      marc_desc_full:
        'Сытная паста с кусочками ароматного бекона, фирменным белым соусом и пармезаном, обладающим приятным орехово-фруктовым послевкусием, и пряным орегано',
      size_pizza: '0',
      count_part: '1',
      weight: '281',
      price: '235',
      link: 'Pasta_s_bekonom',
      type: '1',
      img_new: '',
      img_app: 'Pasta_s_bekonom',
      img_new_update: '2022_12_07_12_03_36',
      cat_id: '15',
      protein: '7,2',
      fat: '19,4',
      carbohydrates: '11,7',
      kkal: '249',
      is_new: '0',
      is_hit: '0',
      info_weight: '',
      info_weight_dop: '',
    },
    {
      id: '272',
      name: 'Паста с курицей и беконом',
      tmp_desc: 'бекон, куриное филе, пармезан, бургер соус, паста, кунжут',
      marc_desc:
        'Паста из твёрдых сортов пшеницы с запечённым куриным филе, ломтиками копчёного бекона, россыпью чёрных и белых кунжутных семян, ароматным пармезаном и бургер-соусом с “дымком”',
      marc_desc_full:
        'Паста из твёрдых сортов пшеницы с запечённым куриным филе, ломтиками копчёного бекона, россыпью чёрных и белых кунжутных семян, ароматным пармезаном и бургер-соусом с “дымком”',
      size_pizza: '0',
      count_part: '1',
      weight: '282',
      price: '235',
      link: 'Pasta_s_kuricei_i_bekonom',
      type: '1',
      img_new: '',
      img_app: 'Pasta_s_kuricei_i_bekonom',
      img_new_update: '2022_12_07_12_04_16',
      cat_id: '15',
      protein: '7,6',
      fat: '13,3',
      carbohydrates: '12,8',
      kkal: '200',
      is_new: '0',
      is_hit: '0',
      info_weight: '',
      info_weight_dop: '',
    },
    {
      id: '271',
      name: 'Паста с креветками',
      tmp_desc: 'креветки, пармезан, соус белый, паста, орегано',
      marc_desc:
        'Любимая итальянская паста с отборными тигровыми креветками, натуральным пармезаном, орегано и фирменным белым соусом',
      marc_desc_full:
        'Любимая итальянская паста с отборными тигровыми креветками, натуральным пармезаном, орегано и фирменным белым соусом',
      size_pizza: '0',
      count_part: '1',
      weight: '261',
      price: '275',
      link: 'Pasta_s_krevetkami',
      type: '1',
      img_new: '',
      img_app: 'Pasta_s_krevetkami',
      img_new_update: '2022_12_07_12_04_54',
      cat_id: '15',
      protein: '9,0',
      fat: '11,0',
      carbohydrates: '11,7',
      kkal: '181',
      is_new: '0',
      is_hit: '0',
      info_weight: '',
      info_weight_dop: '',
    },
  ],
};

const ban3 = {
  id: '48',
  name: 'Укажите дату своего рождения в профиле',
  title: 'Вкусный день рождения от Жако',
  for: 'Для кого',
  desk1:
    'В качестве подарка мы пришлём промокод на бесплатный ролл Жако в личный кабинет. Он будет действовать как в День рождения, так и за 1 день до него и 19 дней после даты рождения. В общей сложности 3 недели.',
  desk3:
    'Подарок получают только те, кто указал дату родения в профиле в настройках аккаунта.',
  how: 'Как заказать',
  desk2:
    'Важно: ввести её можно только один раз. Чтобы получить бесплатный ролл, нужно сделать заказ на сумму от 499 рублей. Укажите промокод в специальном поле специальном поле во время оформления заказа – ролл Жако будет добавлен в корзину автоматически.',
  time: 'Акция распространяется на покупки в кафе, доставку и самовывоз (включая предзаказы). К каждому заказу можно применить только один промокод. Воспользоваться промокодом можно только один раз в год.',
};

const banners = [ban1, ban2, ban3];

export default function ModalBannerPC() {
  console.log('render ModalBannerPC');

  const [setActiveBanner, openModalBanner, banner] = useHomeStore((state) => [state.setActiveBanner, state.openModalBanner, state.banner], shallow);

  const [item, setItem] = useState([]);

  useEffect(() => {
    const ban = banners.find((it) => it.id === banner?.id);
    setItem(ban);
  }, [banner]);

  return (
    <Dialog
      onClose={() => setActiveBanner(false, null)}
      className={'modalBannerPC ' + roboto.variable}
      open={openModalBanner}
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      scroll='body'
    >
      <DialogContent style={{ padding: 0, overflow: 'hidden' }}>
        <Box component="div" className="BannerPC BannerFontPC">
          <IconButton style={{ position: 'absolute', left: '-3.3vw', top: '-0.6vw', backgroundColor: 'transparent' }} onClick={() => setActiveBanner(false, null)}>
            <IconClose style={{ width: '2.166vw', height: '2.166vw', overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)' }} />
          </IconButton>

          <Grid container justifyContent="center">
            <Grid className="ImgItem">
              {/* <Image alt={banner?.promo_title} src={ 'https://storage.yandexcloud.net/site-home-img/' + banner?.img_new + '3700х1000.jpg'} width={3700} height={1000} priority={true}
              /> */}
              <div className="Item"
                style={{ backgroundColor: banner?.id === '84' ? '#3faad8' : banner?.id === '80' ?  '#B570DF' : banner?.id === '48' ? '#F45773' : null}}
              >

                <div className="Group">
                  {banner?.id === '84' ? 
                    <Button variant="contained" className="ItemOther"><span>1 330</span>1 125 ₽</Button>
                  : banner?.id === '80' ? 
                    <Button variant="contained" className="ItemOther">В корзину</Button>
                  : null}

                  <Typography className="ItemOther" variant="h5" component="span">Условия акции<KeyboardArrowUpIcon /></Typography>
                </div>

              </div>

            </Grid>

            <Grid className="DescItem">
              <Grid className="FirstItem">
                <div className="Title">
                  {banner?.id === '48' ? 
                    <Typography variant="h5" component="h2" className="ItemTitle">
                      <span style={{ color: '#DD1A32', cursor: 'pointer' }}>Укажите дату</span>{' '}своего рождения в профиле
                    </Typography>
                   : 
                    <Typography variant="h5" component="h2" className="ItemTitle">{item?.name}</Typography>
                  }
                </div>

                <div className="List">
                  {item?.items?.map((item, key) => (
                    <div key={key}>
                      <div className="itemNumber">
                        <span className="ItemOther">{key + 1}.</span>
                      </div>

                      <div className="itemImg">
                        <Image alt={item?.name} src={'https://cdnimg.jacofood.ru/' + item?.img_app + '_1420x1420.jpg'} width={1420} height={1420} priority={true}/>
                      </div>

                      <div className="itemDesc">
                        <Typography className="ItemName" variant="h5" component="span">{item?.name}</Typography>
                        <Typography variant="h5" component="span" className="ItemDesk">{item?.marc_desc.length > 0 ? item?.marc_desc : item?.tmp_desc}</Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </Grid>

              <Grid className="SecondItem">
                {banner?.id === '84' ? 
                  <Typography className="ItemTitle" variant="h5" component="span" style={{ marginBottom: '1.2vw' }}>
                    Пицца Пепперони и большой сет Атлантида из 4 роллов всего заманчивый{' '}
                    <span style={{ color: '#B1B1B1', textDecoration: 'line-through', textDecorationColor: '#DD1A32', cursor: 'pointer' }}>1 330</span>{' '}1 125 ₽
                  </Typography>
                : 
                  <Typography className="ItemTitle" variant="h5" component="span" style={{ marginBottom: '1.2vw' }}>{item?.title}</Typography>
                }

                <Typography className="ItemSpan" variant="h5" component="span">{item?.for}</Typography>

                <Typography className="ItemOther" variant="h5" component="span" style={{ marginBottom: '1.2vw' }}>{item?.desk1}</Typography>

                {banner?.id === '48' ?
                  <Typography className="ItemOther" variant="h5" component="span" style={{ marginBottom: '1.2vw' }}>
                    Подарок получают только те, кто{' '}
                    <span className='TextDecor'>указал дату родения в профиле</span>{' '}
                    в настройках аккаунта.
                  </Typography>
                : null}

                <Typography className="ItemSpan" variant="h5" component="span">{item?.how}</Typography>

                {banner?.id === '84' ? 
                  <Typography className="ItemOther" variant="h5" component="span" style={{ marginBottom: '1.2vw' }}>
                    Нажмите{' '}
                    <span className='TextDecor'>кнопку с ценой</span>{' '}
                    прямо на баннере или введите промокод{' '}
                    <span className='TextDecor'>«ДЖАМБО»</span>{' '}
                    в специальном поле для промокода в Корзине. Товары из комбо добавятся в корзину автоматически. Вы можете добавить в заказ и другие товары, скидка на комбо сохранится.
                  </Typography>
                 : 
                 banner?.id === '80' ?
                  <Typography className="ItemOther" variant="h5" component="span" style={{ marginBottom: '1.2vw' }}>
                    Нажмите кнопку{' '}
                    <span className='TextDecor'>«В корзину»</span>{' '}
                    прямо на баннере или введите промокод{' '}
                    <span className='TextDecor'>«МАМБО»</span>{' '}
                    в специальном поле для промокода в Корзине. Товары из комбо добавятся в корзину автоматически. Вы можете добавить в заказ и другие товары, скидка на комбо сохранится.
                  </Typography>
                 : 
                 banner?.id === '48' ? (
                  <Typography className="ItemOther" variant="h5" component="span" style={{ marginBottom: '1.2vw' }}>
                    Важно: ввести её можно только один раз. Чтобы получить бесплатный ролл, нужно сделать заказ на сумму от 499 рублей.
                    Укажите промокод в{' '}
                    <span className='TextDecor'>специальном поле</span>{' '}
                    во время оформления заказа – ролл Жако будет добавлен в корзину автоматически.
                  </Typography>
                ) : null}

                <Typography className="ItemTime" variant="h5" component="span">{item?.time}</Typography>
              </Grid>
            </Grid>
            <Grid className="Line"></Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
