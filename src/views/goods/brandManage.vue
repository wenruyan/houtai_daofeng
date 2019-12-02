<template>
  <basic-container>
    <div class="brand-manage">
        <div class="search-box" style="display:flex">
            <div class="title">品牌名称:</div>
            <el-input
                placeholder="请输入内容"
                @keyup.enter.native="searchListData"
                class="search-input"
                v-model="searchVal"
            ></el-input>
            <el-button type="primary" class="search-btn" @click="searchListData">查询</el-button>
        </div>
        <div style="margin-top:20px;margin-bottom: 30px">
           <el-button type="primary" @click="addBrand">添加</el-button> 
        </div>
        <el-table
            :data="tableData"
            ref="multipleTable"
            stripe
            height="calc(100vh - 360px)"
            style="width: 100%;"
            @selection-change="handleSelectionChange"
            v-loading="loading"
        >
            <!-- <el-table-column type="selection" width="46px"></el-table-column> -->
            <el-table-column prop="id" label="编号">
            <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
            </template>
            </el-table-column>
            <el-table-column prop="logo" label="图片">
            <template slot-scope="scope">
                <img style="width:40px;height:40px" class="imgUrl" :src="scope.row.logo" alt="">
            </template>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌名称">
            <template slot-scope="scope">
                <span>{{scope.row.brandName}}</span>
            </template>
            </el-table-column>
            <el-table-column prop="initial" label="品牌首字母">
            <template slot-scope="scope">
                <span>{{scope.row.initial}}</span>
            </template>
            </el-table-column>
            <el-table-column class-name="operate-col" prop label="操作">
            <template slot-scope="scope">
                <el-button  type="text" @click="operateHandle('edit',  scope.$index,scope.row, tableData)" size="mini">编辑</el-button>
                <el-button  type="text" @click="operateHandle('del', scope.$index,scope.row, tableData)" size="mini">删除</el-button>
            </template>
            </el-table-column>
            <div slot="empty" v-if="emptyTextShow"></div>
        </el-table>
        <el-row class="bottom-col" type="flex" justify="space-between" align="middle">
            <el-col :span="8" class="flex flex-cross-center">
            </el-col>
            <el-col :span="16">
            <el-pagination
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
            :visible.sync="showDialog"
            class="dialog"
            center>
            <el-form :label-position="labelPosition" label-width="100px" :model="brandList">
                <el-form-item label="品牌名称" :required="true">
                    <el-input v-model.trim="brandList.brandName"></el-input>
                </el-form-item>
                <el-form-item label="品牌首字母" :required="true">
                    <el-input :maxlength=1 @change="changeValue" v-model.trim="brandList.initial"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom:0px" label="品牌LOGO">
                    <div style="display: flex;position: relative;">
                        <el-upload
                            class="upload-demo"
                            action="api/Focus-BladeX-BootX/fileupload/uploadImage"
                            :beforeUpload="uploadBefore"
                            :on-success="uploadExcelSuccess"
                            :show-file-list="false"
                            multiple
                        >
                            <i class="el-icon-upload"></i>
                            <span class="el-upload__text">选择上传文件</span>
                        </el-upload>
                        <img style="width:40;height:40px;margin-left:20px" :src="brandList.logo" alt="">
                        <!-- <span style="line-height:40px; color:#666;font-size:14px;margin-left:20px">{{fileName}}</span> -->
                    </div>
                    <div style="font-size:12px">只能上传jpg/png格式文件，文件不能超过50kb</div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button class="submit" type="primary" @click="submit">提交</el-button>
                <el-button class="cancle" @click="showDialog = false">取消</el-button> 
            </span>
        </el-dialog>
    </div>
  </basic-container>
</template>

