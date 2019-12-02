<template>
<el-dialog
      title="审核详情"
      :visible.sync="hideDialog"
      width="80%"
      @close="closeDialog"
      center>
      <span>
        <div class="checkInsidePage">
            <div class="left-box">
                <div class="top-title">修改后</div>
                <div class="content" v-if="showListData1">
                    <div class="title">基本信息</div>
                    <div class="text-flex">
                        <div class="text-left"><span class="star">*</span><span>供应商:</span></div>
                        <div class="text-right" :class="{'text-red' : (listData2&&listData1.baseInfo.supplier != listData2.baseInfo.supplier)}">{{listData1.baseInfo.supplier}}</div>
                    </div>
                    <div class="text-flex">
                        <div class="text-left"><span class="star">*</span><span>商品分类:</span></div>
                        <div class="text-right" :class="{'text-red' :  (listData2&&listData1.baseInfo.category != listData2.baseInfo.category)}">{{listData1.baseInfo.category}}</div>
                    </div>
                    <div class="text-flex">
                        <div class="text-left"><span class="star">*</span><span>商品名称:</span></div>
                        <div class="text-right" :class="{'text-red' :  (listData2&&listData1.baseInfo.spuName != listData2.baseInfo.spuName)}">{{listData1.baseInfo.spuName}}</div>
                    </div>
                    <div class="text-flex">
                        <div class="text-left"><span>副标题:</span></div>
                        <div class="text-right" :class="{'text-red' :  (listData2&&listData1.baseInfo.subTitle != listData2.baseInfo.subTitle)}">{{listData1.baseInfo.subTitle}}</div>
                    </div>
                    <div class="text-flex">
                        <div class="text-left"><span class="star">*</span><span>商品品牌:</span></div>
                        <div class="text-right" :class="{'text-red' :  (listData2&&listData1.baseInfo.brand != listData2.baseInfo.brand)}">{{listData1.baseInfo.brand}}</div>
                    </div>
                    <div class="title">库存规格</div>
                    <div class="text-flex">
                        <div class="text-left"><span>商品规格:</span></div>
                        <div>
                            <el-radio-group v-model="radioValue1" @change="changeRadio1">
                                <el-radio :disabled="disabled1" label="single">单品</el-radio>
                                <el-radio :disabled="!disabled1" label="more">多规格</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div v-if="showSingle1">
                        <div class="text-flex">
                            <div class="text-left"><span>国际条码号:</span></div>
                            <div class="text-right" :class="{'text-red' : (listData2&&listData1.skuList[0].barCodeNumber != listData2.skuList[0].barCodeNumber)}">{{listData1.skuList[0].barCodeNumber}}</div>
                        </div>
                        <div class="text-flex">
                            <div class="text-left"><span>供应商货号:</span></div>
                            <div class="text-right" :class="{'text-red' : (listData2&&listData1.skuList[0].supplierGoodsNumber != listData2.skuList[0].supplierGoodsNumber)}">{{listData1.skuList[0].supplierGoodsNumber}}</div>
                        </div>
                        <div class="text-flex">
                            <div class="text-left"><span class="star">*</span><span>销售售价:</span></div>
                            <div class="text-right" :class="{'text-red' : (listData2&&listData1.skuList[0].salePrice != listData2.skuList[0].salePrice)}">￥{{listData1.skuList[0].salePrice}}</div>
                        </div>
                        <div class="text-flex">
                            <div class="text-left"><span class="star">*</span><span>结算价格:</span></div>
                            <div class="text-right" :class="{'text-red' : (listData2&&listData1.skuList[0].payPrice != listData2.skuList[0].payPrice)}">￥{{listData1.skuList[0].payPrice}}</div>
                        </div>
                        <div class="text-flex">
                            <div class="text-left"><span class="star">*</span><span>商品库存:</span></div>
                            <div class="text-right" :class="{'text-red' : (listData2&&listData1.skuList[0].stock != listData2.skuList[0].stock)}">{{listData1.skuList[0].stock}}</div>
                        </div>
                        <div class="text-flex">
                            <div class="text-left"><span class="star">*</span><span>库存预警值:</span></div>
                            <div class="text-right" :class="{'text-red' : (listData2&&listData1.skuList[0].alarmStock != listData2.skuList[0].alarmStock)}">{{listData1.skuList[0].alarmStock}}</div>
                        </div>
                    </div>
                    <div v-if="!showSingle1">
                        <div class="sku-wrap">
                            <div class="sku-head flex">
                            <div class="norm-wrap">
                                <div style="width:80px;" v-for="item in aplitArr(listData1.baseInfo.spuSpecificationName)" :key="item">{{item}}</div>
                            </div>
                            <div class="flex-shrink-0 item-title" style="width: 100px;">图片</div>
                            <div class="flex-shrink-0 item-title" style="width: 150px;">国际条形码</div>
                            <div class="flex-shrink-0 item-title" style="width: 150px;">供应商货号</div>
                            <div class="flex-shrink-0 item-title" style="width: 100px;"><span class="star">*</span>结算价</div>
                            <div class="flex-shrink-0 item-title" style="width: 100px;"><span class="star">*</span>销售价</div>
                            <div class="flex-shrink-0 item-title" style="width: 100px;"><span class="star">*</span>库存</div>
                            <div class="flex-shrink-0 item-title" style="width: 100px;"><span class="star">*</span>库存预警值</div>
                            </div>
                            <div class="sku-body">
                                <div
                                    class="sku-body-line flex flex-cross-center"
                                    v-for="(item, index) in listData1.skuList"
                                    :key="index"
                                >
                                <div class="norm-wrap flex-1 flex flex-box-mean flex-cross-center">
                                <div
                                    v-for="(item2, index2) in aplitArr(item.skuAttributeName)"
                                    :key="item2"
                                    style="width:80px;"
                                    :class="{'text-red' : (listData2 &&listData1.skuList.length==listData2.skuList.length&&aplitArr(listData1.skuList[index].skuAttributeName)[index2] !=aplitArr(listData2.skuList[index].skuAttributeName)[index2] )}"
                                >{{item2}}</div>
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 100px;">
                                <img  :class="{'text-red' : (listData2 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].skuImage !=listData2.skuList[index].skuImage )}" class="imgurl" :src="item.skuImage" alt="">
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 150px;">
                                <div :class="{'text-red' : (listData2 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].barCodeNumber !=listData2.skuList[index].barCodeNumber )}">{{item.barCodeNumber}}</div>
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 150px;">
                                <div :class="{'text-red' : (listData2 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].supplierGoodsNumber !=listData2.skuList[index].supplierGoodsNumber )}">{{item.supplierGoodsNumber}}</div>
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 100px;">
                                <div :class="{'text-red' : (listData2 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].salePrice !=listData2.skuList[index].salePrice )}">{{item.salePrice}}</div>
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 100px;">
                                <div :class="{'text-red' : (listData2 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].payPrice !=listData2.skuList[index].payPrice )}">{{item.payPrice}}</div>
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 100px;">
                                <div :class="{'text-red' : (listData2 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].stock !=listData2.skuList[index].stock )}">{{item.stock}}</div>
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 100px;">
                                <div :class="{'text-red' : (listData2 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].alarmStock !=listData2.skuList[index].alarmStock )}">{{item.alarmStock}}</div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="title">商品主图</div>
                    <div class="img-list" :class="{'img-red' : (listData2&&listData1.spuImageList.length != listData2.spuImageList.length)}">
                        <img v-for="(item, index) in listData1.spuImageList" :key="index" class="mainImg" :src="item.url" alt="">
                    </div>
                    <div class="title">商品详情</div>
                    <div class="detailText" v-html="listData1.baseInfo.spuDetail" :class="{'img-red' : (listData2&&listData1.baseInfo.spuDetail != listData2.baseInfo.spuDetail)}">{{listData1.baseInfo.spuDetail}}</div>
                    <el-button class="check-btn" type="primary" @click="showCehckModal">审核</el-button>
                </div>
                <div class="content nocontent" v-else>无数据</div>
            </div>
            <div class="right-box">
                <div class="top-title">修改前</div>
                <div class="content" v-if="showListData2">
                    <div class="title">基本信息</div>
                    <div class="text-flex">
                        <div class="text-left"><span class="star">*</span><span>供应商:</span></div>
                        <div class="text-right" :class="{'text-red' : (listData1 &&listData1.baseInfo.supplier != listData2.baseInfo.supplier)}">{{listData2.baseInfo.supplier}}</div>
                    </div>
                    <div class="text-flex">
                        <div class="text-left"><span class="star">*</span><span>商品分类:</span></div>
                        <div class="text-right" :class="{'text-red' : (listData1 &&listData1.baseInfo.category != listData2.baseInfo.category)}">{{listData2.baseInfo.category}}</div>
                    </div>
                    <div class="text-flex">
                        <div class="text-left"><span class="star">*</span><span>商品名称:</span></div>
                        <div class="text-right" :class="{'text-red' : (listData1 &&listData1.baseInfo.spuName != listData2.baseInfo.spuName)}">{{listData2.baseInfo.spuName}}</div>
                    </div>
                    <div class="text-flex">
                        <div class="text-left"><span>副标题:</span></div>
                        <div class="text-right" :class="{'text-red' : (listData1 &&listData1.baseInfo.subTitle != listData2.baseInfo.subTitle)}">{{listData2.baseInfo.subTitle}}</div>
                    </div>
                    <div class="text-flex">
                        <div class="text-left"><span class="star">*</span><span>商品品牌:</span></div>
                        <div class="text-right" :class="{'text-red' : (listData1 &&listData1.baseInfo.brand != listData2.baseInfo.brand)}">{{listData2.baseInfo.brand}}</div>
                    </div>
                    <div class="title">库存规格</div>
                    <div class="text-flex">
                        <div class="text-left"><span>商品规格:</span></div>
                        <div>
                            <el-radio-group v-model="radioValue2" @change="changeRadio2">
                                <el-radio :disabled="disabled2" label="single">单品</el-radio>
                                <el-radio :disabled="!disabled2" label="more">多规格</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div v-if="showSingle2">
                        <div class="text-flex">
                            <div class="text-left"><span>国际条码号:</span></div>
                            <div class="text-right" :class="{'text-red' : (listData1 &&listData1.skuList[0].barCodeNumber != listData2.skuList[0].barCodeNumber)}">{{listData2.skuList[0].barCodeNumber}}</div>
                        </div>
                        <div class="text-flex">
                            <div class="text-left"><span>供应商货号:</span></div>
                            <div class="text-right" :class="{'text-red' : (listData1 &&listData1.skuList[0].supplierGoodsNumber != listData2.skuList[0].supplierGoodsNumber)}">{{listData2.skuList[0].supplierGoodsNumber}}</div>
                        </div>
                        <div class="text-flex">
                            <div class="text-left"><span class="star">*</span><span>销售售价:</span></div>
                            <div class="text-right" :class="{'text-red' : (listData1 &&listData1.skuList[0].salePrice != listData2.skuList[0].salePrice)}">￥{{listData2.skuList[0].salePrice}}</div>
                        </div>
                        <div class="text-flex">
                            <div class="text-left"><span class="star">*</span><span>结算价格:</span></div>
                            <div class="text-right" :class="{'text-red' : (listData1 &&listData1.skuList[0].payPrice != listData2.skuList[0].payPrice)}">￥{{listData2.skuList[0].payPrice}}</div>
                        </div>
                        <div class="text-flex">
                            <div class="text-left"><span class="star">*</span><span>商品库存:</span></div>
                            <div class="text-right" :class="{'text-red' : (listData1 &&listData1.skuList[0].stock != listData2.skuList[0].stock)}">{{listData2.skuList[0].stock}}</div>
                        </div>
                        <div class="text-flex">
                            <div class="text-left"><span class="star">*</span><span>库存预警值:</span></div>
                            <div class="text-right" :class="{'text-red' : (listData1 &&listData1.skuList[0].alarmStock != listData2.skuList[0].alarmStock)}">{{listData2.skuList[0].alarmStock}}</div>
                        </div>
                    </div>
                    <div v-if="!showSingle2">
                        <div class="sku-wrap">
                            <div class="sku-head flex">
                            <div class="norm-wrap">
                                <div style="width:80px;" v-for="item in aplitArr(listData2.baseInfo.spuSpecificationName)" :key="item">{{item}}</div>
                            </div>
                            <div class="flex-shrink-0 item-title" style="width: 100px;">图片</div>
                            <div class="flex-shrink-0 item-title" style="width: 150px;">国际条形码</div>
                            <div class="flex-shrink-0 item-title" style="width: 150px;">供应商货号</div>
                            <div class="flex-shrink-0 item-title" style="width: 100px;"><span class="star">*</span>结算价</div>
                            <div class="flex-shrink-0 item-title" style="width: 100px;"><span class="star">*</span>销售价</div>
                            <div class="flex-shrink-0 item-title" style="width: 100px;"><span class="star">*</span>库存</div>
                            <div class="flex-shrink-0 item-title" style="width: 100px;"><span class="star">*</span>库存预警值</div>
                            </div>
                            <div class="sku-body">
                            <div
                                class="sku-body-line flex flex-cross-center"
                                v-for="(item, index) in listData2.skuList"
                                :key="index"
                            >
                                <div class="norm-wrap flex-1 flex flex-box-mean flex-cross-center">
                                <div
                                    v-for="(item2, index2) in aplitArr(item.skuAttributeName)"
                                    :key="item2"
                                    style="width:80px;"
                                    :class="{'text-red' : (listData1 &&listData1.skuList.length==listData2.skuList.length&&aplitArr(listData1.skuList[index].skuAttributeName)[index2] !=aplitArr(listData2.skuList[index].skuAttributeName)[index2] )}"
                                >{{item2}}</div>
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 100px;">
                                <img  :class="{'text-red' : (listData1 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].skuImage !=listData2.skuList[index].skuImage )}" class="imgurl" :src="item.skuImage" alt="">
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 150px;">
                                <div :class="{'text-red' : (listData1 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].barCodeNumber !=listData2.skuList[index].barCodeNumber )}">{{item.barCodeNumber}}</div>
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 150px;">
                                <div :class="{'text-red' : (listData1 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].supplierGoodsNumber !=listData2.skuList[index].supplierGoodsNumber )}">{{item.supplierGoodsNumber}}</div>
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 100px;">
                                <div :class="{'text-red' : (listData1 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].salePrice !=listData2.skuList[index].salePrice )}">{{item.salePrice}}</div>
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 100px;">
                                <div :class="{'text-red' : (listData1 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].payPrice !=listData2.skuList[index].payPrice )}">{{item.payPrice}}</div>
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 100px;">
                                <div :class="{'text-red' : (listData1 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].stock !=listData2.skuList[index].stock )}">{{item.stock}}</div>
                                </div>
                                <div class="line-item-wrap flex-shrink-0" style="width: 100px;">
                                <div :class="{'text-red' : (listData1 &&listData1.skuList.length==listData2.skuList.length&&listData1.skuList[index].alarmStock !=listData2.skuList[index].alarmStock )}">{{item.alarmStock}}</div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="title">商品主图</div>
                    <div class="img-list" :class="{'img-red' : (listData1&&listData1.spuImageList.length != listData2.spuImageList.length)}">
                        <img v-for="(item, index) in listData2.spuImageList" :key="index" class="mainImg" :src="item.url" alt="">
                    </div>
                    <div class="title">商品详情</div>
                    <div class="detailText" v-html="listData1.baseInfo.spuDetail" :class="(listData1 &&listData1.baseInfo.spuDetail!= listData2.baseInfo.spuDetail) ?'img-red':''">{{listData2.baseInfo.spuDetail}}</div>
                </div>
                <div class="content nocontent" v-else>无数据</div> 
            </div>
            <el-dialog
                title="商品审核"
                :visible.sync="checkModal"
                :before-close="handleClose"
                :append-to-body="true"
                width="30%">
                <el-form label-width="100px" ref="singleForm" :model="singleForm">
                    <el-form-item label="商品名称：" class="m-b-10">{{spuName}}</el-form-item>
                    <el-form-item label="商品审核：" class="m-b-10">
                        <el-radio-group v-model="prdCheck">
                        <el-radio :label="70">审核通过</el-radio>
                        <el-radio :label="99">审核不通过</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="反馈详情：" class="m-b-10" v-show=" prdCheck == 99">
                        <el-input v-model="checkReason" type="textarea" placeholder="请输入审核不通过原因"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="checkModal = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="check">确 定</el-button>
                </span>
            </el-dialog>
        </div>
      </span>
    </el-dialog>  
