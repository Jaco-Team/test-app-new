# Экспериментальная форма отзывов

## Что реализовано

Форма перенесена из Figma в отдельный маршрут:

```text
/{city}/feedback-experiment?point_id=7&order_id=12345
```

Существующие страницы истории заказов и профиля не изменяются. Маршрут закрыт серверным env-флагом и при выключенном флаге отвечает `404`.

Экран включает:

- общую оценку заказа;
- теги и текстовый комментарий;
- отдельную оценку доставки;
- отдельную оценку каждой позиции заказа;
- выбор и локальный предпросмотр до трёх фотографий;
- состояния загрузки, ошибки, повторной отправки и успешного сохранения;
- отдельные варианты Mobile `320–667`, Tablet `668–990` и Desktop `991+`.

На Desktop форма открывается модальным окном поверх истории заказов. На Mobile это нижний полноэкранный лист, на Tablet — увеличенное центрированное окно.

## Включение

```dotenv
CLIENT_FEEDBACK_EXPERIMENT_ENABLED=true
CLIENT_FEEDBACK_EXPERIMENT_USE_MOCKS=true
```

После изменения env нужно перезапустить Next.js. Переменные намеренно не имеют префикса `NEXT_PUBLIC_`: решение о доступности маршрута принимается на сервере.

Режимы:

- `CLIENT_FEEDBACK_EXPERIMENT_ENABLED=false` — маршрут отсутствует;
- `CLIENT_FEEDBACK_EXPERIMENT_ENABLED=true` и `CLIENT_FEEDBACK_EXPERIMENT_USE_MOCKS=true` — UI работает на локальном контракте;
- `CLIENT_FEEDBACK_EXPERIMENT_ENABLED=true` и `CLIENT_FEEDBACK_EXPERIMENT_USE_MOCKS=false` — UI обращается к модулю `client_feedback` самописного backend сайта.

Для локальной проверки:

```text
http://localhost:3000/togliatti/feedback-experiment?point_id=7&order_id=12345
```

## Архитектура интеграции

```text
Браузер
  POST /site/public/index.php/client_feedback
      type=get_form | submit_feedback
      token пользователя сайта
          |
          v
Самописный backend сайта
  1. проверяет сессию и принадлежность заказа пользователю
  2. преобразует responses из JSON-строки в массив
  3. добавляет серверный Bearer-токен
          |
          v
Laravel Chef
  POST /api/v1/client-feedback/form
  POST /api/v1/client-feedback/submit
```

`CLIENT_FEEDBACK_API_TOKEN` нельзя передавать в браузер, cookie, HTML, JavaScript-бандл или переменную `NEXT_PUBLIC_*`. Он должен храниться только в окружении самописного backend сайта.

## Контракт браузер → backend сайта

Фронт использует существующий helper `api()` и обычный модуль `client_feedback`. Helper сам добавляет `ts`, `sig`, таймаут и обработку сетевых ошибок.

Получение формы:

```js
import { api } from '@/components/api';

const result = await api('client_feedback', {
  type: 'get_form',
  point_id: 7,
  order_id: 12345,
  token: userToken,
});
```

Сохранение:

```js
const responses = [
  {
    target_id: -100,
    element_id: 'element-1756397981848',
    value: 5,
  },
  {
    target_id: 321,
    element_id: 'element-1756398166076',
    value: 'Всё понравилось',
  },
];

const result = await api('client_feedback', {
  type: 'submit_feedback',
  point_id: 7,
  order_id: 12345,
  responses: JSON.stringify(responses),
  token: userToken,
  __disableRetry: true,
});
```

`responses` передаётся JSON-строкой, потому что текущий сайт использует `application/x-www-form-urlencoded`. Самописный backend должен выполнить `json_decode` перед запросом в Laravel.

Прямой HTTP-запрос к backend сайта выглядит так. `ts` и `sig` формируются существующим механизмом подписи сайта:

```bash
curl -X POST 'https://api2.jacochef.ru/site/public/index.php/client_feedback' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'type=get_form' \
  --data-urlencode 'point_id=7' \
  --data-urlencode 'order_id=12345' \
  --data-urlencode 'token=USER_SITE_TOKEN' \
  --data-urlencode 'ts=UNIX_TIMESTAMP' \
  --data-urlencode 'sig=VALID_SITE_SIGNATURE'
```

Backend сайта возвращает ответ Laravel без дополнительной обёртки `data`, чтобы текущий `api()` получил объект с полями `st`, `targets`, `submitted` и `feedback_ids`.

## Обработчик в самописном backend

Ниже логика адаптера для PHP 8. Названия функций проверки пользователя нужно связать с текущей системой авторизации сайта.

