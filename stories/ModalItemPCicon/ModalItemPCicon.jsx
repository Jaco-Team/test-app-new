import PropTypes from 'prop-types';
import './ModalItemPCicon.scss';
import { IconInfo } from '../Icons';

export const ModalItemPCicon = ({ foodValue }) => {
  return (
    <>
      {foodValue === true ? (
        <IconInfo fill="#DD1A32" />
      ) : (
        <IconInfo fill="rgba(0, 0, 0, 0.2)" />
      )}
    </>
  );
};

ModalItemPCicon.propTypes = {
  foodValue: PropTypes.bool,
};
