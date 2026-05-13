import { CloseIconMin } from '@/ui/Icons.js';
import './ProfileAddrPC.scss';

export const ProfileAddrPC = ({ address }: Record<string, any>) => {
  return (
    <tr className="profileAddrPC">
      <td>{address?.city_name}</td>
      <td>
        {address?.name_street}, д. {address?.home}, кв. {address?.kv}
        {parseInt(address?.is_main) == 1 ? <span>Основной</span> : false}
      </td>
      <td className="ChangeAddr">Изменить</td>
      <td><CloseIconMin /></td>
    </tr>
  );
};

