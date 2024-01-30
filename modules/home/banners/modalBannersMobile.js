import Image from 'next/image';

import { useHomeStore } from '@/components/store';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { roboto } from '@/ui/Font';

export default function ModalBannerMobile() {
  // console.log('render ModalBannerMobile');

  const [setActiveBanner, openModalBanner, banner] = useHomeStore((state) => [state.setActiveBanner, state.openModalBanner, state.banner]);

  const items = banner?.info?.items_on_price?.length ? banner?.info?.items_on_price : banner?.info?.items_add?.length ? banner?.info?.items_add 
    : [];

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={openModalBanner}
      onClose={() => setActiveBanner(false, null)}
      onOpen={() => {}}
      id="modalBannerMobile"
      className={roboto.variable}
      disableSwipeToOpen
    >
      <Box component="div" className="BannerMobile BannerFontMobile">
        <Grid container justifyContent="center">
          <Grid className="ImgItemMobile">
            <Image alt="ImgMobile" src={'https://storage.yandexcloud.net/site-home-img/' + banner?.img_new + '1000х500.jpg'}
              width={1000}
              height={500}
              priority={true}
            />
            <Typography className="ItemTime" variant="h5" component="span" onClick={() => setActiveBanner(false, null)}>
              Условия акции
              <KeyboardArrowUpIcon />
            </Typography>
          </Grid>

          <Grid className="erid">
            <Typography variant="h5" component="h2" className="ItemTime" style={{ color: 'rgba(0, 0, 0, 0.20)' }}>
              {`Реклама, Jacofood.ru, erid: ${banner?.erid}`}
            </Typography>
          </Grid>

          <Grid className="DescItemMobile">
            <Grid className="FirstItemMobile">
              <Typography className="ItemTitle" variant="h5" component="span">{banner?.promo_title}</Typography>
              {banner && banner?.text ? <Grid dangerouslySetInnerHTML={{ __html: banner?.text }} /> : null}
            </Grid>

            <Grid className="SecondItemMobile">
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
          </Grid>
        </Grid>
      </Box>
    </SwipeableDrawer>
  );
}
