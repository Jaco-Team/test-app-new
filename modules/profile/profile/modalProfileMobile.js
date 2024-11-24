import { useEffect, useState, useCallback } from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { flushSync } from 'react-dom';

import { useProfileStore, useHeaderStoreNew } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';

import { roboto } from '@/ui/Font.js';

import dayjs from 'dayjs';
dayjs.locale('ru');

const mon = [
  {'id': 1, 'mon': "января"},
  {'id': 2, 'mon': "февраля"},
  {'id': 3, 'mon': "марта"},
  {'id': 4, 'mon': "апреля"},
  {'id': 5, 'mon': "мая"},
  {'id': 6, 'mon': "июня"},
  {'id': 7, 'mon': "июля"},
  {'id': 8, 'mon': "августа"},
  {'id': 9, 'mon': "сентября"},
  {'id': 10, 'mon': "октября"},
  {'id': 11, 'mon': "ноября"},
  {'id': 12, 'mon': "декабря"},
]

const data_m = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
]

export default function ProfileModalMobile({ city, this_module, setUserDate }) {

  const [calendar, setCalendar] = useState(true);

  const [activeDay, setActiveDay] = useState(0);
  const [activeMonth, setActiveMonth] = useState(0);

  const [slidesDay, setSlidesDay] = useState([]);
  const [slidesMonth, setSlidesMonth] = useState(data_m);

  const [openModalProfile, setActiveProfileModal, modalName, userInfo, setUser, updateUser] = useProfileStore((state) => [state.openModalProfile, state.setActiveProfileModal, state.modalName, state.userInfo, state.setUser, state.updateUser]);
  const [ token, signOut ] = useHeaderStoreNew( state => [ state?.token, state?.signOut ] )

  useEffect(() => {

    //const slidesDay = new Array(dayjs().daysInMonth()).fill(null).map((x, i) => (i + 1).toString());
    const slidesDay = Array.from({length: 31}, (_, i) => i + 1);

    console.log( parseInt(dayjs().format('M')), slidesMonth[ parseInt(dayjs().format('M'))-1 ] )

    //const slidesMonth = [...Array(12).keys()].map(key => new Date(0, key).toLocaleString('ru', { month: 'long' }))

    const presentDate = dayjs().format('D/MMMM').split('/');

    const activeDay = slidesDay.findIndex((day) => parseInt(day) === parseInt(presentDate[0]));
    //const activeMonth = slidesMonth.findIndex((month) => month === presentDate[1]);
    const activeMonth = parseInt(dayjs().format('M'))-1;

    setActiveDay(activeDay);
    setActiveMonth(activeMonth);

    setSlidesDay(slidesDay);
    //setSlidesMonth(slidesMonth);

  }, [calendar]);

  const chooseItem = (index, data) => {
    if (data === 'day') {
      setActiveDay(index);
    }
    if (data === 'month') {
      setActiveMonth(index);
    }
  };

  const chooseData = (userInfo) => {
    const day = slidesDay.find((d, i) => i === activeDay);
    const month = slidesMonth.find((m, i) => i === activeMonth);
    const month_number = mon.find(m => m.mon === month).id;

    

    userInfo.date_bir_d = day;
    userInfo.date_bir_m = month_number;

    setUser(userInfo);
    setUserDate(`${day} ${month}`);

    if( parseInt(day) > 0 && parseInt(month_number) > 0){
      updateUser(this_module, city, token);

      onClose();
    }
  };

  const onClose = () => {
    setActiveProfileModal(false, null); 
    setCalendar(true);
  }

  return (
    <Dialog
      onClose={onClose}
      className={'ProfileModalmodile ' + roboto.variable}
      open={openModalProfile}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      fullWidth
    >
      <DialogContent>
        <div className="ContainerProfileMobile">
          <div className="Line"></div>
          <div className="loginHeader">
            {modalName === 'phone' ? 'Номер телефона' : modalName ? 'Дата рождения' : null}
          </div>
          {modalName !== 'date_first' && modalName ? (
            <div className="infoModal">
              Чтобы изменить{' '}
              {modalName === 'phone' ? 'номер телефона' : 'дату рождения'}{' '}
              напишите в чат нашей Службы поддержки в Telegram или позвоните в
              Контакт-центр.
            </div>
          ) : null}
          {modalName !== 'date_first' && modalName ? (
            <>
              <Button className="buttonModalTelegram" variant="contained"
                //onClick={}
              >
                <span style={{ textTransform: 'capitalize' }}>Написать</span>
                <span>&nbsp;в</span>
                <span style={{ textTransform: 'capitalize' }}>&nbsp;Telegram</span>
              </Button>
              <Button className="buttonModalCall" variant="outlined"
                //onClick={}
              >
                <span>Позвонить</span>
              </Button>
            </>
          ) : null}
          {modalName === 'date_first' && !calendar ? (
            <div className="dateInfo" onClick={() => setCalendar(true)}>
              <span>Пожалуйста, будьте внимательны</span>
              <span>
                Дату рождения можно выбрать только один раз. Будьте аккуратны и
                точны при выборе даты, так как изменить её позже не получится.
              </span>
            </div>
          ) : modalName === 'date_first' && calendar ? (
            <>
              <section className="sandbox__carousel">
                <DataPicker
                  slides={slidesDay}
                  chooseItem={chooseItem}
                  data={'day'}
                  activeData={activeDay}
                />

                <DataPicker
                  slides={slidesMonth}
                  chooseItem={chooseItem}
                  data={'month'}
                  activeData={activeMonth}
                />
              </section>

              <Button className="btnDataTime" variant="contained" onClick={ () => chooseData( userInfo ) }>
                <span>Выбрать</span>
              </Button>

              <div className="divBackground" />
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const DataPicker = ({ slides, chooseItem, data, activeData }) => {
  const [active, setActive] = useState(activeData);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    axis: 'y',
    containScroll: 'trimSnaps',
    skipSnaps: true,
  }, [
    WheelGesturesPlugin(),
  ]);

  const onSelect = useCallback((emblaApi) => {
    setActive(emblaApi.selectedScrollSnap());
    chooseItem(emblaApi.selectedScrollSnap(), data);
  }, []);

  const onScroll = useCallback((emblaApi) => {
    if (!emblaApi) return;

    setActive(emblaApi.selectedScrollSnap());
    chooseItem(emblaApi.selectedScrollSnap(), data);
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSelect);
      emblaApi.scrollTo(activeData);

      onScroll();
      emblaApi.on('scroll', () => {
        flushSync(() => onScroll());
      });

      emblaApi.on('reInit', onScroll);
      emblaApi.on('reInit', onSelect);
    }
  }, [emblaApi, activeData, onSelect, onScroll]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container" style={{ width: data === 'day' ? '25.641025641026vw' : '34.188034188034vw'}}>
          {slides.map((item, i) => (
            <div className="embla__slide" key={i} style={{ color: i !== active ? 'rgba(0, 0, 0, 0.20)' : 'rgba(0, 0, 0, 0.8)' }}>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
