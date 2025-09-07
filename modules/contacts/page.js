import Meta from '@/components/meta.js';

import ContactsPagePC from './contactsPC';
import ContactsPageMobile from './contactsMobile';
import ContactsModalChoose from './contactsModalChoose';

import { useHeaderStoreNew } from '@/components/store';

export default function ContactsPage({ page, city }) {
  const [matches] = useHeaderStoreNew((state) => [state?.matches]);

  return (
    <Meta title={page?.title ?? ''} description={page?.description ?? ''}>
      {matches ? (
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
