import Meta from '@/components/meta.js';

import ContactsPagePC from './contactsPC';
import ContactsPageMobile from './contactsMobile';
import ContactsModalChoose from './contactsModalChoose';

import { useHeaderStore } from '@/components/store';

export default function ContactsPage({ page, city, this_module }) {
  const [matches] = useHeaderStore((state) => [state.matches]);

  return (
    <Meta title={page.title} description={page.description}>
      {matches ? (
        <>
          <ContactsPageMobile city={city} this_module={this_module} />
          <ContactsModalChoose />
        </>
      ) : (
        <ContactsPagePC city={city} />
      )}
    </Meta>
  );
}
