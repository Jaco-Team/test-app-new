import { useEffect, useState, useCallback } from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { flushSync } from 'react-dom';

import { useCartStore } from '@/components/store.js';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BREAKPOINTS } from '@/utils/breakpoints';

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
  const useMobilePicker = useMediaQuery(
    `screen and (max-width: ${BREAKPOINTS.mobileMax}px)`
  );

  const [
    dateTimeOrder,
    openDataTimePicker,
    setActiveDataTimePicker,
    timePreOrder,
    datePreOrder,
    getTimesPred,
    setDataTimeOrder,
  ] = useCartStore((state) => [
    state.dateTimeOrder,
    state.openDataTimePicker,
    state.setActiveDataTimePicker,
    state.timePreOrder,
    state.datePreOrder,
    state.getTimesPred,
    state.setDataTimeOrder,
  ]);

  const [check, setCheck] = useState(false);

  const [activeDate, setActiveDate] = useState(0);
  const [activeTime, setActiveTime] = useState(0);

  const [slidesDate, setSlidesDate] = useState([]);
  const [slidesTime, setSlidesTime] = useState([]);

  useEffect(() => {
    if (activeDate == 0 && check === false) {
      if (dateTimeOrder && openDataTimePicker === true) {
        const test_date = slidesDate?.findIndex(
          (i) => i.date === dateTimeOrder.date
        );

        if (test_date >= 0 && test_date !== activeDate && activeTime == 0) {
          setActiveDate(test_date);
          setCheck(true);
        }
      }
    }
  }, [openDataTimePicker, dateTimeOrder, slidesTime, slidesDate]);

  useEffect(() => {
    if (openDataTimePicker === false) {
      setCheck(false);
    }
  }, [openDataTimePicker]);

  useEffect(() => {
    if (dateTimeOrder && openDataTimePicker === true) {
      const test_time = slidesTime?.findIndex((i) => i.id === dateTimeOrder.id);

      if (test_time >= 0) {
        setActiveTime(test_time);
      }
    }
  }, [slidesTime, dateTimeOrder]);

  useEffect(() => {
    if (activeDate > 0) {
      if (dateTimeOrder && openDataTimePicker === true) {
        const test_time = slidesTime?.findIndex(
          (i) => i.id === dateTimeOrder.id
        );

        if (test_time >= 0) {
          setActiveTime(test_time);
        }
      }
    }
  }, [openDataTimePicker, dateTimeOrder, slidesTime, slidesDate, activeDate]);

  useEffect(() => {
    setSlidesDate(Array.isArray(datePreOrder) ? datePreOrder : []);
    setSlidesTime(Array.isArray(timePreOrder) ? timePreOrder : []);

    if (activeTime > (timePreOrder?.length ?? 0)) {
      setActiveTime(0);
    }
  }, [timePreOrder, datePreOrder]);

  useEffect(() => {
    if (!openDataTimePicker) {
      return;
    }

    const {
      typeOrder,
      orderPic,
      orderAddr,
      datePreOrder: storeDates,
      timePreOrder: storeTimes,
      getDataPred,
      getTimesPred,
    } = useCartStore.getState();

    const point_id = typeOrder === 'pic' ? orderPic?.id : orderAddr?.point_id;

    if (!point_id) {
      return;
    }

    const loadSlots = async () => {
      if (!Array.isArray(storeDates) || storeDates.length === 0) {
        await getDataPred();
      }

      const datesAfterLoad = useCartStore.getState().datePreOrder;

      if (!Array.isArray(datesAfterLoad) || datesAfterLoad.length === 0) {
        return;
      }

      if (!Array.isArray(storeTimes) || storeTimes.length === 0) {
        await getTimesPred(point_id, null, typeOrder === 'pic' ? 1 : 0, []);
      }
    };

    loadSlots();
  }, [openDataTimePicker]);

  const canConfirm =
    Array.isArray(slidesDate) &&
    slidesDate.length > 0 &&
    Array.isArray(slidesTime) &&
    slidesTime.length > 0;

  const chooseItem = (index, data) => {
    if (data === 'date') {
      const indexDate = slidesDate?.find((d, i) => i === index);

      if (!indexDate?.date) {
        return;
      }

      const date = dayjs(indexDate.date).format('YYYY-MM-DD');
      getTimesPred(null, date, null, []);

      setActiveDate(index);
    }

    if (data === 'time') {
      setActiveTime(index);
    }
  };

  const chooseData = () => {
    if (!canConfirm) {
      onClose();
      return;
    }

    const date = slidesDate.find((d, i) => i === activeDate) ?? slidesDate[0];
    const time = slidesTime.find((t, i) => i === activeTime) ?? slidesTime[0];

    if (!date || !time) {
      onClose();
      return;
    }

    setDataTimeOrder({ ...date, ...time });
    onClose();
  };

  const onClose = () => {
    setActiveDate(0);
    setActiveTime(0);
    setActiveDataTimePicker(false);
  };

  const handleDialogClose = (_event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      onClose();
      return;
    }

    onClose();
  };

  if (useMobilePicker) {
    return (
      <Dialog
        onClose={handleDialogClose}
        className={'cartMenuMobileDataTime ' + roboto.variable}
        open={openDataTimePicker}
        slots={Backdrop}
        slotProps={{ timeout: 500 }}
        fullWidth
      >
        <DialogContent>
          <div className="ContainerCartList">
            <div className="Line" />
            <div className="loginHeader">Выберите дату и время</div>

            <section className="sandbox__carousel">
              <DataTime
                slides={slidesDate}
                chooseItem={chooseItem}
                data={'date'}
                activeData={activeDate}
                chooseData={chooseData}
                isMobileLayout={useMobilePicker}
              />

              <DataTime
                slides={slidesTime}
                chooseItem={chooseItem}
                data={'time'}
                activeData={activeTime}
                chooseData={chooseData}
                isMobileLayout={useMobilePicker}
              />
            </section>

            <Button
              className="btnDataTime"
              variant="contained"
              onClick={chooseData}
              disabled={!canConfirm}
            >
              <span>Выбрать</span>
            </Button>

            <div className="divBackground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      onClose={handleDialogClose}
      className={'dataTimePickerPC ' + roboto.variable}
      open={openDataTimePicker}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
    >
      <Fade
        in={openDataTimePicker}
        style={{ overflow: 'hidden', height: '100%' }}
      >
        <Box className="ContainerDataPickerPC">
          <IconButton className="closeButton" onClick={onClose}>
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
              isMobileLayout={useMobilePicker}
            />

            <DataTime
              slides={slidesTime}
              chooseItem={chooseItem}
              data={'time'}
              activeData={activeTime}
              chooseData={chooseData}
              isMobileLayout={useMobilePicker}
            />
          </section>

          <Button
            className="btnDataTime"
            variant="contained"
            onClick={chooseData}
            disabled={!canConfirm}
          >
            <span>Выбрать</span>
          </Button>

          <div className="divBackground" />
        </Box>
      </Fade>
    </Dialog>
  );
}

