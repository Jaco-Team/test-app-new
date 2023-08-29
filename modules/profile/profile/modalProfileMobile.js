import { useEffect, useState, useCallback } from 'react';

import useEmblaCarousel from 'embla-carousel-react';

import { useProfileStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';

import { roboto } from '@/ui/Font.js';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export default function ProfileModalMobile() {
  //console.log('render ProfileModalMobile');

  const [calendar, setCalendar] = useState(false);

  const [activeDay, setActiveDay] = useState(0);
  const [activeMonth, setActiveMonth] = useState(0);
  const [activeYear, setActiveYear] = useState(0);

  const [slidesDay, setSlidesDay] = useState([]);
  const [slidesMonth, setSlidesMonth] = useState([]);
  const [slidesYear, setSlidesYear] = useState([]);

  const [openModalProfile, setActiveProfileModal, modalName] = useProfileStore((state) => [state.openModalProfile, state.setActiveProfileModal, state.modalName]);

  const getYears = (prev, next) => {
    let result = [];

    const year = new Date().getFullYear();

    const yearPrev = Array.from({ length: prev }, (v, i) => year - prev + i + 1);

    const yearNext = Array.from({ length: next }, (v, i) => year + i + 1);

    result = [...result, ...yearPrev, ...yearNext];

    return result;
  };

  const getDays = () => {
    const year = slidesYear.find((y, i) => i === activeYear);

    const month = activeMonth < 9 ? `0${activeMonth + 1}` : `${activeMonth + 1}`;

    const result = new Date(`${year}-${month}`);

    const slidesDay = new Array(moment(result).daysInMonth()).fill(null).map((x, i) => moment().startOf('month').add(i, 'days').format('D'));

    if (activeDay > slidesDay.length - 1) {
      setActiveDay(slidesDay.length - 1);
    }

    setSlidesDay(slidesDay);
  };

  useEffect(() => {
    const slidesDay = new Array(moment().daysInMonth()).fill(null).map((x, i) => moment().startOf('month').add(i, 'days').format('D'));
    const slidesMonth = moment.months();
    const slidesYear = getYears(80, 10);

    const presentDate = moment().format('D/MMMM/YYYY').split('/');

    const activeDay = slidesDay.findIndex((day) => day === presentDate[0]);
    const activeMonth = slidesMonth.findIndex((month) => month === presentDate[1]);
    const activeYear = slidesYear.findIndex((year) => parseInt(year) === parseInt(presentDate[2]));

    setActiveDay(activeDay);
    setActiveMonth(activeMonth);
    setActiveYear(activeYear);

    setSlidesDay(slidesDay);
    setSlidesMonth(slidesMonth);
    setSlidesYear(slidesYear);
  }, []);

  useEffect(() => {
    getDays();
  }, [activeYear, activeMonth]);

  const chooseItem = (index, data) => {
    if (data === 'day') {
      setActiveDay(index);
    }
    if (data === 'month') {
      setActiveMonth(index);
    }
    if (data === 'year') {
      setActiveYear(index);
    }
  };

  const chooseData = () => {
    const day = slidesDay.find((d, i) => i === activeDay);
    const month = slidesMonth.find((m, i) => i === activeMonth);
    const year = slidesYear.find((y, i) => i === activeYear);

    console.log(day, month, year);
  };

  return (
    <Dialog
      onClose={() => { setActiveProfileModal(false, null); setCalendar(false) }}
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
              <section className="sandbox__carousel" onClick={chooseData}>
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

                <DataPicker
                  slides={slidesYear}
                  chooseItem={chooseItem}
                  data={'year'}
                  activeData={activeYear}
                />
              </section>

              <div className="divBackground" />
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const DataPicker = ({ slides, chooseItem, data, activeData }) => {
  const [active, setActive] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    axis: 'y',
    containScroll: 'trimSnaps',
  });

  const onSelect = useCallback((emblaApi) => {
    setActive(emblaApi.selectedScrollSnap());
    chooseItem(emblaApi.selectedScrollSnap(), data);
  }, []);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSelect);
      // if (activeData) {
      emblaApi.scrollTo(activeData);
      // }
    }
    setActive(activeData);
  }, [emblaApi, activeData]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div
          className="embla__container"
          style={{ width: data === 'month' ? '37.606837606838vw' : data === 'day' ? '12.820512820513vw' : '17.094017094017vw', marginRight: data === 'month' ? '2.5641025641026vw' : null}}
        >
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
