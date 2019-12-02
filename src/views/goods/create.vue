<template>
  <basic-container>
    <div class="commodity-create">
      <div>
        <el-button type="primary" :loading="saveLoading" :disabled="this.$route.query.verifyStatus == 30 || this.$route.query.verifyStatus == 40  || this.$route.query.verifyStatus == 50 || this.$route.query.verifyStatus == 60 || this.$route.query.doubleClick == 'true'" @click="save('10')" size="small">保存</el-button>
        <el-button type="primary" :loading="beforeLoading" :disabled="this.$route.query.verifyStatus == 30 || this.$route.query.verifyStatus == 40  || this.$route.query.verifyStatus == 50 || this.$route.query.verifyStatus == 60 || this.$route.query.doubleClick == 'true'" @click="beforeSave('20')" size="small">保存并提交</el-button>
      </div>
      <!-- 基本信息 -->
      <div>
        <el-form ref="baseInfo" class="baseInfo" :model="baseInfo" label-width="120px">
          <el-form-item label="供应商简称：" class="m-b-0" required>
            <el-select class="m-r-10" v-model="baseInfo.supplier" size="small" filterable>
              <el-option :label="item.name" :value="item.id + ''" v-for="(item,index) in supplierOptions" :key="index"></el-option>
            </el-select>
            <i class="el-icon-refresh" @click="overSupplier"></i>
          </el-form-item>
          <el-form-item label="商品分类：" class="m-b-0" required>
            <el-cascader class="m-r-10" v-model="productCategoryName" @change="changeCategory" :options="options" size="small" filterable>
            </el-cascader>
            <i class="el-icon-refresh" @click="overCategory"></i>
          </el-form-item>
          <el-form-item label="商品名称：" class="m-b-0" required>
              <el-input class="w-194" placeholder="请输入商品名称" size="small" maxlength="40" v-model="baseInfo.spuName"></el-input>
          </el-form-item>
          <el-form-item label="副标题：" class="m-b-0">
            <el-input class="w-194" placeholder="请输入副标题" size="small" maxlength="40" v-model="baseInfo.subTitle"></el-input>
          </el-form-item>
          <el-form-item label="商品品牌：" required class="m-b-20">
            <el-select class="m-r-10" size="small"  v-model="baseInfo.brand" filterable>
                <el-option :label="item.brandName" :value="item.id + ''" v-for="(item,index) in brandOptions" :key="index"></el-option>
            </el-select>
            <i class="el-icon-refresh" @click="overBrand"></i>
          </el-form-item>
        </el-form>
      </div>
      <!-- 商品规格 -->
      <div class="m-b-50">
        <el-form label-width="120px">
          <el-form-item class="m-t-10  m-b-0" label="规格：" required>
            <div>
              <el-radio-group v-model="baseInfo.notes" @change="normChange">
                <el-radio label="10"  size="mini">单品</el-radio>
                <el-radio label="20"  size="mini">多规格</el-radio>
              </el-radio-group>
              <span style="margin-left:18px;color:#A8ACB1;font-size:12px">此选项为设定商品的规格属性。</span>
            </div>
          </el-form-item>
        </el-form>
        <div class="singleNorm" v-show="baseInfo.notes == 10">
          <el-form label-width="120px" :model="singleNormForm" ref="singleNormForm">
            <el-form-item class="danpin m-b-0" label="国际条码号：">
              <el-input class="w-194" maxlength="20" size="small" placeholder="请输入国际条码号" v-model="singleNormForm.barCodeNumber"></el-input>
            </el-form-item>
            <el-form-item style="posotion:relative" class="danpin m-b-0" label="供应商货号：">
              <el-input class="w-194" size="small" maxlength="20" placeholder="请输入供应商货号" v-model="singleNormForm.supplierGoodsNumber"></el-input>
              <span style="margin-left:18px;color:#A8ACB1;font-size:12px">国际条码号和供应商货号至少填写一项</span>
            </el-form-item>
            <el-form-item style="posotion:relative" class="danpin m-b-0" label="销售售价：" required>
              <el-input-number :controls="false" size="small" :precision="2" v-model="singleNormForm.salePrice" placeholder="0.00" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item style="posotion:relative" class="danpin m-b-0" label="结算价格：" required>
              <el-input-number :controls="false" size="small" :precision="2" v-model="singleNormForm.payPrice" placeholder="0.00" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item style="posotion:relative" class="danpin m-b-0" label="商品库存：" required>
              <el-input-number :controls="false" size="small" :precision="0" v-model="singleNormForm.stock" placeholder="0" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item style="posotion:relative" class="danpin m-b-0" label="库存预警值：" required>
              <el-input-number :controls="false" size="small" :precision="0" v-model="singleNormForm.alarmStock" placeholder="0" :min="1"></el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div class="moreNorm m-t-10" v-show="baseInfo.notes == 20">
            <div >
              <div class="standard">
                <el-button @click="chooseNormDialogVisible = true" size="small"  type="primary" >选择规格</el-button>
                <el-button class="f-r" size="small" @click="editNormDialogVisible = true">编辑规格</el-button>
              </div>
              <div class="norm-list">
                  <el-row class="m-b-14" v-for="(item, index) in selectChoosedNormCheck" :key="item.id">
                      <el-col :span="2" style="height: 33px;line-height:33px;">{{item.productSpecificationName}}</el-col>
                      <el-col class="normDetail p-b-10" :span="22">
                        <div class="norm-button-group flex">
                          <div
                            class="norm-button"
                            :class="{'choosed': item2.checked}"
                            v-for="(item2, index2) in item.attributes"
                            :key="item2.id"
                            :label="item2.id"
                            :mm="item2.checked"
                            @click="moreNormCheckChange(item,index,item2,index2)"
                            :title="item2.name"
                          >{{item2.productAttributeName}}</div>
                        </div>
                      </el-col>
                  </el-row>
                  </div>
                  <div class="all-set m-b-10" v-if="selectChoosedNormCheck.length > 0">
                    <div class="m-b-10" style="margin-top:40px;font-size:14px;color:#262F3E;">多规格商品详细信息设置</div>
                    <div class=" m-b-15">
                      <el-checkbox v-model="allSet.payUnifiedSet" @change="checkedUnify">结算价统一设置</el-checkbox>
                      <el-input-number @change="changePay" :precision="2" :disabled="!allSet.payUnifiedSet" size="small" v-model="allSetForm.payUnifiedSet" :min="0" placeholder="0.00" :controls="false"></el-input-number> 
                    </div>
                    <div>
                      <el-checkbox v-model="allSet.saleUnifiedSet" @change="checkedUnify">销售价统一设置</el-checkbox>
                      <el-input-number @change="changeSale" :disabled="!allSet.saleUnifiedSet" :precision="2" size="small" v-model="allSetForm.saleUnifiedSet" :min="0" placeholder="0.00" :controls="false"></el-input-number> 
                    </div>
                  </div>
                  <div class="sku-wrap" v-if="selectChoosedNormCheck.length > 0">
                    <div><span style="color:red;font-size:12px">*</span><span style="color:#A8ACB1;font-size:12px"> 国际条码号和供应商货号至少填写一项</span></div>
                    <div class="sku-head flex">
                        <div class="norm-wrap flex-1 flex flex-box-mean">
                        <div v-for="item in selectChoosedNormCheck" :key="item.id">{{item.productSpecificationName}}</div>
                        </div>
                        <div style="width: 150px;">图片</div>
                        <div style="width: 160px;">国际条码号</div>
                        <div style="width: 160px;">供应商货号</div>
                        <div style="width: 140px;">结算价<span class="my-require">*</span></div>
                        <div style="width: 140px;">销售价<span class="my-require">*</span></div>
                        <div style="width: 140px;">库存<span class="my-require">*</span></div>
                        <div style="width: 140px;">库存预警值<span class="my-require">*</span></div>
                    </div>
                  <div class="sku-body">
                  <!-- <div class="sku-body" v-if="skuList.length == 0"> -->
                      <div
                      class="sku-body-line flex flex-cross-center"
                      v-for="(item, index) in skuList"
                      :key="index"
                      :mm="JSON.stringify(item)"
                      >
                      <div class="norm-wrap flex-1 flex flex-box-mean flex-cross-center">
                          <div
                          v-for="(item2, index2) in item.skuAttributeArr"
                          :key="index2"
                          >
                          {{showNormValueText(item2, index2).productAttributeName}}
                          </div>
                      </div>
                      <div class="line-item-wrap flex" style="width: 150px;">
                          <div class="el-button el-button--default el-button--mini" style="position:relative;width: 74px;">
                          上传图片
                          <input type="file"  style="position:absolute;left:0;top:0;opacity: 0;"  @change="tirggerFile($event, index)">
                          </div>
                          <div v-if="item.skuImage" class="flex flex-cross-center">
                          <img style="width:28px;height:28px;margin:0 10px;" :src="item.skuImage" alt>
                          <i
                               class="el-icon-delete"
                              style="color: red;font-size: 20px;cursor:pointer;"
                              @click="delSkuImg(index)"
                          ></i>
                          </div>
                      </div>
                      <div class="line-item-wrap" style="width: 160px;">
                          <el-input class="extrainput" size="mini" maxlength="20" v-model="item.barCodeNumber" placeholder="国际条码号"></el-input>
                      </div>
                      <div class="line-item-wrap" style="width: 160px;">
                          <el-input class="extrainput" size="mini" maxlength="20" v-model="item.supplierGoodsNumber" placeholder="供应商货号"></el-input>
                      </div>
                      <div class="line-item-wrap" style="width: 140px;">
                          <el-input-number class="extrainput"  size="mini" :controls="false" :min="0" :precision="2" placeholder="0.00" v-model="item.payPrice"  :disabled="allSet.payUnifiedSet"></el-input-number>
                      </div>
                      <div class="line-item-wrap" style="width: 140px;">
                          <el-input-number class="extrainput"  size="mini" :controls="false" :min="0" :precision="2" placeholder="0.00" v-model="item.salePrice"  :disabled="allSet.saleUnifiedSet"></el-input-number>
                      </div>
                      <div class="line-item-wrap" style="width: 140px;">
                          <el-input-number class="extrainput"  size="mini" :controls="false" :min="1" :precision="0" placeholder="0" v-model="item.stock"></el-input-number>
                      </div>
                      <div class="line-item-wrap" style="width: 140px;">
                          <el-input-number  class="extrainput" size="mini" :controls="false" :min="1" :precision="0" placeholder="0" v-model="item.alarmStock"></el-input-number>
                          <!-- @change="changeSoccerRate($event, index)" -->
                      </div>
                    </div>
                  </div>
              </div>
            </div>
        </div>
      </div>
      <!-- 商品主图 -->
      <div>
        <el-form label-width="120px">
          <el-form-item label="商品主图：" class="inlineImg" required>
            <Draggable
              class="dragArea list-group flex"
              :list="imgArr"
              :group="{ name: 'people', pull: pullFunction }"
              @start="start"
            >
              <li class="list-item" v-for="(item,index) in imgArr" :key="index">
                <img :src="item.url">
                <div class="modal flex flex-main-center">
                  <i class="el-icon-delete" @click="delImg(index)"></i>
                </div>
              </li>
            </Draggable>
            <el-upload
              action="api/Focus-BladeX-BootX/fileupload/uploadImage"
              list-type="picture-card"
              :headers="headers"
              :show-file-list="false"
              limit="8"
              multiple
              :on-preview="handlePictureCardPreview"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
              <div class="el-upload__tip line_height_15" slot="tip">
                <div>第一张为商品主图,你可以拖拽图片调整顺序</div>
                <div>建议尺寸：800*800像素，单张图片上限500K，最多上传8张</div>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <!-- 商品详情 -->
      <div>
        <el-form label-width="120px">
          <el-form-item label="商品详情：" required>
            <el-upload
              class="avatar-uploader"
              action="api/Focus-BladeX-BootX/fileupload/uploadImage"
              :headers="headers"
              :show-file-list="false"
              multiple
              :on-success="quillUploadSuccess"
              >
            </el-upload>
            <quill-editor
              v-model="content"
              ref="myQuillEditor"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
              @change="onEditorChange($event)"
            ></quill-editor>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" :loading="saveLoading" :disabled="this.$route.query.verifyStatus == 30 || this.$route.query.verifyStatus == 40  || this.$route.query.verifyStatus == 50 || this.$route.query.verifyStatus == 60 || this.$route.query.doubleClick == 'true'" @click="save('10')" size="small">保存</el-button>
        <el-button type="primary" :loading="beforeLoading" :disabled="this.$route.query.verifyStatus == 30 || this.$route.query.verifyStatus == 40  || this.$route.query.verifyStatus == 50 || this.$route.query.verifyStatus == 60 || this.$route.query.doubleClick == 'true'" @click="beforeSave('20')" size="small">保存并提交</el-button>
      </div>
      <el-dialog title="规格选择" width="42%" :visible.sync="chooseNormDialogVisible">
        <div class="top-line flex flex-main-justify">
          <div>
            <el-button type="primary" size="mini" @click="editNormDialogVisible = true">新增/编辑</el-button>
            <el-button type="primary" size="mini" @click="sureNomFunc">确定</el-button>
          </div>
        </div>
        <div class="choosed m-t-20">
          <div class="m-b-10">已选</div>
          <el-tag v-for="(tag,index) in dialogChoosedNormCheck" :key="index" class="m-r-15">{{tag.productSpecificationName}}</el-tag>
        </div>
        <div class="allNorm m-t-20">
          <div class="m-b-10">所有规格</div>
          <el-checkbox-group v-model="idList" @change="getSpec" size="mini">
            <el-checkbox-button
              v-for="item in dialogNormList"
              :key="item.id"
              :label="item.id"
            >{{item.productSpecificationName}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </el-dialog>
      <el-dialog title="编辑规格" width="90%" top="5vh" custom-class="dialogEditNorm" :visible.sync="editNormDialogVisible">
        <my-specification></my-specification>
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import Draggable from 'vuedraggable'
import { quillEditor } from "vue-quill-editor";
import mySpecification from "./specification.vue";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { Base64 } from 'js-base64';
import { getToken } from '@/util/auth'
import website from '@/config/website';
// import $ from "jquery";

export default {
  components: { Draggable, quillEditor,mySpecification },
  data() {
    return {
      headers: {
        'Authorization': `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`,
        'Blade-Auth': 'bearer '+getToken()
      },
      baseInfo: {
        id: "",
        supplier: "",
        category: "",
        spuName: "",
        subTitle: "",
        brand: "",
        productId: "",
        isVirtual: "10",
        spuSpecification: "",
        equitiesType: "60",
        notes: "10" // 10:单规格 20：多规格
      },
      content: "",
      brandOptions: [],
      supplierOptions: [],
      options: [],
      productCategoryName: "",
      imgArr: [],
      checkboxGroup1: [],
      queryParam: {
        opt: "",
        id: "",
        type: ""
      },
      singleNormForm: {
        id: "",
        barCodeNumber: "",
        supplierGoodsNumber: "",
        salePrice: undefined,
        payPrice: undefined,
        stock: undefined,
        alarmStock: undefined,
        productNumber: "",
      },
      skuList: [
        // {productSpecificationSet:[{name:"a"},{name:"a"}]}
      ],
      allSet: {
        payUnifiedSet: false,
        saleUnifiedSet: false,
      },
      allSetForm: {
        payUnifiedSet: undefined,
        saleUnifiedSet: undefined,
      },
      payUnifiedSet: true,
      saleUnifiedSet: true,
      specData: [{}],
      selectChoosedNormCheck: [
        // {name:"直充券",checked:true,attribute:[{name:"周卡",id:"1111",checked:true, },{name:"月卡",id:"2222",checked:true,}]},
        // {name:"兑换码",checked:true,attribute:[{name:"白银",id:"1111",checked:true,},{name:"黄金",id:"2222",checked:false,}]}
        ],
      chooseNormDialogVisible: false,
      editNormDialogVisible: false,
      dialogChoosedNormCheck: [],
      dialogNormList: [{id:"1", name:"直充券"},{id:"2", name:"兑换码"},{id:"3", name:"测试"}],
      editorOption: {
        modules: {
          toolbar: {
            container: [["image"]],
            handlers: {
              image: function(value) {
                // console.log(value)
                if (value) {
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      },
      idList: [], // 选中规格id集合
      verifyStatus: "", // 商品状态
      saveLoading: false,
      beforeLoading: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getNomData()
    this.getProductCategory()
    this.getBrand()
    this.getSupplier()
    if(this.$route.query.id && this.$route.query.verifyStatus){
      this.getDetail()
    }
  },
  methods:{
    getSpec(val){
      console.log(val)
      let arr = []
      this.dialogNormList.map(item =>{
        return val.map( item2 =>{
          if(item.id == item2){
            arr.push(item)
          }
        })
      })
      this.dialogChoosedNormCheck = arr
      console.log(arr,"arr")
      
    },
    // 重新加载供应商
    overSupplier(){
      this.getSupplier()
      this.$message({
        type: "success",
        message: "供应商刷新成功"
      })
    },
    // 重新加载商品分类
    overCategory(){
    this.getProductCategory()
      this.$message({
        type: "success",
        message: "商品分类刷新成功"
      })
    },
    // 重新加载商品品牌
    overBrand(){
    this.getBrand()
      this.$message({
        type: "success",
        message: "商品品牌刷新成功"
      })
    },
    handlePictureCardPreview(){},
    handleRemove(){},
    handleSuccess(response, file, fileList){
      let obj = {url:""}
      obj.url = response.data
      this.imgArr.push(obj)
      console.log(response, file,fileList)
      console.log(this.imgArr)
    },
    // 拖拽方法
    clone() {
      // console.log(this.imgArr)
      return {}
    },
    pullFunction() {
      return this.controlOnStart ? 'clone' : true
    },
    start({ originalEvent }) {
      this.controlOnStart = originalEvent.ctrlKey
    },
    // 富文本上传成功结果
    quillUploadSuccess(response) {
      let quill = this.$refs.myQuillEditor.quill;
      let length = quill.getSelection().index;
      // quill.insertEmbed(length, 'block', '');
      quill.insertEmbed(length + 1, "image", response.data);
      quill.insertEmbed(length + 2, "block", "");
      quill.setSelection(length + 3);
    },
    onEditorBlur() {
      // console.log('editor blur!', quill)
    },
    onEditorFocus() {
      // console.log('editor focus!', quill)
    },
    onEditorReady() {
      // console.log('editor ready!', quill)
    },
    onEditorChange() {
      // console.log('editor ready!', quill)
    },
    // 自定义渲染列头 加红色星号
    renderHeader(h, { column}){
      return h('div', {
                attrs: {
                  class: 'cell'  //ele原来样式
                },
                domProps: {
                  innerHTML: column.label + ' <span style="color:red">* </span>'
                }
              })
    },
    normChange(val){
      if(val == 10){
        this.selectChoosedNormCheck  = []
        this.skuList = []
        this.specificaAttribute = []
        this.dialogChoosedNormCheck = []
      }else if(val == 20){
        this.singleNormForm =  {
          id: "",
          barCodeNumber: "",
          supplierGoodsNumber: "",
          salePrice: undefined,
          payPrice: undefined,
          stock: undefined,
          alarmStock: undefined,
          productNumber: "",
        }
      }
    },
    // 关闭规格选择模态
    sureNomFunc() {
      // console.log("aaaa",this.dialogChoosedNormCheck)
      if (
        this.selectChoosedNormCheck.toString() !=
        this.dialogChoosedNormCheck.toString()
      ) {
        this.skuList = [];
      }
      this.selectChoosedNormCheck = this.dialogChoosedNormCheck.map(item => {
        if (!item.select) {
          item.select = [];
        }
        return item;
      });
      console.log("this.selectChoosedNormCheck",this.selectChoosedNormCheck)
      this.chooseNormDialogVisible = false;
    },
    parsePrice(data) {
      let tmpArr = '设置价格';
      if (data && data.salesPrice && data.marketPrice) {
        tmpArr = `市: ￥${data.marketPrice} / 销: ￥${data.salesPrice}`
      }
      return tmpArr;
    },
    /**
     * 多规格中属性的选择方法，触发之后刷新skuList
     */
    moreNormCheckChange(data, index, data2, index2) {
      // console.log(data, index, data2, index2)
      if (data2.checked && this.queryParam.opt == 'edit' && this.queryParam.type == "code") {
        let canCancel = true
        this.skuList.map(item => {
          if (item.batch == 0 && item.productSpecificationSet.indexOf(data2.id) > -1) canCancel = false
        })
        if (!canCancel) {
          // this.$message({
          //   showClose: true,
          //   message: "无法修改规格",
          //   type: "warning"
          // });
          this.$confirm('已有批次的商品的规格不能被修改，<br>请查看该商品的批次情况。', '操作失败', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '我知道了',
            // cancelButtonText: '取消',
            showCancelButton: false,
            type: 'warning',
            center: true
          })
          return false
        }
      }
      if (data2.checked) {
        data2.checked = false
        data.select.splice(data.select.indexOf(data2.id), 1)
      } else {
        data2.checked = true
        data.select.push(data2.id)
      }
      // console.log(index2, data2)
      // console.log(this.selectChoosedNormCheck[index],"====")
      this.$set(this.selectChoosedNormCheck[index].attributes, index2, data2)
      this.$set(this.selectChoosedNormCheck, index, data)
      this.$nextTick(() => {
        this.createSkuListData();
      });
    },
    createSkuListData() {
      let count = 0;
      this.selectChoosedNormCheck.map(item => {
        if (item.select.length > 0) {
          if (count == 0) count = 1;
          count = count * item.select.length;
        }
      });
      // console.log('总计SKU种类', count)
      let list = [];
      let recursionSpecObj = data => {
        let len = data.length;
        if (len >= 2) {
          let len1 = data[0].length; // 3
          let len2 = data[1].length; // 4
          let newlen = len1 * len2;
          let temp = new Array(newlen);
          let index = 0;
          for (let i = 0; i < len1; i++) {
            for (let j = 0; j < len2; j++) {
              if (Array.isArray(data[0][i])) {
                temp[index] = [...data[0][i], data[1][j]];
              } else {
                temp[index] = [data[0][i], data[1][j]];
              }
              index++;
            }
          } // [[[1,3], [1,4]]]
          let newArray = new Array(len - 1);
          for (let i = 2; i < len; i++) {
            newArray[i - 1] = data[i];
          }
          newArray[0] = temp;
          return recursionSpecObj(newArray);
        } else {
          return data[0];
        }
      };
      if (this.selectChoosedNormCheck.length > 1) {
        list = recursionSpecObj(
          this.selectChoosedNormCheck.map(item => {
            return item.select;
          })
        );
      } else {
        list = this.selectChoosedNormCheck[0].select.map(item => {
          return [item];
        });
      }
      // console.log("list",list)
      let list2 = list.map(item => {
        let tmpItem = {
          id:"",
          barCodeNumber: "",
          supplierGoodsNumber: "",
          skuAttributeArr: item,
          salePrice: undefined,
          payPrice: undefined,
          stock: undefined,
          alarmStock: undefined,
          skuImage: "",
        };
        this.skuList.map(item2 => {
          if (item2.skuAttributeArr.join(',') == tmpItem.skuAttributeArr.join(',')) {
            tmpItem = {
              ...item2
            }
          }
        })
        return tmpItem;
      });
      // console.log("list2" , list2)
      this.skuList = list2;
      // console.log(this.skuList,"skuList");
    },
    showNormValueText(id, index) {
      let data = {};
      this.selectChoosedNormCheck.length > 0 &&
        this.selectChoosedNormCheck[index].attributes.map(item => {
          if (item.id == id) data = item;
        });
        // console.log("data",data)
      return data;
    },
    // 统一设置结算价
    changePay(val){
      console.log(val)
      this.skuList.map(item =>{
        item.payPrice = val
      })
    },
    // 统一设置销售价
    changeSale(val){
      console.log(val)
      this.skuList.map(item =>{
        item.salePrice = val
      })
    },
    // 获取商品详情
    getDetail(){
      let id = this.$route.query.id 
      let verifyStatus = this.$route.query.verifyStatus
      let productId = this.$route.query.productId
      let doubleClick = this.$route.query.doubleClick
      let companyNo = this.$store.state.companyNo
      console.log(id,verifyStatus)
      this.$http.get("api/Focus-BladeX-BootX/draftproductlist/spuDetail?id=" + id + "&&verifyStatus=" + verifyStatus + 
      "&&productId=" + productId + "&&doubleClick=" + doubleClick + "&&companyNo=" + companyNo).then(res =>{
        console.log(res)
        this.brandOptions.map(item =>{
          if(item.id == res.data.baseInfo.brand){
            res.data.baseInfo.brand == item.brandName
          }
        })
        this.baseInfo = res.data.baseInfo
        this.imgArr = res.data.spuImageList
        this.content = res.data.spuDetail
        this.productCategoryName = res.data.baseInfo.category.split(",")
        console.log("this.productCategoryName",this.productCategoryName)
        res.data.skuList.map(item =>{
          // console.log(item)
          item.skuAttributeArr = item.skuAttribute.split(",")
        })
        if(res.data.baseInfo.notes == 10){
          this.singleNormForm = res.data.skuList[0]
        }else if(res.data.baseInfo.notes == 20){
          res.data.baseInfo.specificaAttribute.map(item =>{
            item.attributes.map(item2 =>{
              item2.checked = item2.flag
            })
          })
          this.selectChoosedNormCheck = res.data.baseInfo.specificaAttribute
          this.selectChoosedNormCheck.map(item =>{
            item.select = []
            item.attributes.map(item2 =>{
              if(item2.checked){
                item.select.push(item2.id)
              }
            })
          })
          this.skuList = res.data.skuList
        }
        // console.log("===",this.skuList)
        this.dialogChoosedNormCheck = this.selectChoosedNormCheck.map(item =>{
          return {
            attributes: item.attributes.map( item2 => {
              return {
                productAttributeName: item2.productAttributeName,
                productSpecification: item2.productSpecification.toString(),
                id: item2.id
              }
            }),
            id: item.id.toString(),
            productSpecificationName: item.productSpecificationName,
          }
        })
        this.idList = res.data.baseInfo.specificaAttribute.map(item => {
          return item.id.toString()
        })
        this.baseInfo.spuSpecification = this.baseInfo.spuSpecification.split(",")
        console.log("=======",this.selectChoosedNormCheck)
        
      })
    },
    // 选择商品分类
    changeCategory(val){
      this.baseInfo.category = val[val.length - 1]
      // console.log(val)
    },
    // 保存新增商品
    beforeSave(type){
      if(!this.baseInfo.supplier){
        this.$message({
          type: "error",
          message: "未选择供应商"
        })
        return false
      }
      if(!this.baseInfo.category){
        this.$message({
          type: "error",
          message: "未选择商品分类"
        })
        return false
      }
      if(!this.baseInfo.spuName){
        this.$message({
          type: "error",
          message: "未填写商品名称"
        })
        return false
      }
      if(!this.baseInfo.brand){
        this.$message({
          type: "error",
          message: "未选择商品品牌"
        })
        return false
      }
      if(this.imgArr.length == 0){
        this.$message({
          type: "error",
          message: "未上传商品主图"
        })
        return false
      }
      if(!this.content){
        this.$message({
          type: "error",
          message: "未填写商品详情"
        })
        return false
      }
      if(this.baseInfo.notes == 10){
        if(!this.singleNormForm.barCodeNumber && !this.singleNormForm.supplierGoodsNumber){
          this.$message({
          type: "error",
          message: "单品国际条码号 和 供应商货号 不能同时为空"
        })
        return false
        }
        if(!this.singleNormForm.salePrice){
          this.$message({
          type: "error",
          message: "单品未设置销售价"
        })
        return false
        }
        if(!this.singleNormForm.payPrice){
          this.$message({
          type: "error",
          message: "单品未设置结算价"
        })
        return false
        }
        if(!this.singleNormForm.stock){
          this.$message({
          type: "error",
          message: "单品未设置库存"
        })
        return false
        }
        if( !this.singleNormForm.alarmStock){
          this.$message({
          type: "error",
          message: "单品未设置库存预警值"
        })
        return false
      }
        this.beforeLoading = true
        this.save(type)
      }
      if(this.baseInfo.notes == 20){
        let bool = true
        if(this.selectChoosedNormCheck == 0){
          this.$message({
              type: "error",
              message: "未选择多规格商品规格"
            })
            return false
        }
        if(this.skuList.length == 0){
          this.$message({
              type: "error",
              message: "多规格商品列不能为空"
            })
            return false
          }
        if(this.skuList.length != 0){
          for(let item of this.skuList){
            if(!item.barCodeNumber && !item.supplierGoodsNumber){
              this.$message({
                type: "error",
                message: "存在多规格商品国际条码号和供应商货号同时为空"
              })
              bool = false
              return bool
            } 
            if(!item.payPrice){
              this.$message({
                type: "error",
                message: "存在多规格商品结算价为空"
              })
              bool = false
              return bool
            }else if(!item.salePrice){
              this.$message({
                type: "error",
                message: "存在多规格商品销售价为空"
              })
              bool = false
              return bool
            }else if(!item.stock){
              this.$message({
                type: "error",
                message: "存在多规格商品库存为空"
              })
              bool = false
              return bool
            }else if(!item.alarmStock){
              this.$message({
                type: "error",
                message: "存在多规格商品库存预警值为空"
              })
              bool = false
              return bool
            }
          }
        }
        this.beforeLoading = true
        this.save(type)
      }
    },
    save(type){
      
      // console.log(this.baseInfo)
      if(!this.baseInfo.supplier){
        this.$message({
          type: "error",
          message: "未选择供应商"
        })
        return false
      }
      if(!this.baseInfo.spuName){
        this.$message({
          type: "error",
          message: "未填写商品名称"
        })
        return false
      }
      if(type == 10){
        this.saveLoading = true
      }
      this.baseInfo.companyNo = this.$store.state.companyNo
      // console.log(this.baseInfo.spuSpecification)
      // console.log(this.selectChoosedNormCheck)
      this.baseInfo.spuSpecification = this.selectChoosedNormCheck.map(item =>{
        return item.id
      }).join(",")
      console.log(this.baseInfo.spuSpecification)
      this.skuList.map(item =>{
        item.skuAttribute = item.skuAttributeArr.join(",")
      })
      let skuList = [{}]
      if(this.baseInfo.notes == 10){
        skuList[0] = this.singleNormForm
      }else if(this.baseInfo.notes == 20){
        skuList = this.skuList
      }
      this.imgArr.map((item,index) =>{
        if(index == 0){
          item.picType = "10"   // 10：商品主图 20：其他图片
        }else{
          item.picType = "20"
        }
      })
      let params = {
        baseInfo: this.baseInfo,
        skuList: skuList,
        spuImageList: this.imgArr,
        spuDetail: this.content,
        type: type,
        verifyStatus: this.$route.query.verifyStatus || this.verifyStatus,
        companyNo: this.$store.state.companyNo,
      }
      console.log(params,"params")
      this.$http.post("api/Focus-BladeX-BootX/draftproductlist/saveUpdateSpu",params).then( res =>{
        if(res.status == 200){
          this.baseInfo.id = res.data.data.id.toString()
          this.baseInfo.productId = res.data.data.productId.toString()
          this.verifyStatus = res.data.data.verifyStatus
          this.$message({
          type: "success",
          message: type == 10 ? '保存成功': '提交成功'
          })
          if(type == 20){
            this.$router.push("/goods/goods-list")
          }
          this.saveLoading = false
          this.beforeLoading = false
        }
      })
    },
    // 获取规格信息
    getNomData(){
      let companyNo = this.$store.state.companyNo
      this.$http.get("api/Focus-BladeX-BootX/productspecification/querySpecList?current=1&&size=99999&&companyNo=" + companyNo).then(res =>{
        this.dialogNormList = res.data.data.records.map(item => {
          return {
            attributes: item.attributes.map( item2 => {
              return {
                productAttributeName: item2.productAttributeName,
                productSpecification: item2.productSpecification.toString(),
                id: item2.id
              }
            }),
            id: item.id.toString(),
            productSpecificationName: item.productSpecificationName,
          }
        })
      })
    },
    // 获取供应商信息
    getSupplier(){
      let companyNo = this.$store.state.companyNo
      this.$http.get("api/Focus-BladeX-BootX/supplierinfo/list?current=1&&size=99999&&companyNo=" + companyNo).then(res =>{
        this.supplierOptions = res.data.data.records
        // console.log(res.data.data.records)
      })
    },
    // 获取品牌数据
    getBrand(){
      let companyNo = this.$store.state.companyNo
      this.$http.get("api/Focus-BladeX-BootX/brandinfo/list?current=1&&size=99999&&companyNo=" + companyNo).then(res =>{
        this.brandOptions = res.data.data.records
        // console.log(res.data.data.records)
      })
    },
    // 获取商品分类
    getProductCategory(){
      this.$http.get("api/Focus-BladeX-BootX/productcategory/selectCategoryList", {
        params: {
          companyNo: this.$store.state.companyNo
        }
      }).then(res =>{
        // console.log(res.data.data)
        this.recursion(res.data.data)
        this.options = res.data.data
      })
    },
    // 递归分类
    recursion(children){
      if(children.length > 0){
        children.map(item =>{
          if(item.children.length > 0){
            this.recursion(item.children)
          }else{
            delete item.children
          }
          item.label = item.productCategoryName
          item.value = item.id
        })
      }
    },
    // 上传图片前校验文件大小
    handleBeforeUpload(response){
      // console.log("====",response)
      let isSize = response.size / 1024 > 500
      if(isSize){
        this.$message({
          type: "error",
          message: "上传图片超过500kb",
        })
      }
      return !isSize
    },
    // 删除不需要主图
    delImg(index){
      this.imgArr.splice(index,1)
      console.log(this.imgArr)
    },
    // 删除多规格商品图片
    delSkuImg(index) {
      var item = this.skuList[index];
      item.skuImage = "";
      this.skuList.splice(index, 1, item);
    },
    tirggerFile(event, index) {
      console.log(event, index)
      let file = event.target.files[0];
      let param = new FormData(); // 创建form对象
      console.log(param)
      param.append("file", file, file.name); // 通过append向form对象添加数据
      // param.append('type', '1') // 添加form表单中其他数据
      // console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      // 添加请求头
      this.$http
        .post(
          "api/Focus-BladeX-BootX/fileupload/uploadImage",
          param,
          config
        )
        .then(res => {
          // console.log('res', res.data.data);
          this.skuList[index].skuImage =  res.data.data 
          var item = this.skuList[index];
          this.skuList.splice(index, 1, item);
        })
        .catch(err => {
          console.log("err", err);
        });
    }
  }
};
</script>

<style lang="scss">
.m-r-10{
  margin-right: 10px;
}
.m-b-0{
  margin-bottom: 0;
}
.m-b-10{
  margin-bottom: 10px;
}
.m-b-15{
  margin-bottom: 15px;
}
.m-b-50{
  margin-bottom: 50px;
}
.m-r-15{
  margin-right: 15px;
}
.w-194{
  width: 194px;
}
.line_height_15{
  line-height: 15px;
}
.minheight{
  min-height: 260px;
}
.norm-list{
  .normDetail {
  border-bottom: 1px solid #d9d9d9;
  }
}

.list-item{
  position: relative;
  width: 146px;
  height: 146px;
  border-radius: 5px;
  overflow: hidden;
  margin: 0 5px;
  img{
    width: 146px;
    height: 146px;
  }
  .modal{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: .5);
    display: none;
    i{
      color: #ffffff;
      font-size: 24px;
      line-height: 146px;
      text-align: center;
    }
  }
  &:hover .modal{
    display: block;
  }
}
.quill-editor {
  .ql-toolbar {
    border-color: #dcdfe6;
    border-radius: 3px 3px 0 0;
  }
  .ql-container {
    border-color: #dcdfe6;
    border-radius: 0 0 3px 3px;
    .ql-editor {
      min-height: 300px;
    }
  }
}
.avatar-uploader {
    height: 0;
  }
.dialogEditNorm,
  .dialogEditLabel,
  .dialogEditSort {
    .el-dialog__body {
      max-height: calc(95vh - 150px);
      overflow-y: auto;
      background-color: #d9e0e7;
    }
  }
.inlineImg{
  .el-form-item__content{
    display: flex;
  }
}
.el-checkbox-button{
  margin-right: 10px;
  margin-bottom: 10px;
  .el-checkbox-button__inner{
    width: 180px;
    height: 28px;
    border-radius:3px;
    border: 1px solid #d9d9d9;
    text-align: left;
  }
}    
.el-checkbox-button:last-child .el-checkbox-button__inner{
    border-radius:3px;
}
.el-checkbox-button:first-child .el-checkbox-button__inner{
    border-radius:3px;
}
.chooseStandard{
  margin-left: 200px;
  margin-bottom: 10px;
}
.sku-head {
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #b6c2c9;
  }
.norm-button-group {
        width: 100%;
        .norm-button {
          border: 1px solid #d9d9d9;
          border-radius: 3px;
          width: 180px;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 7px 15px;
          font-size: 12px;
          float: left;
          margin-right: 10px;
          margin-bottom: 10px;
          cursor: pointer;
          &.choosed{
            color: #FFFFFF;
            background-color: #308ad9;
            border: 1px solid #308ad9;
          }
        }
      }
.extrainput{
  width: 100px;
}
.sku-wrap {
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }

      input[type="number"] {
        -moz-appearance: textfield;
      }
      margin-top: 30px;
      .sku-head {
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #b6c2c9;
      }
      .sku-body {
        .sku-body-line {
          height: 42px;
          border-bottom: 1px solid #d9d9d9;
          .line-item-wrap {
            box-sizing: border-box;
            padding: 0 10px 0 0;
            .el-button {
              width: 100%;
              overflow: hidden;
            }
          }
        }
      }
    }
</style>