import Image from 'next/image';

import PropTypes from 'prop-types';
import { HeaderPC } from '../HeaderPC/HeaderPC';
import { BreadСrumbsPC } from '../BreadСrumbsPC/BreadСrumbsPC';
import { FooterPC } from '../FooterPC/FooterPC';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Scrollbar } from 'swiper';
import 'swiper/css';

import './AboutPagePC.scss';

const arrayImage = [
  {
    img: '/about/slide1.png',
    comment: 'Интерьер кафе на Ленинградской 47 (Тольятти)',
  },
  {
    img: '/about/slide2.png',
    comment: 'Интерьер кафе на Куйбышева 113 (Самара)',
  },
  {
    img: '/about/slide3.png',
    comment: 'Интерьер кафе на Цветном 1 (Тольятти)',
  },
  {
    img: '/about/slide5.jpg',
    comment:
      'Касса и кухня кафе на Ленинградской 47 (Тольятти), за кассой — Анастасия',
  },
  {
    img: '/about/slide4.png',
    comment: 'Уборная на Ленинградской 47 (Тольятти)',
  },
];

export const AboutPagePC = ({ header, data, footer }) => {
  return (
    <>
      <HeaderPC {...header} />
      <div className="aboutPC">
        <div className="aboutContainerPC">
          <h1>О нас</h1>
          <p>
            Жако — сеть кафе с доставкой превосходной еды и оптимизма.
            <br />
            Основа нашего меню — роллы и пицца. Дополняем салатами, пастой,
            предлагаем закуски, десерты и напитки.
            <br />
            <br />
            Наши отличия — мы готовим большие порции, кладём много начинки,
            выбираем ингредиенты без ГМО, ЗМЖ, трансжиров, антибиотиков.
            <br />
            <br />У нас можно пообедать в кафе, заказать доставку или забрать
            самому (так выгоднее).
          </p>
          <Image
            alt="AboutPagePC_1"
            src="/about/new_main_min.png"
            width={4606}
            height={3456}
            priority={true}
            style={{ width: '100%', height: 'auto' }}
          />
          <p style={{ textAlign: 'center' }}>Добро пожаловать в Жако!</p>
          <div id={'tag1'}>
            <h2>Превосходные блюда</h2>
            <p>
              <span>
                <strong>Большие порции и много начинки.</strong> Мы хотим сытно
                и вкусно кормить, а не просто разжигать аппетит. Массовая доля
                начинки в отдельных роллах достигает 50% и выше (в ролле
                Филадельфия Люкс — 56%, больше половины от веса блюда!). <br />
              </span>
              <br />
              <span>
                <strong>Качество по сети 99,8%</strong> по статистике{' '}
                <a target="_blank">информационной системы “Жако Шеф”</a>.
                Показатель качества основан на фиксировании обращений клиентов.
                Каждое кафе стремиться к показателю качества 100%. Мы понимаем,
                над чем нам нужно работать и что улучшать. <br />
              </span>
              <br />
              <span>
                <strong>Выбираем натуральность:</strong> В наших блюдах нет ГМО,
                ЗМЖ, трансжиров и антибиотиков.{' '}
                <a target="_blank">Подробнее тут.</a>
                <br />
              </span>
            </p>

            <Image
              alt="AboutPagePC_2"
              src="/about/Populyarnye-blyuda1.jpg"
              width={2000}
              height={1540}
              priority={true}
              style={{ width: '100%', height: 'auto' }}
            />

            <p style={{ textAlign: 'center' }}>
              Сет Атлантида и пицца Пепперони
            </p>
          </div>
          <div id={'tag2'}>
            <h2>Доступные цены</h2>
            <p>
              <span>
                <strong>Низкая наценка.</strong> Держим низкую цену за счёт
                большого объёма продаж. Мы закупаем продукты оптом на всю сеть и
                получаем максимальные скидки от поставщиков. Благодаря этому вы
                тоже получаете выгоду.
                <br />
              </span>
              <br />
              <span>
                <strong>Прозрачное ценообразование.</strong> Возможно, для вас
                это станет открытием, но бесплатной доставки и бесплатных
                приправ не существует. Расходы на на них распределяются между
                всеми клиентами кафе за счет повышения стоимости блюд.
                <br />У нас вы платите лишь за те приправы, которые
                действительно нужны. А за доставку платит только тот, кто ею
                пользуется. Благодаря этому цены на блюда ниже.
              </span>
            </p>
          </div>
          <div id={'tag3'}>
            <h2>Как выглядит кафе</h2>
            <p>
              У нас можно отдохнуть с друзьями или семьёй, провести деловую
              встречу или собеседование. Особенностью наших кафе является
              большая открытая кухня: вы можете наблюдать, в каких условиях
              готовятся блюда. На наших кухнях всегда чисто, и мы честно
              проходим все проверки Роспотребнадзора.
            </p>

            <Swiper
              modules={[Autoplay, Scrollbar]}
              spaceBetween={50}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              scrollbar={{ draggable: true }}
              style={{ width: '100%', height: 'auto' }}
            >
              {arrayImage.map((item, key) => (
                <SwiperSlide key={key}>
                  <Image
                    alt={item.img}
                    src={item.img}
                    width={1280}
                    height={720}
                    priority={true}
                    style={{ width: '100%', height: 'auto' }}
                  />
                  <p style={{ whiteSpace: 'normal', textAlign: 'center', fontWeight: 300 }}>
                    {item.comment}
                  </p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div id={'tag4'}>
            <h2>Время приготовления заказа</h2>
            <p>
              <span>Скорость приготовления блюда почти так же важна, как и его качество.</span>
              <br />
              <br />
              <span>Наша информационная система “Жако Шеф” учитывает загруженность кафе по многим показателям и показывает примерное время приготовления заказа.</span>
              <br />
              <br />
              <span>Узнать статус заказа и примерное время его готовности вы можете в личном кабинете на сайте.</span>
            </p>
          </div>
          <div id={'tag5'}>
            <h2>Заряжаем оптимизмом!</h2>
            <p>
              <span>
                Сотрудники кафе всегда встретят вас дружелюбно и при
                необходимости помогут с выбором блюд. Мы подбираем
                жизнерадостных и трудолюбивых людей, которые готовят
                ответственно и с душой. А клиенты за это оставляют нам слова
                благодарности. Получается круговорот хорошего настроения и
                оптимизма!
              </span>
              <br />
              <br />
              <span>
                Оптимизм — основная ценность нашей компании. И это не про шутки
                и анекдоты. Это про веру в лучшее, про веру в себя, про
                мотивацию и путь к поставленной цели.
              </span>
              <br />
              <br />
              <span>
                У нас есть цель — построить сеть кафе по всей России, мы идём к
                ней и верим, что всё получится. И вы тоже достигнете любой
                поставленной цели, если будете идти к ней шаг за шагом.
              </span>
            </p>

            <Image
              alt="AboutPagePC_3"
              src="/about/IMG_5144.jpg"
              width={4541}
              height={3027}
              priority={true}
              style={{ width: '100%', height: 'auto' }}
            />

            <p style={{ textAlign: 'center' }}>А это Наталия, менеджер кафе на Цветном (Тольятти). Всех заряжает оптимизмом!</p>
          </div>
          <div id={'tag6'}>
            <h2>Социальная и экологическая ответственность</h2>
            <p>
              <span>
                Мы заботимся об окружающей среде, выбирая экологичную упаковку:
                картон и перерабатываемые виды пластика. <br />
              </span>
              <br />
              <span>
                Понимаем, что большая сила — это большая ответственность,
                поэтому помогаем братьям нашим меньшим. Оставшуюся при
                подготовке ингредиентов обрезь отдаём в приюты для животных.
                <br />
              </span>
              <br />
              <span>
                Мы поддерживаем спортивные мероприятия и участвуем в
                субботниках.
              </span>
            </p>

            <Image
              alt="AboutPagePC_4"
              src="/about/субботник.jpg"
              width={2560}
              height={1920}
              priority={true}
              style={{ width: '100%', height: 'auto' }}
            />

            <p style={{ textAlign: 'center' }}>Команда Жако на субботнике</p>
          </div>
          <div id={'tag7'}>
            <h2>Обратная связь</h2>
            <p>
              <span>Мы всегда открыты к диалогу. Нас интересует мнение по вкусу и качеству блюд, обслуживанию в кафе, доставке. <br /></span>
              <br />
              <span>Для связи с вами мы создали группы в социальных сетях и Telegram-канал. <br />
              </span>
              <br />
              <a href={'https://vk.com/jacofood_tlt'} target="_blank">Жако в Тольятти Вконтакте</a>
              <br />
              <a href={'https://vk.com/jacofood_smr'} target="_blank">Жако в Самаре Вконтакте</a>
              <br />
              <a href={'https://t.me/jacofood'} target="_blank">Жако в Телеграм</a>
              <br />
              <a href={'https://ok.ru/group/54671948841166'} target="_blank">Жако в Одноклассниках</a>
              <br />
              <br />
              <span>
                В группах ВКонтакте в обсуждениях вы можете поделиться отзывом о
                блюдах и нашей работе. Если у вас возникли вопросы по качеству,
                напишите в сообщения группы, и вам ответят сотрудники отдела
                поддержки.
              </span>
              <br />
              <br />
              <span>Знаете, как улучшить блюда? Заполните{' '}
                <a href={'https://docs.google.com/forms/d/e/1FAIpQLSc_ohjcoYjY6W5oqaGnoDhlSlyT8Y_LEfbHljjqRAqyvpEv1Q/viewform'} target="_blank">анкету.</a>
              </span>
            </p>
          </div>
          <div id={'tag8'}>
            <h2>Сотрудничество</h2>
            <p>
              <span>Работа — в{' '}
                <a href={'https://vk.com/@jaco_blog-pismo-71-soiskatelyam-o-rabote-v-kafe-zhako'} target="_blank">кафе</a>{' '}и{' '}
                <a href={'https://vk.com/@jaco_blog-pismo-68-soiskatelyam-o-rabote-v-upravlyauschei-kompanii-zha'} target="_blank">Управляющей компании</a>
              </span>
              <br />
              <span>Бизнес —{' '}
                <a href={'https://franchise.jacofood.ru/'} target="_blank">стать франчайзи</a>
              </span>
              <br />
              <span>Отдел маркетинга —{' '}
                <a href={'mailto:event.jaco@gmail.com'}>event.jaco@gmail.com</a>{' '}+7 (906) 129-98-33
              </span>
              <br />
              <span>Отдел закупок —{' '}
                <a href={'mailto:zacupci.jaco@gmail.com'}>zacupci.jaco@gmail.com</a>{' '}
                +7 (903) 333-74-85
              </span>
            </p>
          </div>
        </div>
        <div>
          <BreadСrumbsPC {...data} />
        </div>
      </div>
      <FooterPC {...footer} />
    </>
  );
};

AboutPagePC.propTypes = {
  header: PropTypes.object,
  data: PropTypes.object,
  footer: PropTypes.object,
};