```php
<?php

$pointId = filter_input(INPUT_POST, 'point_id', FILTER_VALIDATE_INT);
$orderId = filter_input(INPUT_POST, 'order_id', FILTER_VALIDATE_INT);
$type = (string) ($_POST['type'] ?? '');
$siteToken = (string) ($_POST['token'] ?? '');

if (!$pointId || !$orderId) {
    http_response_code(422);
    exit(json_encode(['st' => false, 'text' => 'Некорректный заказ']));
}

// Обязательно: проверить сессию и принадлежность заказа пользователю.
assertOrderBelongsToClient($siteToken, $pointId, $orderId);

$path = match ($type) {
    'get_form' => '/api/v1/client-feedback/form',
    'submit_feedback' => '/api/v1/client-feedback/submit',
    default => null,
};

if ($path === null) {
    http_response_code(422);
    exit(json_encode(['st' => false, 'text' => 'Неизвестный тип запроса']));
}

$payload = ['point_id' => $pointId, 'order_id' => $orderId];

if ($type === 'submit_feedback') {
    $payload['responses'] = json_decode((string) ($_POST['responses'] ?? ''), true);
    if (!is_array($payload['responses'])) {
        http_response_code(422);
        exit(json_encode(['st' => false, 'text' => 'Некорректные ответы']));
    }
}

$curl = curl_init(rtrim(getenv('CHEF_API_URL'), '/') . $path);
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 12,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . getenv('CLIENT_FEEDBACK_API_TOKEN'),
        'Accept: application/json',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
]);

$body = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
curl_close($curl);

http_response_code($status ?: 502);
header('Content-Type: application/json; charset=utf-8');
echo $body ?: json_encode(['st' => false, 'text' => 'Chef API недоступен']);
```

Переменные окружения самописного backend:

```dotenv
CHEF_API_URL=https://chef.example.ru
CLIENT_FEEDBACK_API_TOKEN=длинный_случайный_секрет
```

## Запросы backend сайта → Laravel

Получение формы:

```bash
curl -X POST "$CHEF_API_URL/api/v1/client-feedback/form" \
  -H "Authorization: Bearer $CLIENT_FEEDBACK_API_TOKEN" \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data '{"point_id":7,"order_id":12345}'
```

Сохранение:

```bash
curl -X POST "$CHEF_API_URL/api/v1/client-feedback/submit" \
  -H "Authorization: Bearer $CLIENT_FEEDBACK_API_TOKEN" \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data '{
    "point_id": 7,
    "order_id": 12345,
    "responses": [
      {
        "target_id": -100,
        "element_id": "element-1756397981848",
        "value": 5
      },
      {
        "target_id": 321,
        "element_id": "element-1756398166076",
        "value": "Всё понравилось"
      }
    ]
  }'
```

Laravel проверяет завершённость заказа, заново разрешает актуальные формы и не доверяет переданным типам элементов или `form_id`.

## Ответ формы

Backend сайта возвращает ответ Laravel без дополнительной обёртки `data`. Ответ содержит состояние заказа и уже готовое описание формы: фронту не нужно знать правила конструктора или самостоятельно выбирать `form_id`.

### Поля верхнего уровня

| Поле           | Тип       | Назначение                                                              |
| -------------- | --------- | ----------------------------------------------------------------------- |
| `st`           | boolean   | Признак успешного выполнения запроса                                    |
| `submitted`    | boolean   | `true`, если по этому заказу уже существует хотя бы один отзыв          |
| `feedback_ids` | integer[] | ID существующих отзывов; при первой загрузке обычно пустой массив       |
| `order`        | object    | Минимальные данные заказа, по которому строится форма                   |
| `targets`      | object[]  | Объекты, которые пользователь может оценить: заказ, тип заказа и товары |

Объект `order`:

| Поле           | Тип     | Назначение                                                    |
| -------------- | ------- | ------------------------------------------------------------- |
| `point_id`     | integer | ID точки                                                      |
| `order_id`     | integer | Локальный ID заказа в базе точки                              |
| `status_order` | integer | Для доступного отзыва всегда `6`                              |
| `type_order`   | integer | `1` — доставка, `2` — самовывоз, `3` — зал, `4` — зал с собой |

Объект `target`:

