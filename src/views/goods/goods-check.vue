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
                  <el-cascader v-model="productCategoryName" @change="changeCategory" :options="productcategory" size="small" filterable>
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商品品牌：">
                  <el-select size="small"  v-model="searchForm.brand" filterable>
                    <el-option :label="item.brandName" :value="item.id" v-for="(item,index) in brandOptions" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="供应商：">
                  <el-input size="small" v-model="searchForm.supplier" placeholder="供应商/供应商编号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row gutter="20">
              <el-col :span="6">
                <el-form-item label="审核状态：">
                  <el-select size="small"  v-model="searchForm.verifyStatus">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="待审核" value="10"></el-option>
                    <el-option label="审核通过" value="20"></el-option>
                    <el-option label="审核不通过" value="30"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button size="small" type="primary" @click="searchListData">查询</el-button>
                  <el-button size="small" @click="resetSearch()">重置</el-button>
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
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="编号" prop="id"></el-table-column>
            <el-table-column label="商品名称" prop="spuName"></el-table-column>
            <el-table-column label="分类" prop="category"></el-table-column>
            <el-table-column label="供应商" prop="supplier"></el-table-column>
            <el-table-column label="销售价格" prop="salePrice"></el-table-column>
            <el-table-column label="结算价格" prop="payPrice"></el-table-column>
            <el-table-column label="库存" prop="stock"></el-table-column>
            <el-table-column label="毛利率" prop="rateOfMargin"></el-table-column>
            <el-table-column label="提交时间" prop="submitTime" width="150"></el-table-column>
            <el-table-column label="审核状态" prop="verifyStatusStr"></el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <span @click="showModal(scope.row)" v-show="scope.row.verifyStatusStr == '待审核'" class="operate-btn">审核</span>
                <span @click="checkRow(scope.row)" class="operate-btn">查看</span>
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
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="key"
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
              :current-page="page.Page"
              :page-sizes="[15, 30, 50, 100]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="page.total"
            ></el-pagination>
          </el-row>
        </div>
        <!-- 商品审核模态框 -->
        <el-dialog
          title="商品审核"
          :visible.sync="checkModal"
          :before-close="handleClose"
          width="30%">
          <el-form label-width="100px" :model="checkPrd">
            <el-form-item label="商品名称：" class="m-b-10">{{checkPrd.spuName}}</el-form-item>
            <el-form-item label="商品审核：" class="m-b-10">
              <el-radio-group v-model="Prdstatus">
                <el-radio label="70">审核通过</el-radio>
                <!-- 临时解决方案 新增审核必须审核通过 -->
                <el-radio :disabled="checkPrd.verifyStatus == 30" label="99">审核不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="反馈详情：" class="m-b-10" v-show="Prdstatus == 99">
              <el-input type="textarea" v-model="checkPrd.feedback" placeholder="请输入审核不通过原因"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="checkModal = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitCheck">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
        <checkDialog @isCheck="isCheck" v-bind:productId="productId" v-bind:id="id" @closeDialog="closeDialog" v-if="checkDialogVisible"></checkDialog>
  </basic-container>
</template>

