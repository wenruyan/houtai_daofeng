<template>
  <div class="commodity-specfication">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="bg">
          <h1 class="title">新增规格</h1>
          <el-form
            @submit.native.prevent
            label-width="60px"
            label-position="left"
            :model="addForm"
            ref="addForm"
            :rules="rules"
          >
            <el-form-item label="规格" prop="name">
              <el-input placeholder="请输入规格名" v-model="addForm.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="属性" prop="dynamicTags">
              <el-tag
                :key="tag"
                v-for="tag in addForm.dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加属性</el-button>
            </el-form-item>
          </el-form>
          <el-button
            class="pull-right m-t-20"
            type="primary"
            size="small"
            @click="optFunc('addForm')"
          >添加商品规格</el-button>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="bg">
          <el-row class="search-col" type="flex" justify="space-between" align="middle">
            <el-col :span="20">
              <h1 class="title">商品规格列表</h1>
            </el-col>
            <el-col :span="4">
              <el-input
                placeholder="搜索"
                suffix-icon="el-icon-search"
                @keyup.enter.native="getListData"
                v-model="searchVal"
                size="mini"
              ></el-input>
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            ref="multipleTable"
            :height="$route.path == '/main/commodity/specification' ? 'calc(100vh - 305px)' : 'calc(95vh - 380px)'"
            stripe
            style="width: 100%;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="46"></el-table-column>
            <el-table-column prop="productSpecificationName" label="规格名"></el-table-column>
            <el-table-column prop="name" label="属性">
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in scope.row.attributes"
                  :key="item.id"
                >{{(index == scope.row.attributes.length - 1) ? item.productAttributeName : (item.productAttributeName + ';')}}</span>
              </template>
            </el-table-column>
            <el-table-column class-name="operate-col" prop label width="160">
              <template slot-scope="scope">
                <el-button @click="operateHandle('edit', scope.row)" size="mini">编辑</el-button>
                <el-button @click="operateHandle('del', scope.row)" type="danger" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="bottom-col" type="flex" justify="space-between" align="middle">
            <el-col :span="8" class="flex flex-cross-center">
              <el-checkbox class="p-l-14" v-model="checkedAll"></el-checkbox>
              <div class="filter">本页全选</div>
              <el-button type="default" size="mini" @click="delAll">批量删除</el-button>
            </el-col>
            <el-col :span="16" class="flex flex-main-right">
              <el-pagination
                class="pull-right"
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next"
                :total="page.total"
              ></el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 编辑规格对话框Begin -->
    <el-dialog append-to-body title="编辑规格" :visible.sync="editDialogVisible" width="30%">
      <el-form
        @submit.native.prevent
        label-width="60px"
        label-position="left"
        ref="editForm"
        :rules="rules"
        :model="editForm"
      >
        <el-form-item label="规格" prop="name">
          <el-input placeholder="请输入规格名" v-model="editForm.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="属性" prop="dynamicTags">
          <el-tag
            class="m-r-10"
            :key="index"
            v-for="(tag, index) in editForm.dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose2(tag)"
          >{{tag.productAttributeName || tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible2"
            v-model="inputValue2"
            ref="saveTagInput2"
            size="small"
            @keyup.enter.native="handleInputConfirm2"
            @blur="handleInputConfirm2"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput2">+ 添加属性</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="batchMoveDialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="optFunc('editForm')" size="mini">保存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑规格对话框End -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      breadNav: ["首页", "商品", "规格"],
      editDialogVisible: false,
      searchVal: "",
      labelDataCount: 1,
      labelData: [
        {
          name: 1,
          id: 1
        }
      ],
      addForm: {
        name: "",
        dynamicTags: []
      },
      editForm: {
        id: "",
        name: "",
        dynamicTags: []
      },
      inputVisible: false,
      inputValue: "",
      inputVisible2: false,
      inputValue2: "",
      tableData: [{}],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      multipleSelection: [],
      checkedAll: false,
      noCheckedAll: true,
      rules: {
        name: [{ required: true, message: "请输入规格名", trigger: "blur" }],
        dynamicTags: [
          { required: true, message: "请添加属性", trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  watch: {
    checkedAll(val) {
      // console.log(val)
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
      if (this.multipleSelection.length != this.tableData.length) {
        this.noCheckedAll = false;
        this.checkedAll = false;
        this.$nextTick(() => {
          this.noCheckedAll = true;
        });
      } else {
        this.checkedAll = true;
      }
    }
  },
  created () {
    this.$store.commit("updatepageTopData", [
      { router: "list", text: "商品" },
      { router: "", text: "规格设置" }
    ]);
  },
  mounted() {
    this.getListData();
  },
  methods: {
    handleClose(tag) {
      this.addForm.dynamicTags.splice(this.addForm.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.addForm.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    handleClose2(tag) {
      this.editForm.dynamicTags.splice(
        this.editForm.dynamicTags.indexOf(tag),
        1
      );
      // console.log(this.tableData)
    },
    showInput2() {
      this.inputVisible2 = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput2.$refs.input.focus();
      });
    },
    handleInputConfirm2() {
      let inputValue = this.inputValue2;
      if (inputValue) {
        this.editForm.dynamicTags.push(inputValue);
      }
      this.inputVisible2 = false;
      this.inputValue2 = "";
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.page.pageSize = val;
      this.page.currentPage = 1
      this.getListData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page.currentPage = val;
      this.getListData();
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.multipleSelection = val;
    },
    operateHandle(type, row) {
      console.log(row);
      switch (type) {
        case "edit":
          this.editForm.id = row.id;
          this.editForm.name = row.productSpecificationName;
          this.editForm.dynamicTags = row.attributes.map(item => {
            return item;
          });
          this.editDialogVisible = true;
          break;
        case "del":
          this.$confirm("确认删除该规格吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.delItem(row.id);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
          break;
        default:
          break;
      }
    },
    getListData() {
      let current = this.page.currentPage
      let size = this.page.pageSize
      let productSpecificationName = this.searchVal
      this.$http.get("api/Focus-BladeX-BootX/productspecification/querySpecList?current=" + current + "&&size=" + size + "&&productSpecificationName=" + productSpecificationName ).then(
        res =>{
          this.page.total = res.data.data.total
          this.tableData = res.data.data.records
        }
      )
    },
    optFunc(type) {
      this.$refs[type].validate(valid => {
        console.log(valid)
        if (valid) {
          // console.log('submit!');
          let param = {
            id: "",
            productSpecificationName: "",
            attributes: [],
            companyNo: this.$store.state.companyNo
          };
          if (type == "addForm") {
            param.productSpecificationName = this.addForm.name;
            this.addForm.dynamicTags.map(item => {
              param.attributes.push({
                id: "",
                productAttributeName: item
              });
            });
          } else if (type == "editForm") {
            param.id = this.editForm.id;
            console.log("=======",param.id)
            param.productSpecificationName = this.editForm.name;
            this.editForm.dynamicTags.map(item => {
              param.attributes.push({
                id: item.id || "",
                productAttributeName: item.productAttributeName || item
              });
            });
          }
          console.log(param,"param")
          this.$http
            .post("api/Focus-BladeX-BootX/productspecification/specAddOrUp",param)
            .then(res => {
              if (res.msg == "规格属性Key名称已存在") {
                this.$message({
                  showClose: true,
                  message: "该规格已存在"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: "成功",
                  type: "success"
                });
                // console.log('res', res);
                this.getListData();
                this.editDialogVisible = false;
                this.$refs[type].resetFields();
              }
            })
            .catch(err => {
              console.log("err", err);
            });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    delItem(ids) {
      let param = {
        ids: ids
      };
      this.$http
        .post("api/Focus-BladeX-BootX/productspecification/specAndAttrRemove", param)
        .then(res => {
          if (res.code == 100) {
            this.$message({
              showClose: true,
              message: res.msg,
              type: "warning"
            });
          } else {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
            this.getListData();
          }
          // console.log('res', res);
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    delAll() {
      let idList = this.multipleSelection.map(item => {
        return item.id;
      });
      this.$confirm("确认删除选中的所有规格吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delItem(idList.join(","));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss">
.content {
  padding-bottom: 0;
}
.box-card {
    width: 480px;
  }
.m-r-10{
  margin-right: 10px;
}
// .v-modal{
//   z-index: 99 !important;
// }
.commodity-specfication {
  .el-input--mini .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  .el-tag {
    margin-right: 10px;
    height: 24px;
    line-height: 24px;
    background: rgba(226, 231, 235, 1);
    color: rgba(38, 47, 62, 1);
    border: none;
    .el-tag__close.el-icon-close {
      height: 24px;
      line-height: 24px;
      background-color: red;
      right: -10px;
      top: -1px;
      background: rgba(255, 91, 87, 1);
      border-radius: 0px 5px 5px 0px;
      width: 19px;
      color: #fff;
    }
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    vertical-align: bottom;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .el-table {
    .el-table__header {
      .el-table-column--selection {
        .cell {
          visibility: hidden;
        }
      }
    }
  }
  label.el-checkbox {
    margin-bottom: 0;
    margin-right: 0;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f2f3f4;
  }
  .bottom-col {
    margin-top: 15px;
    .filter {
      margin: 0 40px 0 20px;
    }
    .el-dropdown {
      .el-button {
        padding: 8px 20px;
      }
    }
    label.el-checkbox {
      margin-bottom: 0;
    }
  }
  .el-form-item__error {
    top: 70%;
  }
}
.bg{
  background: #fff;
  padding: 10px;
  box-shadow: 0 4px 10px -1px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  .title{
    font-size: 16px;
    color: #333;
    font-weight: bold;
    margin-bottom: 5px;
  }
}
</style>
