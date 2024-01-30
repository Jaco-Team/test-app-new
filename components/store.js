import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';

var isoWeek = require('dayjs/plugin/isoWeek')

import { api } from './api.js';

import Cookies from 'js-cookie'

export const useCartStore = createWithEqualityFn((set, get) => ({
  items: [],
  itemsOnDops: [],
  itemsOffDops: [],
  itemsWithPromo: [],

  allItems: [],
  itemsCount: 0,
  allPrice: 0,
  allPriceWithoutPromo: null, 

  promoInfo: null,
  checkPromo: null,
  free_drive: 0,
  itemsPromo: [],

  zones: null,
  center_map: null,

  //0 - доставка / 1 - самовывоз
  typeOrder: 0,

  //0 - обычный / 1 - пред
  byTime: 0,

  // даты для заказа
  datePreOrder: null,

  // время для заказа
  timePreOrder: null,

  //адрес доставки
  orderAddr: null,

  //точка самовывоза
  orderPic: 0,

  // найти добавляемый промо товар в корзине(items)
  promoItemsFind: false,

  // открыть модалку оформления заказа на ПК
  openModalBasket: false,

  // открыть модалки в оформлении заказа на Мобилке
  openMenuCart: false,

  // название списка при оформлении заказа
  nameList: null,

  // открытие модалки чтобы выбрать время и дату заказа
  openDataTimePicker: false,

  // открыть модалку чтобы выбрать точку для оформления заказа в мобилке
  openMapPoints: false,

  // список точек для оформления заказа
  pointList: [],

  // список адресов досткаи для оформления заказа
  addrList: [],

  // id точки для оформления заказа
  point_id: null,

  // выбранное время и дата заказа
  dateTimeOrder: null,

  // тип способа оплаты
  typePay: null,

  // комментарий курьеру
  comment: '',

  // сумма доставки заказа
  summDiv: 0,

  // сдача при оплате наличными курьеру
  sdacha: 0,

  openPayForm: false,

  // установить размер сдачи при оплате наличными курьеру
  setSdacha: (sdacha) => {
    set({ sdacha })

    get().setCartLocalStorage();
  },

  // установить стоимость доставки
  setSummDiv: (summDiv) => {
    set({ summDiv })

    get().setCartLocalStorage();
  },

  // установить тип заказа Доставка/Самовывоз
  setTypeOrder: (typeOrder) => {
    set({ typeOrder })

    const cart = JSON.parse(localStorage.getItem('setCart'));

    if (typeOrder) {
      get().setTypePay({ id: 'cash', name: 'В кафе' });
      get().setSummDiv(0);
      get().setSdacha(0);
      get().changeComment('');
    } else {

      if(cart?.typePay?.name === 'В кафе') {
        get().setTypePay(null);
      }

      get().setSummDiv(get().orderAddr?.sum_div ?? 0);
    }

    get().setCartLocalStorage();
  },

  // получение данных корзины и оформления заказа
  getCartLocalStorage: () => {

    const promoInfo = get().promoInfo;

    const cart = JSON.parse(localStorage.getItem('setCart'));

    if (localStorage.getItem('setCity') && localStorage.getItem('setCity').length > 0) {
      const city = JSON.parse(localStorage.getItem('setCity'));
      
      if(city?.link === cart?.city?.link) {

        if(cart?.items?.length) {

          const allPriceWithoutPromo = cart.items.reduce((all, it) => all + it.count * it.one_price, 0);

          const itemsCount = cart.items.reduce((all, item) => all + item.count, 0);
      
          set({ items: cart.items, allPriceWithoutPromo, itemsCount });
          
          if(promoInfo) {
            get().promoCheck();
          } else {
            get().getItems();
          }
        }

        if(cart?.orderAddr) {
          set({ orderAddr: cart?.orderAddr });
        }

        if(cart?.orderPic) {
          set({ orderPic: cart?.orderPic });
        }

        if(cart?.comment) {
          set({ comment: cart?.comment });
        }

        if(cart?.typePay) {
          set({ typePay: cart?.typePay });
        }

        if(cart?.sdacha) {
          set({ sdacha: cart?.sdacha });
        }

        if(cart?.typeOrder) {
          set({ typeOrder: cart?.typeOrder });
        }

        if(cart?.dateTimeOrder) {
          set({ dateTimeOrder: cart?.dateTimeOrder });
        }

        if(cart?.summDiv) {
          set({ summDiv: cart?.summDiv });
        }
      }
    }
  },

  // сохранить заполненные/выбранные данные корзины в localStorage
  setCartLocalStorage: () => {

    const city = JSON.parse(localStorage.getItem('setCity'));

    const data = {
      city,
      items: get().items,
      sdacha: get().sdacha,
      summDiv: get().summDiv,
      comment: get().comment,
      typePay: get().typePay,
      orderPic: get().orderPic,
      orderAddr: get().orderAddr,
      typeOrder: get().typeOrder,
      dateTimeOrder: get().dateTimeOrder,
    }

    localStorage.setItem('setCart', JSON.stringify(data));
  },

  // комментарий по заказу при доставке товара
  changeComment: (event) => {

    if(event === '') {
      set({ comment: event })
    } else {
      const comment = event.target.value;

      const len = comment.split(/\r?\n|\r|\n/g)

      if(len.length > 2) {
        return
      }

      if (comment.length > 50) {
        const maxText = comment.toString().slice(0, 50);
        set({ comment: maxText })
      } else {
        set({ comment })
      }

    }

    get().setCartLocalStorage();

  },

  // установить способо оплаты заказа
  setTypePay: (typePay) => {
    set({ typePay })

    get().setCartLocalStorage();
  },
  
  // установить дату и время заказа
  setDataTimeOrder: (dateTimeOrder) => {
    set({ dateTimeOrder })

    get().setCartLocalStorage();
  },

  // выбрать адрес доставки
  setAddrDiv: (orderAddr) => {
    set({ orderAddr })

    get().setCartLocalStorage();
  },

  // выбрать точку
  setPoint: (orderPic) => {
    set({ orderPic })

    get().setCartLocalStorage();
  },

   // все товары которые есть на сайте
   setAllItems: (allItems) => {
    set({ allItems })
  },

  // изменение цен при оформлении заказа в зависимости от выбранного города
  changeAllItems: () => {

    let items = get().items;
    const allItems = get().allItems;
    const promoInfo = get().promoInfo;

    items = items.map((item) => {
      allItems.map(it => {
        if(item.item_id === it.id){
          item.one_price = it.price
        return item;
        }
      })
      return item;
    })

    const allPriceWithoutPromo = items.reduce((all, it) => all + it.count * it.one_price, 0);

    set({ items, allPriceWithoutPromo });
    
    if(promoInfo) {
      get().promoCheck();
    } else {
      get().getItems();
    }
  },

  // открытие/закрытие карты с выбором точек в Корзине мобильной версии
  setActiveCartMap: (active) => {
    set({ openMapPoints: active });
  },

  // открытие/закрытие меню Корзины c выбором даты/времени доставки в мобильной версии
  setActiveDataTimePicker: (active) => {
    set({ openDataTimePicker: active });
  },

  // открытие/закрытие меню Корзины в мобильной версии
  setActiveMenuCart: async(active, nameList) => {

    if(active) {
      const data = {
        type: 'get_point_list',
      };
      
      const json = await api('cart', data);
      set({ pointList: json.points});
    }

    set({ openMenuCart: active, nameList });
  },

  // модалка Корзины для оформления/оплаты заказа на ПК
  setActiveModalBasket: async(active) => {

    if(active) {
      const data = {
        type: 'get_point_list',
      };
      
      const json = await api('cart', data);
      set({ pointList: json.points});
    }

    set({ openModalBasket: active });
  },

  // получение дат заказа в оформлении заказа
  getDataPred: async() => {
    
    const data = {
      type: 'get_date_pred'
    };
    
    let json = await api('cart', data);

    json = json.map(date => {
      if(date.text !== "Сегодня" && date.text !== "Завтра") {
          date.text = dayjs(date.text).locale('ru').format('DD MMM').replace('.', '');
          return date
        }
      return date;
    })

    set({ datePreOrder: json });
  },

  // получение времени заказа в оформлении заказа
  getTimesPred: async(point_id, date, typeOrder, cart) => {

    const setDate = date ?? dayjs().format('YYYY-MM-DD');

    const today = dayjs().format('YYYY-MM-DD');
    
    const data = {
      type: 'get_times_pred',
      date: setDate,
      point_id: point_id ?? get().point_id,
      type_order: typeOrder ?? get().typeOrder,
      cart: JSON.stringify(cart)
    };
    
    let json = await api('cart', data);
    json = json?.filter((time) => time.name !== 'В ближайшее время');
    
    if(setDate === today && !json.length) {

      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate()+1);
      tomorrow = dayjs(tomorrow).format('YYYY-MM-DD');

      const data = {
        type: 'get_times_pred',
        date: tomorrow,
        point_id: point_id ?? get().point_id,
        type_order: typeOrder ?? get().typeOrder,
        cart: JSON.stringify(cart)
      };
      
      let json = await api('cart', data);
      json = json?.filter((time) => time.name !== 'В ближайшее время');

      let datePreOrder = get().datePreOrder;
      datePreOrder = datePreOrder?.filter((day) => day.text !== 'Сегодня')

      set({ timePreOrder: json, point_id: point_id ?? get().point_id, typeOrder: typeOrder ?? get().typeOrder, datePreOrder })

    } else {

      set({ timePreOrder: json, point_id: point_id ?? get().point_id, typeOrder: typeOrder ?? get().typeOrder  })

    }

  },

  // получение адресов доставки в оформлении заказа
  getMySavedAddr: async(city_id, token) => {
    const data = {
      type: 'get_my_saved_addr',
      city_id: city_id,
      token: token
    };
    
    const json = await api('cart', data);

    set({ addrList: json ?? [] });

    get().setCartLocalStorage();
  },

  // создание заказа
  createOrder: async(token, city_id) => {

    let data;
    const typeOrder = get().typeOrder;
    const promoName = localStorage.getItem('promo_name');

    if(typeOrder) {
      data = {
        type: 'create_order',
        token,
        city_id,
        promoName: promoName ?? '',
        sdacha: get().sdacha,
        comment: get().comment,
        typePay: get().typePay.id,
        typeOrder: get().typeOrder,
        point_id: get().orderPic.id,
        dateTimeOrder: JSON.stringify(get().dateTimeOrder ?? { date: '', name: 'В ближайшее время', id: -1 }),
        cart: JSON.stringify(get().items)
      };
    } else {
      data = {
        type: 'create_order',
        token,
        city_id,
        promoName: promoName ?? '',
        sdacha: get().sdacha,
        addr: JSON.stringify(get().orderAddr),
        point_id: get().orderAddr.point_id,
        comment: get().comment,
        typePay: get().typePay.id,
        typeOrder: get().typeOrder,
        dateTimeOrder: JSON.stringify(get().dateTimeOrder ?? { date: '', name: 'В ближайшее время', id: -1 }),
        cart: JSON.stringify(get().items)
      };
    }
    
    console.log('createOrder', data);
    
    const json = await api('cart', data);
    
    if( json.st === true ){
      if( get().typePay.id == 'online' ){

        set({
          openPayForm: true
        })

        const checkout = new window.YooMoneyCheckoutWidget({
          confirmation_token: json.pay.pay.confirmation.confirmation_token, //Токен, который перед проведением оплаты нужно получить от ЮKassa
          return_url: '', //Ссылка на страницу завершения оплаты, это может быть любая ваша страница

          error_callback: function(error) {
            console.log(error)
            //попробовать показать ошибку (смени свою почту в ЛК на ya.ru)
          }
        });

        setTimeout( () => {
          checkout.render('payment-form');
        }, 300 )
      }
    }else{
      //показать ошибку
    }

    //return json;

    get().setCartLocalStorage();
  },

  // получения товара для корзины и добавление промоТовара в корзину если есть и разделение корзины на товары без допов и доп товары
  getItems: () => {

    const items = get().items;
    const itemsWithPromo = get().itemsWithPromo;

    const allItems = itemsWithPromo.length ? [...itemsWithPromo] : [...items];

    const itemsOnDops = allItems.filter(item => item.cat_id === '7');

    const itemsOffDops = allItems.filter(item => item.cat_id !== '7');

    set({ itemsOffDops, itemsOnDops });

    get().setCartLocalStorage();

  },

  // установка данных для корзины если есть промик, в зависимости от промика
  setDataPromoBasket: () => {

    const items = get().items;
    const promoInfo = get().promoInfo;
    const itemsPromo = get().itemsPromo;

    const itemsCount = items.reduce((all, item) => all + item.count, 0);
    
    if(promoInfo?.promo_action === '2') {
      let itemsWithPromo = get().itemsWithPromo;
      itemsWithPromo = [...items, ...itemsPromo];
      const allPriceWithoutPromo = itemsWithPromo.reduce((all, it) => all + it.count * it.one_price, 0);
      set({ itemsCount: itemsCount + promoInfo.items_add.length, itemsWithPromo, allPriceWithoutPromo });
    } else {
      set({ itemsCount: itemsCount, itemsWithPromo: [] });
    }

    if(promoInfo?.promo_action === '3') {
      const promoId = promoInfo.items_on_price[0].id;
      const promo = items.find(item => item.item_id === promoId);
      if(promo) {
        set({ promoItemsFind: true });
      }
    } else {
      set({ promoItemsFind: false });
    }

    if(!promoInfo?.status_promo) {
      const allPriceWithoutPromo = items.reduce((all, it) => all + it.count * it.one_price, 0);
      set({ allPriceWithoutPromo, allPrice: 0 });
    } 

    get().getItems();
  },

  // добавления товара для корзины
  plus: (item_id, cat_id) => {
    let check = false;
    let items = get().items;
    const allItems = get().allItems;
    let itemsCount = get().itemsCount;
    const promoInfo = get().promoInfo;

    items = items.map((item) => {
      if(item.item_id === item_id){
        item.count++;
        itemsCount++;
        check = true;
        return item;
      }
      return item;
    })

    if(!check){
      const item = allItems.find(item => item.id === item_id);
      if(item){
        item.count = 1;
        itemsCount++;
        item.item_id = item.id;
        item.one_price = item.price;
        item.cat_id = cat_id;
        items = [...items,...[item]];
      }
    }

    const allPriceWithoutPromo = items.reduce((all, it) => all + it.count * it.one_price, 0);

    set({ items, itemsCount, allPriceWithoutPromo });
    
    if(promoInfo) {
      get().promoCheck();
    } else {
      get().getItems();
    }

    get().setCartLocalStorage();
  },

  // вычитание товара из корзины
  minus: (item_id) => {
    let items = get().items;
    let itemsCount = get().itemsCount;
    const promoInfo = get().promoInfo;

    items = items.reduce((newItems, item) => {
      if(item.item_id === item_id){
        item.count--;
        itemsCount--;
      }
      return item.count ? newItems = [...newItems,...[item]] : newItems;
    }, [])

    const allPriceWithoutPromo = items.reduce((all, it) => all + it.count * it.one_price, 0);

    set({ items, itemsCount, allPriceWithoutPromo });
    
    if(promoInfo) {
      get().promoCheck();
    } else {
      get().getItems();
    }

    get().setCartLocalStorage();
  },

  // получения информации о промике из БД
  getInfoPromo: async (promoName, city) => {
    
    if( promoName.length == 0 ){
      set({
        promoInfo: null,
        checkPromo: null,
      })
      
      localStorage.removeItem('promo_name')
    
      get().setDataPromoBasket();
      
    } else {
      
      const data = {
        type: 'get_promo',
        city_id: city,
        promo_name: promoName
      };
      
      const json = await api('cart', data);

      set({
        promoInfo: json
      })
      
      localStorage.setItem('promo_name', promoName)
      
      const res = get().promoCheck();
      
      set({
        checkPromo: res
      })
      
    }
  
  },

  // проверка промика
  promoCheck: () => {

    get().setDataPromoBasket();

    set({
      free_drive: 0,
      itemsPromo: []
    })
    
    let tmp = 0,
        allPrice = 0;
        
    let promo_info = get().promoInfo;
    let my_cart = get().items;  
    let allItems = get().allItems;
      
    tmp = 0;
    allPrice = 0;
    
    if(!allItems.length || !allItems) return ; 

    let new_my_cart = [];
      
    my_cart.forEach( (el_cart, key_cart) => {
      new_my_cart.push({
        name: el_cart.name,
        item_id: el_cart.item_id,
        count: el_cart.count,
        one_price: el_cart.one_price,
        all_price: parseInt(el_cart.one_price) * parseInt(el_cart.count),
        img_app: el_cart.img_app,
        cat_id: el_cart.cat_id,
      });
    })
    
    my_cart = new_my_cart;  
      
    set({
      items: my_cart
    })
      
    let cart_new_promo = [];    
    allPrice = my_cart.reduce( (sum, item) => sum + parseInt(item['all_price']), tmp );
    
    setTimeout( () => {
      set({
        allPrice: allPrice
      })
    }, 100 )

    let type_order = 0,
        point_id_dev = 0,
        point_id_pic = 0;
    
    type_order = parseInt( get().typeOrder );
    point_id_dev = get().orderAddr ? parseInt( get().orderAddr.point_id ) : 0;
    point_id_pic = parseInt( get().orderPic );
    
    let this_date = '',
        this_time = '',
        this_dow = '';
    
    dayjs.extend(isoWeek)
    
    if( parseInt( get().byTime ) == 0 ){
      this_date = dayjs(new Date()).format("YYYY-MM-DD");
      this_time = dayjs(new Date()).format("HH:mm");
      this_dow = dayjs(new Date()).isoWeekday();
    }else{
      this_date = dayjs( get().datePreOrder ).format("YYYY-MM-DD");
      this_time = dayjs( get().timePreOrder ).format("HH:mm");
      this_dow = parseInt( dayjs( get().datePreOrder ).isoWeekday() );
    }

    // console.log( 'this_date', this_date )
    // console.log( 'this_time', this_time )
    // console.log( 'this_dow', this_dow )

    if( promo_info ){
      if( promo_info.status_promo === false ){
        return {
          st: false,
          text: 'Данный промокод не найден или уже активирован'
        }
      }
      
      if( promo_info.limits.date.min && promo_info.limits.date.max ){
        if( this_date >= promo_info.limits.date.min && this_date <= promo_info.limits.date.max ){
          
        }else{
          return {
            st: false,
            text: promo_info.promo_text.false
          }
        }
      }
      
      if( promo_info.limits.time.min != 0 && promo_info.limits.time.max != 0 ){
        if( this_time >= promo_info.limits.time.min && this_time <= promo_info.limits.time.max ){
          
        }else{
          return {
            st: false,
            text: promo_info.promo_text.false
          }
        }
      }
      
      if( promo_info.limits.point_id != 0 ){
        if( (type_order == 0 && point_id_dev == promo_info.limits.point_id) || (type_order == 1 && point_id_pic == promo_info.limits.point_id) ){
          
        }else{
          return {
            st: false,
            text: 'По данному адресу промокод не работает'
          }
        }
      }
      
      if( promo_info.limits.summ.min != 0 || promo_info.limits.summ.max != 0 ){
        if( allPrice >= promo_info.limits.summ.min && (promo_info.limits.summ.max >= allPrice || promo_info.limits.summ.max == 0) ){
          
        }else{
          if( allPrice < promo_info.limits.summ.min ){
            return {
              st: false,
              text: 'Суммы заказа не достаточно для активации промокода'
            }
          }

          if( allPrice > promo_info.limits.summ.max ){
            return {
              st: false,
              text: 'Сумма заказа больше, чем лимит промокода'
            }
          }
        }
      }
      
      if( promo_info.limits.dows ){
        if( parseInt(promo_info.limits.dows[ this_dow ]) == 0 ){
          return {
            st: false,
            text: 'Промокод не действует в этот день недели'
          }
        }
      }
      
      if( promo_info.limits.type_order ){
        if( 
          parseInt( promo_info.limits.type_order ) == 1
            || 
          (parseInt( promo_info.limits.type_order ) == 3 && type_order == 0)  
            || 
          (parseInt( promo_info.limits.type_order ) == 2 && type_order == 1) ){
          
        }else{
          if( parseInt( promo_info.limits.type_order ) == 1 ){
            return {
              st: false,
              text: 'Промокод действует только на доставку'
            }
          }

          if( parseInt( promo_info.limits.type_order ) == 2 ){
            return {
              st: false,
              text: 'Промокод действует только на самовывоз'
            }
          }

          if( parseInt( promo_info.limits.type_order ) == 3 ){
            return {
              st: false,
              text: 'Промокод действует только в кафе'
            }
          }
        }
      }
      
      if( promo_info.limits.only_kassa ){
        if( parseInt( promo_info.limits.only_kassa ) == 1 ){
          return {
            st: false,
            text: 'Промокод действует только в кафе'
          }
        }
      }
      
      if( promo_info.limits.items.length > 0 ){
        let check = 0;
        let this_item = null;
        
        promo_info.limits.items.map((need_item)=>{
          this_item = new_my_cart.find( (item) => item.item_id == need_item );
          
          if( this_item ){
            check ++;
          }
        })
        
        if( promo_info.limits.items.length != check ){
          return {
            st: false,
            text: promo_info.promo_text.false
          }
        }
      }
      
      set({
        free_drive: parseInt(promo_info.limits.free_drive)
      })

      let all_price = 0,
          count_sale = 0,
          this_item = null;
      
      //скидка
      if( parseInt(promo_info.promo_action) == 1 ){
        //товары
        if( parseInt(promo_info.sale.cat_sale) == 1 ){
          count_sale = parseInt(promo_info.sale.count_sale);
          
          my_cart.forEach( (el_cart, key_cart) => {
            this_item = allItems.find( (item) => item.id == el_cart.item_id );
            
            if( parseInt(this_item.type) != 3 && parseInt(this_item.type) != 4 ){
              promo_info.sale.sale_action.forEach( (el_promo) => {
                if( parseInt(el_cart.item_id) == parseInt(el_promo) ){
                  
                  if( parseInt(promo_info.sale.type_price) == 1 ){
                    //рубли  
                    
                    if( count_sale > 0 ){
                      all_price = (parseInt(el_cart.one_price) * parseInt(el_cart.count)) - parseInt(count_sale);
                      
                      if( all_price <= 0 ){
                        all_price = 1;
                      }
                      
                      count_sale -= (parseInt(el_cart.one_price) * parseInt(el_cart.count));
                      
                      my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                      my_cart[ key_cart ].all_price = all_price;
                    }
                  }else{
                    //проценты  
                    
                    all_price = parseInt(el_cart.all_price) - ((parseInt(el_cart.all_price) / 100) * parseInt(count_sale));
                    
                    my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                    my_cart[ key_cart ].all_price = parseInt(all_price);
                  }
                }
              })
            }
          })
        }
        
        //категории
        if( parseInt(promo_info.sale.cat_sale) == 2 ){
          count_sale = parseInt(promo_info.sale.count_sale);
          
          my_cart.forEach( (el_cart, key_cart) => {
            this_item = allItems.find( (item) => item.id == el_cart.item_id );
            
            if( parseInt(this_item.type) != 3 && parseInt(this_item.type) != 4 ){
              promo_info.sale.sale_action.forEach( (el_promo) => {
                if( parseInt(this_item.cat_id) == parseInt(el_promo) ){
                  
                  if( parseInt(promo_info.sale.type_price) == 1 ){
                    //рубли  
                    
                    if( count_sale > 0 ){
                      all_price = (parseInt(el_cart.one_price) * parseInt(el_cart.count)) - parseInt(count_sale);
                      
                      if( all_price <= 0 ){
                        all_price = 1;
                      }
                      
                      count_sale -= (parseInt(el_cart.one_price) * parseInt(el_cart.count));
                      
                      my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                      my_cart[ key_cart ].all_price = all_price;
                    }
                  }else{
                    //проценты  

                    all_price = parseInt(el_cart.all_price) - ((parseInt(el_cart.all_price) / 100) * parseInt(count_sale));
                    
                    my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                    my_cart[ key_cart ].all_price = parseInt(all_price);
                  }
                }
              })
            }
          })
        }
        
        //все кроме допов и напитков
        if( parseInt(promo_info.sale.cat_sale) == 3 ){
          count_sale = parseInt(promo_info.sale.count_sale);
          
          my_cart.forEach( (el_cart, key_cart) => {
            this_item = allItems.find( (item) => item.id == el_cart.item_id );
            
            if( parseInt(this_item.type) != 3 && parseInt(this_item.type) != 4 ){
              if( parseInt(promo_info.sale.type_price) == 1 ){
                //рубли  
                
                if( count_sale > 0 ){
                  all_price = (parseInt(el_cart.one_price) * parseInt(el_cart.count)) - parseInt(count_sale);
                  
                  if( all_price <= 0 ){
                    all_price = 1;
                  }
                  
                  count_sale -= (parseInt(el_cart.one_price) * parseInt(el_cart.count));
                  
                  my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                  my_cart[ key_cart ].all_price = all_price;
                }
              }else{
                //проценты  

                all_price = parseInt(el_cart.all_price) - ((parseInt(el_cart.all_price) / 100) * parseInt(count_sale));
                
                my_cart[ key_cart ].new_one_price = parseInt(el_cart.one_price)
                my_cart[ key_cart ].all_price = parseInt(all_price);

              }
            }
          })
        }
        
        tmp = 0;
        allPrice = 0;
        
        allPrice = my_cart.reduce( (sum, item) => sum + item['all_price'], tmp );
        
        set({
          allPrice: allPrice,
          items: my_cart
        })

        get().setDataPromoBasket();

        return {
          st: true,
          text: promo_info.promo_text.true
        }
      }
      
      //добавление товара
      if( parseInt(promo_info.promo_action) == 2 ){

        promo_info.items_add.forEach((el) => {
          this_item = allItems.find( (item) => parseInt(item.id) == parseInt(el.item_id) );
          
          if( this_item ){
            cart_new_promo.push({
              item_id: el.item_id,
              count: el.count,
              one_price: this_item['price'],
              all_price: el.price,
              name: this_item['name'],
              img_app: this_item.img_app,
              disabled: true,
            });
          }
        });
        
        tmp = 0;
        allPrice = 0;
        
        allPrice = my_cart.reduce( (sum, item) => sum + parseInt(item['all_price']), tmp );
        
        tmp = 0;
        
        allPrice += cart_new_promo.reduce( (sum, item) => sum + parseInt(item['all_price']), tmp );
        
        set({
          itemsPromo: cart_new_promo,
          allPrice: allPrice
        })
      }
      
      //товар за цену
      if( parseInt(promo_info.promo_action) == 3 ){
        if( promo_info.items_on_price.length > 0 ){
          my_cart.forEach( (el_cart, key_cart) => {
            promo_info.items_on_price.forEach( (el_promo) => {
              if( parseInt(el_cart.item_id) == parseInt(el_promo.id) ){
                my_cart[ key_cart ].new_one_price = parseInt(el_promo.price)
                my_cart[ key_cart ].all_price = parseInt(el_promo.price) * parseInt(el_cart.count)
              }
            });
          });
          
          tmp = 0;
          allPrice = 0;
          
          allPrice = my_cart.reduce( (sum, item) => sum + parseInt(item['all_price']), tmp );
          
          set({
            allPrice: allPrice
          })
        }
      }
      
      set({
        items: my_cart
      })

      get().setDataPromoBasket();
      
      return {
        st: true,
        text: promo_info.promo_text.true
      }

    }else{

      get().setDataPromoBasket();

      return {
        st: false,
        text: promo_info?.promo_text?.false,
        test: promo_info
      }
    }
  },

  // получение данных для карты
  getMapCart: async (this_module, city) => {

    if(!city) return;

    const data = {
      type: 'get_addr_zone_web',
      city_id: city,
    };

    const json = await api(this_module, data);

    json.map((point) => point.image = 'default#image');

    let zoomSize;

    if(window.innerWidth < 601) {
      zoomSize = 10.6;
    } else {
      zoomSize = 11.5;
    }

    set({
      center_map: {
        center: [json[0].xy_center_map.latitude, json[0].xy_center_map.longitude],
        zoom: zoomSize,
        controls: []
      },
      zones: json,
    })

    setTimeout(() => {
      get().changePointClick(get().orderPic?.name ?? '');
    }, 100)

  },

  // изменение состояния точки по клику на Карте
  changePointClick: (addr) => {
    
    let zones = get().zones;
    const pointList = get().pointList;

    const orderPic = pointList.find(point => point.name === addr);

    const img = ymaps.templateLayoutFactory.createClass( 
      "<div class='my-img'>" +
        "<img alt='' src='/Favikon.png' />" +
      "</div>"
    )
  
    zones = zones.map(item => {
      if(item.addr === addr) {
        item.image = img;
      } else {
        item.image = 'default#image';
      }
      return item
    })

    set({ zones, orderPic: orderPic ?? null });

    get().setCartLocalStorage();

  },

}), shallow);

