import router from '../../router';

const _ = require('lodash');
const moment = require('moment');

moment.locale('ru');

const duration = (s) => {
  const format = [];
  const date = moment().startOf('day').add(s, 'seconds');
  if (date.hour() > 0) {
    format.push('H [ч]');
  }
  if (date.minute() > 0) {
    format.push('m [м]');
  }
  if (date.second() > 0) {
    format.push('s [с]');
  }
  return date.format(format.join(' '));
};

const game = {
  state: {
    name: '',
    id: null,
    cache_id: null,
    cacheId: localStorage ? localStorage.getItem('id') : null,
    cards: [],
    selected: [],
    stats: [],
    finish: {
      points: 0,
      time: 0,
      rating: 0,
      errors: 0,
    },
    points: 0,
    message: -1,
    loading: {
      start_game: false,
    },
    timer: {
      status: false,
      time: 0,
    },
    delay: 0,
  },
  actions: {
    /**
     * устанавливает имя пользователя
     * @param commit
     * @param name
     */
    op_set_name({ commit }, { name }) {
      commit('update_state', {
        name: 'name',
        data: name,
      });
      router.push({ name: 'Game' });
    },
    /**
     * начинает игру
     * @param commit
     * @param count
     * @param time
     */
    op_start_game({ commit }, { count, time }) {
      commit('update_state', {
        name: 'cards',
        data: _.range(0, count).map(index => ({
          index,
          card: null,
          clear: false,
        })),
      });
      commit('update_state', {
        name: 'delay',
        data: time,
      });
    },
    /**
     * устанавливает таймер на просмотр карт
     * @param commit
     * @param status
     * @param time
     */
    op_timer({ commit }, { status, time }) {
      commit('update_state', {
        name: 'timer',
        data: {
          status,
          time: time || 0,
        },
      });
    },
    /**
     * задает баллы
     * @param commit
     * @param points
     */
    op_set_points({ commit }, { points }) {
      commit('update_state', {
        name: 'points',
        data: points,
      });
    },
    /**
     * задает сообщение с сервера
     * @param commit
     * @param index
     */
    op_set_message({ commit }, { index }) {
      commit('update_state', {
        name: 'message',
        data: index,
      });
    },
    /**
     * итоговые данные после игры
     * @param commit
     * @param points
     * @param time
     * @param place
     * @param errors
     */
    op_finish({ commit }, { points, time, place, errors }) {
      commit('update_state', {
        name: 'finish',
        data: {
          points,
          time: duration(time),
          place,
          errors,
        },
      });
      commit('update_state', {
        name: 'id',
        data: false,
      });
      router.push({ name: 'Finish' });
    },
    /**
     * открывает одну карту
     * @param commit
     * @param index
     * @param card
     */
    op_open_card({ commit }, { index, card }) {
      commit('card', { index, card });
    },
    /**
     * удаляет с поля одну карту
     * @param commit
     * @param index
     */
    op_remove_card({ commit }, { index }) {
      commit('card', { index, card: null, clear: true });
    },
    /**
     * закрывает одну карту
     * @param commit
     * @param index
     */
    op_close_card({ commit }, { index }) {
      commit('card', { index, card: null });
    },
    /**
     * переворачивает все карты
     * @param state
     * @param commit
     * @param status
     * @param n
     */
    op_toggle({ state, commit }, { status, n }) {
      const cards = n ? JSON.parse(Buffer.from(n.toString(), 'base64').toString('ascii')) : null;
      const stateCards = _.cloneDeep(state.cards);
      _.forEach(stateCards, (card, index) => {
        stateCards[index].card = status ? cards[index] : null;
      });
      commit('update_state', {
        name: 'cards',
        data: stateCards,
      });
    },
    op_clear_selected() {}, // на сервере очистили
    op_finished() {},
    /**
     * задает ид игры
     * @param commit
     * @param id
     */
    op_game_id({ commit }, { id, status }) {
      commit('update_state', {
        name: 'id',
        data: id,
      });
      if (status) {
        commit('update_state', {
          name: 'cache_id',
          data: id,
        });
      }
    },
    /**
     * восстанвилвает после перезагрузки страницы
     * @param commit
     * @param id
     * @param points
     * @param cards
     * @param name
     */
    op_info({ commit }, { id, points, cards, name }) {
      commit('update_state', {
        name: 'id',
        data: id,
      });
      commit('update_state', {
        name: 'cache_id',
        data: id,
      });
      commit('update_state', {
        name: 'name',
        data: name,
      });
      commit('update_state', {
        name: 'points',
        data: points,
      });
      commit('update_state', {
        name: 'cards',
        data: cards.map((cleared, index) => ({
          index,
          card: null,
          clear: cleared,
        })),
      });
    },
    /**
     * возвращает рейтинг
     * @param commit
     * @param stats
     */
    op_stats({ commit }, stats) {
      commit('update_state', {
        name: 'stats',
        data: _.map(stats, (stat, index) => ({
          place: `#${stat.place || index + 1}`,
          name: stat.name,
          points: stat.points,
          time: duration((new Date(stat.finished_at) - new Date(stat.created_at)) / 1000),
        })),
      });
    },
  },
  mutations: {
    /**
     *
     * @param state
     * @param data
     */
    loading(state, data) {
      _.forEach(data, (value, key) => {
        state.loading[key] = value;
      });
    },
    /**
     *
     * @param state
     * @param name
     * @param data
     */
    update_state(state, { name, data }) {
      state[name] = data;
      if (name === 'cache_id') {
        if (data) {
          localStorage.setItem('id', data);
        } else {
          localStorage.removeItem('id');
        }
      }
    },
    /**
     *
     * @param state
     * @param index
     * @param card
     * @param clear
     */
    card(state, { index, card, clear }) {
      if (state.cards[index]) {
        state.cards[index].card = card;
        if (clear) {
          state.cards[index].clear = clear;
        }
      }
    },
    socket_get_cache() {},
    socket_start_game() {},
    socket_open_cards() {},
    socket_select() {},
    socket_get_stats() {},
  },
};

export default game;
