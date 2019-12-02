<template>
  <div class="avue-top">
    <!-- <div class="top-bar__left">
      <div
        class="avue-breadcrumb"
        :class="[{ 'avue-breadcrumb--active': isCollapse }]"
        v-if="showCollapse && !this.$store.state.user.topNav"
      >
        <i class="icon-navicon" @click="setCollapse"></i>
      </div>
    </div> -->
    <div class="top-bar__title">
      <div class="top-bar__item top-bar__item--show" v-if="showMenu">
        <top-menu></top-menu>
      </div>
      <span class="top-bar__item" v-if="showSearch">
        <top-search></top-search>
      </span>
    </div>
    <div class="top-bar__right">
      <div class="setting-box">
        <i class="el-icon-setting" @click="drawer = true"></i>
      </div>
      <!-- <el-tooltip v-if="showColor" effect="dark" :content="$t('navbar.color')" placement="bottom">
        <div class="top-bar__item">
          <top-color></top-color>
        </top-color>
      </el-tooltip>-->
      <el-tooltip
        v-if="showDebug"
        effect="dark"
        :content="logsFlag?$t('navbar.bug'):logsLen+$t('navbar.bugs')"
        placement="bottom"
      >
        <div class="top-bar__item">
          <top-logs></top-logs>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showLock" effect="dark" :content="$t('navbar.lock')" placement="bottom">
        <div class="top-bar__item">
          <top-lock></top-lock>
        </div>
      </el-tooltip>
      <!-- <el-tooltip v-if="showTheme" effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-theme></top-theme>
        </div>
      </el-tooltip>-->
      <!-- <el-tooltip effect="dark" :content="$t('navbar.language')" placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-lang></top-lang>
        </div>
      </el-tooltip>-->
      <!-- <el-tooltip
        v-if="showFullScren"
        effect="dark"
        :content="isFullScren?$t('navbar.screenfullF'):$t('navbar.screenfull')"
        placement="bottom"
      >
        <div class="top-bar__item">
          <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'" @click="handleScreen"></i>
        </div>
      </el-tooltip>-->
      <img class="top-bar__img" :src="userInfo.avatar" />
      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.userName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">{{$t('navbar.dashboard')}}</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">{{$t('navbar.userinfo')}}</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout" divided>{{$t('navbar.logOut')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 右侧设置 -->
    <el-drawer title :visible.sync="drawer" :direction="direction">
      <div class="setting-one">
        <h2>主题颜色</h2>
        <div class="theme">
          <span
            v-for="item in themeList"
            :key="item.key"
            :title="item.key"
            :style="{backgroundColor: item.color}"
            @click="changeTheme(item)"
          >
            <i class="el-icon-check tavc" v-show="item.selected"></i>
          </span>
        </div>
      </div>
      <div class="setting-one setting-switch set-cont-color">
        <span>内容颜色</span>
        <el-tooltip v-if="showColor" effect="dark" :content="$t('navbar.color')" placement="bottom">
          <div class="top-bar__item">
            <top-color></top-color>
          </div>
        </el-tooltip>
      </div>
      <div class="setting-one setting-switch">
        <span>隐藏用户信息卡片</span>
        <el-switch
          v-model="userInfoCardHide"
          @change="handleHideUser"
          :active-color="selectedTheme.color"
        ></el-switch>
      </div>
      <div class="setting-one setting-switch">
        <span>隐藏侧边栏图标</span>
        <el-switch
          v-model="siderIconHide"
          @change="handleHideSiderIcon"
          :active-color="selectedTheme.color"
        ></el-switch>
      </div>
      <div class="setting-one setting-switch">
        <span>英文</span>
        <el-switch v-model="en" @change="handleSetLanguage" :active-color="selectedTheme.color"></el-switch>
      </div>
      <div class="setting-one setting-switch">
        <span>顶部导航栏</span>
        <el-switch v-model="topNav" @change="handleTopNav" :active-color="selectedTheme.color"></el-switch>
      </div>
      <div class="setting-one setting-switch">
        <span>固定侧边导航栏</span>
        <el-switch
          v-model="siderFixed"
          @change="handleFixSider"
          :active-color="selectedTheme.color"
        ></el-switch>
      </div>
      <div class="setting-one setting-switch">
        <span>固定顶部</span>
        <el-switch
          v-model="headerFixed"
          @change="handleFixHeader"
          :active-color="selectedTheme.color"
        ></el-switch>
      </div>
      <div class="setting-one setting-switch">
        <span>全屏</span>
        <el-switch v-model="fullScreen" @change="handleScreen" :active-color="selectedTheme.color"></el-switch>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { fullscreenToggel, listenfullscreen } from "@/util/util";