<script>
export default {
  data() {
    return {
      emptyTextShow: true,
      loading: false,
      showDialog: false,
      searchVal: "",
      brandList: {
        brandName: "",
        initial: "",
        logo: ""
      },
      id: "",
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      multipleSelection: [],
      checkedAll: false,
      noCheckedAll: true,
      normKey: [],
      skuList: []
    };
  },
  computed: {},
  watch: {
    "brandList.initial": {
      handler(val) {
        //你的代码
        console.log(val, 'val')
        this.brandList.initial = val.replace(/[^a-zA-Z]/g,'')
      }
    }
  },
  created() {},
  mounted() {
    this.getListData();
  },
  methods: {
    uploadBefore(file) {
      console.log(file);
      var fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const arr = ["jpg", "png"];
      const extension = arr.indexOf(fileType) > -1; // 格式jpg或者png
      const isLt2M = file.size / 1024 < 50; // 大小50k
      if (!extension) {
        this.$message({
          message: "仅支持jpg/png格式",
          type: "warning"
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 50K!",
          type: "warning"
        });
        return false;
      }
      return extension && isLt2M;
    },
    uploadExcelSuccess(response, file) {
      console.log("上传成功11", response);
      console.log("上传成功", file);
      this.brandList.logo = response.data;
      console.log(this.brandList.logo);
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
    handleSelectionChange(val) {
      console.log(val, "val00000000000");
      this.multipleSelection = val;
    },
    operateHandle(type, index, row) {
      switch (type) {
        case "edit":
          console.log(row);
          this.showDialog = true;
          this.brandList.brandName = row.brandName;
          this.brandList.initial = row.initial;
          this.brandList.logo = row.logo;
          this.id = row.id;
          break;
        case "del":
          this.$confirm("确定删除该品牌吗?", "提示", {
            confirmButtonText: "删除",
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
    searchListData() {
      this.page.currentPage = 1;
      this.getListData();
    },
    changeValue(val) {
      console.log(val);
      this.brandList.initial = val.slice(0, 1);
    },
    getListData() {
      // console.log(param)
      this.loading = true;
      this.$http
        .get("api/Focus-BladeX-BootX/brandinfo/list", {
          params: {
            name: this.searchVal || "",
            current: this.page.currentPage || "",
            size: this.page.pageSize || "",
            companyNo: this.$store.state.companyNo
          }
        })
        .then(res => {
          console.log("res", res);
          // let newList = res.data.rows.map(item => {
          //   return item;
          // });
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
          this.loading = false;
          this.emptyTextShow = false;
        })
        .catch(err => {
          console.log("err", err);
          this.loading = false;
        });
    },
    // 新增或编辑品牌
    submit() {
      console.log(this.brandList, "8888888");
      if (!this.brandList.brandName) {
        this.$message({
          message: "品牌名称不能为空",
          type: "warning"
        });
      } else if (!this.brandList.initial) {
        this.$message({
          message: "品牌首字母不能为空",
          type: "warning"
        });
      } else {
        let param = {
          companyNo: this.$store.state.companyNo,
          id: this.id || "",
          brandName: this.brandList.brandName,
          logo: this.brandList.logo,
          initial: this.brandList.initial
        };
        console.log(param);
        this.loading = true;
        this.$http
          .post("api/Focus-BladeX-BootX/brandinfo/submit", param)
          .then(res => {
            console.log("res", res);
            this.$message({
              message: "成功",
              type: "success"
            });
            this.showDialog = false;
            this.getListData();
          })
          .catch(err => {
            console.log("err", err);
            this.loading = false;
          });
      }
    },
    addBrand() {
      this.id = "";
      this.brandList = {
        brandName: "",
        initial: "",
        logo: ""
      };
      console.log(this.brandList, "999999999");
      this.showDialog = true;
    },
    // 删除
    delItem(id) {
      // id是数组
      console.log(typeof id);
      let param = {
        // companyNo: this.$store.state.companyNo,
        id: id
      };
      console.log(param);
      this.$http
        .post("api/Focus-BladeX-BootX/brandinfo/remove", param)
        .then(res => {
          console.log("res", res);
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getListData();
        });
    }
  }
};
</script>

<style lang="scss">
.content {
  padding-bottom: 0;
}
.brand-manage {
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

  .el-dialog__wrapper {
    z-index: 22222 !important;
    .el-dialog {
      width: 500px;
      height: 320px;
      padding: 40px 0;
      padding-left: 50px;
      padding-right: 100px;
      .upload-demo {
        width: 150px;
        height: 40px;
        line-height: 40px;
        border: 1px solid #387dff;
        text-align: center;
        background: #e5edff;
        color: #387dff;
        border-radius: 5px;
      }
      .el-dialog__header {
        padding: 0;
      }
      .el-dialog__headerbtn {
        visibility: hidden;
      }
      .el-dialog__body {
        padding: 0;
      }
      .dialog-footer {
        padding: 0;
        .el-button {
          width: 80px;
          height: 35px;
        }
        .submit {
          border: none;
          margin-right: 10px;
        }
      }
    }
  }
  .search-btn {
    // padding: 0;
    width: 80px;
  }
  .panel {
    margin-bottom: 0;
  }
  .panel-heading-btn {
  }
  .search-col {
    // height: 34px;
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
          //   visibility: hidden;
        }
      }
    }
    .operate-col {
      .freezeBtn {
        background-color: #a8e4fb;
        color: #3c74a5;
      }
      .unfreezeBtn {
        background-color: #1aa8de;
        color: #fff;
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
}
</style>
