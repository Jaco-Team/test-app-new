import React, { useState, useEffect } from 'react';
import Head from 'next/head'

import Grid from '@mui/material/Grid';

import { useHomeStore } from '../../components/store.js';

import Banners from './banners.js';
import CardItems from './cardItems.js';

export default function HomePage(props){

  const { page, city } = props;

  return (
    <>

      <Banners />

      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <CardItems />
  
    </>
  )
}