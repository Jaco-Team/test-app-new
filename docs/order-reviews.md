# Отзывы о завершённых заказах

## Назначение

Форма отзыва встроена в реальные детали заказа в истории профиля. Отдельного
экспериментального маршрута, env-флага и локального mock-режима нет.

Кнопка «Оценить заказ» показывается только когда поля детального заказа уже
пришли числами и одновременно выполняются условия:

- `status_order === 6`;
- `is_delete === 0`.

Окончательное решение о доступности формы всегда принимает Site Backend.
Frontend лениво запрашивает форму только после нажатия кнопки.

## UI и состояния

- Mobile `320–667`: `SwipeableDrawer` снизу.
- Tablet `668–990`: центрированный MUI `Dialog`.
- Desktop `991+`: центрированный MUI `Dialog`.

Production presentation-слой находится в
`modules/clientFeedback/orderReview`, Storybook stories и fixtures — в
`stories/features/order-review`. Production controller не импортирует код из
Storybook и находится в `modules/clientFeedback/OrderReviewController.jsx`.

Поддерживаются состояния loading, empty, recoverable load error, ready,
submitting, submit error, submitted и already submitted. Пока отправка идёт,
повторный запрос и закрытие блокируются. Если пользователь уже ввёл данные,
закрытие требует подтверждения в отдельном MUI dialog. Фото не показываются и
не отправляются: такого контракта у Site Backend нет.

## Browser API

Frontend обращается только к Site endpoint `POST /client_feedback` через общий
helper `api()`.

Получение формы:

```js
api('client_feedback', {
  type: 'get_form',
  point_id: pointId,
  order_id: orderId,
  token,
});
```

Сохранение:

```js
api('client_feedback', {
  type: 'submit_feedback',
  point_id: pointId,
  order_id: orderId,
  responses: JSON.stringify(responses),
  token,
  __disableRetry: true,
});
```

`responses` содержит только `target_id`, `element_id` и значение элемента.
Frontend не выбирает форму, не передаёт `form_id` и не воспроизводит серверные
правила eligibility. Автоматический retry мутации отключён; повтор возможен
только явным действием пользователя после ошибки.

## Владение и независимость

Site Backend самостоятельно получает конфигурацию формы, проверяет владельца
и состояние заказа, нормализует ответы и сохраняет отзыв в Site databases.
Frontend не содержит URL, токенов, fallback или adapter-пути в Chef.

## Проверка

- API tests проверяют точные payload `get_form` и `submit_feedback` и запрет
  автоматического retry при сохранении.
- Unit tests проверяют строгий CTA gate, условия видимости, сбор ответов и
  клиентскую валидацию.
- Storybook покрывает ready, submitting, submit error, loading, empty, load
  error, submitted и already submitted.
- Ручная responsive-проверка выполняется на `320`, `667`, `668`, `990`, `991`
  и широком desktop в реальной истории заказов.
