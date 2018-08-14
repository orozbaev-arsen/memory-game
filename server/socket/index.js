const actions = {};

actions.start_game = (app, socket, { name }) => {
  app.game.create(socket, name);
};
actions.open_cards = (app, socket, { gameId }) => {
  app.game.get(socket, gameId, (game) => {
    if (game) {
      game.open_cards();
    }
  });
};
actions.select = (app, socket, { gameId, index }) => {
  app.game.get(socket, gameId, (game) => {
    if (game) {
      game.select(index);
    }
  });
};
actions.get_cache = (app, socket, { gameId }) => {
  app.game.get(socket, gameId, (game) => {
    if (game) {
      game.info();
    }
  });
};
actions.get_stats = (app, socket) => {
  socket.emit('actions', [{ action: 'stats', data: app.game.get_stats() }]);
};

module.exports = actions;
