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
              <el-input type="textarea" v-model="form.target_list" :autosize="{ minRows: 3, maxRows: 6}" placeholder="格式:http://example.com,多条换行"></el-input>
            </el-form-item>
            <el-form-item label="扫描类型">
              <el-select v-model="form.scan_type" placeholder="请选择" style="width:200px">
                <el-option label="完全扫描" value="0"></el-option>
                <el-option label="高危扫描" value="1"></el-option>
                <el-option label="XSS检测" value="2"></el-option>
                <el-option label="SQL注入" value="3"></el-option>
                <el-option label="弱口令检测" value="4"></el-option>
                <el-option label="仅用爬虫" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="submitBtnDisabled" @click="onSubmit()">立即创建</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { AddTask } from "@/api/web_vul"
export default {
  data() {
    return {
      submitBtnDisabled: false,
      title: "创建任务",
      form: {
        description: "",
        scan_type: "0",
        target_list: "",
        task_name: "",
      },
    };
  },
  methods: {
    // 表格格式检查
    formCheck() {
      if (this.form.task_name.trim() == "") { this.$message({ message: "任务名必填", type: "warning" }); return false }
      if (this.form.target_list.trim() == "") { this.$message({ message: "任务目标必填", type: "warning" }); return false }
      return true
    },
    // 关闭子页
    closeChildPage() {
      this.$router.go(-1)
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
    },
    //创建任务
    onSubmit() {
      if (!this.formCheck()) { return }
    //   this.submitBtnDisabled = true
      //1.组装数据
      console.log(this.form)
      let temp = this.form
      let target_list = temp.target_list.split('\n')
      let tlist = []
      
      for (let i=0; i<target_list.length; i++){
          let item = target_list[i].trim()
          if (item != ""){
              tlist.push(item)
          }
      }
      let data = {
        description: temp.description, 
        scan_type: temp.scan_type,
        target_list: tlist,
        task_name: temp.task_name,
      }
      console.log(data)
      //2.调API接口
      AddTask(data).then((response) => {
        this.submitBtnDisabled = false;
        this.clearFormData();
        this.$notify({ title: "Success", message: "添加成功" + response.errmsg + response.data.task_id, type: "success", duration: 5000, });
      }).catch(() => {
        this.submitBtnDisabled = false;
        this.$notify({title: "Failed", message: "添加失败", type: "error", duration: 5000});
      });
    },
    // 提交成功清空当前页面数据
    clearFormData() {
      this.form = { args: "", recursion: 0, target_list: "", task_name: "", service: [] }
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