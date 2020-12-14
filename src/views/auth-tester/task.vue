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
            <el-form-item label="任务周期">
              <el-select v-model="form.recursion" placeholder="请选择" style="width:200px">
                <el-option label="一次" :value="0"></el-option>
                <el-option label="每天" :value="1"></el-option>
                <el-option label="每周" :value="7"></el-option>
                <el-option label="每月" :value="30"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="参数">
              <el-input v-model="form.args" placeholder="如添加参数如-t 20进行设置线程数、-s 2121设置非默认端口, 具体可看hydra命令参数文档"></el-input>
            </el-form-item>
            <el-form-item label="协议选择">
              <el-select v-model="form.service" multiple filterable placeholder="请选择" style="width:100%">
                <el-option v-for="(index,item) in service_list" :key="item" :label="index" :value="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="账户字典"> 
                <el-input type="textarea" :rows="2" placeholder="null" v-model="username_list" disabled></el-input> 
            </el-form-item>
            <el-form-item label="密码字典"> 
                <el-input type="textarea" :rows="2" placeholder="null" v-model="password_list" disabled></el-input> 
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
// import { UpdateTask } from "@/api/mars";
import { ConfigData, AddTask, TaskDetail, PutTask } from "@/api/auth_tester"
// import { date } from 'jszip/lib/defaults';
export default {
  data() {
    return {
      isEditPage: false, //是创建还是修改任务的页面？
      submitBtnDisabled: false,
      title: "创建任务",
      form: {
        args: "",
        recursion: 0,
        target_list: "",
        task_name: "",
        service: [],
      },
      username_list: "",
      password_list: "",
      service_list: [
          "ASTERISK", "CISCO", "CISCO-ENABLE", "CVS","FIREBIRD","FTP","FTPS","HTTP_PROXY","HTTP_PROXY-URLENUM","ICQ","IMAP","IRC","LDAP2",
          "MSSQL","MYSQL","NNTP","ORACLE-LISTENER","ORACLE-SID","PCANYWHERE","PCNFS","POP3","POSTGRES","RDP","REDIS","REXEC","RLOGIN","RSH",
          "S7-300","SIP","SMB","SMTP","SMTP-ENUM","SNMP","SOCKS5","SSH","SSHKEY","SVN","TEAMSPEAK","TELNET","VMAUTHD","VNC","XMPP"
      ],
      task_id: undefined,
    };
  },
  created() {
    this.getDataCfg()
    let id = this.$route.query.id
    if (id) { //点击修改页面的跳转id uri参数(?id=64)
      // 如果有id,查DB进行赋值
      this.title = "修改任务"
      this.isEditPage = true
      this.isLoading = true
      this.task_id = id
      this.getDetail(id)
    }
  },
  methods: {
    // 表格格式检查
    formCheck() {
      if (this.form.task_name.trim() == "") { this.$message({ message: "任务名必填", type: "warning" }); return false }
      if (this.form.target_list.trim() == "") { this.$message({ message: "任务目标必填", type: "warning" }); return false }
      if (this.form.service.length == 0) { this.$message({ message: "协议至少选择一项", type: "warning" }); return false }
      return true
    },
    // 关闭子页
    closeChildPage() {
      this.$router.go(-1)
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
    },
    // 获取配置数据
    getDataCfg(){
        ConfigData().then((response) => {
            this.username_list = response.data.username_list + []
            this.password_list = response.data.password_list + []
            this.service_list = response.data.service
            // console.log(response.data)
      }).catch(() => {
        this.$notify({ title: "Failed", message: "服务未得到响应", type: "error", duration: 5000, });
      });
    },
    // 更新任务
    onUpdate() {
      if (!this.formCheck()) { return }
      this.submitBtnDisabled = true
      //1.组装数据
      let temp = this.form
      let target_list = temp.target_list.split('\n')
      let tlist = []
      
      for (let i=0; i<target_list.length; i++){
          let item = target_list[i].trim()
          if (item != ""){
              tlist.push(item)
          }
      }
      let putData = {
        task_id: this.task_id, args: temp.args, recursion: temp.recursion, target_list: tlist, task_name: temp.task_name, service: temp.service,
      }
      //2.调API接口
      PutTask(putData).then((response) => {
        this.submitBtnDisabled = false;
        this.clearFormData();
        this.$notify({ title: response.data, message: "Update Successfully", type: "success", duration: 5000});
        this.closeChildPage()
      }).catch(() => {
        this.submitBtnDisabled = false;
        this.$notify({ title: "Failed", message: "Failed Update", type: "error", duration: 5000});
      });
    },
    //创建任务
    onSubmit() {
      if (!this.formCheck()) { return }
      this.submitBtnDisabled = true
      //1.组装数据
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
        args: temp.args, recursion: temp.recursion, target_list: tlist, task_name: temp.task_name, service: temp.service,
      }
      //2.调API接口
      AddTask(data).then((response) => {
        this.submitBtnDisabled = false;
        this.clearFormData();
        this.$notify({ title: "Success", message: "添加成功" + response.errmsg + response.data.task_id, type: "success", duration: 5000, });
        this.closeChildPage()
      }).catch(() => {
        this.submitBtnDisabled = false;
        this.$notify({title: "Failed", message: "添加失败", type: "error", duration: 5000});
      });
    },
    // 提交成功清空当前页面数据
    clearFormData() {
      this.form = { args: "", recursion: 0, target_list: "", task_name: "", service: [] }
    },
    getDetail(id) {
      let query = { task_id: id }
      TaskDetail(query).then((response) => {
        this.submitBtnDisabled = false;
        this.form.task_name = response.data.task_name;
        this.form.service = response.data.service;
        this.form.args = response.data.args;
        this.form.recursion = response.data.recursion;
        for (let i=0;i<response.data.target.length;i++){
            this.form.target_list = this.form.target_list + response.data.target[i] + '\n'
            console.log(this.form.target_list)
        }
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