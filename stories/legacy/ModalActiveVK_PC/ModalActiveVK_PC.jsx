import PropTypes from 'prop-types';
import './ModalActiveVK_PC.scss';

export const ModalActiveVK_PC = ({ link }) => {
  return (
    <div className="modalVK_PC">
      <img alt="Город" src={'/Favicon_city.png'} />
      <span>Подпишитесь на{' '}
        <a href={link} target="_blank">нашу группу Вконтакте</a>
        , где мы рассказываем о новинках, проводим конкурсы и разыгрываем вкусные призы.
      </span>
      <a className="buttons" href={link} target='_blank'>Жако Вконтакте</a>
    </div>
  );
};

ModalActiveVK_PC.propTypes = {
  link: PropTypes.string.isRequired,
};
