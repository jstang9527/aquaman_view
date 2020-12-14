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
              <el-input v-if="isEditPage" v-model="form.task_name" disabled></el-input>
              <el-input v-else v-model="form.task_name"></el-input>
            </el-form-item>
            <el-form-item label="扫描周期" class="is-required">
              <el-select v-model="form.recursion" placeholder="请选择">
                <el-option label="一次" :value=0></el-option>
                <el-option label="每日" :value=1></el-option>
                <el-option label="每周" :value=7></el-option>
                <el-option label="每月" :value=30></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="检测目标">
              <el-input v-model="form.target_list" type="textarea" :rows="4" placeholder="http://example.com, 多条换行" />
            </el-form-item>
            <el-form-item>
              <el-card class="box-card-in">
                <div slot="header" class="clearfix">
                  <span class="dump-box">插件列表</span>
                  <el-button style="float: right; margin-top: 3px;" type="text" @click="openDialog()">添加插件</el-button>
                </div>
                <el-timeline>
                  <el-timeline-item v-for="(item, index) in form.pluginid_list" :key="index" :color="'#0bbd87'" :timestamp="plugin_list[item].plugin_date">
                    {{plugin_list[item].plugin_name}}
                    <el-button type="danger" size="mini" style="float: right; margin-top: 3px;" @click="delListItem(index)">删除</el-button>
                  </el-timeline-item>
                </el-timeline>
              </el-card>
            </el-form-item>
            <el-form-item>
              <el-button v-if="isEditPage" type="danger" :disabled="submitBtnDisabled" @click="onUpdate()">提交修改</el-button>
              <el-button v-else type="primary" :disabled="submitBtnDisabled" @click="onSubmit(0)">立即创建</el-button>
              <!-- <el-button>取消</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
    <!--弹出组件-->
    <el-dialog title="POC插件" :visible.sync="dialog">
      <el-form ref="dataForm" :model="temp_plugin" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="选择插件" class="is-required">
          <el-select v-model="temp_plugin.index" filterable  placeholder="请选择" style="width: 120%">
            <el-option v-for="(item, index) in plugin_list" :key="index" :label="item.plugin_name" :value="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelConfirm()">Cancel</el-button>
        <el-button type="primary" @click="onConfirm()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { TaskDetail, PluginList, CreateTask, PutTask } from "@/api/poc_vul";
