const mutations = {};

mutations.connected = (state, { status }) => {
  state.connected = status;
};

export default mutations;
