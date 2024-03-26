import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { CloseButton } from '../CloseButton/CloseButton';
import { BannerPC } from '../BannerPC/BannerPC';
import { ItemBannerPC } from '../ItemBannerPC/ItemBannerPC';

import './ModalBannerPC.scss';

const openBannerItems = [
  {
    title: 'Водопад сет',
    img_app: 'Vodopad_set',
    marc_desc:
      'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
    tmp_desc:
      'Сёрфинг запечённый, Цезарь с курицей, Цезарь с курицей запечённый, Каравелла, Ролл Жако',
    price: '1129',
  },
  {
    title: 'Цезарь с курицей запечённый унаги',
    img_app: 'Cezar_s_kuricei_zapechionnyi_unagi',
    marc_desc:
      'Куриное филе, запечённое со специями, салат айсберг, творожный сыр, румяная сырная шапочка с унаги и кунжутом',
    tmp_desc:
      'Куриное филе, запечённое со специями, салат айсберг, творожный сыр, румяная сырная шапочка с унаги и кунжутом',
    price: '229',
  },
];

export const ModalBannerPC = ({ title, img, text, typePromo, count }) => {
  return (
    <Dialog
      className="modalBannerPC"
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      scroll="body"
      open={true}
    >
      <DialogContent style={{ padding: 0, overflow: 'hidden' }}>
        <Box component="div" className="BannerPC BannerFontPC">
          <CloseButton className=' close' />

          <Grid container justifyContent="center">
            <Grid className="ImgItem">
              <BannerPC title={title} img={img} />
              <Typography className="ItemOther" variant="h5" component="span">
                Условия акции
                <KeyboardArrowUpIcon />
              </Typography>
            </Grid>

            <Grid className="DescItem">
              <Grid className="FirstItem">
                <div className="Title">
                  <Typography variant="h5" component="h2" className="ItemTitle">
                    Состав
                  </Typography>
                </div>

                <div className="List">
                  {openBannerItems?.map((item, key) => (
                    <ItemBannerPC
                      key={key}
                      data_key={key}
                      title={item.title}
                      img_app={item.img_app}
                      marc_desc={item.marc_desc}
                      tmp_desc={item.tmp_desc}
                      price={item.price}
                      typePromo={typePromo}
                      count={count}
                    />
                  ))}
                </div>

                {parseInt(typePromo) == 0 ? false : (
                  <div className="containerBTN">
                    <button>Воспользоватся акцией</button>
                  </div>
                )}
                
              </Grid>

              <Grid className="SecondItem">
                <Typography className="ItemTitle" variant="h5" component="span" style={{ marginBottom: '1.2vw' }}>{title}</Typography>

                <Grid dangerouslySetInnerHTML={{ __html: text }} />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

ModalBannerPC.propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  typePromo: PropTypes.string.isRequired,
  count: PropTypes.number,
};
