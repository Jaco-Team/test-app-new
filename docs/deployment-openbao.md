# Production-сборка и конфигурация

Production `jacofood.ru` получает frontend только как неизменяемый Docker-образ,
собранный GitHub Actions из ветки `main`.

- Workflow: `.github/workflows/production-image.yml`. На pull request и push в
  `main` выполняются `npm ci`, `npm run typecheck` и `npm run test:core`.
- Публикацию запускает только Ansible-контроллер через `workflow_dispatch`.
  Он передаёт публичные `NEXT_PUBLIC_*` из OpenBao
  (`projects/site/prod/frontend-build`), их SHA256, версию KV и идентификатор
  запроса. `.github/scripts/jaco-site/prepare-public-build.py` проверяет
  точный набор ключей, домены и отпечаток, после чего значения передаются
  в Docker как build args. Repository variables/secrets для настроек
  приложения не используются; Actions secret `SENTRY_SITE_AUTH_TOKEN` передаётся
  как BuildKit secret `SENTRY_AUTH_TOKEN` только для загрузки sourcemaps.
- Образ: `ghcr.io/jaco-team/jaco-site-frontend:sha-<commit>` с меткой
  `io.jaco.site.public-config-sha256`. Артефакт `image-metadata` содержит
  digest для контроллера.
- Runtime env (`projects/site/prod/frontend-runtime`) контроллер доставляет
  на сервер отдельно; build args runtime env не заменяет.
- Все env-файлы исключаются из Docker context перед сборкой.

Существующий `deploy-dev.yml` относится к `dev.jacofood.ru` и production не
затрагивает. Файлы `.github/workflows/production-image.yml` и
`.github/scripts/jaco-site/*` проверяются контроллером по SHA256: любое
изменение требует обновления доверенных хешей на контроллере.

Настройка self-hosted Sentry и порядок миграции публичного DSN описаны в
[`sentry-self-hosted.md`](sentry-self-hosted.md).
