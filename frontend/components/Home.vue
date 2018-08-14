<template lang="pug">
  el-row.home
    el-col(:span="24")
      el-row
        el-col.home__logo(:span="24")
          img(src="../assets/logo.png")
        el-col.home__title(:span="24") Игра "Memory"
      el-row
        el-col.home__description(:span="18")
          | Это игра на тренировку памяти!
          br
          br
          | В ней необходимо запомнить расположение карт на столе, а потом открыть одинаковые пары
          | как можно быстрее  с наименьшим количеством ошибок
        el-col.home__button(:span="6")
          router-link(:to="{ name: 'Auth'}")
            el-button(type="success") Начать игру
      el-row
        el-col.home__rating(:span="24")
          div.home__rating__title Рейтинг игроков
          el-table.home__rating__table(:data="stats")
            el-table-column(prop="place", label="Место")
            el-table-column(prop="name", label="Имя")
            el-table-column(prop="points", label="Очки")
            el-table-column(prop="time", label="Время")
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {};
  },
  computed: {
    stats() {
      return this.$store.state.game.stats;
    },
  },
  mounted() {
    this.$store.commit('socket_get_stats');
  },
};
</script>
<style>
.home {
  max-width: 1200px;
  margin: 0 auto;
}
.home__logo {
  text-align: center;
  padding: 50px 0 30px;
}
.home__title {
  text-align: center;
  font-size: 36px;
  font-weight: bold;
  padding: 10px 0 30px;
}
.home__description {
  padding: 0 50px 50px 10px;
}
.home__button {
  text-align: center;
}
.home__button .el-button {
  padding: 20px 40px;
  font-size: 18px;
}
.home__rating__table {
  width: 50%;
}
.home__rating__title {
  font-size: 20px;
  padding: 0 0 10px 10px;
}
.home__rating {
  padding-bottom: 50px;
}
</style>

