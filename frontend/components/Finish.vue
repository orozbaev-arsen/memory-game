<template lang="pug">
  div.finish
    div.finish__inner
      div.finish__image
        img(src="../assets/finish.png")
      div.finish__title Игра окончена!
      div.finish__description
        | вы набрали
        span  {{ finish.points }}
        | &nbsp;{{ points_text }}
      div.finish__description
        | за
        span &nbsp;{{ finish.time }}
      div.finish__description
        |  и заняли
        span  № {{ finish.place }}
        |  в рейтинге
      div.finish__button
        router-link(:to="{ name: 'Home'}")
          el-button(type="success") Вернуться на главную

</template>
<script>
import Utils from './mixins/utils';

export default {
  mixins: [Utils],
  name: 'Finish',
  computed: {
    finish() {
      return this.$store.state.game.finish;
    },
    points_text() {
      return this.noun(this.points, 'балл', 'балла', 'баллов');
    },
  },
  mounted() {
    if (this.finish.time === 0 || this.finish.rating === 0) {
      this.$router.push({ name: 'Home' });
    }
  },
};
</script>
<style scoped>
  .finish {
    height: 100vh;
    background: #f9f9f9;
    min-height: 330px;
  }
  .finish__inner {
    max-width: 580px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .finish__image{
    padding-bottom: 20px;
  }
  .finish__title {
    padding: 0 0 30px 0;
    font-size: 30px;
    font-weight: bold;
  }
  .finish__description {
    padding: 5px 0;
    font-weight: bold;
  }
  .finish__description span{
    color: #ee3b22;
  }
  .finish__button{
    padding-top: 30px;
  }
</style>
