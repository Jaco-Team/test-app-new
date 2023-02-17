import React from 'react';
import Head from 'next/head'

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function PageText(props){

  const { page, className } = props;

  return (
    <Grid container spacing={3} className={className}>
      
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid item xs={12} style={{ paddingBottom: 15 }}>
        <Typography variant="h5" component="h1">{ page ? page.page_h : '' }</Typography>
      </Grid>

      { page && page.content ?
        <Grid item xs={12} dangerouslySetInnerHTML={{__html: page.content}} />
          :
        null
      }
    
    </Grid>
  )
}