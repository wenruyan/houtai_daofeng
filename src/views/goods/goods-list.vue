<template>
  <basic-container>
    <div class="goods-list">
      <div class="points-query">
        <div class="rl-body">
          <el-form  label-width="120px" ref="searchForm" :model="searchForm">
            <el-row gutter="20">
              <el-col :span="6">
                <el-form-item label="商品名称：">
                  <el-input size="small" v-model="searchForm.spuNameNo" placeholder="商品名称/商品编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商品分类：">
                  <el-cascader v-model="productCategoryName" @change="changeCategory" :options="options" size="small" filterable>
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商品品牌：">
                  <el-select size="small"  v-model="searchForm.brand">
                    <el-option :label="item.brandName" :value="item.id" v-for="(item,index) in brandOptions" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="上下架：">
                  <el-select size="small"  v-model="searchForm.status">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="上架" value="20"></el-option>
                    <el-option label="下架" value="10"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row gutter="20">
              <el-col :span="6">
                <el-form-item label="审核状态：">
                  <el-select size="small"  v-model="searchForm.verifyStatus">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="新增待审核" value="10"></el-option>
                    <!-- <el-option label="修改待审核" value="20"></el-option> -->
                    <el-option label="新增审核中" value="30"></el-option>
                    <!-- <el-option label="修改审核中" value="40"></el-option> -->
                    <el-option label="新增打回" value="50"></el-option>
                    <!-- <el-option label="修改打回" value="60"></el-option> -->
                    <el-option label="审核通过" value="70"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="供应商：">
                  <el-input size="small" v-model="searchForm.supplier" placeholder="供应商/供应商编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button size="small" type="primary" @click="searchListData">查询</el-button>
                  <el-button size="small" @click="resetSearch">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table
            border
            :data="tableData"
            ref="multipleTable"
            height="calc(100vh - 290px - 66px)"
            stripe
            style="width: 100%;"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            @selection-change="handleSelectionChange"
            v-loading="loading"
          >
            <el-table-column type="selection" width="100">
              <template slot-scope="scope">
                <el-checkbox :disabled="scope.row.verifyStatus != 70 || scope.row.forceStatus == 10" v-model="scope.row.checked"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="编号" prop="id" width="150"></el-table-column>
            <el-table-column label="商品名称" prop="spuName" width="180">
              <template slot-scope="scope">
                <span @click="edit(scope.row , 'true')" class="operate-btn">{{scope.row.spuName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="分类" prop="category"></el-table-column>
            <el-table-column label="供应商" prop="supplier"></el-table-column>
            <el-table-column label="销售价格" prop="salePrice"></el-table-column>
            <el-table-column label="结算价格" prop="payPrice"></el-table-column>
            <el-table-column label="库存" prop="stock"></el-table-column>
            <el-table-column label="毛利率" prop="rateOfMargin"></el-table-column>
            <el-table-column label="审核状态" prop="verifyStatusStr">
              <template slot-scope="scope">
                <span>
                  {{scope.row.verifyStatusStr}} 
                </span>
              </template>
            </el-table-column>
            <el-table-column label="上架状态" prop="statusBool">
              <template slot-scope="scope">
                <el-switch 
                  :disabled="scope.row.forceStatus == 10 || scope.row.verifyStatus != 70"
                  @change="OnOffCommand(scope.row.id,scope.row.statusBool)"
                  v-model="scope.row.statusBool">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <span @click="showEditModal(scope.row)" class="operate-btn" v-if="!(scope.row.verifyStatus == 10 || scope.row.verifyStatus == 30 || scope.row.verifyStatus == 50 || scope.row.verifyStatus == 60)">快速编辑</span>
                <span @click="edit(scope.row , 'false')" class="operate-btn">{{scope.row.verifyStatus == 50 || scope.row.verifyStatus == 60 || scope.row.verifyStatus == 30 || scope.row.verifyStatus == 40 ? '查看': '编辑'}}</span>
                <span @click="OnOffCommand(scope.row.id, '30')" v-if="scope.row.verifyStatus == 70 && scope.row.forceStatus != 10" class="operate-btn" >强制下架</span>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="bottom-col">
            <div class="flex flex-cross-center fl"> 
              <el-checkbox class="p-l-14 fl" v-model="checkedAll" label="本页全选"></el-checkbox>
              <el-dropdown trigger="click" @command="handleBatchCommand">
                <el-button type="default">
                  批量操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" >
                  <el-dropdown-item
                    :command="item.value"
                    v-for="(item, key) in batchOptions"
                    :key="key"
                  >{{item.label}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-pagination
              class="fr"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
              :page-sizes="[15, 30, 50, 100]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="page.total"
            ></el-pagination>
          </el-row>
        </div>
        <!-- 单规格编辑模态框 -->
        <el-dialog
          title="编辑货品信息"
          :visible.sync="singleEditModal"
          width="30%">
          <el-form label-width="220px" ref="singleForm" :model="singleForm">
            <el-form-item label="商品编号：" class="m-b-10">{{baseInfo.id}}</el-form-item>
            <el-form-item label="商品名称：" class="m-b-10">{{baseInfo.spuName}}</el-form-item>
            <el-form-item label="结算价：" class="m-b-10" required>
              <el-input-number v-model="singleForm.payPrice" size="small" :precision="2" :controls="false" placeholder="0.00"></el-input-number>
            </el-form-item>
            <el-form-item label="销售价：" class="m-b-10" required>
              <el-input-number v-model="singleForm.salePrice" size="small" :precision="2" :controls="false" placeholder="0.00"></el-input-number>
            </el-form-item>
            <el-form-item label="库存：" class="m-b-10" required>
              <el-input-number v-model="singleForm.stock" size="small" :controls="false" placeholder="0"></el-input-number>
            </el-form-item>
            <el-form-item label="库存预警值：" class="m-b-10" required>
              <el-input-number v-model="singleForm.alarmStock" size="small" :controls="false" placeholder="0"></el-input-number>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="singleEditModal = false">取 消</el-button>
            <el-button size="small" type="primary" :disabled="selectedObj.verifyStatus == 30 || selectedObj.verifyStatus == 40" @click="singleSave('10')">保存</el-button>
            <el-button size="small" type="primary" :disabled="selectedObj.verifyStatus == 30 || selectedObj.verifyStatus == 40" @click="singleSave('20')">保存并提交</el-button>
          </span>
        </el-dialog>
        <!-- 多规格编辑模态框 -->
        <el-dialog
          title="编辑货品信息"
          :visible.sync="multipleEditModal"
          width="45%">
          <div class="flex m-b-10">
            <p>商品编号：</p><span class="m-r-20">{{baseInfo.id}}</span>
            <p>商品名称：</p><span>{{baseInfo.spuName}}</span>
          </div>
          <el-table :data="multipleData" border height="400px">
            <el-table-column :prop="index+''" :label="item.name" v-for="(item,index) in multipleCol" :key="index"></el-table-column>
            <el-table-column prop="salePrice" label="结算价" :render-header="renderHeader" width="150px">
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.salePrice" :precision="2" placeholder="0.00" :controls="false"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="payPrice" label="销售价" :render-header="renderHeader" width="150px">
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.payPrice" :precision="2" placeholder="0.00" :controls="false"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" :render-header="renderHeader" width="150px">
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.stock" :precision="0" placeholder="0" :controls="false"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="alarmStock" label="库存预警值" :render-header="renderHeader" width="150px">
              <template slot-scope="scope">
                <el-input-number  v-model="scope.row.alarmStock" :precision="0" size="small" placeholder="0" :controls="false"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="multipleEditModal = false">取 消</el-button>
            <el-button size="small" type="primary" :disabled="selectedObj.verifyStatus == 30 || selectedObj.verifyStatus == 40 || selectedObj.verifyStatus == 50 || selectedObj.verifyStatus == 60" @click="multipleSave('10')">保存</el-button>
            <el-button size="small" type="primary" :disabled="selectedObj.verifyStatus == 30 || selectedObj.verifyStatus == 40 || selectedObj.verifyStatus == 50 || selectedObj.verifyStatus == 60" @click="multipleSave('20')">保存并提交</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </basic-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      page:{
        current: 1,
        size: 15,
        total: 0
      },
      baseInfo: {},
      options: [], // 商品分类
      brandOptions: [], // 商品品牌
      productCategoryName: "",
      multipleData:[],
      multipleCol: [],
      batchOptions: [
        {
        label: "上架",
        value: "20"
        },{
        label: "下架",
        value: "10"
        },{
        label: "强制下架",
        value: "30"
        }
      ],
      searchForm: {
        spuNameNo: "",
        category: "",
        brand: "",
        status: "",
        verifyStatus: "",
        supplier: ""
      },
      singleForm: {
        payPrice: undefined,
        salePrice: undefined,
        stock: undefined,
        alarmStock: undefined
      },
      multipleEditModal: false,
      singleEditModal: false,
      checkRecordModal: false,
      // 积分发放列表筛选条件
      HrPhone: "",
      userPhone: "",
      sendStatus: "",
      submitTime: "",
      companyName: "",
        // 全选
      checkedAll: false,
      noCheckedAll: true,
      multipleSelection: [],
      selectedObj: {},
      tableData: [],
    };
  },
  created() {
  },
  mounted() {
    this.init();
    this.getProductCategory()
    this.getBrand()
  },
  methods: {
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
    // 查询
    search(){},
    // 重置搜索
    resetSearch(){
      this.searchForm = {
        spuNameNo: "",
        category: "",
        brand: "",
        status: "",
        supplier: "",
        verifyStatus: ""
      }
      this.productCategoryName = ""
      this.getListData();
    },
    async init() {
      this.getListData();
    },
    filter(phone, cb) {
      if (this.phoneChange(phone)) {
        cb && cb();
      }
    },
    phoneChange(phone) {
      if (!this.judgePhone(phone)) {
        this.$message({
          message: "手机号输入错误",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
    
    // 快速编辑
    showEditModal(item) {
      this.selectedObj = item
      console.log(this.selectedObj )
      if(item.notes == 10){
        this.singleEditModal = true
        let id = item.id
        let verifyStatus = item.verifyStatus
        let productId = item.productId
        let companyNo = this.$store.state.companyNo
        this.$http.get("api/Focus-BladeX-BootX/draftproductlist/spuDetail?doubleClick=false&&id=" + 
        id + "&&verifyStatus=" + verifyStatus + "&&productId=" + productId + "&&companyNo" + companyNo).then(res =>{
          this.singleForm = res.data.skuList[0]
          // console.log(res.data)
          this.baseInfo = res.data.baseInfo
        })
      }else if(item.notes == 20){
        this.multipleEditModal = true;
        let id = item.id
        let verifyStatus = item.verifyStatus
        let productId = item.productId
        let companyNo = this.$store.state.companyNo
        this.$http.get("api/Focus-BladeX-BootX/draftproductlist/spuDetail?doubleClick=false&&id=" + 
        id + "&&verifyStatus=" + verifyStatus + "&&productId=" + productId + "&&companyNo" + companyNo).then(res =>{
          this.multipleData = res.data.skuList
          this.multipleCol = res.data.baseInfo.specificaAttribute
          res.data.skuList.map(item =>{
            let arr = item.skuAttributeName.split(",")
            for(var key in arr){
              item[key] = arr[key]
            }
          })
          this.baseInfo = res.data.baseInfo
          // console.log(this.baseInfo.id)
        })
      }
    },
    // 单规格保存
    singleSave(type){
      if(type == 20) {
        if(!this.singleForm.salePrice) {
          this.$message({
            type: "error",
            message: "单规格商品销售价不能为空"
          })
          return false
        }
        if(!this.singleForm.payPrice) {
          this.$message({
            type: "error",
            message: "单规格商品结算价不能为空"
          })
          return false
        }
        if(!this.singleForm.stock) {
          this.$message({
            type: "error",
            message: "单规格商品库存不能为空"
          })
          return false
        }
        if(!this.singleForm.alarmStock) {
          this.$message({
            type: "error",
            message: "单规格商品库存预警值不能为空"
          })
          return false
        }
      }
      let skuList = [{}]
      skuList[0] = this.singleForm
      let params = {
        type: type,
        spuId: this.selectedObj.id,
        verifyStatus: this.selectedObj.verifyStatus,
        skuList: skuList,
        productId: this.selectedObj.productId,
        companyNo: this.$store.state.companyNo
      }
      this.$http.post("api/Focus-BladeX-BootX/draftproductlist/fastUpdateSKU",params).then(res=>{
        console.log(res)
        this.getListData()
        this.singleEditModal = false
      })
    },
    // 多规格保存
    multipleSave(type){
      if(type == 20){
        if(this.multipleData.length !=0){
          let bool = true
          for(let item of this.multipleData){
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
            console.log(bool)
          }
        }
      }
      console.log(this.multipleData)
      let params = {
        type: type,
        spuId: this.selectedObj.id,
        verifyStatus: this.selectedObj.verifyStatus,
        skuList: this.multipleData,
        productId: this.selectedObj.productId,
        companyNo: this.$store.state.companyNo
      }
      this.$http.post("api/Focus-BladeX-BootX/draftproductlist/fastUpdateSKU",params).then(res=>{
        console.log(res)
        this.getListData()
        this.multipleEditModal = false
      })
    },
     // 批量操作判断
    handleBatchCommand(command) {
      // console.log(this.tableData, "嘎嘎嘎嘎嘎");
      console.log(command, "嘎嘎嘎嘎嘎");
      this.batchHandleType = command;
      let idArry = [];
      this.tableData.map(item => {
        if(item.checked){
          idArry.push(item.id);
        }
      });
      console.log("idArry",idArry)
      if (idArry.length == 0) {
        this.$message({
          type: "warning",
          message: "请至少选择1件商品"
        });
        return false
      } 
      let str = ""
      switch (command){
        case "10":
          str = "下架";
          break;
        case "20":
          str = "上架";
          break;
        case "30":
          str = "强制下架";
          break;
      }
      this.$confirm("是否批量" + str +"这些商品?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
      }).then(() =>{
        let params = {
          spuIdList: idArry.join(","),
          type: command,
          companyNo: this.$store.state.companyNo
        }
        console.log(params,"params")
        this.$http.post("api/Focus-BladeX-BootX/productlist/batch", params).then(res =>{
          console.log(res)
          this.checkedAll = false
          this.getListData()
        })
      })
    },
    // 上下架操作
    OnOffCommand(id,status){
      let type = "";
      console.log(status)
      switch (status){
        case true:
          type = "20";
          break;
        case false:
          type = "10";
          break
        case "30":
          type = "30";
          break
      }
      if(type == 30){
        this.$confirm("强制下架以后不能进行上下架操作，请谨慎操作","提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
          }).then(() =>{
          let params = {
            spuIdList: id,
            type: type,
            companyNo: this.$store.state.companyNo
          }
          console.log(params,"params")
          this.$http.post("api/Focus-BladeX-BootX/productlist/batch", params).then(res =>{
            console.log(res)
            this.getListData()
          })
        })
      }else {
        let params = {
            spuIdList: id,
            type: type,
            companyNo: this.$store.state.companyNo
          }
        this.$http.post("api/Focus-BladeX-BootX/productlist/batch", params).then(res =>{
          console.log(res)
          this.getListData()
        })
      }
      
      
    },
    edit(item,doubleClick) {
      console.log(item)
      this.$router.push({path: "/goods/create", query:{id:item.id , verifyStatus:item.verifyStatus , productId: item.productId , doubleClick: doubleClick}})
    },
    
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page.size= val;
      this.page.current = 1
      this.getListData();
    },
    
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.current = val;
      this.getListData();
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.multipleSelection = val;
    },
    searchListData() {
      this.page.page = 1;
      this.getListData();
    },
    // 选择商品分类
    changeCategory(val){
      this.searchForm.category = val[val.length - 1]
      // console.log(this.searchForm.category)
    },
    // 获取商品分类
    getProductCategory(){
      this.$http.get("api/Focus-BladeX-BootX/productcategory/selectCategoryList", {
        params: {
          companyNo: this.$store.state.companyNo
        }
      }).then(res =>{
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
    // 获取品牌数据
    getBrand(){
      let companyNo = this.$store.state.companyNo
      this.$http.get("api/Focus-BladeX-BootX/brandinfo/list?current=1&&size=99999&&companyNo=" + companyNo).then(res =>{
        this.brandOptions = res.data.data.records
        // console.log(res.data.data.records)
      })
    },
    getListData() {
      let current = this.page.current
      let size = this.page.size
      let companyNo = this.$store.state.companyNo
      let spuNameNo = this.searchForm.spuNameNo
      let category = this.searchForm.category
      let brand = this.searchForm.brand
      let status = this.searchForm.status
      let verifyStatus = this.searchForm.verifyStatus
      let supplier = this.searchForm.supplier
      this.$http
      .get("api//Focus-BladeX-BootX/productlist/spuList?current=" + current + 
      "&&size=" + size + "&&companyNo=" + companyNo + "&&spuNameNo=" + spuNameNo + "&&category=" + category + 
      "&&brand=" + brand + "&&status=" + status + "&&verifyStatus=" + verifyStatus + "&&supplier=" + supplier)
      .then(res =>{
        res.data.data.records.map(item =>{
          switch(item.status) {
            case "20":
              item.statusBool = false;
              break;
            case "10":
              item.statusBool = true;
              break;
          }
          switch(item.verifyStatus) {
            case "10":
              item.verifyStatusStr = "新增待审核";
              break;
            case "20":
            item.verifyStatusStr = "修改待审核";
              break;
            case "30":
            item.verifyStatusStr = "新增审核中";
              break;
            case "40":
            item.verifyStatusStr = "修改审核中";
              break;
            case "50":
            item.verifyStatusStr = "新增打回";
              break;
            case "60":
              item.verifyStatusStr = "修改打回";
              break;
            case "70":
              item.verifyStatusStr = "审核通过";
              break;
            }
            item.checked = false
        })
        this.tableData = res.data.data.records
        this.tableData.map(item =>{
          switch (item.status){
            case "10":
              item.statusBool = false;
            break;
            case "20":
              item.statusBool = true;
              break;
            case "30":
              item.statusBool =false;
              break;

          }
        })
        this.page.total = res.data.data.total
        this.loading = false
      })
    },
  },
  watch: {
    checkedAll(val) {
      console.log(val, "val");
      console.log(this.noCheckedAll, "noCheckedAll");
      if (this.noCheckedAll) {
        if (val) {
          this.$refs.multipleTable.clearSelection();
          this.tableData.map(row =>{
            if(row.verifyStatus == 70 && row.forceStatus != 10){
              row.checked = true
            }
          })
        } else {
          this.tableData.map(row =>{
            if(row.verifyStatus == 70 && row.forceStatus != 10){
              row.checked = false
            }
          })
        }
      }
    },
    multipleSelection() {
      if (this.multipleSelection.length != this.tableData.length) {
        this.noCheckedAll = false;
        this.checkedAll = false;
        this.$nextTick(() => {
          this.noCheckedAll = true;
        });
      } else {
        this.checkedAll = true;
      }
    },
  },
};
</script>

<style lang="scss">
.content {
  padding-bottom: 0;
}
.points-query {
  position: relative;
  .fr {
    float: right;
  }
  .fl {
    float: left;
  }
  .flex {
    display: flex;
  }
  .rl-body {
    padding: 0 20px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .mr-20 {
    margin-right: 20px;
  }
  .el-table {
    font-size: 12px;
    th {
      font-size: 15px;
    }
    tr {
      height: 54px;
      .operate-btn {
        color: #409EFF;
        cursor: pointer;
        font-size: 14px;
        margin-right: 10px;
      }
      td {
        padding: 0;
        button {
          padding: 8px 12px;
          font-size: 12px;
        }
      }
    }
    .cell {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-align: center;
    }
    .el-table__header-wrapper {
      table {
        thead {
          color: #242a30;
        }
      }
    }
    .el-table__header {
      .el-table-column--selection {
        .cell {
          visibility: hidden;
        }
      }
    }
    .operate-col {
      .el-button {
        padding: 5px 8px;
      }
      .show-operation {
        padding-right: 35px;
        position: relative;
        .el-icon-caret-bottom {
          position: absolute;
          top: 50%;
          right: 5px;
          transform: translateY(-50%);
        }
      }
      .caozuo-drop {
        margin-left: 10px;
      }
    }
    .el-table__expanded-cell {
      padding-left: 18px;
      padding-right: 18px;
      padding-bottom: 0;
      background-color: #fafafa;
    }
    .el-table__expand-column {
      .cell {
        display: none;
      }
    }
  }
  .bottom-col {
    height: 28px;
    margin-top: 15px;
    .el-button:hover,
    .el-button:focus {
      background: none;
      border-color: #dcdfe6;
      color: #606266;
    }
    .filter {
      margin: 0 20px 0 0;
      font-size: 14px;
    }
    label.el-checkbox {
      margin: 0 20px 0 0;
    }
    .el-dropdown {
      .el-button {
        padding: 6px 16px;
      }
    }
  }
}
.m-b-10{
  margin-bottom: 10px;
}
.m-r-20{
  margin-right: 20px;
}
</style>
