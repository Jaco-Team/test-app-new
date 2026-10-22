# Order Reviews — план Site Frontend

Backend-план и контракт являются каноническими для eligibility, формы, данных, безопасности, идемпотентности и rollout: `laravel-api-site/app/Site/Client_feedback/PLAN.md`. Этот документ описывает только presentation, интеграцию с историей и клиентскую проверку.

## Целевой пользовательский поток

1. Пользователь видит CTA у подходящего завершённого неудалённого заказа в настоящей истории.
2. При открытии UI лениво отправляет `get_form` с текущими `token`, `point_id`, `order_id`.
3. Site Backend подтверждает доступность и возвращает форму; клиент рендерит только серверно разрешённые элементы.
4. Валидные ответы один раз отправляются через `submit_feedback`; кнопка и close-поведение защищают от повторов и случайной потери ввода.
5. UI показывает submitted state либо понятную восстановимую ошибку с retry; сервер остаётся источником истины при повторном открытии.

## Этапы

### 1. Инвентаризация без расширения scope

- Зафиксировать текущие `clientFeedback` API/types, env-gate и состояния `FeedbackExperience`.
- Исследовать настоящие desktop/mobile компоненты `modules/profile/zakazy`, источники `token/point_id/order_id`, правила status/deleted и существующие Dialog/Drawer паттерны.
- Сопоставить browser contract с Backend `CONTRACT.md`; не добавлять поля и не переносить eligibility на клиент.
- Отдельно зафиксировать, что `OrderHistoryBackground` — demo shell, а не основа интеграции.

### 2. Storybook-first presentation

- Спроектировать FSD+TypeScript slice в подходящих `stories/{features,entities,shared}` с однонаправленными зависимостями.
- Отделить renderer формы, field adapters, validation messages, submit/status panel и modal/sheet content от API/store/history shell.
- Создать stories для loading, empty/unavailable, каждого поддержанного типа, mixed long form, validation, submitting, submitted, server/network error и retry.
- Не показывать фото/upload controls до появления отдельного контракта.

### 3. Responsive и accessibility

- Mobile `320–667`: bottom sheet/`SwipeableDrawer`, корректные safe areas, scroll, touch targets и закрытие жестом с защитой введённых данных.
- Tablet `668–990`: отдельный размер/композиция и решение modal vs sheet, утверждённое дизайном, а не растянутая mobile-версия.
- Desktop `991+`: MUI `Dialog`, ограниченная читаемая ширина, внутренний scroll и видимое основное действие.
- Для всех: heading/description association, labels и ошибки, focus trap, initial focus, restore focus на CTA, Escape/close, disabled/busy semantics и live announcement результата.

### 4. Интеграция с реальной историей

- Добавить CTA в согласованную точку `modules/profile/zakazy`, переиспользуя её визуальные паттерны и не перестраивая модуль целиком.
- Предварительно фильтровать очевидно неподходящие заказы для UX, но подтверждать eligibility только ленивым `get_form`.
- Передавать настоящие store credentials/identifiers и открывать desktop/tablet/mobile container по утверждённой матрице.
- После submit блокировать повтор, показать подтверждение и синхронизировать локальное состояние с серверным ответом; повторное открытие снова уважает сервер.
- Удалить или изолировать fake history entry point согласно отдельному решению, не оставляя два production flow.

### 5. Проверка

- API tests: payload обоих типов, auth/ids, success/empty/already submitted, contract error, network error, retry, abort/close, отсутствие Chef URL.
- Component/Storybook tests: все field adapters, required/invalid, loading/submitting, no double submit, submitted, error recovery, dirty close.
- Integration: CTA и container в реальной истории с несколькими заказами, сменой заказа, недоступной/изменившейся формой и повторным открытием.
- A11y: keyboard-only, focus trap/restore, accessible names/descriptions/errors, announcement состояния.
- Manual matrix: 320, 667, 668, 990, 991 и широкий desktop; portrait/landscape где применимо, длинная форма, viewport keyboard и scroll.
- Не запускать lint/prettier/eslint без отдельного запроса; backend concurrency/DB проверки выполняются по Backend-плану.

## Rollout и deployment rollback

- Если релиз backend-only, новый entry point остаётся выключенным, но Storybook slice может быть подготовлен и проверен независимо.
- При FE launch использовать существующий или явно согласованный feature/env gate; единственный API route ведёт в Site, без прямого или резервного обращения в Chef.
- Наблюдать open/get success, empty/unavailable, submit success/error, latency и retry без PII/содержимого ответов.
- При превышении согласованных порогов выключить FE entry point и при необходимости откатить deployment Site по Backend-плану; runtime fallback в Chef отсутствует.
- После стабильного окна удалить устаревший demo entry point только отдельным осознанным изменением.

## Открытые продуктовые решения и последствия

- **FE launch в `44127` или backend-only.** Первый вариант требует end-to-end acceptance и rollout UI; второй ограничивает задачу переносом Backend и подготовкой presentation без production entry point.
- **Место CTA.** Карточка заказа проще и заметнее; детали заказа дают больше контекста; оба места требуют единого состояния и защиты от дублей.
- **Скрытый эксперимент.** Сохранение полезно только как временный sandbox; его production retention создаст второй flow. Рекомендуется переиспользовать пригодную presentation-логику, а fake shell удалить после интеграции.
- **Фото.** Рекомендация — полностью скрыть UI до отдельного backend/storage/security контракта.
- **Окно доступности.** Текущее наблюдаемое правило — любой завершённый неудалённый заказ среди последних десяти. Ограничение по времени/количеству должно быть продуктово утверждено и применяться сервером; FE лишь отражает результат.
- **Tablet container.** Нужно утвердить Dialog или bottom sheet для `668–990`; решение влияет на interaction tests и дизайн states.
- **Наблюдаемость.** До запуска нужны численные пороги get/submit ошибок, latency, владелец мониторинга и длительность стабильного окна.
