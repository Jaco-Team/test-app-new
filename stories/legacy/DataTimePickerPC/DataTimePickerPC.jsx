import PropTypes from 'prop-types';
import './DataTimePickerPC.scss';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { MyButton } from '../MyButton/MyButton';

export const DataTimePickerPC = ({ slidesTime, slidesDate }) => {
  return (
    <div className="dataTimePickerPC">
      <span className="pikerLogin">Выберите дату и время</span>
      <section className="sandbox__carousel">
        <DataTime slides={slidesDate} data={'date'} active={1}/>
        <DataTime slides={slidesTime} data={'time'} active={slidesTime?.length < 4 ? 0 : 1}/>
      </section>
      <MyButton children="Выбрать" variant="cart" size="big" id='btn'/>
      <div className="divBackground" />
    </div>
  );
};

const DataTime = ({ slides, data, active }) => {
  return (
    <>
      <div className="embla_button"
        style={{ transform: 'rotate(90deg)', bottom: '11.552346570397vw', left: data === 'date' ? '8.6642599277978vw' : '15.342960288809vw'}}>
        <ArrowBackIosNewIcon />
      </div>
      <div className={slides?.length < 4 && data === 'time' ? 'embla_time' : 'embla'}>
        <div className="embla__viewport">
          <div className="embla__container"
            style={{ width: data === 'date' ? '12.996389891697vw' : '7.2202166064982vw' }}>
            {slides?.map((item, i) => (
              <div className="embla__slide"
                key={i}
                style={{
                  justifyContent: data === 'date' ? item?.text === 'Сегодня' ? 'flex-end' : 'space-between' : 'center',
                  color: i !== active ? 'rgba(0, 0, 0, 0.20)' : 'rgba(0, 0, 0, 0.8)',
                  marginLeft: data === 'date' ? '1.4440433212996vw' : null,
                }}
              >
                {data === 'date' && item?.text !== 'Сегодня' ? (
                  <span style={{ textTransform: 'uppercase' }}>
                    {item?.dow}
                  </span>
                ) : null}
                <span>{data === 'time' ? item?.id : item?.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="embla_button" style={{ transform: 'rotate(270deg)', top: '11.552346570397vw', left: data === 'date' ? '8.6642599277978vw' : '15.342960288809vw'}}>
        <ArrowBackIosNewIcon />
      </div>
    </>
  );
};

DataTimePickerPC.propTypes = {
  slidesTime: PropTypes.array,
  slidesDate: PropTypes.array,
};
