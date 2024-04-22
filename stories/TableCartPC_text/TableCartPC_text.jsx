import PropTypes from 'prop-types';
import './TableCartPC_text.scss';

const dopText = {
  rolly: 'Не забудьте про соусы, приправы и приборы',
  pizza: 'Попробуйте необычное сочетание пиццы и соуса',
  all: 'Не забудьте про соусы, приправы и приборы',
};

export const TableCartPC_text = ({ text }) => {
  return <tr className="dopText">{dopText[text]}</tr>;
};

TableCartPC_text.propTypes = {
  text: PropTypes.string.isRequired,
};