</template>

<script>
export default {
  props: ["productId", "id"],
  data() {
    return {
      hideDialog: true,
      radioValue1: "",
      radioValue2: "",
      showSingle1: false,
      showSingle2: false,
      disabled1: "",
      disabled2: "",
      checkModal: false,
      prdCheck: 70,
      checkReason: "",
      showListData1: false,
      showListData2: false,
      listData1: "",
      listData2: "",
      spuName: ""
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    aplitArr(value) {
      let arr = [];
      arr = value.split(",");
      return arr;
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    changeRadio1(value) {
      console.log(value);
      this.showSingle1 = value == "single" ? true : false;
    },
    changeRadio2(value) {
      console.log(value);
      this.showSingle2 = value == "single" ? true : false;
      console.log(this.showSingle2);
    },
    getListData() {
      this.loading = true;
      this.$http
        .get("api/Focus-BladeX-BootX/productlist/checkDetail", {
          params: {
            productId: this.productId,
            id: this.id,
            companyNo: this.$store.state.companyNo
            // productId: "手动阀撒旦法的",
            // id: "1194864794453196801",
          }
        })
        .then(res => {
          //   console.log("res", res);
          this.listData1 = res.data.data.draftSpu; // 先注释
          this.listData2 = res.data.data.spu; // 先注释
          console.log(this.listData1, "listData1");
          console.log(this.listData2, "listData2");
          if (this.listData1) {
            this.showListData1 = true;
            this.spuName = this.listData1.baseInfo.spuName;
            if (this.listData1.baseInfo.notes == 20) {
              this.radioValue1 = "more";
              this.disabled1 = true;
            } else {
              this.radioValue1 = "single";
              this.disabled1 = false;
            }
            this.showSingle1 = this.radioValue1 == "single" ? true : false;
          } else {
            this.showListData1 = false;
          }
          if (this.listData2) {
            this.showListData2 = true;
            if (this.listData2.baseInfo.spuSpecification) {
              this.radioValue2 = "more";
              this.disabled2 = true;
            } else {
              this.radioValue2 = "single";
              this.disabled2 = false;
            }
            this.showSingle2 = this.radioValue2 == "single" ? true : false;
          } else {
            this.showListData2 = false;
          }

          this.loading = false;
        })
        .catch(err => {
          console.log("err", err);
          this.loading = false;
        });
    },
    showCehckModal() {
      this.checkModal = true;
    },
    check() {
      let param = {
        spuIdList: this.listData1.baseInfo.id,
        status: this.prdCheck,
        feedback: this.checkReason,
        companyNo: this.$store.state.companyNo
      };
      this.$http
        .post("api/Focus-BladeX-BootX/draftproductlist/batchVerify", param)
        .then(res => {
          console.log("res", res);
          console.log("res.data.code", res);
          if (this.prdCheck == "70") {
            this.$message({
              type: "success",
              message: "审核通过"
            });
          } else {
            this.$message({
              type: "success",
              message: "审核不通过"
            });
          }
          this.hideDialog = false
          this.$emit('isCheck')
          this.checkModal = false;
          this.getListData();
        })
        .catch(err => {
          console.log("err", err);
        });
    }
  }
};
</script>

<style lang="scss">
.checkInsidePage {
  display: flex;
  .text-red {
    color: #f04844;
  }
  .star {
    color: #f04844;
  }
  .detailText {
    word-break: normal;
    word-wrap: break-word;
    img {
      width: 100px;
      height: 100px;
    }
  }
  .img-red {
    border: 1px solid #f04844;
  }
  .top-title {
    width: 98%;
    height: 70px;
    text-align: center;
    line-height: 70px;
    background: #f2f2f2;
    color: #333;
  }
  .left-box {
    width: 50%;
  }
  .right-box {
    width: 50%;
  }
  .nocontent {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    height: calc(100vh - 290px);
  }
  .content {
    padding-left: 20px;
    .imgurl {
      width: 30px;
      height: 30px;
    }
    .imgUrl-red {
      border: 1px solid #f04844;
    }
    .img-list {
      display: flex;
      .mainImg {
        width: 100px;
        height: 100px;
        margin-right: 20px;
      }
    }
    .check-btn {
      margin-top: 40px;
    }
    .el-table {
      .el-table__header {
        .cell {
          font-size: 12px;
          position: relative;
        }
      }
    }
    .title {
      color: #333;
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 20px;
      margin-top: 30px;
    }
    .text-flex {
      display: flex;
      font-size: 14px;
      margin-bottom: 20px;
      .text-left {
        width: 80px;
        text-align: right;
        margin-right: 20px;
      }
    }
  }

  .sku-wrap {
    // width: 500px;
    overflow-x: auto;
    border-bottom: 1px solid #eee;
    .norm-wrap {
      display: flex;
      border-bottom: 1px solid #eee;
    }
    .item-title {
      border-bottom: 1px solid #eee;
      text-align: center;
      flex-shrink: 0;
    }
    .sku-head {
      display: flex;
      //   border-bottom: 1px solid #b6c2c9;
    }
    .sku-body {
      .norm-wrap {
        font-size: 14px;
        border-bottom: none;
      }
      .sku-body-line {
        height: 40px;
        flex-shrink: 0;
        // border-bottom: 1px solid #d9d9d9;
        margin-bottom: 10px;
        display: flex;
        .line-item-wrap {
          box-sizing: border-box;
          font-size: 14px;
          text-align: center;
          .el-button {
            width: 100%;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
    