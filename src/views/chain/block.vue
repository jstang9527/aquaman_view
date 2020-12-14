<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{title}}</span>
        </div>
        <div style="margin-bottom:50px;">
          <el-form ref="form" :model="form" label-width="140px">
            <el-form-item label="组件名" class="is-required">
              <el-input v-model="form.block_name"></el-input>
            </el-form-item>
            <el-form-item label="重要性" class="is-required">
              <el-select v-model="form.priority" placeholder="请选择">
                <el-option label="Low" :value="1"></el-option>
                <el-option label="Nonal" :value="2"></el-option>
                <el-option label="High" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="期望值">
              <el-input v-model="form.expect" placeholder="指执行完该链后期望匹配到的值" disabled></el-input>
            </el-form-item>
            <el-form-item>
              <el-card class="box-card-in">
                <div slot="header" class="clearfix">
                  <span class="dump-box">动作链</span>
                  <el-button style="float: right; margin-top: 3px;" type="text" @click="openDialog()">添加动作</el-button>
                </div>
                <el-timeline>
                  <el-timeline-item v-for="(activity, index) in list" :key="index" :color="'#0bbd87'" :timestamp="activity.timestamp">
                    {{activity.action_name}}
                    <el-button type="danger" size="mini" style="float: right; margin-top: 3px;" @click="delListItem(index)">删除</el-button>
                    <el-button type="primary" size="mini" style="float: right; margin-right:3px; margin-top: 3px;" @click="editListItem(index)">修改</el-button>
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
    <el-dialog title="动作" :visible.sync="dialog">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="动作名" class="is-required" style="width:500px;">
          <el-input v-model="temp.action_name" />
        </el-form-item>
        <el-form-item label="动作" class="is-required">
          <el-select v-model="temp.event_type" placeholder="请选择">
            <el-option label="进入/切换页面" :value="1"></el-option>
            <el-option label="输入事件" :value="2"></el-option>
            <el-option label="点击事件" :value="3"></el-option>
            <el-option label="监听事件" :value="4"></el-option>
            <el-option label="抓取表格数据" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请输入URL">
          <el-input v-model="temp.url" placeholder="/#/login" style="width:500px;" />
        </el-form-item>
        <el-form-item label="元素检索">
          <el-select v-model="temp.search_type" clearable placeholder="请选择">
            <el-option label="属性ID" :value="1"></el-option>
            <el-option label="XPath" :value="2"></el-option>
            <el-option label="Auto" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性ID">
          <el-input v-model="temp.element_id" placeholder="username" style="width:500px;" />
        </el-form-item>
        <el-form-item label="Xpath">
          <el-input v-model="temp.xpath" placeholder="//*/div/h1/text" style="width:500px;" />
        </el-form-item>
        <el-form-item label="输入值|期望值">
          <el-input v-model="temp.element_value" placeholder="若是输入事件,请输入内容值;若是监听事件，请输入期望值" style="width:500px;" />
        </el-form-item>
        <el-form-item label="超时时间">
          <el-input v-model="temp.timeout" type="number" oninput="if(value.length > 3)value = value.slice(0, 3)" placeholder="在指定时间内检索元素(单位: 秒)" style="width:500px;" />
        </el-form-item>
        <el-form-item label="出错为真">
          <el-switch v-model="temp.allow_err" active-color="#13ce66" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelConfirm()">Cancel</el-button>
        <el-button v-if="isEditItem" type="danger" :disabled="submitBtnDisabled" @click="onConfirm(1)">确认修改</el-button>
        <el-button v-else type="primary" @click="onConfirm(0)">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { chainAddBlock, blockDetail, chainUpdateBlock } from "@/api/chain";
