<template>
    <basic-container>
        <div class="add-supplier">
            <el-form :label-position="labelPosition" ref="addSupplier" label-width="230px" :model="addSupplier">
              <el-form-item style="margin:0" label="">
                    <span class="text">基本信息</span>
                </el-form-item>
                <el-form-item label="公司名称:" :required="true">
                    <el-input v-model.trim="addSupplier.name"></el-input>
                </el-form-item>
                <el-form-item label="公司简称:" :required="true">
                    <el-input v-model.trim="addSupplier.shortName"></el-input>
                </el-form-item>
                <el-form-item label="工商营业执照注册号/统一社会信用代码:">
                    <el-input v-model.trim="addSupplier.businessNo"></el-input>
                </el-form-item>
                <el-form-item label="营业执照电子版:">
                    <div style="display: flex;position: relative;">
                        <el-upload
                            class="upload-demo"
                            action="api/Focus-BladeX-BootX/fileupload/uploadImage"
                            :beforeUpload="uploadBefore"
                            :on-success="uploadExcelSuccess"
                            :show-file-list="false"
                            list-type="picture"
                            :headers="headers"
                            multiple
                        >
                            <i class="el-icon-upload"></i>
                            <span class="el-upload__text">选择上传文件</span>
                        </el-upload>
                        <img class="img-url" :src="addSupplier.businessNoUrl" alt="">
                    </div>
                    <div style="font-size:12px">支持扩展名：jpg/jpeg,png,gif,bmp</div>
                </el-form-item>
                <el-form-item style="margin:0" label="">
                    <span class="text">开票信息</span>
                </el-form-item>
                <el-form-item label="税号:">
                    <el-input onkeyup="this.value=this.value.replace(/\D/g,'')" v-model.trim="addSupplier.dutyNo"></el-input>
                </el-form-item>
                <el-form-item label="开户银行:">
                    <el-input v-model.trim="addSupplier.bankName"></el-input>
                </el-form-item>
                <el-form-item label="银行账号:">
                    <el-input onkeyup="this.value=this.value.replace(/\D/g,'')" v-model.trim="addSupplier.bankAccount"></el-input>
                </el-form-item>
                <el-form-item label="单位地址:">
                    <el-input v-model.trim="addSupplier.addressDetail"></el-input>
                </el-form-item>
                <el-form-item label="电话号码:">
                    <el-input :maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')" v-model.trim="addSupplier.phone"></el-input>
                </el-form-item>
                <el-form-item style="margin:0" label="">
                    <span class="text">账户信息</span>
                </el-form-item>
                <el-form-item label="平台登录账号 (手机):">
                    <el-input :maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')" v-model.trim="addSupplier.account"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('addSupplier')">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </basic-container>        
</template>
      
<script>
import { Base64 } from "js-base64";
import { getToken } from "@/util/auth";
import website from "@/config/website";
export default {
  data() {
    return {
      businessNoUrl: "",
      addSupplier: {
        name: "",
        shortName: "",
        businessNo: "",
        dutyNo: "",
        bankName: "",
        bankAccount: "",
        addressDetail: "",
        phone: "",
        account: "",
        businessNoUrl: ""
      },
      headers: {
        Authorization: `Basic ${Base64.encode(
          `${website.clientId}:${website.clientSecret}`
        )}`,
        "Blade-Auth": "bearer " + getToken()
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    console.log(this.$route.query);
    if (this.$route.query.id) {
      this.getLiatData();
    }
    
  },
  methods: {
    uploadBefore(file) {
      console.log(file);
      var fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const arr = ["jpg", "jpeg", "png", "gif", "bmp"];
      const extension = arr.indexOf(fileType) > -1; // 格式jpg或者png
      // const isLt2M = file.size / 1024 < 500; // 大小500k
      if (!extension) {
        this.$message({
          message: "仅支持jpg/png格式",
          type: "warning"
        });
        return false;
      }
      // if (!isLt2M) {
      //   this.$message({
      //     message: "上传文件大小不能超过 500K!",
      //     type: "warning"
      //   });
      //   return false;
      // }
      // return extension && isLt2M;
      return extension;
    },
    uploadExcelSuccess(response, file) {
      console.log("上传成功11", response);
      console.log("上传成功", file);
      this.addSupplier.businessNoUrl = response.data;
    },
    getLiatData() {
      this.$http
        .get("api/Focus-BladeX-BootX/supplierinfo/detail", {
          params: {
            id: this.$route.query.id || ""
          }
        })
        .then(res => {
          console.log("res", res);
          this.addSupplier = {
            name: res.data.data.name,
            shortName: res.data.data.shortName,
            businessNo: res.data.data.businessNo,
            dutyNo: res.data.data.dutyNo,
            bankName: res.data.data.bankName,
            bankAccount: res.data.data.bankAccount,
            addressDetail: res.data.data.addressDetail,
            phone: res.data.data.phone,
            account: res.data.data.account,
            businessNoUrl: res.data.data.businessNoUrl
          };
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    onSubmit() {
      console.log(111111);
      console.log(this.addSupplier);
      if (!this.addSupplier.name) {
        this.$message({
          type: "warning",
          message: "公司名称不能为空"
        });
      } else if (!this.addSupplier.shortName) {
        this.$message({
          type: "warning",
          message: "公司简称不能为空"
        });
      } else if (
        this.addSupplier.phone &&
        !/^[1][3456789]\d{9}$/.test(this.addSupplier.phone)
      ) {
        this.$message({
          type: "warning",
          message: "请输入正确的手机号码格式"
        });
      }  else if (
        this.addSupplier.account &&
        !/^[1][3456789]\d{9}$/.test(this.addSupplier.account)
      ) {
        this.$message({
          type: "warning",
          message: "请输入正确的登录账号"
        });
      } else {
        let param = {
          id: this.$route.query.id,
          name: this.addSupplier.name,
          shortName: this.addSupplier.shortName,
          businessNo: this.addSupplier.businessNo,
          dutyNo: this.addSupplier.dutyNo,
          bankName: this.addSupplier.bankName,
          bankAccount: this.addSupplier.bankAccount,
          addressDetail: this.addSupplier.addressDetail,
          phone: this.addSupplier.phone,
          account: this.addSupplier.account,
          businessNoUrl: this.addSupplier.businessNoUrl,
          companyNo: this.$store.state.companyNo
        };
        this.$http
          .post("api/Focus-BladeX-BootX/supplierinfo/submit", param)
          .then(res => {
            console.log("res", res);
            if (res.data.code == 200) {
              this.$message({
                showClose: true,
                message: "成功",
                type: "success"
              });
              this.$router.push({
                path: "/supplier/supplierList"
              });
            }
          });
      }
    }
  }
};
</script>
      
<style lang="scss">
.add-supplier {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .text {
    font-size: 18px;
    font-weight: bold;
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .upload-demo {
    width: 200px;
    border: 1px solid #eee;
    text-align: center;
  }
  .el-input {
    .el-input__inner {
      width: 240px;
    }
  }
  .img-url {
    width: 40px;
    height: 40px;
    margin-left: 10px;
  }
}
</style>
      