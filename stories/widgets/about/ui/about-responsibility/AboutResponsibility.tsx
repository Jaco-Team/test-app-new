import Image from 'next/image';
import Typography from '@mui/material/Typography';

export const AboutResponsibility = () => (
  <section className="about-page__section" id="tag6">
    <Typography variant="h2" component="h2">
      Социальная и экологическая ответственность
    </Typography>
    <p>
      <span>
        Мы заботимся об окружающей среде, выбирая экологичную упаковку: картон и
        перерабатываемые виды пластика. <br />
      </span>
      <br />
      <span>
        Понимаем, что большая сила — это большая ответственность, поэтому
        помогаем братьям нашим меньшим. Оставшуюся при подготовке ингредиентов
        обрезь отдаём в приюты для животных.
        <br />
      </span>
      <br />
      <span>
        Мы поддерживаем спортивные мероприятия и участвуем в субботниках.
      </span>
    </p>

    <Image
      alt="Субботник Жако"
      src="/about/субботник.jpg"
      width={2560}
      height={1920}
      priority
      style={{ width: '100%', height: 'auto' }}
    />

    <p className="about-page__caption">Команда Жако на субботнике</p>
  </section>
);
