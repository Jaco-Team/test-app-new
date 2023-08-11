import { useEffect, useState, useCallback } from 'react';

import useEmblaCarousel from 'embla-carousel-react';

import { useCartStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';

import { roboto } from '@/ui/Font.js';

const slidesMin = ['00', '15', '30', '45'];
const slidesHour = ['10', '11', '12', '13', '14', '15', '16', '17'];
const slidesDay = ['Сегодня', '23 мая', '24 мая', '25 мая', '26 мая'];

export default function CartDataTimePicker() {
  const [openDataTimePicker, setActiveCartDataTimePicker, dataMenu] = useCartStore((state) => [state.openDataTimePicker, state.setActiveCartDataTimePicker, state.dataMenu]);

  const [activeDay, setActiveDay] = useState(0);
  const [activeHour, setActiveHour] = useState(0);
  const [activeMin, setActiveMin] = useState(0);

  useEffect(() => {
    if (dataMenu) {
      const data = dataMenu?.split(' ');

      const day = dataMenu?.split(' ')[0];

      const time = data.at(-1).split(':');

      const hour = time[0];

      const min = time[1];

      const indexDay = slidesDay.findIndex((d) => d === day);

      const indexHour = slidesHour.findIndex((h) => h === hour);

      const indexMin = slidesMin.findIndex((m) => m === min);

      if (indexDay) {
        setActiveDay(indexDay);
      }

      if (indexHour) {
        setActiveHour(indexHour);
      }

      if (indexMin) {
        setActiveMin(indexMin);
      }
    }
  }, [dataMenu]);

  const chooseItem = (index, data) => {
    if (data === 'day') {
      setActiveDay(index);
    }
    if (data === 'hour') {
      setActiveHour(index);
    }
    if (data === 'min') {
      setActiveMin(index);
    }
  };

  const chooseData = () => {
    const indexDay = slidesDay.find((d, i) => i === activeDay);

    const indexHour = slidesHour.find((h, i) => i === activeHour);

    const indexMin = slidesMin.find((m, i) => i === activeMin);

    console.log(indexDay, indexHour, indexMin);
  };

  // const closeDataTimePicker = () => {
  //   setActiveCartDataTimePicker(false);
  //   setActiveDay(0);
  //   setActiveHour(0);
  //   setActiveMin(0);
  // }

  return (
    <Dialog
      onClose={() => setActiveCartDataTimePicker(false)}
      className={'cartMenuMobileDataTime ' + roboto.variable}
      open={openDataTimePicker}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      fullWidth
    >
      <DialogContent>
        <div className="ContainerCartList">
          <div className="Line"></div>
          <div className="loginHeader">
            <Typography component="span">Выберите дату и время</Typography>
          </div>

          <section className="sandbox__carousel" onClick={chooseData}>
            <DataTimePicker
              slides={slidesDay}
              chooseItem={chooseItem}
              data={'day'}
              activeData={activeDay}
            />

            <DataTimePicker
              slides={slidesHour}
              chooseItem={chooseItem}
              data={'hour'}
              activeData={activeHour}
            />

            <div className="embla">
              <div className="embla__viewport">
                <div className="embla__container" style={{ width: '1.7094017094017vw' }}>
                  <div className="embla__slide" style={{ color: 'rgba(0, 0, 0, 0.20)' }}>
                    <span>:</span>
                  </div>
                  <div className="embla__slide">
                    <span>:</span>
                  </div>
                  <div className="embla__slide" style={{ color: 'rgba(0, 0, 0, 0.20)' }}>
                    <span>:</span>
                  </div>
                </div>
              </div>
            </div>

            <DataTimePicker
              slides={slidesMin}
              chooseItem={chooseItem}
              data={'min'}
              activeData={activeMin}
            />

          </section>

          <div className="divBackground" />

        </div>
      </DialogContent>
    </Dialog>
  );
}

const DataTimePicker = ({ slides, chooseItem, data, activeData }) => {
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
  }, [emblaApi, activeData]);

  return (
    <div className="embla" style={{ marginRight: data === 'day' ? '3.4188034188034vw' : null }}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container" style={{ width: data === 'day' ? '34.188034188034vw' : '13.675213675214vw' }}>
          {slides.map((item, i) => (
            <div className="embla__slide" key={i} style={{ justifyContent: data === 'day' ? 'flex-end' : 'center',
                color: i !== active ? 'rgba(0, 0, 0, 0.20)' : 'rgba(0, 0, 0, 0.8)'}}>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
