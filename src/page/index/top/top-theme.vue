<template>
  <div>
    <el-dialog title="选择"
               append-to-body
               :visible.sync="box"
               width="50%">
      <el-radio-group v-model="text"
                      class="list">
        <el-row :span="24">
          <el-col v-for="(item,index) in list"
                  :key="index"
                  :md="4"
                  :xs="12"
                  :sm="4">
            <el-radio :label="item.value">{{item.name}}</el-radio>
          </el-col>
        </el-row>
      </el-radio-group>
    </el-dialog>

    <span>
      <i class="icon-zhuti"
         @click="open"></i>
    </span>
  </div>
</template>

<script>
import { setTheme } from "@/util/util";
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      box: false,
      text: "",
      list: [
        {
          name: "Wisteria",
          value: "Wisteria"
        },
        {
          name: "Tapestry",
          value: "Tapestry"
        },
        {
          name: "Atlantis",
          value: "Atlantis"
        },
        {
          name: "Indigo",
          value: "Indigo"
        },
        {
          name: "Dodger Blue",
          value: "Dodger-Blue"
        },
        {
          name: "Tradewind",
          value: "Tradewind"
        },
        {
          name: "Cranberry",
          value: "Cranberry"
        },
        {
          name: "Oslo Gray",
          value: "Oslo-Gray"
        },
        {
          name: "Chetwode Blue",
          value: "Chetwode-Blue"
        },
        {
          name: "Apricot",
          value: "Apricot"
        },
        {
          name: "Blue Smoke",
          value: "Blue-Smoke"
        },
        {
          name: "Green Smoke",
          value: "Green-Smoke"
        },
        {
          name: "Wild Blue Yonder",
          value: "Wild-Blue-Yonder"
        },
        {
          name: "Emerald",
          value: "Emerald"
        }
      ]
    };
  },
  watch: {
    text: function (val) {
      this.$store.commit("SET_THEME_NAME", val);
      setTheme(val);
    }
  },
  computed: {
    ...mapGetters(["themeName"])
  },
  mounted () {
    this.text = this.themeName;
    if (!this.text) {
      this.text = "";
    }
  },
  methods: {
    open () {
      this.box = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
}
</style>