export const useContactStore = createWithEqualityFn((set, get) => ({
  myAddr: [],
  phone: '',
  disable: true,
  point: '',
  openModalChoose: false,
  location_user: null,
  zones: null,
  center_map: null,
  points_zone: null,

  polygon_options_default: {
      fillColor: 'rgba(53, 178, 80, 0.15)',
      strokeColor: '#35B250',
      strokeWidth: 5,
      fillOpacity: 1,
  },
  polygon_options_active: { 
    strokeColor: '#DD1A32', 
    fillColor: 'rgba(221, 26, 50, 0.15)', 
    fillOpacity: 1, 
    strokeWidth: 5 
  },
  polygon_options_none: { 
    fillColor: "#000000", 
    strokeColor: "#000000", 
    fillOpacity: 0.001, 
    strokeWidth: 0 
  },
 
  // получение геопозиции клиента на карте в мобильной версии
  getUserPosition: () => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { latitude, longitude } = coords
        
      set({ location_user: [latitude, longitude] })
     
      setTimeout(() => {
        set({ location_user: null })
      }, 300000);
      
    }, ({ message }) => {
      useHeaderStore.getState().setActiveModalAlert(true, 'Не удалось определить местоположение. '+message )
    }, {
      enableHighAccuracy: true
    })
  },

  // открытие/закрытие карты с выбором точек/городов на странице Адреса в мобильной версии
  setActiveModalChoose: (active) => {
    set({ openModalChoose: active });
  },

  // получение данных для карты
  getMap: async (this_module, city) => {

    if(!city) return;

    set({ disable: true });

    const data = {
      type: 'get_addr_zone_web',
      city_id: city,
    };

    const json = await api(this_module, data);

    let points_zone = [];

    json.map((point) => {
      if (point['zone_origin'].length > 0) {
        points_zone.push({ 
          zone: JSON.parse(point['zone_origin']), 
          addr: point.addr, 
          options: get().polygon_options_default,
        })
      return point;
      }
    })

    
    let zoomSize;
    
    if(window.innerWidth < 601) {
      zoomSize = 10.6;
    } else {
      zoomSize = 11.5;
    }

    json.forEach((point) => point.image = 'default#image');

    set({
      center_map: {
        center: [json[0].xy_center_map.latitude, json[0].xy_center_map.longitude],
        zoom: zoomSize,
        controls: []
      },
      zones: json,
      points_zone,
      phone: json[0].phone,
      myAddr: json.filter((value, index, self) => index === self.findIndex((t) => t.addr === value.addr)),
    })

    const matches = useHeaderStore.getState().matches;

    if(matches) {
      setTimeout(() => {
        get().choosePointMap(false);
      }, 300)
    }

  },
  
  // выбор точки для страницы Контакты в мобильной версии
  choosePointMap: (point) => {
    const pointList = get().myAddr;

    if(point) {
      const pointFind = pointList.find(item => item.addr === point);

      set({ openModalChoose: false })

      get().changePointClick(pointFind?.addr, 'mobile');

    } else {
      get().changePointClick(pointList[0].addr, 'mobile');
    }

  },

  // изменение состояния точки по клику
  changePointClick: (addr) => {
    
    const disable = get().disable;
    let zones = get().zones;
    let points_zone = get().points_zone;
    let myAddr = get().myAddr;

    const img = ymaps.templateLayoutFactory.createClass( 
      "<div class='my-img'>" +
        "<img alt='' src='/Favikon.png' />" +
      "</div>"
    )

    points_zone = points_zone.map(item => {
      if(disable) {
        if(item.addr === addr) {
          item.options = get().polygon_options_active;
        } else {
          item.options = get().polygon_options_default;
        }
      } 
      return item
    })

    zones = zones.map(item => {
      if(item.addr === addr) {
        item.image = img;
      } else {
        item.image = 'default#image';
      }
      return item
    })

    myAddr = myAddr.map(item => {
      if (item.addr === addr)  {
        item.color = '#DD1A32'
      } else {
        item.color = null;
      }
      return item
    });

    set({ points_zone, zones, myAddr, point: addr })

  },

  // изменение состояния карты/точек при клике вне точек
  changePointNotHover: (event) => {

    const type = event.get('target').getType();
    
    if(type === 'yandex#map') {

      const disable = get().disable;
      const zones = get().zones;
      const myAddr = get().myAddr;
      let points_zone = get().points_zone;

      zones.forEach(item => item.image = 'default#image');

      points_zone = points_zone.map(item => {
        if(disable) {
          item.options = get().polygon_options_default;
        } 
        return item
      })
      
      myAddr.forEach(addr => addr.color = null);
  
      set({ myAddr, zones, points_zone });
    }

  },

  // показывать/не показывать границы зон доставки
  disablePointsZone: () => {

    set({ disable: !get().disable });

    let points_zone = get().points_zone;
    const myAddr = get().myAddr;

    points_zone = points_zone.map(item => {
      if(get().disable) {
          const chooseAddr = myAddr.find(addr => addr?.color);
          if(chooseAddr?.addr === item.addr) {
            item.options = get().polygon_options_active;
          } else {
            item.options = get().polygon_options_default;
          }
        } else {
          item.options = get().polygon_options_none;
        }
      return item
    })
  
    set({ points_zone });
  },

}), shallow);

