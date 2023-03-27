import React from 'react';
import Head from 'next/head'

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Meta from '@/components/meta.js';

export default function PageText(props){

  const { page, className } = props;

  return (
    <Meta title={page.title} description={page.description}>
      <Grid container spacing={3} className={className}>
        
        <Grid item xs={12} style={{ paddingBottom: 15 }}>
          <Typography variant="h5" component="h1">{ page ? page.page_h : '' }</Typography>
        </Grid>

        { page && page.content ?
          <Grid item xs={12} dangerouslySetInnerHTML={{__html: page.content}} />
            :
          null
        }
      
      </Grid>
    </Meta>
  )
}