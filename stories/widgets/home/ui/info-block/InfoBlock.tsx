import React, { useState } from 'react';
import './InfoBlock.scss';

const InfoBlock: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="info-block">
      {/* ---------- всегда видимая часть ---------- */}
      <div className="info-block__body">
        <p className="info-block__text">
          <strong>«Жако»</strong> — сеть кафе и доставка готовой еды. Мы
          работаем по Самаре: готовим и доставляем свежие блюда на дом или в
          офис к выбранному времени, чтобы вы могли заранее спланировать обед
          или ужин. В меню — классические, фирменные, горячие роллы, сеты на
          компанию, пицца 35 см с большим количеством начинки, паста, салаты,
          десерты и напитки.
        </p>

        <p className="info-block__text">
          Используем отборные ингредиенты: премиальный лосось, сочные креветки,
          рис высшего сорта, настоящий угорь, сыры высокого качества и другие
          продукты.
          <br />
          Блюда готовим только после оформления заказа.
        </p>

        {/* ---------- разворачиваемая часть ---------- */}
        <div
          className={`info-block__expandable ${
            isOpen ? 'info-block__expandable--open' : ''
          }`}
        >
          <h3 className="info-block__subtitle">Почему заказывают у нас:</h3>
          <ul className="info-block__list">
            <li>большие порции, сбалансированный состав и вкус блюд;</li>
            <li>составы без заменителей молочного жира, трансжиров и ГМО;</li>
            <li>повара готовят быстро и вкусно;</li>
            <li>курьеры доставляют аккуратно;</li>
            <li>чистая кухня, регулярные проверки, контроль качества;</li>
            <li>быстрая обратная связь.</li>
          </ul>

          <p className="info-block__text">
            Доставка работает в Самарском, Ленинском, Октябрьском, Советском,
            Промышленном, Кировском и Железнодорожном районах Самары.
          </p>
          <p className="info-block__text">
            Стоимость доставки не включена в цену блюд; вы можете сэкономить,
            забрав заказ самовывозом.
            <br />
            Добавляйте блюда в корзину и заказывайте онлайн — приготовим и
            привезём к удобному времени.
          </p>

          <p className="info-block__text">
            Также вы можете выбрать и заказать блюда с помощью оператора по
            телефону:
          </p>

          <a href="tel:+78463004653" className="info-block__phone">
            +7 846 300-46-53
          </a>
        </div>
      </div>

      <button
        className="info-block__toggle"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="info-block-expandable"
      >
        <span>{isOpen ? 'Свернуть' : 'Подробнее'}</span>
        <svg
          className={`info-block__arrow ${isOpen ? 'info-block__arrow--up' : ''}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default InfoBlock;
