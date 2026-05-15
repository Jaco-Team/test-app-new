import './ModalActiveVK.scss';

export const ModalActiveVK = ({ link }: Record<string, any>) => {
  return (
    <div className="vk-modal">
      <img alt="Город" src={'/Favicon_city.png'} />
      <span>
        Подпишитесь на{' '}
        <a href={link} target="_blank">
          нашу группу Вконтакте
        </a>
        , где мы рассказываем о новинках, проводим конкурсы и разыгрываем
        вкусные призы.
      </span>
      <a className="buttons" href={link} target="_blank">
        Жако Вконтакте
      </a>
    </div>
  );
};
