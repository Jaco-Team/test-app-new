import Link from 'next/link';

import './FooterCookie.scss';

interface FooterCookieProps {
  cityName: string;
}

export function FooterCookie({ cityName }: FooterCookieProps) {
  return (
    <div className="FooterLegal">
      <div className="containerLegal">
        <div className="text">
          <p>
            Мы <Link className="link" href={`/${cityName}/politika-legal`}>используем</Link>{' '}
            файлы «Cookie» и метрическую систему «Яндекс.Метрика» для сбора и анализа информации о
            производительности и использовании сайта. Продолжая пользоваться сайтом, вы соглашаетесь
            на размещение файлов «Cookie» и обработку данных метрических систем.
          </p>
        </div>
        <button className="buttonAccept" type="button">
          <span>Согласен</span>
        </button>
      </div>
    </div>
  );
}