export const useAkciiStore = createWithEqualityFn((set) => ({
  actii: [],
  openAkcia: {},
  openModal: false,
  getData: async (this_module, city) => {
    let data = {
      type: 'get_actii',
      city_id: city,
    };

    const json = await api(this_module, data);

    set({
      actii: json,
    });
  },
  getAktia: async (id, city) => {
    let data = {
      type: 'get_one_actii',
      city_id: city,
      act_id: id,
    };

    const json = await api('akcii', data);

    set({
      openAkcia: json,
      openModal: true,
    });
  },
  closeAktia: () => {
    set({
      openAkcia: {},
      openModal: false,
    });
  },
}), shallow);

export const useProfileStore = createWithEqualityFn((set, get) => ({
  promoListActive: [],
  promoListOld: [],
  orderList: [],
  userInfo: {},
  modalOrder: {},
  openModal: false,
  openModalDelete: false,
  isOpenModalAddr: false,
  shortName: '',
  streets: [],
  allStreets: [],
  city: '',
  thisMAP: null,
  is_fetch: false,
  chooseAddrStreet: {},
  infoAboutAddr: null,
  cityList: [],
  is_fetch_save_new_addr: false,
  active_city: 0,

  center_map: null,
  zones: [],

  openModalAccount: false,
  colorAccount: {id: 6, login: "rgba(111, 190, 248, 1)", item: 'rgba(111, 190, 248, 0.1)'},

  openModalProfile: false,
  modalName: null,

  openModalAddress: false,
  streetId: 0,

  year: '',
  yearList: [],
  openModalYear: false,

  // открытие/закрытие модалки заказа в Истории заказов в мобильной версии
  setActiveModalOrder: (active, modalOrder) => {
    set({ openModal: active, modalOrder })
  },

  // установить год в Истории заказов в мобильной версии
  setYear: (year) => {
    set({ year })
  },

  // открытие/закрытие модалки выбора года в Истории заказов в мобильной версии
  setActiveModalYear: (active, list) => {
    let yearList = [];

    if(list.length) {
      yearList = list.reduce((arr, item) => {
        return arr = [...arr, ...[{name: item.year}]]
      }, [])
      set({ orderList: list }) // для тестирования
    } 

    set({ openModalYear: active, yearList })
  },


  // открытие/закрытие модалки с указанием адреса в Адресах доставки и при Оформлении заказа в мобильной версии
  setActiveAddressModal: async (active, id, city = '') => {

    if(active) {

      set({ openModalAddress: active, streetId: id, city })

      get().getMapMobile(id, city);

    } else {
      set({ openModalAddress: active, streetId: 0,  city: '', infoAboutAddr: null })
    }

  },

  // карта для модалки выбора адреса доставки в мобильной версии
  getMapMobile: async (id, city = '') => {

    let data = {
      type: 'get_data_for_streets',
      city_id: city ? city : get().city,
      street_id: id
    };

    let json = await api('profile', data);

    set({
      allStreets: json.streets,
      infoAboutAddr: json.this_info,
      cityList: json.cities,
      active_city: json.city,

      chooseAddrStreet: json.this_info,
      center_map: {
        center: json.this_info ? [json?.this_info?.xy[0], json?.this_info?.xy[1]] : [json.city_center[0], json.city_center[1]],
        zoom: 11.5,
        controls: []
      },
      zones: json.zones
    })

  },

  // открытие/закрытие модалки в Профиле в мобильной версии
  setActiveProfileModal: (active, modalName) => {
    set({ openModalProfile: active, modalName });
  },

  // открытие/закрытие модалки в Аккаунте для выбора цвета или выхода из Аккаунта в мобильной версии
  setActiveAccountModal: (active, modalName) => {
    set({ openModalAccount: active, modalName });
  },

  // изменение цвета в Аккаунте
  setAccountColor: (colorAccount) => {
    set({ colorAccount });
  },


  getPromoList: async (this_module, city, userToken) => {
    let data = {
      type: 'get_my_promos',
      city_id: city,
      user_id: userToken,
    };

    let json = await api(this_module, data);

    set({ 
      promoListActive: json.active_list,
      promoListOld: json.old_list,
      city: city
    });
  },
  getOrderList: async (this_module, city, userToken) => {
    let data = {
      type: 'get_my_orders_new',
      city_id: city,
      user_id: userToken,
    };

    let json = await api(this_module, data);

    set({
      orderList: json?.order_list,
      city: city
    });
  },
  getUserInfo: async (this_module, city, userID) => {
    let data = {
      type: 'get_my_info',
      city_id: city,
      user_id: userID,
    };

    let json = await api(this_module, data);

    set({
      shortName: json?.user?.name?.substring(0, 1) + json?.user?.fam?.substring(0, 1),
      userInfo: json?.user,
      streets: json?.streets,
      city: city
    });
  },
  setUser: (user) => {
    set({
      shortName: user?.name?.substring(0, 1) + user?.fam?.substring(0, 1),
      userInfo: user,
    });
  },
  updateUser: async (this_module, city, userToken) => {
    let data = {
      type: 'update_user',
      city_id: city,
      user_id: userToken,
      user: JSON.stringify(get().userInfo),
    };

    let json = await api(this_module, data);
  },
  getOrder: async (this_module, city, userToken, order_id, point_id) => {
    let data = {
      type: 'get_order',
      city_id: city,
      user_id: userToken,
      order_id: order_id,
      point_id: point_id,
    };

    let json = await api(this_module, data);

    set({
      modalOrder: json,
      openModal: true,
    });
  },
  closeOrder: () => {
    set({
      openModal: false,
      modalOrder: {},
    });
  },
  openModalDel: () => {
    set({
      openModalDelete: true
    })
  },
  closeModalDel: () => {
    set({
      openModalDelete: false
    })
  },
  closeModalAddr: () => {
    set({
      isOpenModalAddr: false
    })
  },
  openModalAddr: async (id, city = '') => {
    let data = {
      type: 'get_data_for_streets',
      city_id: city,
      street_id: id
    };

    let json = await api('profile', data);

    set({
      isOpenModalAddr: true,
      allStreets: json.streets,
      infoAboutAddr: json.this_info,
      cityList: json.cities,
      active_city: json.city,
      chooseAddrStreet: json.this_info,
      center_map: {
        center: json.this_info ? [json?.this_info?.xy[0], json?.this_info?.xy[1]] : [json.city_center[0], json.city_center[1]],
        zoom: 11.5,
        controls: []
      },
      zones: json.zones
    })
  },
  orderDel: async (this_module, userToken) => {
    let data = {
      type: 'close_order',
      user_id: userToken,
      order_id: get().modalOrder?.order?.order_id,
      point_id: get().modalOrder?.order?.point_id
    };

    let json = await api(this_module, data);

    if( json.st === true ){
      get().closeModalDel();
      get().closeOrder();
      get().getOrderList('zakazy', get().city, userToken);
    }
  },

  // установить выбранный адрес, если похожих адресов больше одного
  setAddress: (chooseAddrStreet) => {
    set({
      chooseAddrStreet,
      center_map: {
        center: [chooseAddrStreet?.xy[0], chooseAddrStreet?.xy[1]],
      },
    })
  },

  checkStreet: async(street, home, pd, city_id) => {
    if( get().is_fetch === true ){
      setTimeout( () => {
        get().checkStreet(street, home, pd, city_id)
      }, 500 )

      return ;

    }else{
      set({
        is_fetch: true,
        chooseAddrStreet: {}
      })
    }

    let data = {
      type: 'check_street',
      city_id: city_id,
      street: street,
      pd: pd,
      home: home
    };

    let json = await api('profile', data);

    if( json?.addrs?.length == 1 ){
      json.addrs = json?.addrs[0];

      set({
        chooseAddrStreet: json.addrs,
        center_map: {
          center: [json?.addrs?.xy[0], json?.addrs?.xy[1]],
        },
      })

    } else {

      if(json?.addrs?.length === 0) {
        useHeaderStore.getState().setActiveModalAlert(true, 'Адрес не найден, или указан не точно', false);
      }

      if(json?.addrs?.length > 1) {
        useHeaderStore.getState().setActiveModalSelectAddress(true, json.addrs);
      }

      set({
        chooseAddrStreet: {},
      })

    }

    set({
      is_fetch: false
    })
  },
  saveNewAddr: async(pd, domophome, et, kv, comment, token, is_main, nameAddr, city_id) => {

    if( get().is_fetch_save_new_addr === true ){
      return ;
    }

    if( get().is_fetch === true || Object.keys( get().chooseAddrStreet ).length == 0 ){
      setTimeout( () => {
        get().saveNewAddr(pd, domophome, et, kv, comment, token, is_main, nameAddr, city_id)
      }, 455 )

      return ;
    }

    set({
      is_fetch_save_new_addr: true
    })

    let data = {
      type: 'save_new_addr',
      token: token,
      city_id: city_id,
      street: JSON.stringify( get().chooseAddrStreet ),
      pd: pd,
      domophome: domophome === true ? 1 : 0,
      et: et,
      kv: kv,
      comment: comment,
      is_main: is_main === true ? 1 : 0,
      nameAddr: nameAddr
    };

    let json = await api('profile', data);

    if( json.st === true ){
      get().closeModalAddr();
      get().getUserInfo('profile', get().city, token);
    }

    setTimeout( () => {
      set({
        is_fetch_save_new_addr: false
      })
    }, 500 )
    
  },
  updateAddr: async(pd, domophome, et, kv, comment, token, is_main, nameAddr, city_id) => {

    if( get().is_fetch_save_new_addr === true ){
      return ;
    }

    if( get().is_fetch === true || Object.keys( get().chooseAddrStreet ).length == 0 ){
      setTimeout( () => {
        get().updateAddr(pd, domophome, et, kv, comment, token, is_main, nameAddr, city_id)
      }, 455 )

      return ;
    }

    if( Object.keys( get().chooseAddrStreet ).length == 0 ){
      return ;
    }

    set({
      is_fetch_save_new_addr: true
    })

    let data = {
      type: 'update_addr',
      token: token,
      city_id: city_id,
      street: JSON.stringify( get().chooseAddrStreet ),
      pd: pd,
      domophome: domophome === true ? 1 : 0,
      et: et,
      kv: kv,
      id: get().infoAboutAddr.id,
      comment: comment,
      is_main: is_main === true ? 1 : 0,
      nameAddr: nameAddr
    };

    let json = await api('profile', data);

    if( json.st === true ){
      get().closeModalAddr();
      get().getUserInfo('profile', get().city, token);
    }

    setTimeout( () => {
      set({
        is_fetch_save_new_addr: false
      })
    }, 500 )
    
  },
  delAddr: async(addr_id, token) => {
    let data = {
      type: 'del_my_addr',
      city_id: get().city,
      token: token,
      addr_id: addr_id,
    };

    let json = await api('profile', data);

    if( json.st === true ){
      get().getUserInfo('profile', get().city, token);
    }
  },
  updateStreetList: async(city_id) => {
    if( city_id === null || city_id == '' ){
      return ;
    }

    let data = {
      type: 'get_city_street_zone',
      city_id: city_id,
    };

    let json = await api('profile', data);

    set({
      allStreets: json.streets,
      zones: json.zones,
      //chooseAddrStreet: {}
    })

    //get().setMapZone(json.zones, json.city_center)
  },
  clearAddr: () => {
    alert( 'clearAddr' )
    set({
      chooseAddrStreet: {},
      infoAboutAddr: null
    })
  },

  setMapZone: (zones, city_center) => {
    get().thisMAP.geoObjects.removeAll();

    zones.map((zone, key)=>{
      get().thisMAP.geoObjects.add(
        new ymaps.Polygon([zone.zone], 
          {
            address: '',
            raion: '',
          }, 
          {
            fillColor: 'rgba(53, 178, 80, 0.15)',
            strokeColor: '#35B250',
            strokeWidth: 5,
            hideIconOnBalloonOpen: false,
          }
        )
      );
    })

    get().thisMAP.setCenter([city_center[0], city_center[1]], 11);
  },
  setAddrPoint: (point) => {

    let objectManager = new ymaps.ObjectManager();

    let json2 = {
      "type": "FeatureCollection",
      "features": []
    };

    json2.features.push({
      type: "Feature",
      id: -1,
      geometry: {
        type: "Point",
        coordinates: [ point[0], point[1] ]
      },
    })

    objectManager.objects.options.set({
      iconLayout: 'default#image',
      iconImageHref: '/Frame.png',
    });

    objectManager.add(json2);

    get().thisMAP.geoObjects.add(objectManager);
  },
  delAddrPoint: () => {
    let geoObjects = get().thisMAP.geoObjects;

    geoObjects.each(function (object) {
      if( object['geometry'] === null ){
        get().thisMAP.geoObjects.remove(object)
      }
    });
  }
}), shallow);

