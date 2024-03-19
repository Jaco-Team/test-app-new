import { useProfileStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { roboto } from '@/ui/Font.js';

export default function ModalOrderYear() {
  const [openModalYear, setActiveModalYear, year, yearList, setYear] =
    useProfileStore((state) => [state.openModalYear, state.setActiveModalYear, state.year, state.yearList, state.setYear]);

  const chooseYear = (year) => {
    setActiveModalYear(false, []);
    setYear(year);
  };

  return (
    <Dialog
      onClose={() => setActiveModalYear(false, [])}
      className={'ZakazyModalYear ' + roboto.variable}
      open={openModalYear}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      fullWidth
    >
      <DialogContent>
        <div className="ContainerZakazyModalYear">
          <div className="Line"></div>
          <div className="loginHeader">Выберите год</div>
          <List>
            {yearList.map((item, key) => (
              <ListItem onClick={() => chooseYear(item.name)} key={key} style={{ background: year ? year === item.name ? 'rgba(0, 0, 0, 0.05)' : null : null }}>
                <span>{item.name}</span>
              </ListItem>
            ))}
          </List>
        </div>
      </DialogContent>
    </Dialog>
  );
}
