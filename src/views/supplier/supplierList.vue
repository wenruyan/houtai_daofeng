<template>
<basic-container>
  <div class="supplier-list">
      <div class="search-box" style="display:flex">
            <div class="title">供应商:</div>
            <el-input
                placeholder="供应商名称/简称"
                @keyup.enter.native="searchListData"
                class="search-input"
                v-model="searchVal"
            ></el-input>
            <el-button type="primary" class="search-btn" @click="searchListData">查询</el-button>
        </div>
        <div style="margin-top:20px;margin-bottom: 30px">
           <el-button type="primary" @click="goAdd">添加</el-button> 
        </div>
      <el-table
        :data="tableData"
        ref="multipleTable"
        height="calc(100vh - 360px)"
        stripe
        style="width: 100%;"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        v-loading="loading"
      >
        <el-table-column type="expand" width="0">
          <template v-if="expands.length > 0 && expands[0] == scope.row.id" slot-scope="scope">
                <div v-if="scope.row.linkManInfoListVOList.length !=0" class="linkman-box">
                    <div v-for="(item,index) in scope.row.linkManInfoListVOList" :key="index" class="linkman-content">
                        <div class="linkman-name">
                            <div style="display:flex;align-items:center">
                                <div class="main" v-if="item.isMain == 1">主</div>
                                <div class="name">{{item.name}}</div>
                                <div class="positionName">{{item.positionName}}</div>
                            </div>
                            <div>
                                <el-button type="text" @click="editLinkman(scope.row, item)">编辑</el-button>
                                <el-button type="text" @click="delLinkman(scope.row,item, index)">删除</el-button>
                            </div>
                        </div>
                        <div class="linkman-way">
                                <div style="margin-right:20px">
                                    <p style="margin-bottom:4px">手机号码</p>
                                    <p class="phone">{{item.phone}}</p>
                                </div>
                                <div style="margin-right:36px">
                                    <p style="margin-bottom:4px">微信号</p>
                                    <p class="phone">{{item.weChat}}</p>
                                </div>
                                <div>
                                    <p style="margin-bottom:4px">邮箱</p>
                                    <p class="phone">{{item.email}}</p>
                                </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div style="text-align: center;">暂无联系人</div>
                </div>
          </template>
        </el-table-column>
        <el-table-column prop="supplierNo" label="供应商编号">
        </el-table-column>
        <el-table-column prop="name" label="供应商名称"></el-table-column>
        <el-table-column prop="shortName" label="供应商简称"></el-table-column>
        <el-table-column prop="bankName" label="开户银行">
          <template slot-scope="scope">
            <span>{{scope.row.bankName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bankAccount" label="银行账号">
          <template slot-scope="scope">
              <span>{{scope.row.bankAccount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="account" label="平台登录账号">
          <template slot-scope="scope">
            <span>{{scope.row.account}}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="operate-col" prop label="操作" width="240">
          <template slot-scope="scope">
            <el-button type="text" @click="operateHandle('edit', scope.row)" size="mini">编辑</el-button>
            <el-button type="text" @click="operateHandle('add', scope.row)" size="mini">添加联系人</el-button>
            <el-button type="text" @click="operateHandle('quickEdit', scope.row)" size="mini">查看联系人</el-button>
          </template>
        </el-table-column>
        <div slot="empty" v-if="emptyTextShow"></div>
      </el-table>
      <el-row class="bottom-col" type="flex" justify="space-between" align="middle">
        <el-col :span="8" class="flex flex-cross-center">
        </el-col>
        <el-col :span="16">
          <el-pagination
            class="pull-right"
            style="float:right"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="[15, 30, 50, 100]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="page.total"
          ></el-pagination>
        </el-col>
      </el-row>
    <el-dialog
        title="新增联系人"
        class="editDialog"
        :visible.sync="editDialogVisible"
        width="40%">
        <div style="padding:0 113px 0 113px; color:#262F3E;margin-bottom:15px;">
            设为主要联系人
            <el-switch
                v-model="switchValue">
            </el-switch>
        </div>
        <el-form :model="spullierInfo" ref="spullierInfo" label-width="90px" class="demo-ruleForm">
            <el-form-item style="padding:0 113px 0 113px" :required="true" label="联系人" prop="name">
                <el-input v-model.trim="spullierInfo.name" placeholder="请输入联系人"></el-input>
            </el-form-item>
            <el-form-item style="padding:0 113px 0 113px" label="职位" prop="positionName">
                <el-input v-model.trim="spullierInfo.positionName" placeholder="请输入职位"></el-input>
            </el-form-item>
            <el-form-item style="padding:0 113px 0 113px" label="手机号码" prop="phone">
                <el-input v-model.trim="spullierInfo.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item style="padding:0 113px 0 113px" label="微信号" prop="weChat">
                <el-input v-model.trim="spullierInfo.weChat" placeholder="请输入微信号"></el-input>
            </el-form-item>
            <el-form-item style="padding:0 113px 0 113px" label="邮箱" prop="email">
                <el-input v-model.trim="spullierInfo.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item style="display:flex;justify-content: flex-end;margin-top:20px">
                <el-button @click="editDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="saveFormSpullier('spullierInfo')">保存</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog
        title=""
        :visible.sync="deleteDialogVisible"
        width="30%"
        class="deleteDialog"
        center>
        <span>是否删除当前选择的联系人？</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="danger" @click="sureDelete">确 定</el-button>
            <el-button  @click="deleteDialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</basic-container>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      emptyTextShow: true,
      loading: false,
      editDialogVisible: false,
      deleteDialogVisible: false,
      sortBtnText: "",
      deleteIndex: "",
      switchValue: false,
      linkManInfoListVOList: [],
      itemLinkman: "",
      supplierId: "",
      spullierInfo: {
        name: "",
        positionName: "",
        phone: "",
        weChat: "",
        email: ""
      },
      searchVal: "",
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      multipleSelection: [],
      expands: [],
      normKey: []
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getListData();
  },
  methods: {
    goCreate() {
      this.createDialogVisible = true;
      // this.PUSH({
      //   name: "main-supplier-create"
      // });
    },
    cancelCreate(formName) {
      this.createDialogVisible = false;
      this.$refs[formName].resetFields();
    },
    createLinkMan() {
      this.editDialogVisible = true;
      this.linkManId = "";
      this.spullierInfo = {
        linkManId: "",
        name: "",
        phone: "",
        weChat: "",
        email: "",
        positionName: ""
      };
      this.switchValue = false;
    },
    goAdd() {
      this.$router.push({
        path: "/supplier/addSupplier",
        query: {
          id: this.supplierId || ""
        }
      });
    },
    // 联系人编辑
    editLinkman(row, item) {
      console.log(item);
      console.log(row);
      this.itemLinkman = item;
      this.supplierId = row.id;
      this.editDialogVisible = true;
      this.spullierInfo = {
        name: item.name,
        email: item.email,
        phone: item.phone,
        positionName: item.positionName,
        weChat: item.weChat
      };
      this.switchValue = item.isMain == 1 ? true : false;
    },
    // 删除联系人
    delLinkman(row, item, index) {
      console.log(row);
      this.deleteDialogVisible = true;
      this.deleteIndex = index;
      this.linkManInfoListVOList = row.linkManInfoListVOList;
      this.itemLinkman = item;
    },
    sureDelete() {
      // this.linkManInfoListVOList.splice(this.deleteIndex, 1);
        let param = {
          id: this.itemLinkman.id || ''
        };
        this.$http
          .post("api/Focus-BladeX-BootX/linkmaninfo/remove", param)
          .then(res => {
            console.log('res', res);
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
            this.deleteDialogVisible = false;
            this.getListData();
          })
          .catch(err => {
            console.log("err", err);
          });
    },
    saveFormSpullier() {
      if (this.spullierInfo.name == "") {
        this.$message({
          type: "warning",
          message: "联系人不能为空"
        });
      } else if (
        this.spullierInfo.phone &&
        !/^[1][3456789]\d{9}$/.test(this.spullierInfo.phone)
      ) {
        this.$message({
          type: "warning",
          message: "请输入正确的手机号码格式"
        });
      } else if (
        this.spullierInfo.email &&
        !/^[a-zA-Z0-9_-]+(\.([a-zA-Z0-9_-])+)*@[a-zA-Z0-9_-]+[.][a-zA-Z0-9_-]+([.][a-zA-Z0-9_-]+)*$/.test(
          this.spullierInfo.email
        )
      ) {
        this.$message({
          type: "warning",
          message: "请输入正确的邮箱"
        });
      } else {
        let param = {
          supplierId: this.supplierId,
          id: this.itemLinkman.id || "",
          name: this.spullierInfo.name,
          phone: this.spullierInfo.phone,
          weChat: this.spullierInfo.weChat,
          email: this.spullierInfo.email,
          positionName: this.spullierInfo.positionName,
          isMain: this.switchValue == true ? "1" : "0",
          companyNo: this.$store.state.companyNo
        };
        console.log(param);
        this.$http
          .post("api/Focus-BladeX-BootX/linkmaninfo/submit", param)
          .then(res => {
            console.log('res', res);
            this.editDialogVisible = false;
            this.getListData();
          })
          .catch(err => {
            console.log("err", err);
          });
      }
    },
    getRowKeys(row) {
      return row.id;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.page.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.currentPage = val;
      this.getListData();
    },
    operateHandle(type, row) {
      switch (type) {
        case "quickEdit":
          console.log(row);
          if (this.expands[0] == row.id) {
            this.expands = [];
          } else {
            this.expands = [row.id];
          }
          break;
        case "edit":
          this.$router.push({
            path: "/supplier/addSupplier",
            query: { id: row.id }
          });
          break;
        case "add":
          console.log(row)
          this.supplierId = row.id
          this.editDialogVisible = true;
          this.switchValue = false
          console.log(this.itemLinkman)
          if (this.itemLinkman) {
            this.itemLinkman.id = ''
          }
          
          this.spullierInfo = {
            linkManId: "",
            name: "",
            phone: "",
            weChat: "",
            email: "",
            positionName: ""
          };
          console.log(this.spullierInfo)
          break;
        default:
          break;
      }
    },
    searchListData() {
      this.page.currentPage = 1;
      this.getListData();
    },
    getListData() {
      this.loading = true;
      this.$http
        .get("api/Focus-BladeX-BootX/supplierinfo/list", {
          params: {
            name: this.searchVal || "",
            current: this.page.currentPage || "",
            size: this.page.pageSize || "",
            companyNo: this.$store.state.companyNo
          }
        })
        .then(res => {
          console.log("res", res);
          this.tableData = res.data.data.records; // 先注释
          this.page.total = res.data.data.total;
          this.loading = false;
          this.emptyTextShow = false;
        })
        .catch(err => {
          console.log("err", err);
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.content {
  padding-bottom: 0;
}
.supplier-list {
  position: relative;
  .el-form-item__error {
    visibility: hidden;
  }
  .search-box {
    align-items: center;
    .title {
      width: 100px;
    }
    .search-input {
      width: 200px;
      margin-right: 100px;
      .el-input__inner {
        width: 200px;
      }
    }
  }
  .deleteDialog {
    .el-dialog__body {
      text-align: center;
      font-size: 16px;
      color: #262f3e;
      font-weight: bold;
    }
  }
  .create-dialog {
    .el-dialog__header {
      padding: 0;
      padding-left: 13px;
      height: 40px;
      line-height: 40px;
      background: #f3f3f3;
      position: relative;
      .el-dialog__title {
        font-size: 12px;
        color: #262f3e;
        font-weight: bold;
      }
      .el-dialog__headerbtn {
        top: 0;
      }
    }
    .el-dialog__body {
      padding: 30px 90px;
    }
    input.el-input__inner {
      height: 34px;
      line-height: 34px;
    }
    .el-form-item__label {
      height: 34px;
      line-height: 34px;
    }
    .el-form-item {
      margin-bottom: 5px;
    }
  }
  .page-top {
    .showModal {
      position: absolute;
      width: 200px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.5);
      border-radius: 3px;
      left: 64px;
      top: 33px;
      div {
        height: 30px;
        line-height: 30px;
        padding-left: 14px;
        color: #262f3e;
        font-size: 12px;
        cursor: pointer;
        background-color: #f1f1f1;
        &:hover {
          background-color: #fff;
        }
      }
    }
  }
  .search-col {
    height: 34px;
    .filter {
      display: inline-block;
      cursor: pointer;
      .active {
        color: #308ad9;
        font-weight: bold;
      }
    }
    .el-input {
      input {
        height: 34px;
        line-height: 34px;
      }
    }
  }
  .el-table {
    font-size: 12px;
    .cell {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
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
    }
    .el-table__expanded-cell {
      padding: 14px 0;
      background-color: #fff;
      .linkman-content {
        height: 94px;
        background: #fbfbfb;
        border: 1px solid #ececec;
        padding: 14px;
        border-radius: 5px;
        margin-bottom: 10px;
        width: 31%;
        float: left;
        margin-right: 1.5%;
        &:nth-child(3) {
          margin-right: 0;
        }
        .linkman-name {
          display: flex;
          position: relative;
          align-items: center;
          justify-content: space-between;
          height: 23px;
          margin-bottom: 12px;
          .main {
            width: 19px;
            height: 19px;
            border: 1px solid #ff5b57;
            text-align: center;
            color: #ff5b57;
            font-weight: bold;
            font-size: 12px;
            margin-right: 10px;
            // position: absolute;
            bottom: 0;
          }
          .name {
            color: #242a30;
            font-size: 18px;
            margin-right: 10px;
            height: 23px;
            line-height: 23px;
            // position: absolute;
            bottom: 0;
            left: 30px;
          }
          .post {
            color: #6c757d;
            position: absolute;
            bottom: 0;
            left: 96px;
          }
        }
        .linkman-way {
          display: flex;
          p {
            color: #242a30;
            margin: 0;
          }
          .phone {
            color: #308ad9;
          }
        }
      }
    }
    .el-table__expand-column {
      .cell {
        display: none;
      }
    }
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f2f3f4;
    // label {
    //   overflow: hidden;
    // }
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
  .sku-wrap {
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
  .batchDialog {
    &.textCenter {
      .el-dialog__body {
        text-align: center;
      }
    }
    .title {
      // font-siz
    }
  }
}
.el-dropdown-menu {
  padding: 0;
  overflow: hidden;
  li.el-dropdown-menu__item {
    padding: 0 16px;
    &:hover {
      background: rgba(241, 241, 241, 1);
      color: #262f3e;
    }
  }
}
</style>
