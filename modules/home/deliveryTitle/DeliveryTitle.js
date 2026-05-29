export default function DeliveryTitle({ text = '' }) {
  // H1 приходит с сервера в page.page_h; пустой — заголовок не показываем.
  const title = String(text ?? '').trim();
  if (!title) {
    return null;
  }

  return <h1 className="homeDeliveryTitle">{title}</h1>;
}
