<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  watch: {},
  created() {

  },
  methods: {},
  computed: {}
};
</script>
<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #f0f2f5;
}
.tac {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.tvc {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.tavc {
  position: absolute;
  left: 50%;
   top: 50%;
  transform: translate(-50%, -50%);
}
.clearfix:before,
.clearfix:after {
    /*清除浮动*/
    content: "";
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
}

.clearfix {
    *zoom: 1;
    /*IE/7/6*/
}
</style>