export default {
  data() {
    return {
      isEditItem: false,
      isEditPage: false, //是创建还是修改页面？
      submitBtnDisabled: false,
      dialog: false,
      title: "创建组件",
      temp: { id: 0, block_id: 0, action_name: "", event_type: undefined, search_type: undefined, url: "", element_id: "", element_value: "", xpath: "", timeout: undefined, allow_err: 0 },
      form: { block_name: "", priority: 1, expect: "", },
      list: [],
      block_id: undefined,
      curListItemIndex: undefined,//当前修改的列表的下标值
    };
  },
  created() {
    let id = this.$route.query.id
    if (id) { //点击修改页面的跳转id uri参数(?id=64)
      // 如果有id,查DB进行赋值
      this.title = "更新组件配置"
      this.isEditPage = true
      this.isLoading = true
      this.block_id = Number(id)
      this.getDetail(id)
    }
  },
  methods: {
    openDialog() {
      this.dialog = true
      this.isEditItem = false
    },
    // 更新组件配置
    onUpdate() {
      if (this.form.block_name == "") { this.$message({ message: "组件名必填", type: "warning" }); return }
      if (this.form.priority < 1) { this.$message({ message: "重要性必选", type: "warning" }); return }
      if (this.list.length == 0) { this.$message({ message: "动作列表为空", type: "warning" }); return }
      this.submitBtnDisabled = true
      //1.组装数据
      let postData = { id: this.block_id, block_name: this.form.block_name, priority: this.form.priority, expect: this.form.expect, action_chain: this.list }
      //2.调API接口
      chainUpdateBlock(postData).then((response) => {
        this.submitBtnDisabled = false;
        this.clearFormData();
        this.$notify({ title: "Success", message: "更新成功 [id:" + this.block_id + "]" + response.data.errmsg, type: "success", duration: 5000, });
        this.$router.go(-1)
      }).catch(() => {
        this.submitBtnDisabled = false;
        this.$notify({ title: "Failed", message: "更新失败 [id:" + this.block_id + "]", type: "error", duration: 5000, });
      });
    },
    //提及创建组件
    onSubmit() {
      if (this.form.block_name == "") { this.$message({ message: "组件名必填", type: "warning" }); return }
      if (this.form.priority < 1) { this.$message({ message: "重要性必选", type: "warning" }); return }
      if (this.list.length == 0) { this.$message({ message: "动作列表为空", type: "warning" }); return }
      this.submitBtnDisabled = true
      //1.组装数据
      let postData = { block_name: this.form.block_name, priority: this.form.priority, expect: this.form.expect, action_chain: this.list }
      //2.调API接口
      chainAddBlock(postData).then((response) => {
        this.submitBtnDisabled = false;
        this.clearFormData();
        this.$notify({ title: "Success", message: "添加成功" + response.data.errmsg, type: "success", duration: 5000, });
      }).catch(() => {
        this.submitBtnDisabled = false;
      });
    },
    cancelConfirm() {
      this.clearTempData()
      this.dialog = false
    },
    onConfirm(sign) { //弹出框提交
      let result = { id: 0, block_id: 0, action_name: "", event_type: undefined, search_type: undefined, url: "", element_id: "", element_value: "", xpath: "", timeout: undefined, allow_err: 0, timestamp: undefined }
      result.action_name = this.temp.action_name
      result.event_type = this.temp.event_type
      if (result.action_name == "") { this.$message("动作名必填"); return }
      if (!result.event_type) { this.$message("动作必选"); return }
      console.log("===>" + this.temp.event_type)

      //1.判断事件
      //1.1 页面切换,只保留url
      if (result.event_type == 1) {
        if (this.temp.url == "") { this.$message("URL必填"); return }
        result.url = this.temp.url
      } else {
        result.search_type = this.temp.search_type
        if (!result.search_type) { this.$message("元素检索必选"); return }
      }
      //1.2输入事件,判断元素检索方式[byid|xpath]
      if (result.event_type == 2) {
        if (result.search_type == 1) { //ByID,保留id和value
          result.element_id = this.temp.element_id
          result.element_value = this.temp.element_value
          if (result.element_id == "") { this.$message("属性ID必填"); return }
          if (result.element_value == "") { this.$message("输入值必填"); return }
        } else { //保留xpath
          result.xpath = this.temp.xpath
          if (result.xpath == "") { this.$message("XPath必填"); return }
        }
      }
      //1.3 点击事件,只保留XPath或ID即可
      if (result.event_type == 3) {
        if (result.search_type == 1) { //ByID,保留id
          result.element_id = this.temp.element_id
          if (result.element_id == "") { this.$message("属性ID必填"); return }
        } else { //保留xpath
          result.xpath = this.temp.xpath
          if (result.xpath == "") { this.$message("XPath必填"); return }
        }
      }
      //1.4 监听事件，只保留id|xpath、期望值、超时时间、出错为真
      if (result.event_type == 4) {
        result.timeout = this.temp.timeout
        result.allow_err = this.temp.allow_err
        result.element_value = this.temp.element_value
        if (result.search_type == 1) { //ByID,保留id
          result.element_id = this.temp.element_id
          if (result.element_id == "") { this.$message("属性ID必填"); return }
        } else { //保留xpath
          result.xpath = this.temp.xpath
          if (result.xpath == "") { this.$message("XPath必填"); return }
        }
        if (result.element_value == "") { this.$message("期望值必填"); return }
      }
      //1.5 抓取表格数据
      if (result.event_type == 5) {
        if (result.search_type == 1) { //ByID,保留id
          result.element_id = this.temp.element_id
          if (result.element_id == "") { this.$message("属性ID必填"); return }
        } else { //保留xpath
          result.xpath = this.temp.xpath
          if (result.xpath == "") { this.$message("XPath必填"); return }
        }
      }
      result.id = this.temp.id
      result.block_id = this.temp.block_id
      result.search_type = Number(this.temp.search_type)
      result.url = this.temp.url
      result.element_id = this.temp.element_id
      result.element_value = this.temp.element_value
      result.xpath = this.temp.xpath
      result.timeout = Number(this.temp.timeout)
      result.allow_err = this.temp.allow_err
      result.timestamp = new Date() + ""

      //+ 判断是新增还是修改操作
      if (sign == 1) {//  - 修改 ->改list[index]的值
        this.list[this.curListItemIndex] = result
      } else {//  - 新增 ->推给全局list下
        this.list.push(result)
      }
      this.dialog = false
      this.clearTempData()
    },
    delListItem(index) {
      this.list.splice(index, 1);
    },
    // 修改action，本地修改list[index]
    editListItem(index) {
      //打开弹出框
      this.dialog = true
      this.isEditItem = true
      this.curListItemIndex = index
      //对弹出框进行赋值
      let obj = this.list[index]
      this.temp = obj
    },
    // 提交弹出框后清除temp弹出框数据
    clearTempData() {
      this.temp = { action_name: "", event_type: undefined, search_type: undefined, url: "", element_id: "", element_value: "", xpath: "", timeout: undefined, allow_err: 0 }
    },
    // 提交成功清空当前页面数据
    clearFormData() {
      this.form = { block_name: "", priority: 1, expect: "", }
      this.list = [];
    },
    getDetail(id) {
      let query = { id: id }
      blockDetail(query).then((response) => {
        this.list = response.data.actions
        this.form = response.data.info
        console.log(this.list)
        setTimeout(() => { this.isLoading = false; }, 1.5 * 1000);
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