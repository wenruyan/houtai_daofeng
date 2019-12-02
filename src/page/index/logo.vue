<template>
  <div class="avue-logo" :class="{'fixed':$store.state.user.headerFixed}">
    <img src="~@/assets/logo.png" alt="logo">
    <h1 v-if="!keyCollapse">Focus</h1>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "logo",
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapGetters(["website", "keyCollapse"])
  },
  methods: {}
};
</script>

<style lang="scss">
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.avue-logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  height: 64px;
  line-height: 64px;
  padding: 0 20px;
  background-color: #20222a;
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);
  z-index: 1024;
  &.fixed {
    position: fixed;
  }
  h1 {
    float: left;
    font-size: 24px;
    margin: 0;
  }
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-top: 12px;
    float: left;
    margin-right: 10px;
  }
  &_title {
    display: block;
    text-align: center;
    font-weight: 300;
    font-size: 20px;
  }
  &_subtitle {
    display: block;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
}
</style>