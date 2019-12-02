<template>
  <basic-container>
    <div>基本设置</div>
    <el-form label-width="180px">
      <el-form-item label="热门关键字：" class="m-b-0" required >
        <el-input class="w-200" v-model="form.keys" size="small" placeholder="请输入热门关键字"></el-input>
        <div style="color:#A8ACB1;font-size:12px">热门搜索关键字,请用半角逗号(,)分隔多个关键字</div>
      </el-form-item>
      <el-form-item label="订单运费(元)：" class="m-b-0" >
        <el-input-number size="mini" v-model="form.freight" :controls="false" min="0" precision="0" placeholder="0"></el-input-number>
      </el-form-item>
      <el-form-item label="免运费订单金额(元)：" class="m-b-0" >
        <el-input-number size="mini" v-model="form.free" :controls="false" min="0" precision="0" placeholder="0"></el-input-number>
        <div style="color:#A8ACB1;font-size:12px">达到此购物金额，可免收运费</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small">提交</el-button>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
export default {
  data() {
    return {
      form:{
        keys: "",
        freight: undefined,
        free: undefined
      }
    };
  },
  created() {
  },
  mounted() {
    this.init();
  },
  watch: {
    'form.keys': {
      deep: true,
      handler(val){
        console.log(val)
      }
    }
  },
  methods: {
    async init() {
    },
  },
  
};
</script>

<style lang="scss">
.m-b-0{
  margin-bottom: 0;
}
.w-200{
  width: 200px;
}
</style>