export const useFooterStore = createWithEqualityFn((set) => ({
  links: {},

  getData: async (this_module, city) => {
    let data = {
      type: 'get_page_info',
      city_id: city,
      page: 'info',
    };

    const json = await api(this_module, data);

    set({
      links: json.page,
    });
  },
}), shallow);

export const useHeaderStore = createWithEqualityFn((set, get) => ({
  activePage: '',
  openCityModal: false,
  openAuthModal: false,
  openBasket: false,
  targetBasket: null,

  errTextAuth: '',
  token: '',

  errTitle: '',
  errText1: '',
  errText2: '',

  is_sms: true,

  typeLogin: 'start',
  // typeLogin: 'startTestAuth',
  userName: '',

  timer: 89,
  timerPage: false,

  preTypeLogin: '',
  loginLogin: '',
  pwdLogin: '',
  code: '',
  genPwd: '',
  loading: false,

  matches: null,

  openCityModalList: false,

  openModalAlert: false,
  textAlert: '',
  statusAlert: false,

  isAuth: 'none',

  yandexAuthLink: '',

  doubleClickSMS: false,

  openModalSelectAddress: false,
  chooseAddrStreet: [],

  // открытие/закрытие модалки выбора адреса доставки при условии что есть два и более похожих адреса
  setActiveModalSelectAddress: (active, chooseAddrStreet) => {
    set({ openModalSelectAddress: active, chooseAddrStreet})
  },

  // установить таймер для формы авторизации
  setTimer: (timer) => {
    set({ timer })

    if(timer === 0) {
      set({ timerPage: true })
    } else {
      set({ timerPage: false })
    }
  },

  // установление таймера 
  toTime: (seconds) => {
    let date = new Date(null);
    date.setSeconds(seconds);
    date.toISOString().substring(14, 19)
    return date.toISOString().substring(14, 19);
  },

  // открытие/закрытие модалки вывода сообщения на клиенте
  setActiveModalAlert: (active, textAlert, statusAlert) => {
    set({ openModalAlert: active, textAlert, statusAlert })
  },

  // установить шиирну экрана устройства, при открытии приложения 
  setMatches: (matches) => {
    set({ matches });
  },

  setActivePage: (page) => {
    set({ activePage: page });
  },

   // открытие меню со списком городов
  setActiveModalCityList: (active) => {
    set({ openCityModalList: active });
  },

  // открытие меню с выбором города
  setActiveModalCity: (active) => {
    set({ openCityModal: active });
  },

  // открытие модального окна формы авторизации
  setActiveModalAuth: (active) => {
    set({ openAuthModal: active });
  },

  // навигация между формами авторизации
  navigate: (typeLogin) => {

    // if (typeLogin === 'create' || typeLogin === 'resetPWD') {
    //   get().gen_password();
    // }

    set({ typeLogin, errTextAuth: '', preTypeLogin: get().typeLogin });
  },

  // закрытие форм авторизации
  closeModalAuth: () => {
    set({
      openAuthModal: false,
      errTextAuth: '',
      typeLogin: 'start',
      // typeLogin: 'startTestAuth',
      preTypeLogin: '',
      loginLogin: '',
      pwdLogin: '',
      code: '',
      genPwd: '',
      timer: 89,
      timerPage: false,
    });
  },

  // изменение/введение логина/телефона
  changeLogin: (event) => {

    if(!event) {
      set({ loginLogin: '' });
      return;
    }

    let data = event.target.value;

    if (isNaN(data) && data != '+') {
      return;
    }

    if (parseInt(data[0]) == 9) {
      data = '8' + data;
    }

    if (data[0] == '+' && parseInt(data[1]) == '7') {
      data = data.slice(2);
      data = '8' + data;
    }

    if (parseInt(data[0]) == '7') {
      data = data.slice(1);
      data = '8' + data;
    }

    data = data.split(' ').join('');
    data = data.split('(').join('');
    data = data.split(')').join('');
    data = data.split('-').join('');
    data = data.split('_').join('');

    if (data.length < 12) {
      set({ loginLogin: data });
    }
  },

  // установление пароля при авторизации
  setPwdLogin: (event) => {
    if(event) {
      set({ pwdLogin: event.target.value });
    } else {
      set({ pwdLogin: event });
    }
  },

  // запуск функции при нажатии enter в зависимости от формы авторизации
  checkLoginKey: (type, event) => {

    if (parseInt(event.keyCode) == 13) {
      if (parseInt(type) == 1) {
        get().logIn();
      }
      if (parseInt(type) == 2) {
        get().createProfile();
      }

      if (parseInt(type) == 3) {
        get().sendsmsNewLogin();
      }

      // if (parseInt(type) == 4) {
      //   get().sendsmsNewLogin();
      // }
    }
  },
  
  // изменение/введение 4-х значного номера подтверждения
  changeCode: (code) => {

    set({ code });

    if (code.length < 4 || code === '') {
      set({ errTextAuth: '' });
    }

    if (code.length === 4) {
      get().checkCode();
    }
  },

  // генерация случаного пароля при регистарции
  // gen_password: () => {
  //   let genPwd = '';
  //   let symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+?';
  //   for (let i = 0; i < 10; i++) {
  //     genPwd += symbols.charAt(Math.floor(Math.random() * symbols.length));
  //   }

  //   set({ genPwd });
  // },

  // проверка логина, кода при регистрации/логировании
  checkCode: async () => {
    const data = {
      type: 'check_profile',
      number: get().loginLogin,
      cod: get().code,
    };

    const res = await api('auth', data);

    if (res.st === false) {
      set({
        errTextAuth: res.text,
      });
    } else {
      set({
        errTextAuth: '',
        errTitle: '',
        errText1: '',
        errText2: '',
      });

      if (get().preTypeLogin === 'create') {
        set({
          typeLogin: 'finish',
        });
      } else {
        get().closeModalAuth();
      }

      set({
        errTextAuth: '',
        token: res.token,
        userName: get().setNameUser(res.name),

        isAuth: 'auth'
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.token);
        Cookies.set('token', res.token, { expires: 7 }) //expires 7 days
      }
    }
  },

  signOut: (city) => {
    localStorage.removeItem('token');
    Cookies.remove('token');

    window.location.href = '/' + city;
  },

  //логирование в форме регистрации
  logIn: async () => {

    set({ loading: true });

    const data = {
      type: 'site_login',
      number: get().loginLogin,
      pwd: get().pwdLogin,
    };

    const json = await api('auth', data);

    if (json.st === false) {
      set({
        errTextAuth: json.text,
        loading: false,
      });
    } else {
      set({
        errTextAuth: '',
        is_sms: json.is_sms,
        token: json.token,
        userName: get().setNameUser(json.name),
        openAuthModal: false,
        loading: false,
        isAuth: 'auth'
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', json.token);
        Cookies.set('token', json.token, { expires: 7 }) //expires 7 days
      }
    }
  },

  checkToken: async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if( token && token.length > 0 ){
        const data = {
          type: 'check_token',
          token: token,
        };

        const json = await api('auth', data);

        if (json.st === false) {
          set({
            isAuth: 'none'
          });
        }else{
          set({
            token: token,
            userName: get().setNameUser(json.user.name),
            isAuth: 'auth'
          });
        }

        return ;
      }

      const token2 = Cookies.get('token');

      if( token2 && token2.length > 0 ){
        const data = {
          type: 'check_token',
          token: token2,
        };

        const json = await api('auth', data);

        if (json.st === false) {
          set({
            isAuth: 'none'
          });
        }else{
          set({
            token: token2,
            userName: get().setNameUser(json.user.name),
            isAuth: 'auth'
          });
        }

        return ;
      }
    }
    
  },

  // защита
  // создание нового аккаунта или получения смс кода для действующего аккаунта
  createProfile: async () => {

    if( get().doubleClickSMS === true ){
      return ;
    }

    set({
      doubleClickSMS: true
    })

    const data = {
      type: 'create_profile',
      number: get().loginLogin,
    };

    const json = await api('auth', data);

    if (json.st) {
      set({
        errTextAuth: '',
        errTitle: '',
        errText1: '',
        errText2: '',
      });
    } else {
      set({
        errTextAuth: json.text,
      });
    }

    set({
      doubleClickSMS: false
    })
  },

  // защита
  // подтвреждение новой регистрации/изменения в существующий аккаунт
  sendsmsNewLogin: async () => {

    if( get().doubleClickSMS === true ){
      return ;
    }

    set({
      doubleClickSMS: true
    })

    if(get().typeLogin !== 'loginSMSCode') {
      set({ timerPage: false, timer: 89 })
      get().navigate('loginSMSCode');
    }

    const data = {
      type: 'sendsmsrp',
      number: get().loginLogin,
      pwd: get().pwdLogin
    };

    const json = await api('auth', data);

    if (json['st']) {
      set({
        errTextAuth: '',
        errTitle: '',
        errText1: '',
        errText2: '',
      });
    } else {
      set({
        errTextAuth: json.text,
      });
    }

    set({
      doubleClickSMS: false
    })
  },

  getYandexLinkAuth: async(city) => {
    const data = {
      type: 'getYaLinkAuth',
      city: city
    };

    const json = await api('auth', data);

    set({
      yandexAuthLink: json?.link
    })
  },

  yandexAuthCheck: async(code) => {
    const data = {
      type: 'checkAuthYandex',
      code
    };

    const json = await api('auth', data);

    set({
      token: json.token,
      userName: get().setNameUser(json.name),
      isAuth: 'auth'
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', json.token);
      Cookies.set('token', json.token, { expires: 7 }) //expires 7 days
    }
  },

  // открытие/закрытие корзины на главное странице
  setActiveBasket: (active) => {
    
    if(!active) {
      set({ targetBasket: null, openBasket: active });
    } else {
      const anchorEl = document.getElementById('headerNew');
      set({ targetBasket: anchorEl, openBasket: active });
    }

  },

  // определение инициалов из имени клиента при авторизации
  setNameUser: (name) => {
    let userName = '';

    if(name){
      const nameSplit = name.split(' ');

      if(nameSplit.length === 1) {
        userName = nameSplit[0][0].toUpperCase() + nameSplit[0][1].toUpperCase()
      } else {
        userName = nameSplit[0][0].toUpperCase() + nameSplit[1][0].toUpperCase()
      }

    }

    return userName;
  }
}), shallow);

