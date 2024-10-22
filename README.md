# JWT Cookie Authentication

## Описание

Пример не плохой аутентификации на основе JWT (JSON Web Tokens), где токены хранятся в HTTP cookies, обеспечивая безопасный и удобный способ аутентификации пользователей.

В отличие от классической передачи токенов через заголовки авторизации, использование cookies позволяет автоматически включать токен в каждую HTTP-запрос благодаря механизму браузера.

Это упрощает клиентскую логику и снижает риск уязвимостей, таких как XSS (межсайтовый скриптинг), если cookies помечены как HttpOnly.

Такая схема аутентификации упрощает управление сессиями, делает их более безопасными и масштабируемыми, обеспечивая при этом высокую производительность приложений.

## Функциональность

- Регистрация и вход пользователя
- Обновление и удаление токенов
- Защищённые маршруты на фронтенде и бэкенде
- Хранение JWT в cookies для безопасной передачи токенов
- Автообновление токенов при их истечении

## Архитектура Frontend
```
next-client/
  ├── components       # React компоненты
  ├── pages            # Страницы приложения
  ├── services         # Запросы к API
  ├── styles           # Глобальные стили
  └── public           # Статические ресурсы
```

## Архитектура Backend
```
api/
  ├── auth             # Логика аутентификации (JWT, cookies)
  ├── users            # Модуль для управления пользователями
  ├── guards           # Guard'ы для защиты маршрутов
  ├── common           # Общие утилиты, декораторы
  ├── app.module.ts    # Основной модуль приложения
  └── main.ts          # Точка входа в приложение
```

## Технологии

### Фронтенд (Next.js)

- **Next.js** — серверный рендеринг и статическая генерация страниц
- **React** — компонентный подход
- **TailwindCSS** — стилизация
- **Axios** — HTTP запросы к API
- **shadcn/ui** - ui компоненты

### Бэкенд (Nest.js)

- **Nest.js** — фреймворк для создания серверных приложений на TypeScript
- **JWT** — аутентификация на основе токенов
- **Sequelize** — ORM для работы с базой данных
- **Passport.js** — библиотека для аутентификации
- **Cookie-Parser** — для работы с cookies

## Установка

### Требования

- Node.js >= 20
- Docker (для базы данных)

### Шаги установки

1. Клонируйте репозиторий:

```bash
git clone https://github.com/your-username/jwt-cookie-auth.git
cd jwt-cookie-auth
```

2. Установить зависимости:

```bash
npm i
```
3. Запуск:

```bash
# prod
docker compose up --build -d
# dev
docker compose -f docker-compose.dev.yml up --build -d
```

## Env Backend

```
API_PORT=4000
DB_PORT=5432
DB_HOST=postgres-db
DB_USER=root
DB_PASSWORD=root
DB_NAME=jwt_auth
JWT_KEY=secret

REFRESH_TOKEN_NAME=refreshToken
EXPIRE_DAY_REFRESH_TOKEN=1
```

## Env Frontend

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