<script>
import checkDialog from "./checkInsidePage";
export default {
  components: {
    checkDialog
  },
  data() {
    return {
      checkDialogVisible: false,
      productId: "",
      id: "",
      checkPrd:{
        skuList: "",
        feedback: "",
      },
      Prdstatus: "70",
      productcategory: [],
      productCategoryName: [],
      brandOptions: [],
      batchOptions: [
        {
        label: "审核",
        value: "1"
        }
      ],
      searchForm: {
        spuNameNo: "",
        category: "",
        brand: "",
        supplier: "",
        verifyStatus: "10"
      },
      checkModal: false,
        // 全选
      checkedAll: false,
      checkedAllT: false,
      noCheckedAll: true,
      multipleSelection: [],
      tableData: [],
      page: {
        current: 1,
        size: 15,
        total: 0
      },
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
    // 选择商品分类
    changeCategory(){
      this.searchForm.category = this.productCategoryName[this.productCategoryName.length - 1]
      console.log(this.searchForm.category)
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
     // 批量操作判断
    handleBatchCommand(command) {
      this.batchHandleType = command;
      this.checkPrd.spuName = this.multipleSelection.map(item => {
        return item.spuName;
      }).join(",")
      this.checkPrd.id = this.multipleSelection.map(item => {
        return item.id;
      }).join(",")
      console.log(this.checkPrd)
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "请至少选择一件商品"
        });
      } else {
        this.checkModal = true
      }
    },
    showModal(item) {
      console.log(item)
      this.checkModal = true;
      this.checkPrd = item;
    },
    // 查看单行
    checkRow(row){
      console.log(row)
      this.checkDialogVisible = true
      this.productId = row.productId
      this.id = row.id
    },
    getRowKeys(row) {
      return row.id;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.page.size = val;
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
    // 提交审核
    submitCheck(){
      let params = {
        companyNo: this.$store.state.companyNo,
        spuIdList: this.checkPrd.id,
        status: this.Prdstatus,
        feedback: this.checkPrd.feedback
      }
      this.$http.post("api/Focus-BladeX-BootX/draftproductlist/batchVerify",params).then(res =>{
        console.log(res)
        if(res.code == 200){
          this.$message({
            type: "seccess",
            message: "审核完成，请去商品列表查看"
          })
        }
        this.getListData()
        this.checkModal = false
      })
    },
    // 查询数据
    searchListData() {
      this.page.currentPage = 1;
      this.getListData();
    },
    // 重置搜索
    resetSearch(){
      this.searchForm = {
        spuNameNo: "",
        category: "",
        brand: "",
        supplier: "",
        verifyStatus: "10"
      }
      this.productCategoryName = []
      this.getListData()
    },
    // 获取表格数据
    getListData() {
      let current = this.page.current
      let size = this.page.size
      let spuNameNo = this.searchForm.spuNameNo
      let category = this.searchForm.category
      let brand = this.searchForm.brand
      let supplier = this.searchForm.supplier
      let verifyStatus = this.searchForm.verifyStatus
      let companyNo = this.$store.state.companyNo
      this.$http
      .get("api/Focus-BladeX-BootX/draftproductlist/draftVerifySpuList?current=" + current + "&&size=" + size + "&&spuNameNo=" + spuNameNo + "&&category=" + category + "&&brand=" + brand + "&&supplier=" + supplier + "&&verifyStatus=" + verifyStatus +"&&companyNo=" + companyNo)
      .then(res =>{
        res.data.data.records.map(item =>{
          switch(item.verifyStatus){
            case "30":
              item.verifyStatusStr = "待审核";
              break;
            case "40":
              item.verifyStatusStr = "待审核";
              break;
            case "70":
              item.verifyStatusStr = "审核通过";
              break;
            case "80":
              item.verifyStatusStr = "审核通过";
              break;
            case "50":
              item.verifyStatusStr = "审核不通过";
              break
            case "60":
              item.verifyStatusStr = "审核不通过";
              break
          }
        })
        this.tableData = res.data.data.records
        this.page.total = res.data.data.total
        this.loading = false
      })
    },
    // 获取商品分类
    getProductCategory(){
      this.$http.get("api/Focus-BladeX-BootX/productcategory/selectCategoryList", {
        params: {
          companyNo: this.$store.state.companyNo
        }
      }).then(res =>{
        console.log(res.data.data)
        this.recursion(res.data.data)
        this.productcategory = res.data.data
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
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => {
        });
    },
    closeDialog() {
      this.checkDialogVisible = false
    },
    isCheck() {
      this.getListData()
    }
  },
  watch: {
    checkedAll(val) {
      console.log(val, "val");
      console.log(this.noCheckedAll, "noCheckedAll");
      if (this.noCheckedAll) {
        if (val) {
          this.$refs.multipleTable.clearSelection();
          this.tableData.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      }
    },
    multipleSelection() {
      console.log("haha",this.multipleSelection);
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
    
  }
};
</script>

<style lang="scss">
.content {
  padding-bottom: 0;
}
.goods-list {
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
}
.m-b-10{
  margin-bottom: 10px;
}
.m-r-20{
  margin-right: 20px;
}
</style>
