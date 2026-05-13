# План покрытия Storybook

## Текущее состояние

- Новый слой Storybook лежит в FSD-структуре `stories/{shared,entities,features,widgets,pages}`.
- Legacy-истории остаются отдельно в `stories/legacy` только как reference для сверки переноса.
- После подтверждения, что legacy story перенесена в новый FSD Storybook, legacy-версию больше не рендерим в Storybook UI.
- Header/Footer сейчас вне зоны этой задачи: `stories/widgets/header`, `stories/widgets/footer`, старые `stories/widgets/Header*`, `stories/widgets/NavBarMobile`, `stories/shared/ui/footer-cookie`, `stories/shared/ui/scroll-top`.
- В новом слое без Header/Footer найдено 57 TSX story-файлов.
- Все эти 57 story-файлов имеют три варианта: `Mobile`, `Tablet`, `Desktop`.
- Общие viewport-значения уже заведены: mobile `320`, tablet `668`, desktop `991`.
- Interaction-тесты через `play` почти не используются в новом слое.
- В зависимостях пока нет `@storybook/test`, `@storybook/addon-vitest`, `vitest` или отдельного Storybook test-runner.

## Границы текущего этапа

Сейчас готовим только новый Storybook-слой. Core app не трогаем.

Строго не менять на этом этапе:

- `pages`;
- `components`;
- `modules`;
- `utils`;
- `public`;
- Next/runtime-конфиги, если изменение не нужно строго для запуска Storybook;
- backend-интеграции, API-клиенты, store и production data flow;
- legacy-компоненты и legacy-stories, кроме выключения их рендера в Storybook UI.

Последовательность проекта:

1. Подготовить новый Storybook как источник будущих компонентов.
2. Сверить все legacy stories с новым FSD Storybook и закрыть gaps.
3. Убрать legacy stories из видимого Storybook UI, оставив их reference-only в файлах.
4. Только следующим этапом обновлять core-код и подключать компоненты из Storybook вместо старых raw-компонентов.

## Целевая структура меню Storybook

Меню должно быть логичным для просмотра дизайна, а не повторять физические FSD-папки один в один.

Рекомендуемый верхний уровень:

- `Страницы`
- `Виджеты`
- `Фичи`
- `Сущности`
- `Общие элементы`

Legacy не должен быть верхним уровнем в видимом Storybook UI после сверки переноса.

Правила нейминга:

- Заголовки, docs labels и story names пишем на русском.
- Технические имена компонентов в коде оставляем как есть, пока идет перенос.
- Не смешиваем `Cart`, `Header`, `ПК`, `Главная страница` в одном стиле внутри разных веток.
- Для новых историй используем единый порядок story-вариантов: `Desktop`, `Tablet`, `Mobile`, затем состояния.
- Legacy-истории не смешиваем с новым FSD-слоем и не показываем в меню после подтверждения переноса.

Предлагаемая нормализация дерева:

- `Страницы/Главная`
- `Страницы/Акции`
- `Страницы/Контакты`
- `Страницы/О компании`
- `Страницы/Документы`
- `Страницы/Профиль/Личные данные`
- `Страницы/Профиль/Заказы`
- `Страницы/Профиль/Промокоды`
- `Виджеты/Корзина`
- `Виджеты/Главная/Баннеры`
- `Виджеты/Главная/Список товаров`
- `Виджеты/Контакты/Карта`
- `Виджеты/Заказы/Таблица`
- `Виджеты/Акции/Детальная акция`
- `Фичи/Авторизация`
- `Фичи/Город и адрес`
- `Фичи/Оформление заказа`
- `Фичи/Модалка товара`
- `Фичи/Заказы`
- `Фичи/Социальные сети`
- `Сущности/Товар`
- `Сущности/Корзина`
- `Сущности/Заказ`
- `Сущности/Профиль`
- `Сущности/Акция`
- `Общие элементы/Кнопки`
- `Общие элементы/Поля ввода`
- `Общие элементы/Select`
- `Общие элементы/Switch`
- `Общие элементы/Иконки`
- `Общие элементы/Меню`
- `Общие элементы/Хлебные крошки`
- `Общие элементы/Уведомления`

## Breakpoints

Базовые диапазоны проекта:

- `Mobile`: 320-667
- `Tablet`: 668-990
- `Desktop`: 991+

Что нужно поправить в базе Storybook:

- Оставить canonical viewport keys: `mobile`, `tablet`, `desktop`.
- В названиях viewport явно указать диапазоны: `Мобилка 320-667`, `Планшет 668-990`, `Десктоп 991+`.
- Для story-вариантов использовать `parameters.viewport.defaultViewport`, чтобы при открытии `Mobile`, `Tablet`, `Desktop` iframe реально переключался.
- Глобальный default лучше держать `desktop`, чтобы обычный просмотр не ломал desktop-first компоненты.
- Для проверки границ добавить отдельные служебные viewports `mobileMax` и `tabletMax`, но не делать их обязательными story-вариантами для каждого компонента.
- Не добавлять breakpoint-логику в story-код. Story только выбирает viewport, компонент сам отвечает CSS/media/container queries.

## Testing Base

Storybook 10 рекомендует писать interaction tests прямо в stories через `play`. Это подходит проекту лучше, чем пачка отдельных `*.test.ts`, потому что одна история становится:

- документацией;
- визуальным примером;
- executable interaction test.

Нужная база:

- Добавить `@storybook/test`.
- Добавить Vitest-интеграцию Storybook: `@storybook/addon-vitest` и `vitest`.
- Включить addon в `.storybook/main.mjs`.
- Завести npm script для Storybook-тестов без влияния на `npm run dev` и core build.
- Держать тестовые helpers в `stories/shared/lib/storybook`.
- Не заводить отдельные `*.test.ts` для простых UI-состояний, пока сценарий нормально живет в `play`.
- Отдельные `*.test.ts` использовать только для чистых функций, сложных мапперов и edge cases без DOM.
- `*.visual.ts` не вводить сейчас: визуальные проверки лучше закрывать story variants + Chromatic после стабилизации дерева.

## Что тестировать в stories

Минимальный baseline для каждой новой истории:

- Story рендерится без ошибок.
- Основной текст/кнопка/контейнер доступен через role/text/label.
- Для `Mobile`, `Tablet`, `Desktop` проверяется не пиксельная верстка, а наличие ключевых элементов и отсутствие критичных скрытых блоков.

Интерактивные компоненты:

- `Button`: click вызывает handler.
- `TextInput`: ввод текста, focus, disabled/error states.
- `Select`: открытие, выбор значения, disabled state.
- `Switch`: переключение и disabled state.
- `CloseButton`: click вызывает handler.
- `MyMenu`: открытие/выбор пункта, корректные ссылки.
- `Breadcrumbs`: переходные ссылки и текущий последний элемент.

Фичи:

- `Авторизация`: ввод телефона, SMS-код, disabled/loading/error states.
- `Город и адрес`: выбор города, поиск/выбор адреса, empty/error states.
- `Оформление заказа`: выбор доставки/самовывоза, дата/время, комментарий, submit disabled/enabled.
- `Модалка товара`: выбор варианта, добавление количества, добавление в корзину.
- `Заказы`: открытие модалки заказа, отмена заказа, confirm/cancel flows.

Страницы и виджеты:

- Проверять smoke/render и ключевые блоки.
- Не тестировать backend/data fetching в Storybook.
- Все данные брать из fixtures рядом со stories или из `stories/fixtures`.

## Порядок внедрения

1. Составить checklist legacy stories -> new FSD stories.
2. Подтвердить, что каждая legacy story либо уже перенесена, либо явно записана как gap.
3. Исключить `stories/legacy` из рендера Storybook UI, оставив файлы как reference-only.
4. Нормализовать Storybook navigation titles без изменения core-компонентов.
5. Привести viewport keys и responsive helper к единому контракту.
6. Проверить вручную в UI, что `Mobile`, `Tablet`, `Desktop` реально переключают iframe.
7. Добавить `@storybook/test`, Vitest addon и отдельный npm script.
8. Начать с shared UI interaction tests: button, input, select, switch, breadcrumbs, menu.
9. Затем покрыть features по пользовательским сценариям.
10. Затем добавить smoke checks для pages/widgets.
11. После стабилизации подключить CI-команду Storybook tests.
12. После стабилизации визуального дерева решать отдельно по Chromatic/visual regression.

## Definition Of Done

- Storybook UI имеет предсказуемое русское дерево.
- Все новые stories открываются в понятных ветках.
- Legacy stories не отображаются в Storybook UI после сверки переноса.
- У каждого нового компонента есть `Mobile`, `Tablet`, `Desktop`.
- Breakpoint story реально выставляет нужный viewport.
- Интерактивные shared UI и основные features имеют `play` checks.
- Тестовая база не трогает core app, backend и production data flow.
- `npm run dev` и текущий production build не меняют поведение из-за Storybook-подготовки.