const DataTime = ({
  slides,
  chooseItem,
  data,
  activeData,
  chooseData,
  isMobileLayout = false,
}) => {
  const isTabletLayout = useMediaQuery(
    `screen and (min-width: ${BREAKPOINTS.tabletMin}px) and (max-width: ${BREAKPOINTS.tabletMax}px)`
  );
  const [active, setActive] = useState(activeData);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      axis: 'y',
      containScroll: 'trimSnaps',
      skipSnaps: true,
    },
    [WheelGesturesPlugin()]
  );

  const onSelect = useCallback((emblaApi) => {
    if (!emblaApi) return;

    setActive(emblaApi.selectedScrollSnap());
    chooseItem(emblaApi.selectedScrollSnap(), data);
  }, []);

  const onScroll = useCallback(
    (emblaApi) => {
      if (!emblaApi) return;

      setActive(emblaApi.selectedScrollSnap());
      chooseItem(emblaApi.selectedScrollSnap(), data);
    },
    [emblaApi]
  );

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
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi && emblaApi.scrollNext();
    setActive(emblaApi.selectedScrollSnap());
    chooseItem(emblaApi.selectedScrollSnap(), data);
  }, [emblaApi]);

  const handleData = (index) => {
    //active === (slides.length - 1) && index === 0 ? scrollNext() : index < active || index === (slides.length - 1) && active === 0 ? scrollPrev() : index === active ? chooseData() : scrollNext();
    active === slides.length - 1 && index === 0
      ? scrollNext()
      : index < active || (index === slides.length - 1 && active === 0)
        ? scrollPrev()
        : index === active
          ? () => {}
          : scrollNext();
  };

  //onClick={chooseData}

  //width: data === 'date' ? '42.735042735043vw' : '35.897435897436vw'

  if (isMobileLayout) {
    return (
      <div
        className={
          slides?.length < 4 && data === 'time' ? 'embla_time' : 'embla'
        }
      >
        <div className="embla__viewport" ref={emblaRef}>
          <div
            className="embla__container"
            style={{
              width:
                data === 'date' ? '42.735042735043vw' : '42.735042735043vw',
            }}
          >
            {slides?.map((item, i) => (
              <div
                className="embla__slide"
                key={i}
                style={{
                  justifyContent:
                    data === 'date'
                      ? item?.text === 'Сегодня'
                        ? 'flex-end'
                        : 'space-between'
                      : null,
                  color:
                    i !== active ? 'rgba(0, 0, 0, 0.20)' : 'rgba(0, 0, 0, 0.8)',
                  marginLeft: '3.4188034188034vw',
                }}
              >
                {data === 'date' && item?.text !== 'Сегодня' ? (
                  <span style={{ textTransform: 'uppercase' }}>
                    {item?.dow}
                  </span>
                ) : null}
                <span>{data === 'time' ? item?.name : item?.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  //width: data === 'date' ? '12.996389891697vw' : '7.2202166064982vw'
  const arrowLeft =
    data === 'date'
      ? isTabletLayout
        ? '10.909090909091vw'
        : '8.6642599277978vw'
      : isTabletLayout
        ? '23.090909090909vw'
        : '18.343vw';
  const arrowOffset = isTabletLayout
    ? '14.545454545455vw'
    : '11.552346570397vw';
  const containerWidth = isTabletLayout
    ? '16.363636363636vw'
    : '12.996389891697vw';
  const dateMarginLeft = isTabletLayout
    ? '1.8181818181818vw'
    : '1.4440433212996vw';

  return (
    <>
      <div
        className="embla_button"
        style={{
          transform: 'rotate(90deg)',
          bottom: arrowOffset,
          left: arrowLeft,
        }}
      >
        <ArrowBackIosNewIcon onClick={scrollPrev} />
      </div>
      <div
        className={
          slides?.length < 4 && data === 'time' ? 'embla_time' : 'embla'
        }
      >
        <div className="embla__viewport" ref={emblaRef}>
          <div
            className="embla__container"
            style={{ width: data === 'date' ? containerWidth : containerWidth }}
          >
            {slides?.map((item, i) => (
              <div
                className="embla__slide"
                key={i}
                onClick={() => handleData(i)}
                style={{
                  justifyContent:
                    data === 'date'
                      ? item?.text === 'Сегодня'
                        ? 'flex-end'
                        : 'space-between'
                      : 'center',
                  color:
                    i !== active ? 'rgba(0, 0, 0, 0.20)' : 'rgba(0, 0, 0, 0.8)',
                  marginLeft: data === 'date' ? dateMarginLeft : null,
                }}
              >
                {data === 'date' && item?.text !== 'Сегодня' ? (
                  <span style={{ textTransform: 'uppercase' }}>
                    {item?.dow}
                  </span>
                ) : null}
                <span>{data === 'time' ? item?.name : item?.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="embla_button"
        style={{
          transform: 'rotate(270deg)',
          top: arrowOffset,
          left: arrowLeft,
        }}
      >
        <ArrowBackIosNewIcon onClick={scrollNext} />
      </div>
    </>
  );
};