| Поле            | Тип      | Назначение                                                                        |
| --------------- | -------- | --------------------------------------------------------------------------------- |
| `target_id`     | integer  | Идентификатор объекта оценки                                                      |
| `target_type`   | string   | `order`, `order_type` или `product`                                               |
| `name`          | string   | Заголовок объекта, например «Общая оценка», «Доставка» или название товара        |
| `category_name` | string   | Категория товара; для заказа и типа заказа приходит пустая строка                 |
| `form_id`       | integer  | Фактически выбранная сервером форма; информационное поле, обратно не отправляется |
| `type_id`       | integer  | Условие, по которому выбрана форма                                                |
| `elements`      | object[] | Плоский список элементов в порядке конструктора                                   |

Значения `target_id`:

- положительное число — ID товара из заказа;
- `-1` — доставка;
- `-2` — самовывоз;
- `-3` — зал;
- `-4` — зал с собой;
- `-100` — общая оценка заказа.

Значения `type_id`:

- `1` — форма выбрана по конкретному товару;
- `2` — по категории товара;
- `3` — по типу заказа;
- `4` — универсальная форма с условием `always`.

Приоритет выбора: товар → категория → тип заказа → `always`. Если совпали две формы одного уровня, Laravel выбирает форму с большим приоритетом канала `client_site`, затем с меньшим `form_id`.

В ответ попадают только активные формы с каналом «Сайт». Элемент конструктора `block` в браузер не приходит: Laravel разворачивает подходящий блок и возвращает его дочерние элементы внутри `target.elements`. Общие элементы формы не дублируются.

### Общая структура элемента

Каждый элемент имеет вид:

```json
{
  "id": "element-1756397981848",
  "type": "rating",
  "data": {
    "value": 0
  },
  "answerable": true
}
```

- `id` — стабильный ID из конструктора. Именно его нужно передавать как `element_id` при сохранении;
- `type` определяет компонент интерфейса и формат `value`;
- `data` содержит настройки элемента из конструктора;
- `answerable` показывает, разрешено ли отправлять ответ. Фронт собирает `responses` только для элементов с `answerable: true`.

Не нужно отправлять в `/submit` поля `form_id`, `type_id`, `type`, `data` или `answerable`. Laravel повторно получает актуальную форму и проверяет пару `target_id + element_id`.

### Все поддерживаемые типы элементов

#### `rating`

Пять звёзд. `data.value` может использоваться конструктором как начальное значение, но сайт начинает с отсутствующего ответа.

```json
{
  "id": "order-rating",
  "type": "rating",
  "data": { "value": 0 },
  "answerable": true
}
```

В `responses` передаётся целое число от `1` до `5`:

```json
{ "target_id": -100, "element_id": "order-rating", "value": 5 }
```

#### `input`

Однострочное текстовое поле. Сайт берёт подпись из `data.label` или `data.title`, placeholder — из `data.placeholder`. Максимум `500` символов.

```json
{
  "id": "client-name",
  "type": "input",
  "data": {
    "title": "Как к вам обращаться?",
    "placeholder": "Введите имя"
  },
  "answerable": true
}
```

Ответ:

```json
{ "target_id": -100, "element_id": "client-name", "value": "Михаил" }
```

Пустая строка фронтом не отправляется. Laravel обрезает пробелы по краям.

#### `textarea`

Многострочный комментарий. Использует те же поля `label`/`title` и `placeholder`, максимум `5000` символов.

```json
{
  "id": "order-comment",
  "type": "textarea",
  "data": {
    "title": "Ваш комментарий",
    "placeholder": "Напишите подробнее"
  },
  "answerable": true
}
```

Ответ:

```json
{ "target_id": -100, "element_id": "order-comment", "value": "Всё понравилось" }
```

#### `checkbox`

Один флаг. Подпись берётся из `data.label` или `data.title`. `data.param` сохраняется вместе с ответом и используется аналитикой.

```json
{
  "id": "contact-agreement",
  "type": "checkbox",
  "data": {
    "label": "Со мной можно связаться",
    "param": "can_contact"
  },
  "answerable": true
}
```

Ответ должен быть именно boolean, не `0`, `1` и не строка:

```json
{ "target_id": -100, "element_id": "contact-agreement", "value": true }
```

#### `checkboxGroup`

Группа вариантов. Заголовок берётся из `data.title` или `data.label`. Каждый вариант должен иметь уникальный `param`; `label` показывается пользователю.

```json
{
  "id": "delivery-details",
  "type": "checkboxGroup",
  "data": {
    "title": "Что понравилось в доставке?",
    "checkboxes": [
      {
        "id": "preset-1",
        "label": "Быстро доставили",
        "param": "fast_delivery"
      },
      { "id": "preset-2", "label": "Вежливый курьер", "param": "polite_driver" }
    ],
    "conditions": {}
  },
  "answerable": true
}
```

В ответ отправляются не подписи и не `id`, а выбранные `param`:

