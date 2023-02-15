import React, { useState } from 'react';
import Head from 'next/head'

import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';

import TabPromo from './tabPromo.js';
import TabOrders from './tabOrders.js';
import TabProfile from './tabProfile.js';
import ModalOrder from './modalOrder.js';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ContactsPage(props){

  const { page, this_module, city } = props;

  const [ activeTab, setActiveTab ] = useState(0);

  const changeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Grid container className="Profile mainContainer MuiGrid-spacing-xs-3">
                
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Grid item xs={12}>
        <Typography variant="h5" component="h1">Личный кабинет</Typography>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ width: '100%' }}>
          <Box>
            <Tabs value={activeTab} onChange={ changeTab } centered>
              <Tab label="Промокоды" {...a11yProps(0)} />
              <Tab label="Заказы" {...a11yProps(1)} />
              <Tab label="Редактирование" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={activeTab} index={0} className="Tabs">
            <TabPromo this_module={this_module} city={city} />
          </TabPanel>
          <TabPanel value={activeTab} index={1} className="Tabs">
            <TabOrders this_module={this_module} city={city} />
          </TabPanel>
          <TabPanel value={activeTab} index={2} className="Tabs">
            <TabProfile this_module={this_module} city={city} />
          </TabPanel>
        </Box>
      </Grid>

      <ModalOrder />

    </Grid>
  )
}