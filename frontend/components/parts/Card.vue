<template lang="pug">
  div.card(:class="{flip: is_flip, clear: is_clear}")
    div.card__flipper(:style="{transition: time}")
      div.card__back(v-on:click="select")
      div.card__front(v-if="focused", :class="'card__' + current_card")
</template>
<script>
import _ from 'lodash';

export default {
  props: ['current', 'focused'],

  data() {
    return {
      sec: 's',
    };
  },
  mounted() {
  },
  computed: {
    current_card() {
      return _.isNull(this.current.card) ? false : this.current.card;
    },
    current_index() {
      return this.current.index;
    },
    game_id() {
      return this.$store.state.game.id;
    },
    time() {
      return this.is_toggled ? '0.6s' : (0.1 + (this.current.index * 0.05)) + this.sec;
    },
    is_toggled() {
      // return true; // для отключаения эффекта прокрутки
      return this.$store.state.game.cache_id;
    },
    is_clear() {
      return !!this.current.clear;
    },
    is_flip() {
      return !this.current.card;
    },
  },
  methods: {
    select() {
      if (!this.is_clear) {
        this.$store.commit('socket_select', { gameId: this.game_id, index: this.current_index });
      }
    },
  },
};
</script>

<style>
  .card {
    width: 121px;
    height: 183px;
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;
    perspective: 1000px;
    transition: opacity 1s, transform 0s linear 1s;
  }
  .card.clear {
    opacity: 0.05;
    transform: grayscale(1);
  }
  .card.flip .card__flipper {
    transform: rotateY(180deg);
  }

  .card__flipper {
    transition: 0.6s;
    transform-style: preserve-3d;

    position: relative;
  }

  .card__front {
    z-index: 2;
    transform: rotateY(0deg);
  }

  .card__back {
    transform: rotateY(180deg);
  }

  /*
  .card {
    width: 121px;
    height: 183px;
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }
  @-webkit-keyframes turn {
    to {
      -webkit-transform: rotateY(180deg);
    }
  }
  @keyframes turn {
    to {
      transform: rotateY(180deg);
    }
  }
  .turn-enter-active {
    animation: turn 2s;
  }
  .turn-leave-active {
    animation: turn 2s reverse;
  }
  .turn-on-enter-active .card__back, .turn-on-leave-active .card__back {
    transition: transform 1.5s;
  }
  .turn-on-enter .card__back, .turn-on-leave-to .card__back {
    transform: rotateY(180deg);
  }
  /*.card__back-enter-active {*/
    /*-webkit-animation: turn 2s infinite;*/
    /*animation: turn 2s infinite;*/
  /*}*/
  .card__back, .card__front {
    backface-visibility: hidden;
    top: 0;
    left: 0;
    position: absolute;
    width: 121px;
    height: 183px;
    background: url('../../assets/cards_v2.png') no-repeat center;
  }/*
  .card__inner_back .card__front {
    z-index: 1;
  }
  .card__inner_back .card__back {
    z-index: 2;
  }
  .card__inner_front .card__front {
    z-index: 2;
  }
  .card__inner_front .card__back {
    z-index: 1;
  }
  .card__front {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  */
  .card__back, .card__false {
    background-position: -10px -759px;
  }
  .card__0-14 {
    background-position: -1098px -5px;
  }
  .card__0-13 {
    background-position: -962px -194px;
  }
  .card__0-12 {
    background-position: -1098px -194px;
  }
  .card__0-11 {
    background-position: -1234px -194px;
  }
  .card__0-10 {
    background-position: -1370px -194px;
  }
  .card__0-9 {
    background-position: -10px -5px;
  }
  .card__0-8 {
    background-position: -146px -5px;
  }
  .card__0-7 {
    background-position: -282px -5px;
  }
  .card__0-6 {
    background-position: -418px -5px;
  }
  .card__0-5 {
    background-position: -554px -5px;
  }
  .card__0-4 {
    background-position: -690px -5px;
  }
  .card__0-3 {
    background-position: -826px -5px;
  }
  .card__0-2 {
    background-position: -962px -5px;
  }
  .card__1-14 {
    background-position: -554px -382px;
  }
  .card__1-13 {
    background-position: -418px -571px;
  }
  .card__1-12 {
    background-position: -554px -571px;
  }
  .card__1-11 {
    background-position: -690px -571px;
  }
  .card__1-10 {
    background-position: -826px -571px;
  }
  .card__1-9 {
    background-position: -962px -571px;
  }
  .card__1-8 {
    background-position: -1098px -571px;
  }
  .card__1-7 {
    background-position: -1234px -571px;
  }
  .card__1-6 {
    background-position: -1370px -571px;
  }
  .card__1-5 {
    background-position: -10px -382px;
  }
  .card__1-4 {
    background-position: -146px -382px;
  }
  .card__1-3 {
    background-position: -282px -382px;
  }
  .card__1-2 {
    background-position: -418px -382px;
  }
  .card__2-14 {
    background-position: -282px -571px;
  }
  .card__2-13 {
    background-position: -146px -759px;
  }
  .card__2-12 {
    background-position: -282px -759px;
  }
  .card__2-11 {
    background-position: -418px -759px;
  }
  .card__2-10 {
    background-position: -554px -759px;
  }
  .card__2-9 {
    background-position: -690px -759px;
  }
  .card__2-8 {
    background-position: -826px -759px;
  }
  .card__2-7 {
    background-position: -962px -759px;
  }
  .card__2-6 {
    background-position: -1098px -759px;
  }
  .card__2-5 {
    background-position: -1234px -759px;
  }
  .card__2-4 {
    background-position: -1370px -759px;
  }
  .card__2-3 {
    background-position: -10px -571px;
  }
  .card__2-2 {
    background-position: -146px -571px;
  }
  .card__3-14 {
    background-position: -826px -194px;
  }
  .card__3-13 {
    background-position: -690px -382px;
  }
  .card__3-12 {
    background-position: -826px -382px;
  }
  .card__3-11 {
    background-position: -962px -382px;
  }
  .card__3-10 {
    background-position: -1098px -382px;
  }
  .card__3-9 {
    background-position: -1234px -382px;
  }
  .card__3-8 {
    background-position: -1370px -382px;
  }
  .card__3-7 {
    background-position: -10px -194px;
  }
  .card__3-6 {
    background-position: -146px -194px;
  }
  .card__3-5 {
    background-position: -282px -194px;
  }
  .card__3-4 {
    background-position: -418px -194px;
  }
  .card__3-3 {
    background-position: -554px -194px;
  }
  .card__3-2 {
    background-position: -690px -194px;
  }
</style>