import topLock from "./top-lock";
import topMenu from "./top-menu";
import topSearch from "./top-search";
import topTheme from "./top-theme";
import topLogs from "./top-logs";
import topColor from "./top-color";
import topLang from "./top-lang";
import { setTheme } from "@/util/util";
export default {
  components: {
    topLock,
    topMenu,
    topSearch,
    topTheme,
    topLogs,
    topColor,
    topLang
  },
  name: "top",
  data() {
    return {
      drawer: false,
      direction: "rtl",
      themeList: [
        {
          key: "Wisteria",
          color: "#584475",
          selected: true
        },
        {
          key: "Tapestry",
          color: "#754467",
          selected: false
        },
        {
          key: "Atlantis",
          color: "#617a28",
          selected: false
        },
        {
          key: "Indigo",
          color: "#2b4c81",
          selected: false
        },
        {
          key: "Dodger-Blue",
          color: "#0f619f",
          selected: false
        },
        {
          key: "Tradewind",
          color: "#447574",
          selected: false
        },
        {
          key: "Cranberry",
          color: "#a12861",
          selected: false
        },
        {
          key: "Oslo-Gray",
          color: "#5b5b5b",
          selected: false
        },
        {
          key: "Chetwode-Blue",
          color: "#3955bc",
          selected: false
        },
        {
          key: "Apricot",
          color: "#bf662c",
          selected: false
        },
        {
          key: "Blue-Smoke",
          color: "#4d504f",
          selected: false
        },
        {
          key: "Green-Smoke",
          color: "#6a734e",
          selected: false
        },
        {
          key: "Wild-Blue-Yonder",
          color: "#4e4c77",
          selected: false
        },
        {
          key: "Emerald",
          color: "#318c38",
          selected: false
        }
      ],
      fullScreen: false,
      siderIconHide: false,
      topNav: false,
      selectedTheme: false,
      userInfoCardHide: false,
      en: false,
      headerFixed: true,
      siderFixed: true
    };
  },
  filters: {},
  created() {
    console.log(this.$store.state.user, "user");
    console.log(this.$store.state.common, "common");
    this.siderIconHide = this.$store.state.user.siderIconShow ? false : true;
    this.topNav = this.$store.state.user.topNav ? true : false;
    this.selectedTheme = this.$store.state.user.selectedTheme;
    this.userInfoCardHide = !this.$store.state.user.userInfoCardShow
      ? true
      : false;
    this.en = this.$store.state.common.language == "en" ? true : false;
    this.headerFixed = this.$store.state.user.headerFixed ? true : false;
    this.siderFixed = this.$store.state.user.siderFixed ? true : false;
  },
  mounted() {
    listenfullscreen(this.setScreen);
    if (this.selectedTheme && !this.selectedTheme.color) {
      this.selectedTheme = this.themeList[0];
    }
    if (this.selectedTheme && this.selectedTheme.color) {
      this.themeList.forEach(item => {
        item.selected = false;
        if (item.color == this.selectedTheme.color) {
          item.selected = true;
        }
      });
    }
    this.$store.commit("SET_THEME_NAME", this.selectedTheme.key);
    setTheme(this.selectedTheme.key);
  },
  computed: {
    ...mapState({
      showDebug: state => state.common.showDebug,
      showTheme: state => state.common.showTheme,
      showLock: state => state.common.showLock,
      showFullScren: state => state.common.showFullScren,
      showCollapse: state => state.common.showCollapse,
      showSearch: state => state.common.showSearch,
      showMenu: state => state.common.showMenu,
      showColor: state => state.common.showColor
    }),
    ...mapGetters([
      "userInfo",
      "isFullScren",
      "tagWel",
      "tagList",
      "isCollapse",
      "tag",
      "logsLen",
      "logsFlag",
      "language",
      "tag"
    ])
  },
  methods: {
    handleFullScreen() {},
    handleTopNav(val) {
      this.$store.commit("CHANGE_NAV_TOP", val);
    },
    handleFixSider(val) {
      this.$store.commit("CHANGE_SIDER_FIXED", val);
    },
    handleFixHeader(val) {
      this.$store.commit("CHANGE_HEADER_FIXED", val);
    },
    handleSetLanguage(lang) {
      lang = lang ? "en" : "zh";
      this.$i18n.locale = lang;
      this.$store.commit("SET_LANGUAGE", lang);
      let tag = this.tag;
      let title = this.$router.$avueRouter.generateTitle(
        tag.label,
        (tag.meta || {}).i18n
      );
      //根据当前的标签也获取label的值动态设置浏览器标题
      this.$router.$avueRouter.setTitle(title);
    },
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    handleScreen() {
      fullscreenToggel();
    },
    mounted() {
      listenfullscreen(this.setScreen);
    },
    computed: {
      ...mapState({
        showDebug: state => state.common.showDebug,
        showTheme: state => state.common.showTheme,
        showLock: state => state.common.showLock,
        showFullScren: state => state.common.showFullScren,
        showCollapse: state => state.common.showCollapse,
        showSearch: state => state.common.showSearch,
        showMenu: state => state.common.showMenu,
        showColor: state => state.common.showColor
      }),
      ...mapGetters([
        "userInfo",
        "isFullScren",
        "tagWel",
        "tagList",
        "isCollapse",
        "tag",
        "logsLen",
        "logsFlag"
      ])
    },
    handleHideUser(val) {
      console.log(val, "val");
      this.$store.commit("CHANGE_USERINFO_CARD", !val);
      console.log(this.$store.state.user.userInfoCardShow, "show");
    },
    handleHideSiderIcon(val) {
      console.log("1111");
      this.$store.commit("CHANGE_SIDER_ICON", !val);
    },
    changeTheme(item) {
      this.themeList.forEach(ele => {
        ele.selected = false;
      });
      item.selected = true;
      this.selectedTheme = item;
      this.$store.commit("SET_THEME_NAME", item.key);
      this.$store.commit("CHANGE_SELECTED_THEME", item);
      setTheme(item.key);
    },
    logout() {
      this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({ path: "/login" });
        });
      })
    }
  }
};
</script>

<style lang="scss">
.avue-top {
  .top-bar__title {
    padding: 0;
    padding-right: 40px;
  }
}
.top-bar__right {
  i {
    cursor: pointer;
  }
}
.setting-box {
  padding: 0 6px;
}
.el-icon-setting {
  font-size: 22px !important;
  cursor: pointer;
}
.el-drawer {
  width: auto !important;
  padding: 20px;
}
.el-drawer__header {
  padding: 0 !important;
  margin-bottom: 0 !important;
}
.setting-one {
  padding: 12px 0;
  .theme {
    width: 246px;
    span {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      border-radius: 5px;
      margin-right: 6px;
      margin-bottom: 6px;
      cursor: pointer;
      text-align: center;
      position: relative;
      &:nth-child(7n) {
        margin-right: 0;
      }
      i {
        color: #fff;
      }
    }
  }
  &.setting-switch {
    display: flex;
    justify-content: space-between;
  }
  &.set-cont-color {
    .top-bar__item {
      height: auto;
      margin: 0;
      .theme-picker {
        padding-top: 0 !important;
      }
    }
  }
}
</style>