export default {
    data() {
        return {
            isEditItem: false,
            isEditPage: false, //是创建还是修改页面？
            submitBtnDisabled: false,
            dialog: false,
            title: "创建任务",
            list: [],
            task_id: undefined,
            form: {task_name: "", recursion: 0, pluginid_list:[], target_list:""}, //第三个是plugin_list下标,第四个需要切分
            plugin_list: [], //插件列表
            temp_plugin: {index: undefined}, //选择的插件
        };
    },
    created() {
        this.getPlugins()
        let id = this.$route.query.id
        if (id) { //点击修改页面的跳转id uri参数(?id=64)
            // 如果有id,查DB进行赋值
            this.title = "更新任务"
            this.isEditPage = true
            this.isLoading = true
            this.task_id = id
            this.getDetail(id)
        }else{ //创建POC任务
            
        }
    },
    methods: {
        openDialog() {
            this.dialog = true
            this.isEditItem = false
        },
        // 关闭子页
        closeChildPage() {
          this.$router.go(-1)
          this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
          this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
        },
        // 更新组件配置
        onUpdate() {
            if (this.form.task_name.trim() == "") { this.$message({ message: "任务名必填", type: "warning" }); return }
            if (this.form.target_list.trim() == "") { this.$message({ message: "目标列表为空", type: "warning" }); return }     
            if (this.form.pluginid_list.length == 0) { this.$message({ message: "插件列表为空", type: "warning" }); return }
            this.submitBtnDisabled = true
            //1.组装数据
            let targets = this.form.target_list.split('\n').map(el => el.trim()).filter(item => item.trim() != '')
            let plugins = []
            for (let i=0; i<this.form.pluginid_list.length; i++){
                plugins.push(this.plugin_list[this.form.pluginid_list[i]]._id)
            }
            let postData = { id: this.task_id, task_name: this.form.task_name, recursion: this.form.recursion, target_list: targets, plugins: plugins }
            //2.调API接口
            PutTask(postData).then((response) => {
              this.submitBtnDisabled = false;
              this.$notify({title: "Success", message: "Update Successfully" + response.data.errmsg, type: "success", duration: 5000});
              this.closeChildPage()
            }).catch(() => {
              this.submitBtnDisabled = false;
              this.$notify({title: "Failed", message: "Failed Update", type: "error", duration: 5000});
            });
        },
        //提及创建组件
        onSubmit() {
            console.log(this.form)
            if (this.form.task_name == "") { this.$message({ message: "任务名必填", type: "warning" }); return }
            if (this.form.target_list == "") { this.$message({ message: "目标列表为空", type: "warning" }); return }     
            if (this.form.pluginid_list.length == 0) { this.$message({ message: "插件列表为空", type: "warning" }); return }
            this.submitBtnDisabled = true
            //1.组装数据
            let targets = this.form.target_list.split('\n').map(el => el.trim()).filter(item => item.trim() != '')
            let plugins = []
            for (let i=0; i<this.form.pluginid_list.length; i++){
                plugins.push(this.plugin_list[this.form.pluginid_list[i]]._id)
            }
            let postData = { task_name: this.form.task_name, recursion: this.form.recursion, target_list: targets, pluginid_list: plugins }
            console.log(postData)
            //2.调API接口
            CreateTask(postData).then((response) => {
                this.submitBtnDisabled = false;
                this.$notify({ title: "Success", message: "添加成功" + response.data.errmsg, type: "success", duration: 5000, });
                this.form = {}
                this.closeChildPage()
            }).catch((response) => {
                this.submitBtnDisabled = false;
                this.$notify({ title: "Failed", message: "添加失败:" + response.errmsg, type: "danger", duration: 5000, });
            });
        },
        cancelConfirm() {
            this.temp_plugin = {index: undefined}
            this.dialog = false
        },
        //插件弹出框提交
        onConfirm() {
            let index = this.temp_plugin.index
            if (index < 0) { this.$message("插件必选"); return }
            // 判断是否已经存在了
            if (this.form.pluginid_list.indexOf(index)> -1){ this.$message({ message: "该插件已经被选择", type: "warning" }); return }
            this.form.pluginid_list.push(index)
            this.temp_plugin = {index: undefined}
            this.dialog = false
        },
        // 删除插件列表中的插件
        delListItem(index) { this.form.pluginid_list.splice(index, 1) },
        // + 修改 获取当前任务信息
        getDetail(id) {
            TaskDetail({task_id: id}).then((response) => {
                let target = response.data.target_list
                let target_str = ""
                for (let i=0;i<target.length;i++){
                    target_str = target_str + target[i] + '\n'
                }
                this.form = {
                    task_name: response.data.task_name,
                    target_list: target_str,
                    pluginid_list: response.data.pluginid_list,
                    recursion: response.data.recursion
                }
                this.matchPlugin(response.data.pluginid_list)
                setTimeout(() => { this.isLoading = false; }, 1.5 * 1000);
            });
        },
        // + 修改 pluginid_list匹配插件详情
        matchPlugin(array){
            let index_list = []
            for (let i=0;i<this.plugin_list.length;i++){
                for(let j=0;j<array.length;j++){
                    if (array[j]==this.plugin_list[i]._id){
                        index_list.push(i)
                        break
                    }
                }
            }
            this.form.pluginid_list = index_list
        },
        // 获取Poc插件列表
        getPlugins(){
            let query = {page_no: 1, page_size: 100, info: ""} //页码、条数、查询字段
            PluginList(query).then((response)=>{
                this.plugin_list = response.data.list
            }).catch(() => {
                this.$notify({title: "Error", message: "Failed Get Plugin Data", type: "danger", duration: 5000})
            })
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