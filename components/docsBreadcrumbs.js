import React from 'react';

import Grid from '@mui/material/Grid';
import Link from 'next/link'

import { useHeaderStoreNew, useCitiesStore, useFooterStore } from '@/components/store.js';

export default function DocsBreadcrumbs() {

  const [ thisCity ] = useCitiesStore(state => [ state.thisCity ]);
  const [ activePage ] = useHeaderStoreNew( state => [ state?.activePage ] )
  const [links] = useFooterStore((state) => [state.links]);

  const handleClick = () => {
    const city = (thisCity || '').toLowerCase();
    const counterId = city === 'togliatti' ? 100601350 : 100325084;
    ym(counterId, 'reachGoal', 'health_reminder');
  };
  
  return (
    <Grid item className="DocsBreadcrumbs" style={{ paddingBottom: 15 }}>
      <div>
        <div>
          <span>Документы</span>
        </div>
        
        {thisCity?.length == 0 ? null :
          <ul>
            <li className={ activePage === 'publichnaya-oferta' ? 'activeMarker' : '' }><Link className={ activePage === 'publichnaya-oferta' ? 'active' : '' } href={"/"+thisCity+"/publichnaya-oferta"}>Публичная оферта</Link></li>

            <li className={ activePage === 'company-details' ? 'activeMarker' : '' }><Link className={ activePage === 'company-details' ? 'active' : '' } href={"/"+thisCity+"/company-details"}>Реквизиты</Link></li>

            <li className={ activePage === 'politika-konfidencialnosti' ? 'activeMarker' : '' }><Link className={ activePage === 'politika-konfidencialnosti' ? 'active' : '' } href={"/"+thisCity+"/politika-konfidencialnosti"}>Политика конфиденциальности</Link></li>

            <li className={ activePage === 'instpayorders' ? 'activeMarker' : '' }><Link className={ activePage === 'instpayorders' ? 'active' : '' } href={"/"+thisCity+"/instpayorders"}>Правила оплаты</Link></li>

            <li className={ activePage === 'legal' ? 'activeMarker' : '' }><Link className={ activePage === 'legal' ? 'active' : '' } href={"/"+thisCity+"/legal"}>Согласие на обработку персональных данных</Link></li>

            <li><Link className={ activePage === '' ? 'active' : '' } href={links?.link_allergens ?? links} target="_blank">Калорийность, состав, БЖУ</Link></li>

            <li><Link className={ activePage === 'pamiatka_po_sohraneniiu_zdorovia' ? 'active' : '' } href={"/"+thisCity+"/pamiatka_po_sohraneniiu_zdorovia"} onClick={handleClick}>Памятка по сохранению здоровья</Link></li>

          </ul>
        }
      </div>
    </Grid>
  )
}
