import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';

import { useAkciiStore } from '@/components/store.js';
import AkciiItem from './item.js';
import AkciiModal from './modal.js';

import Meta from '@/components/meta.js';

export default function AkciiPage(props){

  const { page, city } = props;

  const [ openMSG, setOpenMSG ] = useState(false);
  const [ statusMSG, setStatusMSG ] = useState(false);
  const [ textMSG, setTextMSG ] = useState('');

  const [ actiiList, setActiiList ] = useState([]);

  let [ actii, openModal, getAktia ] = useAkciiStore((state) => [state.actii, state.openModal, state.getAktia])

  useEffect(() => {
    setActiiList(actii)
  }, [actii]);

  function openDialog(id){
    if( parseInt(id) > 0 ){
      getAktia(id, city);

      let state = {  },
        title = '',
        url = window.location.pathname+'?act_'+id;

      window.history.pushState(state, title, url)
    }
  }

  useEffect(() => {
    if (typeof window != "undefined") {
      setTimeout(() => {
        let hash = window.location.search;
        
        if( hash.length > 0 && hash.indexOf('act_') > 0 && openModal == false ){
          let act = hash.split('&')[0];
          let act_id = act.split('act_')[1];
          let this_item = actii.find( (item) => item.id == act_id );
          
          if(this_item && openModal == false){
            openDialog(this_item.id);
          }
        }
      }, 300);
    }
  }, []);

  return (
    <Meta title={page.title} description={page.description}>
      <Grid container spacing={3} className="Actii mainContainer">
        
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={openMSG}
          autoHideDuration={3000}
          onClose={ () => setOpenMSG(false) }
          message={textMSG}
          style={{ backgroundColor: statusMSG ? 'green' : '#BB0025', borderRadius: 4 }}
        />

        <Grid item xs={12}>
          <Typography variant="h5" component="h1">Акции</Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>

            { actiiList.length > 0 ?
              actiiList.map((item, key) =>
                <AkciiItem 
                  key={item.id}
                  openDialog={openDialog}
                  item={item}
                />
              )
                :
              null
            }

          </Grid>
        </Grid>

        <AkciiModal />

      </Grid>
    </Meta>
  )
}