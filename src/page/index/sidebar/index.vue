<template>
  <div class="avue-sidebar">
    <logo></logo>
    <el-scrollbar style="height:100%">
      <div v-if="validatenull(menu)" class="avue-sidebar--tip">{{$t('menuTip')}}</div>
      <div class="user" v-show="userShow && $store.state.user.userInfoCardShow && ! $store.state.user.topNav">
        <img src="~@/assets/cover-2-lg.png" alt class="user-bg" />
        <div class="i-box" @click="hideUser">
          <i class="el-icon-arrow-down"></i>
        </div>
        <div class="info tavc">
          <img :src="userInfo.avatar" alt class="user-img" />
          <span>{{userInfo.userName}}</span>
        </div>
      </div>
      <div class="search" v-show="!userShow && $store.state.user.userInfoCardShow">
        <el-input v-model="filterVal" placeholder="按名称搜索" @keyup.native="filterMenu"></el-input>
        <div class="i-box" @click="showUser">
          <i class="el-icon-arrow-up"></i>
        </div>
      </div>
      <el-menu
        unique-opened
        :default-active="nowTagValue"
        :mode="mode"
        :show-timeout="200"
        :collapse="keyCollapse"
        menu-trigger="click"
      >
        <sidebar-item
          :menu="menu"
          :screen="screen"
          first
          :props="website.menu.props"
          :collapse="keyCollapse"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";
export default {
  name: "sidebar",
  components: { sidebarItem, logo },
  data() {
    return {
      filterVal: "",
      userShow: true
    };
  },
  props: ["mode"],
  created() {
    this.$store.dispatch("GetMenu").then(data => {
      if (data.length === 0) return;
      this.$router.$avueRouter.formatRoutes(data, true);
    });
  },
  computed: {
    ...mapGetters([
      "website",
      "menu",
      "tag",
      "keyCollapse",
      "screen",
      "userInfo"
    ]),
    nowTagValue: function() {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  mounted() {},
  methods: {
    filterMenu() {
      if (this.filterVal) {
        let arr = this.$store.state.user.menuAll.filter(item => {
          return item.name.indexOf(this.filterVal) != -1;
        });
        this.$store.commit("SET_MENU", arr);
      } else {
        this.$store.commit("SET_MENU", this.$store.state.user.menuAll);
      }
    },
    showUser() {
      this.userShow = true;
    },
    hideUser() {
      this.userShow = false;
    }
  }
};
</script>
<style lang="scss">
.search {
  padding: 10px 20px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  position: relative;
  .el-input .el-input__inner {
    background-color: rgba(0, 0, 0, 0.3);
    border: none;
    color: #fff;
    border-radius: 6px;
  }
  .i-box {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 30px;
    cursor: pointer;
    border-radius: 6px;
  }
  i {
    font-size: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.user {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 130px;
  line-height: 130px;
  text-align: center;
  span {
    margin-left: 10px;
    color: #fff;
  }
  .i-box {
    color: #fff;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border-radius: 0 0 20px 20px;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 6px #fff;
      transform: translate(-50%, -50%) scale(1.2);
    }
  }
  i {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
  }
  .info {
    height: 50px;
    line-height: 50px;
  }
  span,
  .user-img {
    position: relative;
    z-index: 1;
    float: left;
  }
  .user-img {
    width: 50px;
    height: 50px;
  }
  .user-bg {
    opacity: 0.5;
    left: -20px;
    position: absolute;
    top: 0;
    height: 100%;
    width: auto;
  }
}
.el-scrollbar__wrap {
  margin-top: 0;
}
.sider-left {
  width: 100%;
  .avue-sidebar {
    padding-top: 64px;
    .avue-sidebar--tip {
      top: 70px;
    }
  }
  .menubar {
    i {
      color: #fff !important;
    }
  }
  .el-menu-item.is-active {
    // color: #fff;
  }
}
.sider-top {
  width: 100%;
  .top-bar__title .el-input input {
    color: #fff !important;
  }
  .el-scrollbar {
    height: 64px !important;
    background-color: #fff;
    color: #000;
  }
  .avue-header {
    position: relative;
    padding-left: 240px;
    &.fixed {
      width: 100% !important;
    }
    .avue-logo {
      background: none;
      box-shadow: none;
    }
    .avue-top {
      background: none;
      i,
      span {
        color: #fff;
      }
    }
  }
  .avue-left {
    position: relative;
    width: 100% !important;
    height: 60px !important;
    line-height: 60px !important;
    &.fixed {
      top: 64px !important;
    }
    &.header-fixed {
      position: absolute;
      top: 64px !important;
    }
    .el-scrollbar {
      height: 60px !important;
      line-height: 60px !important;
    }
    .el-scrollbar__wrap {
      margin: 0;
    }
    .avue-sidebar {
      padding-top: 0;
    }
    .avue-logo {
      display: none;
    }
  }
  .avue-layout {
    padding: 0 !important;
    width: 100% !important;
    position: relative;
    z-index: 999;
    &.header-fixed {
      margin-top: 128px !important;
    }
  }
  .el-submenu {
    float: left;
    span,
    i {
      color: #000 !important;
    }
    .el-submenu__icon-arrow {
      position: relative;
      top: auto;
      right: auto;
      margin-left: 6px;
      margin-top: 0;
    }
  }
}
.el-menu.el-menu--popup {
  padding: 10px 20px;
  width: auto;
  border-radius: 10px;
  background-color: #fff !important;
  margin-top: 20px;
  .el-submenu__title:hover {
    background: none !important;
  }
  .el-menu-item,
  .menu-wrapper {
    background: none;
    height: 40px;
    line-height: 40px;
    i {
      margin-right: 10px;
    }
  }
}
</style>

