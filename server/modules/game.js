const _ = require('lodash');
const sequelize = require('sequelize');
const sanitizer = require('sanitize-html');

module.exports = async (app, config) => {
  const rate = config.game.rate;

  const Core = {
    stats: [],
    games: {},
    /**
     * получить игру по ид
     * @param socket
     * @param id
     * @param resolve
     */
    get(socket, id, resolve) {
      if (this.games[id]) {
        this.games[id].socket = socket;
        resolve(this.games[id]);
        return;
      }
      app.models.games.findOne({
        where: {
          game: id,
        },
      }).then((info) => {
        if (info) {
          app.models.cards.findAll({
            where: {
              game_id: info.id,
            },
          }).then((cards) => {
            const list = {};
            cards.forEach((item) => {
              list[item.index] = item.card;
            });
            this.games[id] = Game(socket, id, {
              id: info.id,
              time: info.created_at,
              finished: info.finished_at,
              points: info.points,
              errors: info.errors,
              cards: _.range(0, config.game.cards).map(index => ({
                index,
                card: list[index] || '',
                clear: !list[index],
              })),
            });
            resolve(this.games[id]);
          });
        } else {
          resolve(false);
        }
      });
    },
    /**
     * создание новой игры
     * @returns {string}
     */
    create(socket, name) {
      const rand = _.random(100000, 999999);
      const id = `game_${rand}`;
      /* eslint-disable no-use-before-define */
      this.games[id] = Game(socket, id);
      this.games[id].start_game(name);
      return this.games[id];
    },
    /**
     * get rating
     */
    get_stats() {
      return this.stats;
    },
    /**
     * get rating
     */
    async update_stats() {
      await app.models.games.findAll({
        where: {
          finished_at: {
            $gt: 0,
          },
        },
        order: [
          ['rating', 'DESC'],
        ],
        limit: config.game.stats_limit,
      }).then((rows) => {
        this.stats = rows;
      });
    },
  };

  const Actions = {
    async set_name(game, data) {
      await app.models.games.create({
        name: data.name,
        game: game.id,
        rating: 0,
        points: 0,
        errors: 0,
        created_at: new Date(),
        // created_at: this.now(),
      }).then((gameData) => {
        game.set_insert_id(gameData.id);
        return Promise.resolve();
      });
    },
    async set_points(game, data) {
      await app.models.games.update({
        points: data.points,
      }, {
        where: {
          id: game.insert_id,
        },
      });
    },
    async toggle(game, data) {
      if (data.status) {
        await app.models.cards.bulkCreate(game.cards.map(item => ({
          game_id: game.insert_id,
          card: item.card,
          index: item.index,
        })));
      }
    },
    async remove_card(game, data) {
      await app.models.cards.destroy({
        where: {
          game_id: game.insert_id,
          index: data.index,
        },
      });
    },
    async finished(game, data) {
      await app.models.games.update({
        rating: data.rating,
        points: data.points,
        errors: data.errors,
        finished_at: new Date(),
      }, {
        where: {
          game: game.id,
        },
      }).then(() => {
        return app.models.games.findOne({
          attributes: [
            [sequelize.fn('COUNT', sequelize.col('points')), 'position'],
          ],
          order: [
            ['rating', 'DESC'],
          ],
          where: {
            rating: {
              $gte: data.rating,
            },
            finished_at: {
              $gt: 0,
            },
          },
        }).then((row) => {
          game.set_rating({
            points: data.points,
            errors: data.errors,
            time: data.time,
            place: row.get('position'),
          });
        });
        // COUNT(DISTINCT points))
      });
    },
  };

  const Game = (socket, id, info = {}) => ({
    socket,
    id,
    insert_id: info.id || null,
    started: !!info.id,
    points: info.points || 0,
    errors: info.errors || 0,
    time: info.time ? info.time.getTime() / 1000 : null,
    finished_at: info.finished || null,
    rating: 0,
    cards: info.cards || [],
    selected: [],
    actions: [],
    now() {
      return new Date().getTime() / 1000;
    },
    set_insert_id(insertId) {
      this.insert_id = insertId;
    },
    /**
     * добавить действие
     * @param action
     * @param data
     */
    async add(action, data) {
      this.actions.push({
        action,
        data,
      });
      // дополнительные действия
      if (Actions[action]) {
        await Actions[action](this, data);
      }
    },
    /**
     * получить список действий
     * @returns {*}
     */
    send_actions() {
      this.socket.emit('actions', _.cloneDeep(this.actions));
      this.actions = [];
    },
    /**
     * создание игры
     * @param name
     */
    start_game(name) {
      if (this.started) {
        return;
      }
      const count = Math.ceil(config.game.cards / config.game.similar) * config.game.similar;
      const suits = config.game.suits; // масть карты
      const values = config.game.values; // значение карты
      // получаем массив колоды
      let cards = _.flatten(_.map(suits, suit => _.map(values, value => `${suit}-${value}`)));
      // перемещиваем и берем нужное количество одиночных карт
      cards = _.chunk(_.shuffle(cards), count / config.game.similar)[0];
      // "дублируем" карты и перемещиваем
      cards = _.shuffle(_.flatMap(cards, n => _.range(config.game.similar).fill(n)));

      this.cards = cards.map((card, index) => ({
        index,
        card,
        clear: false,
      }));
      this.name = sanitizer(name);
      this.time = this.now();
      this.points = 0;
      this.errors = 0;
      this.selected = [];

      this.add('game_id', { id, status: false });
      this.add('set_name', { name: this.name });
      this.add('set_points', { points: this.points });
      this.add('start_game', { count, time: config.game.time });
      // отправка всех действий
      this.send_actions();
    },
    /**
     * пользовать готов играть
     */
    open_cards() {
      if (this.started) {
        return;
      }
      this.started = true;
      const cards = this.cards.map(item => item.card);

      this.add('timer', { status: true, time: config.game.time });
      this.add('toggle', { status: true, n: Buffer.from(JSON.stringify(cards)).toString('base64') });
      // отправка всех действий
      this.send_actions();
      setTimeout(() => {
        this.add('game_id', { id, status: true });
        this.add('timer', { status: false });
        this.add('toggle', { status: false });
        // отправка всех действий
        this.send_actions();
      }, config.game.time);
    },
    /**
     * пользователь выбрал карту
     * @param index
     */
    select(index) {
      if (!this.started) {
        return;
      }
      if (this.cards[index] // есть карта на доске
        && !this.cards[index].clear // еще не убрана с доски
        && this.selected.length < config.game.similar // ограничение количества выбранных
        && this.selected.indexOf(index) === -1 // еще не выбрана
      ) {
        this.selected.push(index);
        this.add('open_card', { index, card: this.cards[index].card });
        // если выбрали последнюю карту, проверка всех выбранных карт
        if (this.selected.length >= config.game.similar) {
          // отправка всех действий
          this.send_actions();
          this.check();
        } else {
          this.add('set_message', { index: 1 }); // 1 - откройте еще следующую карту
          // отправка всех действий
          this.send_actions();
        }
      }
    },
    /**
     * проверка пользовательского выбора карт
     */
    check() {
      if (!this.started) {
        return;
      }
      let card = false;
      let similar = true;
      // проверка выбранных карт
      _.forEach(this.selected, (index) => {
        if (card === false) {
          card = this.cards[index].card;
        } else if (this.cards[index].card !== card) {
          similar = false;
        }
      });
      if (similar) {
        this.points += config.game.win_point;
      } else {
        this.points -= config.game.loose_point;
        this.errors += config.game.errors_point;
      }
      this.add('set_points', { points: this.points });
      this.add('set_message', { index: similar ? 2 : 3 }); // 2 - угадали, 3 - ошиблись
      this.send_actions();
      setTimeout(() => {
        // итоговые действия
        _.forEach(this.selected, (index) => {
          if (similar) {
            this.add('remove_card', { index });
            this.cards[index].clear = true;
          } else {
            this.add('close_card', { index });
          }
        });
        this.selected = [];
        const left = _.filter(this.cards, item => !item.clear).length;
        if (left > 0) {
          this.add('clear_selected', {});
          this.add('set_message', { index: 0 }); // 0 - откройте одну карту
          // отправка всех действий
          this.send_actions();
        } else {
          this.send_actions();
          setTimeout(() => {
            this.finish();
          }, config.game.pause_before_next);
        }
      }, config.game.pause_before_next);
    },
    /**
     * закрытие игры и вывод итогов
     */
    finish() {
      if (!this.started) {
        return;
      }
      const time = this.now() - this.time;
      // чем больше очков, тем больше рейтинг - минус время потраченное
      const rating = Math.ceil((this.points * rate.points) - (time * rate.time));
      const summary = {
        points: this.points,
        errors: this.errors,
        time,
        rating,
      };
      // пред отправка данных
      this.add('finished', summary);
    },
    /**
     * после получения текущего рейтинг, отправить на клиент
     * @param data
     */
    set_rating(data) {
      Core.update_stats();
      this.add('stats', { stats: this.stats }); // TODO: broadcast to all users
      this.add('set_message', { index: -1 });
      this.add('finish', data);
      // отправка всех действий
      this.send_actions();
    },
    /**
     * возврат данных для повторного использования игры
     */
    info() {
      this.add('info', {
        id: this.id,
        points: this.points,
        name: this.name,
        cards: this.cards.map(item => item.clear),
      });
      // отправка всех действий
      this.send_actions();
      // проверка на завершение сессии, для предотвращения тупика
      if (isNaN(this.finished_at) || !this.finished_at) {
        const left = _.filter(this.cards, item => !item.clear).length;
        if (left <= 0) {
          this.finish();
        }
      }
    },
  });
  Core.update_stats();

  return Core;
};
