import { useEffect, useState } from 'react';

import { useContactStore, useCitiesStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { roboto } from '@/ui/Font.js';

const pointListTLT = [
  { name: 'Ленинградская 47', id: 1, area: 'Центральный район' },
  { name: 'Ворошилова 12а', id: 2, area: 'Автозаводский район' },
  { name: 'Цветной 1', id: 3, area: 'Автозаводский район' },
  { name: 'Матросова 32', id: 4, area: 'Комсомольский район' },
  { name: 'Все кафе', id: 5 },
];

const pointListSMR = [
  { name: 'Молодёжная 2', id: 1, area: 'Промышленный район' },
  { name: 'Куйбышева 113', id: 2, area: 'Самарский район' },
  { name: 'Победы 10', id: 3, area: 'Советский район' },
  { name: 'Все кафе', id: 4 },
];

const cityList = [
  { name: 'Тольятти', id: 1 },
  { name: 'Самара', id: 2 },
  { name: 'Все города', id: 3 },
];

export default function ContactsModalChoose() {
  //console.log('render ContactsModalChoose');

  const [list, setList] = useState([]);
  const [value, setValue] = useState([]);

  const [thisCityRu] = useCitiesStore((state) => [state.thisCityRu]);
  const [openModalChoose, setActiveModalChoose, nameList, point] =
    useContactStore((state) => [state.openModalChoose, state.setActiveModalChoose, state.nameList, state.point]);

  useEffect(() => {
    if (nameList === 'point' && thisCityRu === 'Тольятти') {
      setList(pointListTLT);
      setValue(point);
    }

    if (nameList === 'point' && thisCityRu === 'Самара') {
      setList(pointListSMR);
      setValue(point);
    }

    if (nameList === 'city') {
      setList(cityList);
      setValue(thisCityRu);
    }
  }, [nameList, thisCityRu]);

  return (
    <Dialog
      onClose={() => setActiveModalChoose(false)}
      className={'ContactsModalChoose ' + roboto.variable}
      open={openModalChoose}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      fullWidth
    >
      <DialogContent>
        <div className="ContainerContactsList">
          <div className="Line"></div>
          <List>
            {list.map((item, key) => (
              <ListItem key={key} style={{ background: value === item.name ? 'rgba(0, 0, 0, 0.05)' : null}}
              //onClick={() => chooseMenuItem(item)}
              >
                <div className="containerDiv">
                  {item === list.at(-1) ? <div className="circleDiv"></div> : null}
                  <span className="spanFirst">{item.name}</span>
                  {nameList === 'point' && item?.area ? <span className="spanLast">{item.area}</span> : null}
                </div>
              </ListItem>
            ))}
          </List>
        </div>
      </DialogContent>
    </Dialog>
  );
}
