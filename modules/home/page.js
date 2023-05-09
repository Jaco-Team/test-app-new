import React, { useState, useEffect } from 'react';
// import Head from 'next/head'

// import Grid from '@mui/material/Grid';

// import { useHomeStore } from '../../components/store.js';

import Banners from './banners.js';
import CardItems from './cardItems.js';
import ModalCardItem from './modalCardItem';

import Meta from '@/components/meta.js';

export default function HomePage(props){

  const { page, city } = props;

  return (
    <Meta title={page.title} description={page.description}>

      <Banners />

      <CardItems />

      <ModalCardItem />
  
    </Meta>
  )
}
