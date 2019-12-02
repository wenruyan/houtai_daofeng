<template>
  <basic-container>
    <div class="order-list">
      <div class="points-query">
        <div class="rl-body">
          <el-form  label-width="120px" ref="searchForm" :model="searchForm">
            <el-row gutter="20">
              <el-col :span="6">
                <el-form-item label="商品名称：">
                  <el-input size="small" v-model="searchForm.product" placeholder="商品名称/商品编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="收货人：">
                  <el-input size="small" v-model="searchForm.addressee" placeholder="收货人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="提交时间：">
                  <el-date-picker
                    size="small"
                    v-model="searchForm.timeRange"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row gutter="20">
              <el-col :span="6">
                <el-form-item label="订单状态：">
                  <el-select size="small"  v-model="searchForm.orderStatus" filterable>
                    <el-option label="全部" value=""></el-option>
                    <el-option label="待支付" value="1"></el-option>
                    <el-option label="待发货" value="2"></el-option>
                    <el-option label="已发货" value="3"></el-option>
                    <el-option label="已完成" value="4"></el-option>
                    <el-option label="已关闭" value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订单来源：">
                  <el-select size="small"  v-model="searchForm.source">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="h5" value="1"></el-option>
                    <el-option label="小程序" value="2"></el-option>
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
            <el-table-column label="订单编号" prop="id"></el-table-column>
            <el-table-column label="供应商" prop="spuName"></el-table-column>
            <el-table-column label="提交时间" prop="category"></el-table-column>
            <el-table-column label="用户账户" prop="supplier"></el-table-column>
            <el-table-column label="订单金额" prop="salePrice"></el-table-column>
            <el-table-column label="订单来源" prop="payPrice"></el-table-column>
            <el-table-column label="订单状态" prop="stock"></el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <span @click="showCheck(scope.row)" class="operate-btn">查看订单</span>
                <span @click="showClose(scope.row)" class="operate-btn">关闭订单</span>
                <span @click="showSend(scope.row)" class="operate-btn">订单发货</span>
                <span @click="checkRow(scope.row)" class="operate-btn">订单跟踪</span>
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
        <!-- 查看订单 -->
        <el-dialog
          title="查看订单"
          :visible.sync="checkModal"
          width="60%">
          <div class="flex m-b-20">
            <h1 class="order_status">发货中</h1>
            <div class="progress flex-1">
              <el-steps :space="350" :active="3" finish-status="success" align-center>
                <el-step title="提交订单" description="2020-10-11 12:30:59"></el-step>
                <el-step title="支付订单" description="2020-10-11 12:30:59"></el-step>
                <el-step title="商家发货" description="2020-10-11 12:30:59"></el-step>
                <el-step title="订单完成"></el-step>
              </el-steps>
            </div>
          </div>
          <el-row gutter="30">
            <el-col :span="8">
              <el-card class="box-card">
                <div slot="header"><span>基本信息</span></div>
                <el-form label-width="100px">
                  <el-form-item label="订单编号：" class="m-b-0">13213465498</el-form-item>
                  <el-form-item label="供应商：" class="m-b-0">孚库</el-form-item>
                  <el-form-item label="用户账号：" class="m-b-0">18752068270</el-form-item>
                  <el-form-item label="订单来源：" class="m-b-0">小程序</el-form-item>
                  <el-form-item label="物流公司：" class="m-b-0">顺丰</el-form-item>
                  <el-form-item label="物流单号：" class="m-b-0">9555sdfad9 <el-button size="small" class="btn">订单跟踪</el-button></el-form-item>
                </el-form>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="box-card">
                <div slot="header"><span>收货人信息</span></div>
                <el-form label-width="100px">
                  <el-form-item label="收货人：" class="m-b-0">13213465498</el-form-item>
                  <el-form-item label="收货地址：" class="m-b-0">孚库</el-form-item>
                  <el-form-item label="手机号：" class="m-b-0">18752068270</el-form-item>
                </el-form>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="box-card">
                <div slot="header"><span>付款信息</span></div>
                <el-form label-width="100px">
                  <el-form-item label="付款方式：" class="m-b-0">在线支付</el-form-item>
                  <el-form-item label="付款时间：" class="m-b-0">2019-11-12 21:49:21</el-form-item>
                  <el-form-item label="应付总额：" class="m-b-0">￥105</el-form-item>
                  <el-form-item label="积分：" class="m-b-0">￥105</el-form-item>
                  <el-form-item label="人民币：" class="m-b-0">￥105</el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
          <el-table :data="prdData" border style="width: 100%">
            <el-table-column prop="date" label="商品图片">
              <template slot-scope="scope">
                <img src="">
              </template>
            </el-table-column>
            <el-table-column prop="date" label="商品名称">
            </el-table-column>
            <el-table-column prop="date" label="规格">
            </el-table-column>
            <el-table-column prop="date" label="国际条码号">
            </el-table-column>
            <el-table-column prop="date" label="供应商货号">
            </el-table-column>
            <el-table-column prop="date" label="数量">
            </el-table-column>
            <el-table-column prop="date" label="单价">
            </el-table-column>
            <el-table-column prop="date" label="小计">
            </el-table-column>
          </el-table>
          <el-row class="flex flex-main-right m-t-10">
            <div>
              <div><span class="label">商品总额：</span><span>￥300</span></div>
              <div><span class="label">运费：</span><span>￥5</span></div>
              <div><span class="label">应付总额：</span><span style="color:red">￥305</span></div>
            </div>
            
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeModal = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitClose">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 关闭订单模态框 -->
        <el-dialog
          title="关闭订单"
          :visible.sync="closeModal"
          width="30%">
          <el-form label-width="100px">
            <el-form-item label="操作备注：" required>
              <el-input type="textarea" placeholder="请输入内容" v-model="textarea"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeModal = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitClose">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 订单发货模态框 -->
        <el-dialog
          title="订单发货"
          :visible.sync="sendModal"
          width="30%">
          <el-form label-width="100px">
            <el-form-item label="操作备注：" required>
              <el-input type="textarea" placeholder="请输入内容" v-model="textarea"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeModal = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitClose">确 定</el-button>
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
      loading: false,
      productId: "",
      id: "",
      productcategory: [],
      productcategoryname: [],
      brandOptions: [],
      batchOptions: [
        {
        label: "关闭订单",
        value: "1"
        }
      ],
      searchForm: {
        product: "",
        addressee: "",
        timeRange: [],
        orderStatus: "",
        source: "",
        supplier: ""
      },
      closeModal: false,
      checkModal: false,
      sendModal: false,
      // 全选
      checkedAll: false,
      checkedAllT: false,
      noCheckedAll: true,
      noCheckedAllT: true,
      multipleSelection: [],
      tableData: [{}],
      prdData:[{}],
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
      this.searchForm.category = this.productcategoryname[this.productcategoryname.length - 1]
      console.log(this.searchForm.category)
    },
    
    async init() {
      this.getListData();
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
        this.closeModal = true
      }
    },
    showCheck(row){
      console.log(row)
      this.checkModal = true;
    },
    // 展示关闭模态框
    showClose(row) {
      console.log(row)
      this.closeModal = true;
    },
    // 展示发货模态框
    showSend(row){
      console.log(row)
      this.sendModal = true;
    },
    // 查看单行
    checkRow(row){
      console.log(row)
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
    submitClose(){
      this.closeModal = false
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
        supplier: ""
      }
      this.productcategoryname = []
    },
    // 获取表格数据
    getListData() {
      let params = {
        ...this.page,
        ...this.searchForm,
      }
      this.$http.get("api/focus-saas/orderinformation/page", {params}).then(res => {
        console.log(res)
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => {
        });
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
.order_status{
  color: #F00;
  width: 300px;
  text-align: center;
  line-height: 50px;
  font-size: 22px;
}

.text {
    font-size: 14px;
  }
.item {
  margin-bottom: 18px;
}
.el-card__header{
  span{
    font-size: 18px;
  }
}
.box-card{
  .btn{
    height: 25px;
    line-height: 0;
  }
}
.order-list {
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
.m-b-0{
  margin-bottom: 0;
}
.m-b-10{
  margin-bottom: 10px;
}
.m-b-20{
  margin-bottom: 20px;
}
.m-r-20{
  margin-right: 20px;
}
.m-t-10{
  margin-top: 10px;
}
.label{
  display: inline-block;
  width: 90px;
  text-align: right;
}
</style>