```json
{
  "target_id": -1,
  "element_id": "delivery-details",
  "value": ["fast_delivery", "polite_driver"]
}
```

Массив должен состоять из уникальных разрешённых значений. Пустой массив не отправляется. Текущий UI показывает `checkboxGroup` только после выбора рейтинга текущего `target`.

Конструктор может вернуть `data.conditions` со звёздами, товарами или категориями. Сейчас сайт эти условия не интерпретирует: группа показывается после любой оценки. Для условного показа на сайте следует использовать `data.showWhen`, описанный ниже, либо отдельно реализовать поддержку `conditions`.

#### `tagCloud`

Набор тегов-кнопок. В `data.availableTags` приходит полный список разрешённых значений. Заголовок берётся из `data.title` или `data.label`.

```json
{
  "id": "positive-tags",
  "type": "tagCloud",
  "data": {
    "title": "Что вам особенно понравилось?",
    "availableTags": [
      "Вкус и качество блюд",
      "Быстрая доставка",
      "Удобство упаковки"
    ],
    "showWhen": "positive"
  },
  "answerable": true
}
```

Ответ содержит уникальный массив значений строго из `availableTags`:

```json
{
  "target_id": -100,
  "element_id": "positive-tags",
  "value": ["Вкус и качество блюд", "Удобство упаковки"]
}
```

Текущий UI показывает `tagCloud` только после выбора рейтинга. Поддерживаются дополнительные правила отображения:

- `data.showWhen = "positive"` — показывать при оценке `4–5`;
- `data.showWhen = "negative"` — показывать при оценке `1–3`;
- поле отсутствует — показывать при любой выбранной оценке.

`data.selectedTags`, если оно присутствует в данных конструктора, текущим сайтом не используется. Разрешённый список для UI и серверной проверки — `availableTags`.

#### `heading`

Текстовый заголовок без ответа. Сайт ищет текст последовательно в `data.title`, `data.label`, `data.value`, `data.text`.

```json
{
  "id": "details-heading",
  "type": "heading",
  "data": { "text": "Расскажите подробнее" },
  "answerable": false
}
```

Элемент отображается, но никогда не добавляется в `responses`.

#### `discount`

Служебный элемент старого сценария выдачи скидки:

```json
{
  "id": "discount",
  "type": "discount",
  "data": {
    "value": 0,
    "availableDiscount": [10, 20]
  },
  "answerable": false,
  "reward_issued": false
}
```

В первой версии сайт его не отображает и не отправляет. Клиентский API скидку не создаёт.

#### `block`

`block` существует только в конструкторе и задаёт условие для вложенных элементов. В ответе `/form` этого типа быть не должно: backend разворачивает блок до плоского списка `elements`.

### Пример 1: общая форма заказа

```json
{
  "st": true,
  "submitted": false,
  "feedback_ids": [],
  "order": {
    "point_id": 7,
    "order_id": 12345,
    "status_order": 6,
    "type_order": 1
  },
  "targets": [
    {
      "target_id": -100,
      "target_type": "order",
      "name": "Общая оценка",
      "category_name": "",
      "form_id": 24,
      "type_id": 4,
      "elements": [
        {
          "id": "order-rating",
          "type": "rating",
          "data": { "value": 0 },
          "answerable": true
        },
        {
          "id": "positive-tags",
          "type": "tagCloud",
          "data": {
            "title": "Что вам особенно понравилось?",
            "availableTags": ["Вкусные блюда", "Быстрая доставка"],
            "showWhen": "positive"
          },
          "answerable": true
        },
        {
          "id": "order-comment",
          "type": "textarea",
          "data": {
            "title": "Ваш комментарий",
            "placeholder": "Напишите подробнее"
          },
          "answerable": true
        }
      ]
    }
  ]
}
```

После оценки `5` сайт покажет положительные теги и может отправить:

```json
[
  { "target_id": -100, "element_id": "order-rating", "value": 5 },
  {
    "target_id": -100,
    "element_id": "positive-tags",
    "value": ["Вкусные блюда"]
  },
  {
    "target_id": -100,
    "element_id": "order-comment",
    "value": "Спасибо, всё отлично"
  }
]
```

### Пример 2: отдельная форма доставки

Один ответ `/form` может содержать несколько `targets` с разными формами. Например, общая форма заказа и отдельная форма доставки:

