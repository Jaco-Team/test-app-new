import { useEffect, useState, useCallback } from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { flushSync } from 'react-dom';

import { useCartStore, useHeaderStore } from '@/components/store.js';

import { IconClose } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { Fade } from '@/ui/Fade';
import { roboto } from '@/ui/Font.js';

import dayjs from 'dayjs';

export default function DataTimePicker() {
  const [matches] = useHeaderStore((state) => [state.matches]);

  const [openDataTimePicker, setActiveDataTimePicker, timePreOrder, datePreOrder, getTimesPred, setDataTimeOrder] = useCartStore((state) => [
    state.openDataTimePicker, state.setActiveDataTimePicker, state.timePreOrder, state.datePreOrder, state.getTimesPred, state.setDataTimeOrder]);

  const [activeDate, setActiveDate] = useState(0);
  const [activeTime, setActiveTime] = useState(0);

  const [slidesDate, setSlidesDate] = useState(null);
  const [slidesTime, setSlidesTime] = useState(null);

  useEffect(() => {
   
    setSlidesDate(datePreOrder);
    setSlidesTime(timePreOrder);

    if(activeTime > timePreOrder?.length) {
      setActiveTime(0);
    }
    
  }, [timePreOrder, datePreOrder]);

  const chooseItem = (index, data) => {

    if (data === 'date') {

      const indexDate = slidesDate.find((d, i) => i === index);
      const date = dayjs(indexDate.date).format('YYYY-MM-DD');
      getTimesPred(null, date, null, []);

      setActiveDate(index);
    }
    if (data === 'time') {
      setActiveTime(index);
    }
  };

  const chooseData = () => {
    const date = slidesDate.find((d, i) => i === activeDate);

    const time = slidesTime.find((t, i) => i === activeTime) ?? slidesTime[0];

    const dateTimeOrder = { ...date, ...time };

    setDataTimeOrder(dateTimeOrder);

    onClose();
  };

  const onClose = () => {
    setActiveDate(0);
    setActiveTime(0);
    setActiveDataTimePicker(false);
  };

  return (
    <>
      {matches ? (
        <Dialog
          onClose={chooseData}
          className={'cartMenuMobileDataTime ' + roboto.variable}
          open={openDataTimePicker}
          slots={Backdrop}
          slotProps={{ timeout: 500 }}
          fullWidth
        >
          <DialogContent>
            <div className="ContainerCartList">
              <div className="Line"></div>
              <div className="loginHeader">Выберите дату и время</div>

              <section className="sandbox__carousel">
                <DataTime
                  slides={slidesDate}
                  chooseItem={chooseItem}
                  data={'date'}
                  activeData={activeDate}
                  chooseData={chooseData}
                />

                <DataTime
                  slides={slidesTime}
                  chooseItem={chooseItem}
                  data={'time'}
                  activeData={activeTime}
                  chooseData={chooseData}
                />
              </section>

              <div className="divBackground" />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog
          onClose={chooseData}
          className={'dataTimePickerPC ' + roboto.variable}
          open={openDataTimePicker}
          slots={Backdrop}
          slotProps={{ timeout: 500 }}
        >
          <Fade in={openDataTimePicker} style={{ overflow: 'hidden', height: '100%' }}>
            <Box className="ContainerDataPickerPC">
              <IconButton className="closeButton" onClick={chooseData}>
                <IconClose />
              </IconButton>

              <div className="pikerLogin">Выберите дату и время</div>

              <section className="sandbox__carousel">
                <DataTime
                  slides={slidesDate}
                  chooseItem={chooseItem}
                  data={'date'}
                  activeData={activeDate}
                  chooseData={chooseData}
                />

                <DataTime
                  slides={slidesTime}
                  chooseItem={chooseItem}
                  data={'time'}
                  activeData={activeTime}
                  chooseData={chooseData}

                />
              </section>

              <Button className="btnDataTime" variant="contained" onClick={chooseData}>
                <span>Выбрать</span>
              </Button>

              <div className="divBackground" />
            </Box>
          </Fade>
        </Dialog>
      )}
    </>
  );
}

const DataTime = ({ slides, chooseItem, data, activeData, chooseData }) => {
  const [matches] = useHeaderStore((state) => [state.matches]);

  const [active, setActive] = useState(activeData);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    axis: 'y',
    containScroll: 'trimSnaps',
    skipSnaps: true,
  },[
    WheelGesturesPlugin(),
  ]);

  const onSelect = useCallback((emblaApi) => {
    if (!emblaApi) return;

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

    setActive(activeData);
  }, [emblaApi, activeData, onSelect, onScroll]);

  const scrollPrev = useCallback(() => {
    emblaApi && emblaApi.scrollPrev();
    setActive(emblaApi.selectedScrollSnap());
    chooseItem(emblaApi.selectedScrollSnap(), data);
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi && emblaApi.scrollNext();
    setActive(emblaApi.selectedScrollSnap());
    chooseItem(emblaApi.selectedScrollSnap(), data);
  }, [emblaApi])

  const handleData = (index) => {
    active === (slides.length - 1) && index === 0 ? scrollNext() : index < active || index === (slides.length - 1) && active === 0 ? scrollPrev() : index === active ? chooseData() : scrollNext();
  }

  return (
    <>
      {matches ? (
        <div className={slides?.length < 4 && data === 'time' ? 'embla_time' : 'embla'} onClick={chooseData}>
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container" style={{ width: data === 'date' ? '42.735042735043vw' : '35.897435897436vw' }}>
              {slides?.map((item, i) => (
                <div className="embla__slide" key={i}
                  style={{ justifyContent: data === 'date' ? item.text === 'Сегодня' ? 'flex-end' : 'space-between' : null,
                           color: i !== active ? 'rgba(0, 0, 0, 0.20)' : 'rgba(0, 0, 0, 0.8)',
                           marginLeft: '3.4188034188034vw',
                        }}>
                  {data === 'date' && item.text !== 'Сегодня' ? <span style={{ textTransform: 'uppercase' }}>{item.dow}</span> : null}
                  <span>{data === 'time' ? item.id : item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className='embla_button' 
            style={{transform: 'rotate(90deg)', bottom: '11.552346570397vw', left: data === 'date' ? '8.6642599277978vw' : '15.342960288809vw'}}>
            <ArrowBackIosNewIcon onClick={scrollPrev} />
          </div>
          <div className={slides?.length < 4 && data === 'time' ? 'embla_time' : 'embla'}>
            <div className="embla__viewport" ref={emblaRef}>
              <div className="embla__container" style={{ width: data === 'date' ? '12.996389891697vw' : '7.2202166064982vw' }}>
                {slides?.map((item, i) => 
                  <div className="embla__slide" 
                       key={i}
                       onClick={() => handleData(i)}
                       style={{ justifyContent: data === 'date' ? item.text === 'Сегодня' ? 'flex-end' : 'space-between' : 'center',
                                color: i !== active ? 'rgba(0, 0, 0, 0.20)' : 'rgba(0, 0, 0, 0.8)',
                                marginLeft: data === 'date' ? '1.4440433212996vw' : null}}>
                    {data === 'date' && item.text !== 'Сегодня' ? <span style={{ textTransform: 'uppercase' }}>{item.dow}</span> : null}
                    <span>{data === 'time' ? item.id : item.text}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='embla_button' 
            style={{transform: 'rotate(270deg)', top: '11.552346570397vw', left: data === 'date' ? '8.6642599277978vw' : '15.342960288809vw'}}>
            <ArrowBackIosNewIcon onClick={scrollNext} />
          </div>
        </>
      )}
    </>
  );
};
