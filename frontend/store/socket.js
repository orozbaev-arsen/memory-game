import io from 'socket.io-client';
import _ from 'lodash';

const socket = () => {
  const connect = io({
    transports: ['websocket'],
  });

  return (store) => {
    connect.on('connect', () => {
      store.commit('connected', { status: true });
    });
    connect.on('disconnect', () => {
      store.commit('connected', { status: false });
    });
    connect.on('actions', (actions) => {
      store.commit('loading', { socket: false });
      _.forEach(actions, ({ action, data }) => {
        store.dispatch(`op_${action}`, data);
      });
    });
    store.subscribe((mutation) => {
      const type = mutation.type.toLowerCase();
      if (type.startsWith('socket_')) {
        store.commit('loading', { socket: true });
        const name = type.replace('socket_', '');
        connect.emit(name, mutation.payload, (data) => {
          if (data) {
            store.dispatch(`${name}_done`, data);
          }
        });
      }
    });
  };
};

export default socket;
