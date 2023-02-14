import React from 'react';

import Image from 'next/image';
import Grid from '@mui/material/Grid';

function areEqual(prevProps, nextProps) {
  return nextProps.item !== prevProps.item;
}

export default React.memo(function AkciiItem(props){
  const { item, openDialog } = props;
  
  console.log( 'render_item' )

  return (
    <Grid item xs={12} sm={6} md={4} xl={4} onClick={ () => openDialog(item.id)}>
      <Image alt={item.promo_title} src={"https://storage.yandexcloud.net/site-aktii/"+item.img_new+"750х750.jpg"} width={750} height={750} priority={true} />
    </Grid>
  )
}, areEqual)