```json
{
  "target_id": -1,
  "target_type": "order_type",
  "name": "Доставка",
  "category_name": "",
  "form_id": 31,
  "type_id": 3,
  "elements": [
    {
      "id": "delivery-rating",
      "type": "rating",
      "data": { "value": 0 },
      "answerable": true
    },
    {
      "id": "delivery-details",
      "type": "checkboxGroup",
      "data": {
        "title": "Что понравилось?",
        "checkboxes": [
          {
            "id": "fast",
            "label": "Быстро доставили",
            "param": "fast_delivery"
          },
          {
            "id": "polite",
            "label": "Вежливый курьер",
            "param": "polite_driver"
          }
        ]
      },
      "answerable": true
    },
    {
      "id": "can-contact",
      "type": "checkbox",
      "data": { "label": "Можно связаться со мной", "param": "can_contact" },
      "answerable": true
    }
  ]
}
```

Ответы для доставки используют `target_id = -1`:

```json
[
  { "target_id": -1, "element_id": "delivery-rating", "value": 4 },
  {
    "target_id": -1,
    "element_id": "delivery-details",
    "value": ["fast_delivery"]
  },
  { "target_id": -1, "element_id": "can-contact", "value": true }
]
```

### Пример 3: отдельная форма товара

```json
{
  "target_id": 321,
  "target_type": "product",
  "name": "Пицца Жако",
  "category_name": "Пицца",
  "form_id": 42,
  "type_id": 1,
  "elements": [
    {
      "id": "product-heading",
      "type": "heading",
      "data": { "text": "Оцените новинку" },
      "answerable": false
    },
    {
      "id": "product-rating",
      "type": "rating",
      "data": { "value": 0 },
      "answerable": true
    },
    {
      "id": "product-comment",
      "type": "input",
      "data": {
        "title": "Короткий комментарий",
        "placeholder": "Что запомнилось?"
      },
      "answerable": true
    },
    {
      "id": "product-discount",
      "type": "discount",
      "data": { "value": 0, "availableDiscount": [10, 20] },
      "answerable": false,
      "reward_issued": false
    }
  ]
}
```

Заголовок будет показан, скидка скрыта, а в запрос попадут только `product-rating` и заполненный `product-comment`:

```json
[
  { "target_id": 321, "element_id": "product-rating", "value": 5 },
  {
    "target_id": 321,
    "element_id": "product-comment",
    "value": "Много начинки"
  }
]
```

### Полный минимальный ответ

Если подходящих элементов для части заказа нет, соответствующий `target` не включается. Минимальный успешный ответ может содержать только общую оценку:

```json
{
  "st": true,
  "submitted": false,
  "feedback_ids": [],
  "order": {
    "point_id": 7,
    "order_id": 12345,
    "status_order": 6,
    "type_order": 1
  },
  "targets": [
    {
      "target_id": -100,
      "target_type": "order",
      "name": "Общая оценка",
      "category_name": "",
      "form_id": 24,
      "type_id": 4,
      "elements": [
        {
          "id": "order-rating",
          "type": "rating",
          "data": { "value": 0 },
          "answerable": true
        }
      ]
    }
  ]
}
```

Если ни одна активная сайт-форма не дала отображаемых элементов, Laravel вернёт `targets: []`, а текущий UI покажет сообщение «Для этого заказа пока нет активной формы отзыва».

Если `submitted = true`, форма уже была отправлена. `feedback_ids` будет содержать созданные записи, например `[501, 502]`. UI должен показывать состояние «отзыв уже отправлен» и не выполнять повторный submit. Laravel также защищён от повторной записи и вернёт `already_existed: true`.

## Фотографии

Макет Figma содержит добавление фотографий, поэтому выбор, предпросмотр и удаление реализованы в UI. Текущий Laravel API принимает только JSON-ответы и не имеет файлового endpoint. Фотографии пока не отправляются и исчезают после закрытия/обновления страницы.

Перед включением фотографий в production нужен отдельный серверный контракт: ограничения размера и MIME, временная загрузка, антивирусная проверка, хранение, привязка к `feedback_id` и политика удаления.

## Ошибки и повторная отправка

- `401` от Laravel — неверный серверный Bearer-токен;
- `404` — точка или заказ не найдены;
- `409` — заказ удалён или не завершён;
- `422` — неверные данные или ответы;
- `429` — превышен rate limit;
- `500` — внутренняя ошибка.

Самописный backend должен сохранять HTTP-код Laravel. Если Laravel возвращает `already_existed: true`, UI показывает уже отправленный отзыв и не создаёт повторные строки.

## Что потребуется для подключения к истории заказов

Сейчас эксперимент доступен только по отдельному маршруту, поэтому существующие страницы не затронуты. После подтверждения эксперимента можно отдельно добавить кнопку `Оценить заказ` в завершённые заказы и передавать реальные `point_id` и `order_id`. Это изменение намеренно не входит в текущую реализацию.
