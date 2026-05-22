import { useEffect } from 'react';
import Link from 'next/link';

import {
  useHeaderStoreNew,
  useCitiesStore,
  useProfileStore,
} from '@/components/store.js';

import { ProfileIconNew } from '@/ui/Icons.js';

function ProfileIconHeaderPCNew() {
  const [colorAccount, shortName, count_promo, count_orders] = useProfileStore(
    (state) => [
      state.colorAccount,
      state.shortName,
      state.count_promo,
      state.count_orders,
    ]
  );

  return (
    <div
      className="accountLogin accountMain"
      style={{ background: colorAccount.login }}
    >
      {count_promo > 0 || count_orders > 0 ? (
        <div className="count_promo_order" />
      ) : (
        false
      )}
      {shortName ? (
        <span>{shortName}</span>
      ) : (
        <ProfileIconNew className="profile_svg" />
      )}
    </div>
  );
}

export default function ProfileIconHeaderPC({ activeProfile, goToPage, city }) {
  const [setActiveModalAuth, isAuth, token, openAuthModal] = useHeaderStoreNew(
    (state) => [
      state?.setActiveModalAuth,
      state?.isAuth,
      state.token,
      state?.openAuthModal,
    ]
  );
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);
  const [getUserInfo] = useProfileStore((state) => [state.getUserInfo]);

  useEffect(() => {
    if (token && token.length > 0) {
      getUserInfo('profile', city, token);
    }
  }, [token, city]);

  const authModalOpen = Boolean(openAuthModal) && isAuth !== 'auth';

  const handleProfileAuthClick = () => {
    goToPage('Авторизация');
    setActiveModalAuth(true);
  };

  const profileClassName =
    'profileHeaderPC ' +
    (activeProfile ? 'active ' : '') +
    (authModalOpen ? 'profileHeaderPC--authOpen ' : '') +
    (isAuth !== 'auth' ? 'profileHeaderPC--guest' : '');

  if (isAuth === 'auth') {
    return (
      <div className={profileClassName.trim()}>
        <Link
          href={'/' + thisCity + '/zakazy'}
          onClick={() => goToPage('Заказы')}
        >
          <ProfileIconHeaderPCNew />
        </Link>
      </div>
    );
  }

  return (
    <div
      className={profileClassName.trim()}
      role="button"
      tabIndex={0}
      aria-label="Войти в аккаунт"
      onClick={handleProfileAuthClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleProfileAuthClick();
        }
      }}
    >
      <ProfileIconNew
        className="profile_svg"
        aria-hidden="true"
        focusable="false"
      />
    </div>
  );
}