export const useCitiesStore = createWithEqualityFn((set) => ({
  thisCity: null,
  thisCityRu: '',
  thisCityList: [],
  setThisCity: (city) => {
    set({
      thisCity: city,
    });
  },
  setThisCityRu: (city) => {
    set({
      thisCityRu: city,
    });
  },
  setThisCityList: (cityList) => {
    set({
      thisCityList: cityList,
    });
  },
}), shallow);

export const useHomeStore = createWithEqualityFn((set, get) => ({
  bannerList: [],
  CatsItems: [],
  category: [],
  openItem: null,
  isOpenModal: false,
  typeModal: 'start',
  foodValue: false,

  activeSlider: true,

  openModalBanner: false,
  banner: null,
  swiper: null,

  setActiveModalCardItemMobile: (active) => {
    set({ isOpenModal: active });
  },

  getBanners: async (this_module, city) => {
    let data = {
      type: 'get_banners',
      city_id: city,
    };

    const json = await api(this_module, data);

    set({
      bannerList: json.banners,
    });
  },
  
  getItemsCat: async (this_module, city) => {
    let data = {
      type: 'get_items_cat',
      city_id: city,
    };

    const json = await api(this_module, data);

    set({
      CatsItems: json.items,
      category: json.main_cat
    });
  },

  setCategory: (cats) => {
    set({
      category: cats
    });
  },

  // получение данных выбранного товара
  getItem: async (this_module, city, item_id) => {

    let data = {
      type: 'get_item',
      city_id: city,
      item_id: item_id
    };

    const json = await api(this_module, data);

    set({
      isOpenModal: true,
      openItem: json,
      typeModal: 'start',
    });
  },

  // закрытие модального окна товара на главной странице
  closeModal: () => {
    set({
      isOpenModal: false,
      foodValue: false,
    });
  },

  // навигация между модальными окнами товара
  navigate: (typeModal) => {

    if(typeModal === 'value') {
      set({ typeModal, foodValue: true  });
    } else {
      set({ typeModal, foodValue: false });
    } 
  },

  // закрытие БЖУ/Cета товара
  closeTypeModal: (event) => {

    if(event.target.classList.contains("first_text") || !event.target.classList.value || 
       event.target.classList.contains('MuiDialog-container') || event.target.classList.contains('minus') || 
       event.target.classList.contains('plus')) {

      return;

    } else {
      get().navigate('start');
    }
  },

  // открытие/закрытие модального окна баннер на главное странице
  setActiveBanner: (active, banner, swiper) => {

    console.log( banner )

    if(swiper) set({ swiper });

    if(active) {
      get().swiper.autoplay.stop();
    } else {
      get().swiper.autoplay.start();
    }
    
    set({ 
      activeSlider: !active,
      banner, 
      openModalBanner: active 
    });

  }

}), shallow);
