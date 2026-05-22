import PropTypes from 'prop-types';
import './TableCartPC_text.scss';

const dopText = {
  rolly: 'Не забудьте про соусы, приправы и приборы',
  pizza: 'Попробуйте необычное сочетание пиццы и соуса',
  all: 'Не забудьте про соусы, приправы и приборы',
  allergens:
    'Блюда могут содержать ингредиенты, обладающие аллергенными свойствами. Если у вас есть аллергия на какой-либо продукт, пожалуйста, уточняйте состав в меню или на кассе. Обратите внимание, что мы не можем исключить или заменить ингредиенты, но с удовольствием поможем выбрать блюдо с подходящим составом.',
};

export const TableCartPC_text = ({ text }) => {
  return (
    <>
      {text === 'allergens' ? (
        <span className="dopText">{dopText[text]}</span>
      ) : (
        <tr className="dopText">{dopText[text]}</tr>
      )}
    </>
  );
};

TableCartPC_text.propTypes = {
  text: PropTypes.string.isRequired,
};
