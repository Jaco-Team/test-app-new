import { useContactStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { roboto } from '@/ui/Font.js';

export default function ContactsModalChoose() {
  const [openModalChoose, setActiveModalChoose, myAddr, point, choosePointMap] =
    useContactStore((state) => [state.openModalChoose, state.setActiveModalChoose, state.myAddr, state.point, state.choosePointMap]);

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
            {myAddr.map((item, key) => (
              <ListItem 
                key={key} 
                style={{ background: point === item.addr ? 'rgba(0, 0, 0, 0.05)' : null}} 
                onClick={() => choosePointMap(item.addr)}
              >
                <div className="containerDiv">
                  <span className="spanFirst">{item.addr}</span>
                  <span className="spanLast">{item.raion}</span>
                </div>
              </ListItem>
            ))}
          </List>
        </div>
      </DialogContent>
    </Dialog>
  );
}
