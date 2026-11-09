# Order Reviews — постановка задачи Site Frontend

## Цель

Подготовить и, если это входит в согласованный релиз `44127`, встроить отзыв по завершённому заказу в реальную историю заказов Site. Backend переносится из Chef в `laravel-api-site`, но браузер продолжает использовать существующий `POST /client_feedback`; frontend не должен знать, где физически разрешается форма и сохраняются ответы.

## Репозиторий и ветка

- Репозиторий: `test-app-new`.
- Ветка: `feat/order-reviews-44127`, создана от `origin/main`, upstream не настроен.
- Канонические API, data/security правила и rollout: `laravel-api-site/app/Site/Client_feedback/TASK.md` и `PLAN.md` в парной ветке.
- Chef FE/BE и `cafe_reviews` используются только как источник понимания и не изменяются.

## Текущее состояние

- Production controller и API-клиент находятся в `modules/clientFeedback` и обращаются только к Site Backend.
- Entry point встроен в реальные desktop/mobile детали заказа в `modules/profile/zakazy` и использует `token`, `point_id`, `order_id` из действующего flow.
- Production presentation вынесен в типизированный slice `modules/clientFeedback/orderReview`; Storybook импортирует его без обратной production-зависимости.
- Скрытый эксперимент, fake history shell, mock-режим и связанные env-флаги удалены.

## Объём Frontend

- Сначала выделить presentation отзыва в новом Storybook/FSD/TypeScript slice без fake history shell.
- Покрыть состояния: loading, готовая форма, validation error, submit, submitted, empty/unavailable, recoverable server/network error и retry.
- Затем встроить entry point в визуальные паттерны реальной истории: desktop `Dialog`, mobile bottom sheet/`SwipeableDrawer`, отдельное осознанное поведение tablet.
- Показывать CTA только для завершённых неудалённых заказов по доступным клиенту данным, но считать ответ `get_form` окончательным серверным решением.
- Загружать форму лениво при открытии; использовать реальные `token`, `point_id`, `order_id`; исключить двойной submit и корректно отражать уже отправленный отзыв.
- Обеспечить клавиатурное управление, focus trap/restore, понятные labels/errors, закрытие Escape/кнопкой/жестом без потери данных без предупреждения.
- Сохранить действующий browser API и обработку контрактных ошибок; frontend всегда вызывает только Site endpoint, без прямого или резервного пути в Chef.

## Ожидаемый результат

- Компоненты отзыва изолированно проверяются в Storybook и готовы для реальной истории заказов.
- При согласованном FE launch пользователь может открыть форму из завершённого заказа, отправить её один раз, увидеть подтверждение или восстановимую ошибку.
- Mobile `320–667`, tablet `668–990` и desktop `991+` имеют проверенный, неслучайный layout и interaction model.
- Fake `OrderHistoryBackground` не становится production-маршрутом и не дублирует настоящую историю.

## Не входит в задачу

- QR/cafe_reviews и их сценарий отзыва о кафе.
- Chef-конструктор форм, изменение backend-схемы или новый browser contract.
- Переписывание всей истории заказов вне минимальной интеграции CTA/modal/sheet.
- Загрузка фото: UI должен быть скрыт, пока нет реального backend/storage контракта.

## Критерии приёмки

- Storybook stories и component tests покрывают основные состояния, все поддержанные типы полей, ошибки/retry, close/focus и блокировку повторной отправки.
- API tests подтверждают точные запросы `get_form` / `submit_feedback`, передачу real identifiers и совместимую обработку ответов/ошибок.
- Интеграционная проверка выполнена в реальной PC/mobile истории, а не на искусственном фоне.
- Manual responsive matrix покрывает 320, 667, 668, 990, 991 и широкий desktop; отдельно проверены клавиатура, screen-reader labels, scroll и длинный контент.
- CTA не обещает доступность до ответа сервера; незавершённые/удалённые заказы не предлагают отзыв; submitted state переживает повторное открытие в рамках серверного поведения.
- Нет запросов к Chef и нет интерфейса фото без работающего контракта.

## Зависимости

- Стабильный совместимый контракт Site Backend и тестовые fixtures.
- Rollout и метрики координируются с Backend; frontend сам не определяет окончательную eligibility и не содержит Chef fallback.
