'use client';

import { useContactMapBootstrap } from '../model/useContactMapBootstrap';
import type { UseContactMapBootstrapOptions } from '../model/useContactMapBootstrap';

export type ContactMapBootstrapProps = UseContactMapBootstrapOptions;

/** Client-only bootstrap: loads cafe zones into `useContactStore` when YMaps is ready. */
export function ContactMapBootstrap(props: ContactMapBootstrapProps) {
  useContactMapBootstrap(props);
  return null;
}
