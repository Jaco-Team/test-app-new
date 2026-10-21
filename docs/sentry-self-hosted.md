# Sentry клиентского сайта

- Сервер: https://sentry.jacochef.ru/.
- Организация `sentry`, проект `jacofood-web` (ID `4`).
- Проект: https://sentry.jacochef.ru/settings/sentry/projects/jacofood-web/.
- Дашборд: https://sentry.jacochef.ru/organizations/sentry/dashboard/2/.
- Его воспроизводимая конфигурация: `config/sentry-dashboard.json`.

## Сбор данных

Браузер, Node.js и Edge используют новый DSN из `.env.example`. Прежний облачный
DSN и DSN других проектов отклоняются. SDK отправляет все ошибки и выборку 10%
трассировок; оценки количества переходов на дашборде учитывают эту выборку.
События браузера содержат маршрут, тип подключения и технические метки API.
Для дополнительных ошибок API и ресурсов нужен
`NEXT_PUBLIC_SENTRY_CUSTOM_MONITORING_ENABLED=true` при сборке.

Отключены Replay, пользовательские данные, cookie, заголовки и тела HTTP-запросов.
Фильтры убирают query/hash из URL и console breadcrumbs. Логи SDK не отправляются.
Серверное удаление IP включено в настройках проекта. Тестовые события имеют
`monitoring_check:true`, окружение `validation` и исключены из рабочего дашборда.

## Sourcemap и GitHub

GitHub Actions secret `SENTRY_SITE_AUTH_TOKEN` содержит токен внутренней интеграции
«Jacofood CI source maps» с разрешением Continuous Integration (`org:ci`).
Значение не хранится в репозитории, OpenBao public snapshot или Docker build args.
В Docker оно передаётся через BuildKit secret `SENTRY_AUTH_TOKEN`.

Production workflow задаёт `SENTRY_UPLOAD_SOURCEMAPS=true` и
`SENTRY_RELEASE=jacofood-web@<полный SHA коммита>`. Загрузка идёт только на
`sentry.jacochef.ru`, в проект `jacofood-web`. Создаются release и debug-ID artifact
bundles; отдельная OAuth-интеграция GitHub для расшифровки стека не требуется.
Релиз позволяет найти точный коммит на GitHub по SHA. Автоматическая привязка
коммитов через GitHub-интеграцию (`setCommits`) не включена.

Локальная сборка по умолчанию ничего не загружает. Старые локальные токены Sentry
Cloud не используются для self-hosted. После загрузки карты удаляются; Docker
дополнительно удаляет оставшиеся `.map` до копирования runtime-образа.
Ошибка создания release или загрузки карт останавливает CI, включая ответы 401.

Workflow `Site Sentry validation` проверяет загрузку на отдельной ветке
`setup/site-sentry-selfhost` и может быть запущен вручную из `main` после слияния.
Он не публикует образ и не разворачивает приложение. Синтетическая ошибка
использует debug ID реального клиентского bundle, не обращаясь к API заказов.
В Sentry у события нужно проверить исходный файл `pages/sentry-example-page.jsx`
и контекст строки с `myUndefinedFunction()`; одного HTTP 200 при приёме события
недостаточно для подтверждения расшифровки.

Проверка 21.10.2026: workflow run `39602324507` успешно загрузил карты; событие
`24504ad58aad4303ac98c59ed2e50094` расшифровано до исходного файла, строки 72,
с контекстом кода и пустым списком ошибок обработки. Production при проверке
не изменялся.

## Включение в production

1. В OpenBao `projects/site/prod/frontend-build` заменить только
   `NEXT_PUBLIC_SENTRY_DSN` на DSN проекта `4` и включить
   `NEXT_PUBLIC_SENTRY_CUSTOM_MONITORING_ENABLED=true`. Остальные ключи сохраняются.
2. Если runtime `SENTRY_DSN` задан, заменить его тем же DSN; иначе сервер использует
   встроенный `NEXT_PUBLIC_SENTRY_DSN`. `SENTRY_ENABLED=false` отключает серверный SDK.
3. После ревью и слияния обновить доверенные SHA256 production workflow и
   `.github/scripts/jaco-site/prepare-public-build.py` на Ansible-контроллере,
   включая установленную там копию валидатора. См. `deployment-openbao.md`.
   Прежний валидатор допускает только облачный DSN. Не обходить trust-проверки.
4. Запустить штатный выпуск контроллером с новой версией публичного snapshot.
   Убедиться, что CI загрузил sourcemap, а runtime работает с соответствующим
   коммиту release. Смена DSN в runtime без пересборки браузерный DSN не меняет.
5. Проверить ошибки и запросы дашборда на настоящем трафике после выпуска.

Изменения OpenBao, доверенных хешей и production-релиз не выполняются тестовым
workflow. Пока они не применены, работающий сайт продолжает старую конфигурацию.

## Устойчивость и очистка диагностики

SDK 11 использует `traceLifecycle: stream`: очистка span выполняется через
`beforeSendSpan` в браузере, Node.js и Edge. `beforeSendTransaction` не подключён,
поскольку в этом режиме SDK его игнорирует. Удаляются query/hash из URL в имени,
атрибутах и связях span, сообщениях исключений, stack frames, breadcrumbs и
вложенных технических контекстах. Заголовки, тела, телефон и значения токенов
не должны добавляться в диагностику; `hasToken` и тип операции сохраняются.

После ошибки исполняемого JS/CSS собственной сборки или Next.js invariant
`attempted to hard navigate to the same URL` допускается одна перезагрузка на
путь за сессию. Отметка записывается до reload. При запрете хранилища, offline
или скрытой вкладке автоматической перезагрузки нет. Ошибка prefetch/preload
сама по себе не сбрасывает текущую страницу. Корзина в persistent storage не
очищается. Сохранение ресурсов предыдущей сборки и маршрутизация старых
`/_next/data/<buildId>/` требуют отдельной проверки конфигурации выпуска.

Из error feed исключены ошибки загрузки конкретных аналитических скриптов
Mail.ru, VK Retargeting (`/js/api/openapi.js`) и `mc.yandex.by`. Ошибки ЮKassa,
Яндекс Карт и остальных скриптов `yastatic.net` продолжают отправляться.
`Permissions::query`, `fireChangeEvent` и `notifyReadyEvent` без подтверждённого
источника не подавляются. Их количество не равно числу пострадавших клиентов.

Ожидание Яндекс Карт ограничено общим сроком, включая фазу `ymaps.ready`;
поздний callback после таймаута не меняет результат. Регрессии проверяются
командой `npx vitest run --config tests/monitoring/vitest.config.mjs`.
