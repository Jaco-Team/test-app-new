// @ts-nocheck
import { BreadСrumbsPC } from '../../../shared/ui/breadcrumbs/BreadСrumbsPC';
import { MySwitch } from '../../../shared/ui/switch/MySwitch';
import { ProfileAddrPC } from '../../../entities/profile/ui/address-card/ProfileAddrPC';
import { MyButton } from '../../../shared/ui/button/MyButton';
import MySelect from '../../../shared/ui/select/MySelect';
import MyTextInput from '../../../shared/ui/text-input/MyTextInput';

import './ProfilePagePC.scss';

export const ProfilePagePC = ({ header, user, address, footer, data }) => {
  const addrList = address ? Array.from(Array(4).keys()).fill(address) : [];

  const arr_m = [
    { name: 'Января', id: 1 },
    { name: 'Февраля', id: 2 },
    { name: 'Марта', id: 3 },
    { name: 'Апреля', id: 4 },
    { name: 'Мая', id: 5 },
    { name: 'Июня', id: 6 },
    { name: 'Июля', id: 7 },
    { name: 'Августа', id: 8 },
    { name: 'Сентября', id: 9 },
    { name: 'Октября', id: 10 },
    { name: 'Ноября', id: 11 },
    { name: 'Декабря', id: 12 },
  ];

  const arr_d = [];

  for (let i = 1; i <= 31; i++) {
    arr_d.push({
      name: i,
      id: i,
    });
  }

  return (
    <>
      {header ? null : null}
      <div className="profilePC">
        <div className="profileContainerPC">
          <div className="profile_title">Личные данные</div>
          <div className="profile_data">
            <span>И</span>
            <div>
              <MyTextInput placeholder="Имя" value={user.name} />
              {/* <MyTextInput placeholder="Фамилия" value={user.fam} /> */}
              <MyTextInput placeholder="" readOnly={true} value={user.login} />
              <MyTextInput placeholder="name@mail.ru" value={user.mail} />
            </div>
          </div>
          <div className="profile_check">
            <span className="text">Хочу получать СМС с акциями и скидками</span>
            <MySwitch type="ios" />
          </div>
          <div className="profile_date">
            <div className="promokod">Подарим промокод на бесплатный ролл ко дню рождения.</div>
            <div>
              <div>Дата вашего рождения</div>
              <div className="profile_select">
                <MySelect
                  data={arr_d}
                  disabled={user?.date_bir_m > 0 && user?.date_bir_d > 0 ? true : false}
                  value={user.date_bir_d}
                />
                <MySelect
                  data={arr_m}
                  disabled={user?.date_bir_m > 0 && user?.date_bir_d > 0 ? true : false}
                  value={user.date_bir_m}
                />
              </div>
              <div className="last_text">Дату рождения можно выбрать только один раз. Будьте внимательны, так как изменить её позже не получится.</div>
            </div>
          </div>
          <table className="profile_table">
            <thead>
              <tr>
                <th>Мои адреса</th>
                <th>Добавить</th>
              </tr>
            </thead>
            <tbody>
              {addrList.map((addr, key) => (
                <ProfileAddrPC key={key} {...addr} />
              ))}
            </tbody>
          </table>
          <MyButton children="Выйти" variant="secondary" size="large" />
        </div>
        <div>
          <BreadСrumbsPC {...data} />
        </div>
      </div>
      {footer ? null : null}
    </>
  );
};

