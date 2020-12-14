<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{title}}</span>
        </div>
        <div style="margin-bottom:50px;">
          <el-form ref="form" :model="form" label-width="140px">
            <el-form-item label="任务名" class="is-required">
              <el-input v-model="form.task_name"></el-input>
            </el-form-item>
            <el-form-item label="任务目标" class="is-required">
              <el-input type="textarea" v-model="form.target_list" :autosize="{ minRows: 2, maxRows: 4}" placeholder="格式:http://example.com,多条换行"></el-input>
            </el-form-item>
            <el-form-item label="开启Web漏洞扫描">
              <el-switch v-model="form.open_web" active-color="#13ce66" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item v-if="form.open_web" label="扫描类型">
              <el-select v-model="form.scan_type" placeholder="请选择" style="width:200px">
                <el-option label="完全扫描" :value="1"></el-option>
                <el-option label="高危扫描" :value="2"></el-option>
                <el-option label="XSS检测" :value="3"></el-option>
                <el-option label="SQL注入" :value="4"></el-option>
                <el-option label="弱口令检测" :value="5"></el-option>
                <el-option label="Web指纹" :value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开启Poc检测">
              <el-switch v-model="form.open_poc" active-color="#13ce66" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item v-if="form.open_poc" label="选择协议">
              <el-select v-model="form.protocol" multiple placeholder="请选择" size="medium">
                <el-option v-for="(index,item) in options" :key="item" :label="index" :value="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开启漏洞利用">
              <el-switch v-model="form.open_exp" active-color="#FF4500" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item>
              <el-button v-if="isEditPage" type="danger" :disabled="submitBtnDisabled" @click="onUpdate()">提交修改</el-button>
              <el-button v-else type="primary" :disabled="submitBtnDisabled" @click="onSubmit()">立即创建</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { AddTask, UpdateTask, TaskDetail } from "@/api/mars";
export default {
  data() {
    return {
      isEditPage: false, //是创建还是修改任务的页面？
      submitBtnDisabled: false,
      title: "创建任务",
      form: {
        task_name: "",
        target_list: "", //\n -> , 换行更换逗号
        open_web: 1,
        scan_type: undefined, //完全扫描
        open_poc: 1,
        protocol: [],  //协议 msf search xxx
        open_exp: 1,
      },
      options: ["SMB", "FTP", "RDP", "SSH"],
      task_id: undefined,
    };
  },
  created() {
    let id = this.$route.query.id
    if (id) { //点击修改页面的跳转id uri参数(?id=64)
      // 如果有id,查DB进行赋值
      this.title = "修改任务"
      this.isEditPage = true
      this.isLoading = true
      this.task_id = Number(id)
      this.getDetail(id)
    }
  },
  methods: {
    // 表格格式检查
    formCheck() {
      if (this.form.task_name == "") { this.$message({ message: "任务名必填", type: "warning" }); return false }
      if (this.form.target_list == "") { this.$message({ message: "任务目标必填", type: "warning" }); return false }
      if (this.form.open_web == 1) {
        if (!this.form.scan_type) { this.$message({ message: "扫描类型必填", type: "warning" }); return false }
      }
      if (this.form.open_poc == 1) {
        if (this.form.protocol.length == 0) { this.$message({ message: "协议必填", type: "warning" }); return false }
      }
      return true
    },
    closeChildPage() {
      this.$router.go(-1)
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
    },
    // 更新任务
    onUpdate() {
      if (!this.formCheck()) { return }
      this.submitBtnDisabled = true
      // //1.组装数据
      this.form.target_list = this.form.target_list.replace(/\n/g, ",");
      let putData = {
        id: this.task_id,
        task_name: this.form.task_name,
        target_list: this.form.target_list,
        open_web: this.form.open_web,
        scan_type: this.form.scan_type,
        open_poc: this.form.open_poc,
        protocol: this.form.protocol,
        open_exp: this.form.open_exp,
      }
      //2.调API接口
      UpdateTask(putData).then((response) => {
        this.submitBtnDisabled = false;
        this.clearFormData();
        console.log(response.data)
        this.$notify({ title: response.data, message: "更新成功 [id: " + this.task_id + " ]", type: "success", duration: 5000, });
        this.closeChildPage()
      }).catch(() => {
        this.submitBtnDisabled = false;
        this.$notify({ title: "Failed", message: "更新失败 [id: " + this.task_id + " ]", type: "error", duration: 5000, });
      });
    },
    //创建任务
    onSubmit() {
      if (!this.formCheck()) { return }
      this.submitBtnDisabled = true
      //1.组装数据
      this.form.target_list = this.form.target_list.replace(/\n/g, ",");
      //2.调API接口
      AddTask(this.form).then((response) => {
        this.submitBtnDisabled = false;
        this.clearFormData();
        this.$notify({ title: "Success", message: "添加成功" + response.data.errmsg, type: "success", duration: 5000, });
      }).catch(() => {
        this.submitBtnDisabled = false;
      });
    },
    // 提交成功清空当前页面数据
    clearFormData() {
      this.form = {
        task_name: "", target_list: "", open_web: 1, scan_type: undefined, open_poc: 1, protocol: [], open_exp: 1,
      }
    },
    getDetail(id) {
      let query = { id: id }
      TaskDetail(query).then((response) => {
        this.submitBtnDisabled = false;
        this.form = response.data
      }).catch(() => {
        this.submitBtnDisabled = true;
      });
    },
  }
}
</script>

<style>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.text {
  font-size: 14px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card-in {
  width: 60%;
}
.dump-box {
  font-weight: 700;
  color: #606266;
}
</style>