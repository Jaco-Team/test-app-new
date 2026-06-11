'use client';

import type { StoreBootstrapProps } from '@src/features/bootstrap';
import { CabinetPageShell } from '@src/widgets/cabinet';
import { ProfilePage } from './ProfilePage';

export type ProfileClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function ProfileClient({ storeSeed }: ProfileClientProps) {
  return (
    <CabinetPageShell
      storeSeed={storeSeed}
      activePage="profile"
      title="Личные данные"
      description="Настройте контактные данные, уведомления и адреса доставки."
      frameVariant="cabinet"
    >
      <ProfilePage />
    </CabinetPageShell>
  );
}
