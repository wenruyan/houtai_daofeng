<template>
  <div class="login-container" @keyup.enter.native="handleLogin" :style="'background:url('+ bg +') 0 bottom repeat-x #049ec4'">
    <div class="login-weaper animated bounceInDown">
      <div class="login-border">
        <div class="login-main">
          <h4 class="login-title">
          </h4>
          <userLogin></userLogin>
        </div>
      </div>
    </div>
    <div class="bg-list">
      <img :class="{'active': item == bg}" @click="changeBg(index)" :src="item" v-for="(item,index) in arr" :key="index">
    </div>
  </div>
</template>
<script>
import userLogin from "./userlogin-focus";
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
import bg12 from '/focus-project/Focus-SaberX/public/img/bg/login-bg-12.jpg'
import bg13 from '/focus-project/Focus-SaberX/public/img/bg/login-bg-13.jpg'
import bg14 from '/focus-project/Focus-SaberX/public/img/bg/login-bg-14.jpg'
import bg15 from '/focus-project/Focus-SaberX/public/img/bg/login-bg-15.jpg'
import bg16 from '/focus-project/Focus-SaberX/public/img/bg/login-bg-16.jpg'
import bg17 from '/focus-project/Focus-SaberX/public/img/bg/login-bg-17.jpg'
export default {
  name: "login",
  components: {
    userLogin,
  },
  data() {
    return {
      time: "",
      bg: bg12,
      arr:[ bg12, bg13, bg14, bg15, bg16, bg17]
    };
  },
  watch: {
    $route() {
      const params = this.$route.query;
      this.socialForm.state = params.state;
      this.socialForm.code = params.code;
      if (!validatenull(this.socialForm.state)) {
        const loading = this.$loading({
          lock: true,
          text: `${
            this.socialForm.state === "WX" ? "微信" : "QQ"
          }登录中,请稍后。。。`,
          spinner: "el-icon-loading"
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
      }
    }
  },
  created() {
    this.getTime();
    setInterval(() => {
      this.getTime();
    }, 1000);
  },
  mounted() {},
  computed: {
    ...mapGetters(["website"])
  },
  props: [],
  methods: {
    // 切换背景
    changeBg(index){
      this.bg = this.arr[index]
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/login.scss";
.login-weaper{
  width: 500px;
  box-shadow:none;
  .companyName{
    font-size: 24px;
  }
  .login-border{
    width: 100%;
    background: transparent;
  }
  .login-form .el-input input{
    padding: 0;
    background: #ffffff;
    border-radius: 5px;
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
    }
    .login-form .el-form-item{
      margin-bottom: 20px;
  }
  .login-submit{
    background: rgb(64, 158, 255);
    color: #ffffff;
    border-radius: 5px;
  }
  .login-submit:hover{
    background: rgb(60, 149, 238);
  }
  
}
.login-container{
  // background: url(/img/bg/login-bg-12.jpg) 0 bottom repeat-x #049ec4;
  animation: none;
  position: relative;
}
.bg-list{
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 9999;
  img{
    margin:0 2px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid transparent;
  }
  img:hover{
    border: 3px solid #bbbbbb;
  }
  .active,
  .active:hover{
    border: 3px solid #ffffff;
  }
  
}
.m-r-10{
  margin-right: 10px;
}
</style>