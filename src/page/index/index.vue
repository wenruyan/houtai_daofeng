<template>
  <div class="avue-contail" :class="{'avue--collapse':isCollapse}">
    <div class="sider-left" v-show="!$store.state.user.topNav">
      <div class="avue-left" :class="{'fixed':$store.state.user.siderFixed}">
        <!-- 左侧导航栏 -->
        <sidebar />
      </div>
      <div
        class="avue-layout"
        :class="{'header-fixed':$store.state.user.headerFixed,'sider-fixed':$store.state.user.siderFixed}"
      >
        <div class="avue-header" :class="{'fixed':$store.state.user.headerFixed}">
          <!-- 顶部导航栏 -->
          <top />
        </div>
        <div class="avue-main">
          <!-- 顶部标签卡 -->
          <tags />
          <!-- 主体视图层 -->
          <div id="avue-view">
            <keep-alive>
              <router-view class="avue-view" v-if="!$route.meta.$keepAlive" />
            </keep-alive>
            <!-- <router-view class="avue-view" v-if="!$route.meta.$keepAlive" /> -->
          </div>
        </div>
      </div>
      <div class="avue-shade" @click="showCollapse"></div>
    </div>
    <div class="sider-top" v-show="$store.state.user.topNav">
      <div class="avue-header" :class="{'fixed':$store.state.user.headerFixed}">
        <!-- 顶部导航栏 -->
        <logo></logo>
        <top />
      </div>
      <div class="avue-left" :class="{'fixed':$store.state.user.siderFixed, 'header-fixed':!$store.state.user.siderFixed && $store.state.user.headerFixed}">
        <!-- 左侧导航栏 -->
        <sidebar mode="horizontal" />
      </div>
      <div
        class="avue-layout"
        :class="{'header-fixed':$store.state.user.headerFixed,'sider-fixed':$store.state.user.siderFixed}"
      >
        <div class="avue-main">
          <!-- 顶部标签卡 -->
          <tags />
          <!-- 主体视图层 -->
          <div id="avue-view">
            <keep-alive>
              <!-- 为满足切换tab不刷新修改内容 -->
              <router-view class="avue-view" v-if="!$route.meta.$keepAlive" />
            </keep-alive>
            <!-- <router-view class="avue-view" v-if="!$route.meta.$keepAlive" /> -->
          </div>
        </div>
      </div>
      <div class="avue-shade" @click="showCollapse"></div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import tags from "./tags";
  import search from "./search";
  import top from "./top/";
  import logo from "./logo";
  import sidebar from "./sidebar/";
  import admin from "@/util/admin";
  import {validatenull} from "@/util/validate";
  import {calcDate} from "@/util/date.js";
  import {getStore} from "@/util/store.js";

  export default {
    components: {
      top,
      tags,
      search,
      sidebar,
      logo
    },
    name: "index",
    provide() {
      return {
        index: this
      };
    },
    data() {
      return {
        //搜索控制
        isSearch: false,
        //刷新token锁
        refreshLock: false,
        //刷新token的时间
        refreshTime: ""
      };
    },
    created() {
      //实时检测刷新token
      this.refreshToken();
      console.log("====", this.$route.meta)
    },
    mounted() {
      this.init();
    },
    computed: mapGetters(["isMenu", "isLock", "isCollapse", "website", "menu"]),
    props: [],
    methods: {
      showCollapse() {
        this.$store.commit("SET_COLLAPSE");
      },
      // 初始化
      init() {
        this.$store.commit("SET_SCREEN", admin.getScreen());
        window.onresize = () => {
          setTimeout(() => {
            this.$store.commit("SET_SCREEN", admin.getScreen());
          }, 0);
        };
        this.$store.dispatch("FlowRoutes").then(() => {
        });
      },
      //打开菜单
      openMenu(item = {}) {
        this.$store.dispatch("GetMenu", item.id).then(data => {
          if (data.length !== 0) {
            this.$router.$avueRouter.formatRoutes(data, true);
          }
          //当点击顶部菜单后默认打开第一个菜单
          /*if (!this.validatenull(item)) {
            let itemActive = {},
              childItemActive = 0;
            if (item.path) {
              itemActive = item;
            } else {
              if (this.menu[childItemActive].length === 0) {
                itemActive = this.menu[childItemActive];
              } else {
                itemActive = this.menu[childItemActive].children[childItemActive];
              }
            }
            this.$store.commit('SET_MENU_ID', item);
            this.$router.push({
              path: this.$router.$avueRouter.getPath({
                name: (itemActive.label || itemActive.name),
                src: itemActive.path
              }, itemActive.meta)
            });
          }*/

        });
      },
      // 定时检测token
      refreshToken() {
        this.refreshTime = setInterval(() => {
          const token = getStore({
            name: "token",
            debug: true
          }) || {};
          const date = calcDate(token.datetime, new Date().getTime());
          if (validatenull(date)) return;
          if (date.seconds >= this.website.tokenTime && !this.refreshLock) {
            this.refreshLock = true;
            this.$store
              .dispatch("refreshToken")
              .then(() => {
                this.refreshLock = false;
              })
              .catch(() => {
                this.refreshLock = false;
              });
          }
        }, 10000);
      }
    }
  }
</script>
