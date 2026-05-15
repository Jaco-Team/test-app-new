import { CloseIconMin } from '@stories/shared/compat/CoreIcons';
import './ProfileAddr.scss';

export const ProfileAddr = ({ address }: Record<string, any>) => {
  return (
    <tr className="address-card-row">
      <td>{address?.city_name}</td>
      <td>
        {address?.name_street}, д. {address?.home}, кв. {address?.kv}
        {parseInt(address?.is_main) == 1 ? <span>Основной</span> : false}
      </td>
      <td className="ChangeAddr">Изменить</td>
      <td>
        <CloseIconMin />
      </td>
    </tr>
  );
};
