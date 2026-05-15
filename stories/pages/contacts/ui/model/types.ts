import React from 'react';
import { MenuContactsProps } from '@stories/features/contacts/ui/contacts-menu/model/types';
import { MapProps } from '@stories/widgets/contacts/ui/map/model/types';

export interface ContactsPageProps {
  header?: React.ReactNode;
  menu?: MenuContactsProps;
  map?: any;
  footer?: React.ReactNode;
}
