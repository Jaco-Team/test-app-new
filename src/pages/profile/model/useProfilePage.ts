'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import dayjs from 'dayjs';
import { useProfileStore, type ProfileUser } from '@src/entities/profile';
import { useHeaderStore } from '@src/entities/header';

const PROFILE_MODULE = 'profile';

export function useProfilePage(citySlug: string) {
  const token = useHeaderStore((state) => state.token);
  const userInfo = useProfileStore((state) => state.userInfo);
  const streets = useProfileStore((state) => state.streets);
  const shortName = useProfileStore((state) => state.shortName);
  const getUserInfo = useProfileStore((state) => state.getUserInfo);
  const updateUser = useProfileStore((state) => state.updateUser);
  const setUser = useProfileStore((state) => state.setUser);
  const delAddr = useProfileStore((state) => state.delAddr);
  const openModalAddr = useProfileStore((state) => state.openModalAddr);

  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [login, setLogin] = useState('');
  const [isSpam, setIsSpam] = useState(0);
  const [birthDate, setBirthDate] = useState<Date | null>(null);

  useEffect(() => {
    setName(String(userInfo?.name ?? ''));
    setMail(String(userInfo?.mail ?? ''));
    setLogin(String(userInfo?.login ?? ''));
    setIsSpam(parseInt(String(userInfo?.spam ?? 0), 10) || 0);

    if (userInfo?.date_bir_full) {
      try {
        setBirthDate(parseISO(String(userInfo.date_bir_full)));
      } catch {
        setBirthDate(null);
      }
    } else {
      setBirthDate(null);
    }
  }, [userInfo]);

  useEffect(() => {
    if (!token.length) {
      return;
    }

    void getUserInfo(PROFILE_MODULE, citySlug, token);
  }, [citySlug, getUserInfo, token]);

  function saveMainData() {
    const nextUser: ProfileUser = {
      ...userInfo,
      name,
      mail,
    };

    setUser(nextUser, citySlug);
    void updateUser(PROFILE_MODULE, citySlug, token);
  }

  function changeSpam(checked: boolean) {
    const nextUser: ProfileUser = {
      ...userInfo,
      spam: checked ? 1 : 0,
    };

    setUser(nextUser, citySlug);
    setIsSpam(checked ? 1 : 0);
    void updateUser(PROFILE_MODULE, citySlug, token);
  }

  function saveBirthDate(value: Date | null) {
    if (!value || userInfo?.date_bir_full) {
      return;
    }

    const formatted = dayjs(value).format('YYYY-MM-DD');
    const [year, month, day] = formatted.split('-');
    const nextUser: ProfileUser = {
      ...userInfo,
      date_bir_d: day,
      date_bir_m: month,
      date_bir_y: year,
      date_bir: formatted,
    };

    setUser(nextUser, citySlug);
    setBirthDate(value);
    void updateUser(PROFILE_MODULE, citySlug, token);
  }

  const birthDateLocked = Boolean(userInfo?.date_bir_full);
  const birthDateLabel = birthDate
    ? format(birthDate, 'd MMMM yyyy')
    : 'День рождения';

  return {
    userInfo,
    streets,
    shortName,
    name,
    setName,
    mail,
    setMail,
    login,
    isSpam,
    birthDate,
    setBirthDate,
    birthDateLocked,
    birthDateLabel,
    saveMainData,
    changeSpam,
    saveBirthDate,
    delAddr,
    openModalAddr,
  };
}
