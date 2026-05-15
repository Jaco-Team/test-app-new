import Link from 'next/link';
import Typography from '@mui/material/Typography';

export const AboutCooperation = () => (
  <section className="about-page__section" id="tag8">
    <Typography variant="h2" component="h2">
      Сотрудничество
    </Typography>
    <p>
      <span>
        Работа — в{' '}
        <Link
          href="https://vk.com/@jaco_blog-pismo-71-soiskatelyam-o-rabote-v-kafe-zhako"
          target="_blank"
          rel="noreferrer"
        >
          кафе
        </Link>{' '}
        и{' '}
        <Link
          href="https://vk.com/@jaco_blog-pismo-68-soiskatelyam-o-rabote-v-upravlyauschei-kompanii-zha"
          target="_blank"
          rel="noreferrer"
        >
          Управляющей компании
        </Link>
      </span>
      <br />
      <span>
        Бизнес —{' '}
        <Link
          href="https://franchise.jacofood.ru/"
          target="_blank"
          rel="noreferrer"
        >
          стать франчайзи
        </Link>
      </span>
      <br />
      <span>
        Отдел маркетинга —{' '}
        <Link href="mailto:event.jaco@yandex.ru">event.jaco@yandex.ru</Link> +7
        (906) 129-98-33
      </span>
      <br />
      <span>
        Отдел закупок —{' '}
        <Link href="mailto:Zacupci.jaco@yandex.ru">Zacupci.jaco@yandex.ru</Link>
      </span>
    </p>
  </section>
);
