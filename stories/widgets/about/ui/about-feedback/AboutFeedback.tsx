import Link from 'next/link';
import Typography from '@mui/material/Typography';

export const AboutFeedback = () => (
  <section className="about-page__section" id="tag7">
    <Typography variant="h2" component="h2">
      Обратная связь
    </Typography>
    <p>
      <span>
        Мы всегда открыты к диалогу. Нас интересует мнение по вкусу и качеству
        блюд, обслуживанию в кафе, доставке. <br />
      </span>
      <br />
      <span>
        Для связи с вами мы создали группы в социальных сетях и Telegram-канал.{' '}
        <br />
      </span>
      <br />
      <Link href="https://vk.com/jacofood_tlt" target="_blank" rel="noreferrer">
        Жако в Тольятти Вконтакте
      </Link>
      <br />
      <Link href="https://vk.com/jacofood_smr" target="_blank" rel="noreferrer">
        Жако в Самаре Вконтакте
      </Link>
      <br />
      <Link href="https://t.me/jacofood" target="_blank" rel="noreferrer">
        Жако в Телеграм
      </Link>
      <br />
      <Link
        href="https://ok.ru/group/54671948841166"
        target="_blank"
        rel="noreferrer"
      >
        Жако в Одноклассниках
      </Link>
      <br />
      <br />
      <span>
        В группах ВКонтакте в обсуждениях вы можете поделиться отзывом о блюдах
        и нашей работе. Если у вас возникли вопросы по качеству, напишите в
        сообщения группы, и вам ответят сотрудники отдела поддержки.
      </span>
      <br />
      <br />
      <span>
        Знаете, как улучшить блюда? Заполните{' '}
        <Link
          href="https://b24-rzeh1q.bitrix24site.ru/"
          target="_blank"
          rel="noreferrer"
        >
          анкету.
        </Link>
      </span>
    </p>
  </section>
);
