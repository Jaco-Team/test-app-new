import Meta from '@/components/meta.js';

import ContactsPagePC from './contactsPC';
import ContactsPageMobile from './contactsMobile';
import ContactsModalChoose from './contactsModalChoose';

import useMediaQuery from '@mui/material/useMediaQuery';
import { BREAKPOINTS } from '@/utils/breakpoints';

export default function ContactsPage({ page, city }) {
  const isMobileContactsLayout = useMediaQuery(`screen and (max-width: ${BREAKPOINTS.mobileMax}px)`);

  return (
    <Meta title={page?.title ?? ''} description={page?.description ?? ''}>
      {isMobileContactsLayout ? (
        <>
          <ContactsPageMobile />
          <ContactsModalChoose />
        </>
      ) : (
        <ContactsPagePC city={city} />
      )}
    </Meta>
  );
}
