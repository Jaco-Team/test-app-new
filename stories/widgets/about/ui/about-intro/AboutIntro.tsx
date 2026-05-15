import Image from 'next/image';
import Link from 'next/link';
import Typography from '@mui/material/Typography';

import { ArrowLeftMobile } from '@stories/shared/Icons';

import type { ResponsiveViewport } from '@stories/shared/lib/storybook/responsive';

export interface AboutIntroProps {
  cityName: string;
  viewport: ResponsiveViewport;
}

export const AboutIntro = ({ cityName, viewport }: AboutIntroProps) => {
  const showBack = viewport === 'mobile';

  return (
    <section className="about-page__section about-page__section--intro">
      {showBack ? (
        <Link
          href={`/${cityName}/document`}
          className="about-page__back"
          aria-label="Назад к документам"
        >
          <ArrowLeftMobile />
        </Link>
      ) : null}

      <Typography variant="h1" component="h1">
        О нас
      </Typography>

      <p>
        Жако — сеть кафе с доставкой превосходной еды и оптимизма.
        <br />
        Основа нашего меню — роллы и пицца. Дополняем салатами, пастой,
        предлагаем закуски, десерты и напитки.
        <br />
        <br />
        Наши отличия — мы готовим большие порции, кладём много начинки, выбираем
        ингредиенты без ГМО, ЗМЖ, трансжиров, антибиотиков.
        <br />
        <br />У нас можно пообедать в кафе, заказать доставку или забрать самому
        (так выгоднее).
      </p>

      <Image
        alt="О кафе Жако"
        src="/about/new_main_min.png"
        width={4606}
        height={3456}
        priority
        style={{ width: '100%', height: 'auto' }}
      />

      <p className="about-page__caption">Добро пожаловать в Жако!</p>
    </section>
  );
};
