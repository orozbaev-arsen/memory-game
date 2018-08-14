# Игра "Memory"

> LPmotor тестовое задание

## Install
1. применить server/memory.sql к MySQL базе данных
2. установить зависимости npm install
3. запустить сервер
4. запустить фронтенд

## Запуск

``` bash
# запустить фронтенд
npm run frontend_dev

# запустить фронтенд с минификацией
npm run frontend

# запустить сервер
npm run server_dev

# запустить сервер в production mode
npm run server

# run unit tests
npm run unit

# run all tests
npm test
```

## Структура сервера
#### server / models
> модели сервера sequelize
#### server / modules
> дополнительные модули расширяющие первоначальный сервер, для разделения логики
#### server / routers
> автоматическая генерация роутеров на основе файлов
#### server / socket
> обработчик socket сообщений
#### server / views
> шаблоны для отображения при HTTP запросах от сервера
#### server / app.js
> основная логика сервера
#### server / index.js
> основной файл запуска сервера
#### server / memory.sql
> дамп базы данных

## Структура фронтенда
#### frontend / assets
> файлы для фронтенда
#### frontend / components / Home.vue
> компонент vue, для отображения главной страницы
#### frontend / components / Game.vue
> компонент vue, для работы с игровым полем
#### frontend / components / Finish.vue
> компонент vue, для отображения финального счета
#### frontend / components / Auth.vue
> компонент vue, для авторизации
#### frontend / components / parts / Card.vue
> компонент vue, для работы с одной картой
#### frontend / router
> фронтенд роутинг
#### frontend / store / modules / game.js
> логика игры, state, actions и mutations
#### server / store / index.js
> стандартная настройка vuex
#### server / store / socket.js
> обработчик socket
#### server / App.vue
> основной компонент vuejs
#### server / main.js
> основной файл запуска фронтенд
