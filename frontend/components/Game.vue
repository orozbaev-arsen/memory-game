<template lang="pug">
  div.game
    div.game__score {{ points }} {{ points_text }}
    div.game__messages
      div.timer(v-if="timer.status") {{ tick }} {{ tick_text }}
      div.text(v-if="message") {{ message }}
    div.game__cards
      div.game__cards__card(v-for="(card) in cards")
        Card(:current="card", :focused="focused")
    el-dialog(
      :visible.sync="start_dialog",
      width="30%",
      :close-on-click-modal="false",
      :close-on-press-escape="false",
      :show-close="false"
    )
      span У вас будет {{ delay }} {{ delay_text }}, чтобы запомнить расположение карт
      span.dialog-footer(slot='footer')
        el-button(type='success', @click="startGame") Начать игру

</template>

<script>
import Card from './parts/Card';
import Utils from './mixins/utils';

export default {
  mixins: [Utils],
  components: {
    Card,
  },
  name: 'Game',
  data() {
    return {
      focused: true,
      start_dialog: false,
      tick: 0,
      interval: null,
    };
  },
  computed: {
    points() {
      return this.$store.state.game.points;
    },
    cards() {
      return this.$store.state.game.cards;
    },
    game_id() {
      return this.$store.state.game.id;
    },
    cache_id() {
      return this.$store.state.game.cacheId;
    },
    timer() {
      return this.$store.state.game.timer;
    },
    message() {
      const index = this.$store.state.game.message;
      const messages = [
        'Откройте карту',
        'Откройте ещё карту',
        'Вы угадали!',
        'Вы не угадали...',
      ];
      if (messages[index]) {
        return messages[index];
      }
      return '';
    },
    delay() {
      return this.$store.state.game.delay / 1000;
    },
    points_text() {
      return this.noun(this.points, 'балл', 'балла', 'баллов');
    },
    tick_text() {
      return this.noun(this.tick, 'секунда', 'секунды', 'секунд');
    },
    delay_text() {
      return this.noun(this.delay, 'секунда', 'секунды', 'секунд');
    },
  },
  mounted() {
    if (this.cache_id) {
      this.$store.commit('socket_get_cache', { gameId: this.cache_id });
    } else if (!this.game_id) {
      this.$router.push({ name: 'Auth' });
    } else {
      // показать диалог
      this.start_dialog = true;
      // скрытие данных при скрытии вкладки, но это не помогает от скриншотов
      // let hidden = null;
      // let visibilityChange = null;
      // if (typeof document.hidden !== 'undefined') {
      //   hidden = 'hidden';
      //   visibilityChange = 'visibilitychange';
      // } else if (typeof document.msHidden !== 'undefined') {
      //   hidden = 'msHidden';
      //   visibilityChange = 'msvisibilitychange';
      // } else if (typeof document.webkitHidden !== 'undefined') {
      //   hidden = 'webkitHidden';
      //   visibilityChange = 'webkitvisibilitychange';
      // }
      // document.addEventListener(visibilityChange, () => {
      //   this.focused = (document[hidden]);
      // }, false);
      // document.addEventListener('onkeydown', (e) => {
      //   console.log(e.which);
      //   if (e.which === 44) {
      //     this.focused = false;
      //   }
      // });
      // window.onblur = () => {
      //   this.focused = false;
      // };
      // window.onfocus = () => {
      //   this.focused = true;
      // };
    }
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  watch: {
    timer() {
      if (this.timer.status) {
        if (this.interval) {
          clearInterval(this.interval);
        }
        this.tick = this.timer.time / 1000;
        this.interval = setInterval(() => {
          this.tick = this.tick - 1;
        }, 1000);
      } else {
        clearInterval(this.interval);
      }
    },
  },
  methods: {
    startGame() {
      this.$store.commit('socket_open_cards', { gameId: this.game_id });
      this.start_dialog = false;
    },
  },
};
</script>

<style>
.game {
  height: 100%;
  background: #507345;
  overflow: auto;
}
.game__score {
  color: #fff;
  padding: 30px;
  font-size: 18px;
  font-weight: bold;
}
.game__messages {
  color: #fff;
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  padding-bottom: 20px;
  height: 31px;
}
.game__cards {
  display: flex;
  flex-wrap: wrap;
  width: 1050px;
  margin: 0 auto;
  padding-bottom: 30px;
}
.game__cards__card {
  width: 150px;
  height: 183px;
  margin-bottom: 10px;
}
.game .el-dialog__body {
  text-align: center;
  font-size: 16px;
}
</style>

