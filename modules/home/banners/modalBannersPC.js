import Image from 'next/image';

import { useHomeStore } from '@/components/store';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { IconClose } from '@/ui/Icons';

import { roboto } from '@/ui/Font';

export default function ModalBannerPC() {
  // console.log('render ModalBannerPC');

  const [setActiveBanner, openModalBanner, banner] = useHomeStore((state) => [state.setActiveBanner, state.openModalBanner, state.banner]);

  const items = banner?.info?.items_on_price?.length ? banner?.info?.items_on_price : banner?.info?.items_add?.length ? banner?.info?.items_add
    : [];

  return (
    <Dialog
      onClose={() => setActiveBanner(false, null)}
      className={'modalBannerPC ' + roboto.variable}
      open={openModalBanner}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      scroll="body"
    >
      <DialogContent style={{ padding: 0, overflow: 'hidden' }}>
        <Box component="div" className="BannerPC BannerFontPC">
          <IconButton className="iconBTN" onClick={() => setActiveBanner(false, null)}>
            <IconClose />
          </IconButton>

          <Grid container justifyContent="center">
            <Grid className="ImgItem">
              <Image alt="ImgItem" src={'https://storage.yandexcloud.net/site-home-img/' + banner?.img_new + '3700х1000.jpg'}
                width={3700}
                height={1000}
                priority={true}
              />
              <Typography className="ItemOther" variant="h5" component="span" onClick={() => setActiveBanner(false, null)}>
                Условия акции
                <KeyboardArrowUpIcon />
              </Typography>
            </Grid>

            <Grid className="erid">
              <Typography variant="h5" component="h2" className="ItemOther" style={{ color: 'rgba(0, 0, 0, 0.20)' }}>
                {`Реклама, Jacofood.ru, erid: ${banner?.erid}`}
              </Typography>
            </Grid>

            <Grid className="DescItem">
              <Grid className="FirstItem">
                <div className="Title">
                  {items?.length ? <Typography variant="h5" component="h2" className="ItemTitle">Состав</Typography> : null}
                </div>

                <div className="List">
                  {items?.map((item, key) => (
                    <div key={key}>
                      <div className="itemNumber">
                        <span className="ItemOther">{key + 1}.</span>
                      </div>

                      <div className="itemImg">
                        {item?.img_app ? (
                          <Image alt={item?.name} src={'https://cdnimg.jacofood.ru/' + item?.img_app + '_1420x1420.jpg'}
                            width={1420}
                            height={1420}
                            priority={true}
                          />
                        ) : null}
                      </div>

                      <div className="itemDesc">
                        <Typography className="ItemName" variant="h5" component="span">
                          {item?.name}
                        </Typography>
                        {/* <Typography variant="h5" component="span" className="ItemDesk">
                          {item?.marc_desc.length > 0 ? item?.marc_desc : item?.tmp_desc}</Typography> */}
                      </div>
                    </div>
                  ))}
                </div>
              </Grid>

              <Grid className="SecondItem">
                <Typography className="ItemTitle" variant="h5" component="span" style={{ marginBottom: '1.2vw' }}>
                  {banner?.promo_title}
                </Typography>

                {banner && banner?.text ? (
                  <Grid dangerouslySetInnerHTML={{ __html: banner?.text }} />
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
