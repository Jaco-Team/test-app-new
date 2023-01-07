import React from 'react';
import Head from 'next/head'

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { roboto } from '../../components/elements.js'

const this_module = 'contacts';

import config from '../../components/config.js';

import { Header } from '../../components/header.js';
import { Footer } from '../../components/footer.js';

import queryString from 'query-string';

export default class PolitikaKonfidencialnosti extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {      
      cats: this.props.data1?.cats ?? [],
      city_list: this.props.data1?.cities ?? [],

      page: this.props.data1 ? this.props.data1.page : null,
      title: this.props.data1 ? this.props.data1.page.title : '',
      description: this.props.data1 ? this.props.data1.page.description : '',
      
      city: this.props.data1 ? this.props.data1.city : '',
      city_name: this.props.city,
      is_load: false,
    };
    
    //itemsStore.setCity(this.props.city);
  }

  render(){
    return (
      <div className={roboto.variable}>
        <Header city={this.state.city} cats={this.state.cats} city_list={this.state.city_list} active_page={'other'} />

        <Head>
          <title>{this.state.title}</title>
          <meta name="description" content={this.state.description} />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Grid container className="PAGEpolitic MuiGrid-spacing-xs-3">
          
          <Grid item xs={12} style={{ paddingBottom: 15 }}>
            <Typography variant="h5" component="h1">{ this.state.page ? this.state.page.page_h : '' }</Typography>
          </Grid>

          { this.state.page && this.state.page.content ?
            <Grid item xs={12} dangerouslySetInnerHTML={{__html: this.state.page.content}} />
              :
            null
          }
        
        </Grid>

        <Footer cityName={this.state.city} />

      </div>
    )
  }
}

export async function getServerSideProps({ req, res, query }) {
  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: 'politika-konfidencialnosti' 
  };

  let res1 = await fetch(config.urlApi+this_module, {
    method: 'POST',
    headers: {
      'Content-Type':'application/x-www-form-urlencoded'},
    body: queryString.stringify(data)
  })

  const data1 = await res1.json()
  
  data1['city'] = query.city;

  data1.page.content = data1.page.content.replace(
    /<a href=\"\//g,
    '<a href="/'+query.city+'/'
  );

  return { props: { data1 } }
}