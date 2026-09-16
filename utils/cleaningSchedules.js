const STORAGE_BASE_URL =
  'https://storage.yandexcloud.net/jaco-cleaning/cleaning-schedules';

export const CLEANING_SCHEDULES = {
  'kuybysheva-113': {
    cafeName: 'Куйбышева',
    documents: {
      'guest-toilet': {
        title: 'График уборок гостевого туалета',
        goalId: 'open_cleaning_kuybysheva_113_guest_toilet',
        url: `${STORAGE_BASE_URL}/kuybysheva-113/guest-toilet.pdf`,
      },
    },
  },
  'leningradskaya-47': {
    cafeName: 'Ленинградка',
    documents: {
      'guest-toilet': {
        title: 'График уборок гостевого туалета',
        goalId: 'open_cleaning_leningradskaya_47_guest_toilet',
        url: `${STORAGE_BASE_URL}/leningradskaya-47/guest-toilet.pdf`,
      },
    },
  },
  'matrosova-32': {
    cafeName: 'Матросова',
    documents: {
      'guest-toilet': {
        title: 'График уборок гостевого туалета',
        goalId: 'open_cleaning_matrosova_32_guest_toilet',
        url: `${STORAGE_BASE_URL}/matrosova-32/guest-toilet.pdf`,
      },
    },
  },
  'metallurgov-76a': {
    cafeName: 'Металлург',
    documents: {
      'guest-toilet': {
        title: 'График уборок гостевого туалета',
        goalId: 'open_cleaning_metallurgov_76a_guest_toilet',
        url: `${STORAGE_BASE_URL}/metallurgov-76a/guest-toilet.pdf`,
      },
    },
  },
  'pobedy-10': {
    cafeName: 'Победа',
    documents: {
      'guest-toilet': {
        title: 'График уборок гостевого туалета',
        goalId: 'open_cleaning_pobedy_10_guest_toilet',
        url: `${STORAGE_BASE_URL}/pobedy-10/guest-toilet.pdf`,
      },
    },
  },
  'tsvetnoy-1': {
    cafeName: 'Цветной',
    documents: {
      'guest-toilet': {
        title: 'График уборок гостевого туалета',
        goalId: 'open_cleaning_tsvetnoy_1_guest_toilet',
        url: `${STORAGE_BASE_URL}/tsvetnoy-1/guest-toilet.pdf`,
      },
    },
  },
  'voroshilova-12a': {
    cafeName: 'Ворошилова',
    documents: {
      'guest-toilet': {
        title: 'График уборок гостевого туалета',
        goalId: 'open_cleaning_voroshilova_12a_guest_toilet',
        url: `${STORAGE_BASE_URL}/voroshilova-12a/guest-toilet.pdf`,
      },
    },
  },
};

export function getCleaningSchedule(location, documentSlug) {
  const cafe = CLEANING_SCHEDULES[location];
  const document = cafe?.documents?.[documentSlug];

  if (!cafe || !document) return null;

  return {
    location,
    documentSlug,
    cafeName: cafe.cafeName,
    title: document.title,
    goalId: document.goalId,
    url: document.url,
  };
}

export function getCleaningSchedulePaths() {
  return Object.entries(CLEANING_SCHEDULES).flatMap(([location, cafe]) =>
    Object.keys(cafe.documents).map((documentSlug) => ({
      params: { location, document: documentSlug },
    }))
  );
}
