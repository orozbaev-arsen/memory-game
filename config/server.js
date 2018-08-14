module.exports = {
  development: {
    home: 'game',
    port: 5000,
    game: {
      cards: 28, // количество карт на доске
      time: 5000, // время на запоминание
      pause_before_next: 1000, // пауза перед завершением хода
      similar: 2, // количество одинаковых, для разных режимов на будущее
      stats_limit: 10,
      rate: {
        // rating = (points * rate.points) - (time * rate.time)
        points: 25, // каждый балл в игре n рейтинга
        time: 10, // каждая секунда минус n рейтинга
      },
      win_point: 2, // сколько получаешь баллов за правильный ответ
      loose_point: 1, // сколько отнимается баллов за ошибку
      errors_point: 1,
      suits: [0, 1, 2, 3], // 0 - пик, 1 - треф, 2 - буби, 3 - черви
      values: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], // 2-10, валет - 11, дама - 12, король - 13, туз - 14
    },
    database: {
      host: 'localhost',
      database: 'memory',
      username: 'root',
      password: '',
    },
  },
};
