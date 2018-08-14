<template lang="pug">
  div.auth
    div.auth__inner
      div.auth__title Для участия в игре введите ваше имя:
      div.auth__input
        el-input(v-model="name", v-on:keydown.13.native="set_name", autofocus)
      div.auth__description имя будут видеть другие игроки
      div.auth__button
        router-link(:to="{ name: 'Home'}")
          el-button(type="info") Назад
        el-button(type="success", v-on:click="set_name") Продолжить
</template>

<script>
import _ from 'lodash';

export default {
  name: 'Auth',
  data() {
    return {
      name: '',
    };
  },
  mounted() {
    // очистка данных по предыдущей игре, так как мы защли снова
    this.$store.commit('update_state', {
      name: 'cache_id',
      data: false,
    });
    this.$store.commit('update_state', { name: 'finish', data: { points: 0, time: 0, rating: 0, errors: 0 } });
  },
  methods: {
    set_name() {
      this.name = _.trim(this.name);
      if (this.name.length > 0) {
        this.$store.commit('socket_start_game', { name: this.name.replace(/<[^>]*>/g, '') });
      } else {
        this.$notify.error({
          title: 'Ошибка',
          message: 'Введите ваше имя',
        });
      }
    },
  },
};
</script>
<style>
.auth {
  height: 100vh;
  background: #f9f9f9;
  min-height: 330px;
}
.auth__inner {
  max-width: 580px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.auth__title {
  padding: 0 0 30px 0;
  font-size: 30px;
  font-weight: bold;
}
.auth__input {
  width: 80%;
}
.auth__description {
  padding: 20px 0 40px;
  color: #909399;
}
.auth__button .el-button--info {
  margin-right: 10px;
}
</style>

