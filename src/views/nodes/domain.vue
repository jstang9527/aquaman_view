<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{title}}</span>
        </div>
        <div style="margin-bottom:50px;" v-loading="isLoading">
          <el-form ref="form" :model="form" label-width="140px">
            <el-form-item label="域名称" class="is-required">
              <el-input v-model="form.domain" placeholder="6-128位字母数字下划线"></el-input>
            </el-form-item>
            <el-form-item label="域IP" class="is-required">
              <el-input v-model="form.domain_ip" placeholder class="input-with-select">
                <el-select v-model="form.domain_type" slot="prepend" placeholder="请选择" style="width:90px">
                  <el-option label="物理机" :value="0"></el-option>
                  <el-option label="云主机" :value="1"></el-option>
                  <el-option label="虚拟机" :value="2"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="操作系统" class="is-required">
              <el-input v-model="form.domain_os" placeholder="CentOS 7.5"></el-input>
            </el-form-item>
            <el-form-item label="域描述">
              <el-input type="textarea" v-model="form.domain_desc" autosize placeholder></el-input>
            </el-form-item>

            <el-form-item label="宿主机ip" v-if="form.domain_type==2" class="is-required">
              <el-input v-model="form.host_ip"></el-input>
            </el-form-item>
            <el-form-item label="宿主机描述" v-if="form.domain_type==2">
              <el-input type="textarea" v-model="form.host_desc" autosize placeholder></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="submitBtnDisabled" @click="onSubmit">提交</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { domainAdd } from "@/api/domain";
export default {
  name: "DomainOperation",
  data() {
    return {
      title: "添加域",
      submitBtnDisabled: false,
      isLoading: false,
      query: { id: undefined },
      form: {
        domain: "",
        domain_ip: "",
        domain_os: "",
        domain_type: 2,
        domain_desc: "",
        host_ip: "",
        host_desc: "",
      },

    };
  },
  created() {
    let id = this.$route.query.id
    if (id) { //点击修改页面的跳转id uri参数(?id=64)
      // 如果有id,查DB进行赋值
      this.title = "更新域信息"
      this.isLoading = true
      this.query.id = id
      console.log(this.query)
      this.getDetail()
    }
  },
  methods: {
    // 获取域详情
    getDetail() {
      //   serviceDetail(this.query).then((response) => {
      //     console.log(response.data)
      //     setTimeout(() => { this.isLoading = false; }, 1.5 * 1000);
      //   });
      this.isLoading
    },
    onSubmit() {
      this.submitBtnDisabled = true;
      // 拷贝一个form数据
      const form_data = Object.assign({}, this.form);
      console.log(form_data);
      domainAdd(form_data).then((response) => {
        this.submitBtnDisabled = false;
        this.$notify({ title: "Success", message: "添加成功" + response.data.errmsg, type: "success", duration: 5000, });
      }).catch(() => {
        this.submitBtnDisabled = false;
      });
      this.submitBtnDisabled = false
    },
  },
};
</script>

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.support-span {
  color: #606266;
  font-weight: 700;
  margin-left: 50px;
  margin-right: 10px;
}
</style>