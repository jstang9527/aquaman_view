<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{title}}</span>
        </div>
        <div style="margin-bottom:50px;" v-loading="isLoading">
          <el-form ref="form" :model="form" label-width="140px">
            <el-form-item label="服务名称" class="is-required">
              <el-input v-model="form.service_name" placeholder="6-128位子午数字下划线"></el-input>
            </el-form-item>
            <el-form-item label="服务描述" class="is-required">
              <el-input v-model="form.service_desc" placeholder="最多255字符, 必填"></el-input>
            </el-form-item>
            <el-form-item label="接入类型" class="is-required">
              <el-input v-model="form.rule" placeholder="路径格式:/user/,域名格式:www.test.com" class="input-with-select">
                <el-select v-model="form.rule_type" slot="prepend" placeholder="请选择" style="width:80px">
                  <el-option label="路径" :value="0"></el-option>
                  <el-option label="域名" :value="1"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="支持https">
              <el-switch v-model="form.need_https" active-color="#13ce66" :active-value="1" :inactive-value="0" />
              <span class="support-span">支持strip_uri</span>
              <el-switch v-model="form.need_strip_uri" active-color="#13ce66" :active-value="1" :inactive-value="0" />
              <span class="support-span">支持websocket</span>
              <el-switch v-model="form.need_websocket" active-color="#13ce66" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="URL重写">
              <el-input type="textarea" v-model="form.url_rewrite" autosize placeholder="格式:^/gateway/test_service(.*) $1 多条换行"></el-input>
            </el-form-item>
            <el-form-item label="Header头转换">
              <el-input type="textarea" v-model="form.head_transfor" autosize placeholder="header转换支持增加(add)、删除(del)、修改(edit):格式:add headname headvalue 多条换行"></el-input>
            </el-form-item>
            <el-form-item label="开启验证">
              <el-switch v-model="form.open_auth" active-color="#13ce66" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="ip白名单">
              <el-input type="textarea" v-model="form.white_list" autosize placeholder="格式:127.0.0.1 多条换行 白名单优先于黑名单"></el-input>
            </el-form-item>
            <el-form-item label="ip黑名单">
              <el-input type="textarea" v-model="form.black_list" autosize placeholder="格式:127.0.0.1 多条换行 白名单优先于黑名单"></el-input>
            </el-form-item>
            <el-form-item label="客户端限流">
              <el-input v-model="form.clientip_flow_limit" placeholder="0表示无限制"></el-input>
            </el-form-item>
            <el-form-item label="服务端限流">
              <el-input v-model="form.service_flow_limit" placeholder="0表示无限制"></el-input>
            </el-form-item>
            <el-form-item label="轮询方式">
              <el-radio-group v-model="form.round_type">
                <el-radio :label="0">random</el-radio>
                <el-radio :label="1">round-robin</el-radio>
                <el-radio :label="2">weight-round-robin</el-radio>
                <el-radio :label="3">ip-hash</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="IP列表" class="is-required">
              <el-input type="textarea" v-model="form.ip_list" autosize placeholder="格式:127.0.0.1:80 多条换行"></el-input>
            </el-form-item>
            <el-form-item label="权重列表" class="is-required">
              <el-input type="textarea" v-model="form.weight_list" autosize placeholder="格式:50 多条换行"></el-input>
            </el-form-item>
            <el-form-item label="建立连接超时">
              <el-input v-model="form.upstream_connect_timeout" placeholder="单位s, 0表示无限制"></el-input>
            </el-form-item>
            <el-form-item label="获取header超时">
              <el-input v-model="form.upstream_header_timeout" placeholder="单位s, 0表示无限制"></el-input>
            </el-form-item>
            <el-form-item label="链接最大空闲时间">
              <el-input v-model="form.upstream_idle_timeout" placeholder="单位s, 0表示无限制"></el-input>
            </el-form-item>
            <el-form-item label="最大空闲链接数">
              <el-input v-model="form.upstream_max_idle" placeholder="0表示无限制"></el-input>
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
import { serviceAddHTTP, serviceDetail } from "@/api/service";
export default {
  name: "ServiceCreateHTTP",
  data() {
    return {
      title: "创建HTTP服务",
      submitBtnDisabled: false,
      isLoading: false,
      query: { id: undefined },
      form: {
        service_name: "",
        service_desc: "",
        rule: "",
        rule_type: 0,
        need_https: 0,
        need_strip_uri: 1,
        need_websocket: 0,
        url_rewrite: "",
        head_transfor: "",
        open_auth: 0,
        white_list: "",
        black_list: "",
        clientip_flow_limit: "",
        service_flow_limit: "",
        round_type: 2,
        ip_list: "",
        weight_list: "",
        upstream_connect_timeout: "",
        upstream_header_timeout: "",
        upstream_idle_timeout: "",
        upstream_max_idle: "",
      },

    };
  },
  created() {
    let id = this.$route.query.id
    if (id) { //点击修改页面的跳转id uri参数(?id=64)
      // 如果有id,查DB进行赋值
      this.title = "更新服务信息"
      this.isLoading = true
      this.query.id = id
      console.log(this.query)
      this.getDetail()
    }
  },
  methods: {
    // 获取服务详情
    getDetail() {
      this.listLoading = true;
      serviceDetail(this.query).then((response) => {
        console.log(response.data)
        this.form.service_name = response.data.info.service_name,
          this.form.service_desc = response.data.info.service_desc,
          this.form.rule = response.data.http_rule.rule,
          this.form.rule_type = response.data.http_rule.rule_type,
          this.form.need_https = response.data.http_rule.need_https,
          this.form.need_strip_uri = response.data.http_rule.need_strip_uri,
          this.form.need_websocket = response.data.http_rule.need_websocket,
          this.form.url_rewrite = response.data.http_rule.url_rewrite,
          this.form.head_transfor = response.data.http_rule.head_transfor,
          this.form.open_auth = response.data.access_control.open_auth,
          this.form.white_list = response.data.access_control.white_list,
          this.form.black_list = response.data.access_control.black_list,
          this.form.clientip_flow_limit = response.data.access_control.clientip_flow_limit,
          this.form.service_flow_limit = response.data.access_control.service_flow_limit,
          this.form.round_type = response.data.load_balance.round_type,
          this.form.ip_list = response.data.load_balance.ip_list,
          this.form.white_list = response.data.load_balance.weight_list,
          this.form.upstream_connect_timeout = response.data.load_balance.upstream_connect_timeout,
          this.form.upstream_header_timeout = response.data.load_balance.upstream_header_timeout,
          this.form.upstream_idle_timeout = response.data.load_balance.upstream_idle_timeout,
          this.form.upstream_max_idle = response.data.load_balance.upstream_max_idle,
          setTimeout(() => { this.isLoading = false; }, 1.5 * 1000);
      });
    },
    onSubmit() {
      this.submitBtnDisabled = true;
      // 拷贝一个form数据
      const form_data = Object.assign({}, this.form);
      console.log(form_data);
      form_data.url_rewrite = form_data.url_rewrite.replace(/\n/g, ",");
      form_data.head_transfor = form_data.head_transfor.replace(/\n/g, ",");
      form_data.ip_list = form_data.ip_list.replace(/\n/g, ",");
      form_data.weight_list = form_data.weight_list.replace(/\n/g, ",");
      form_data.white_list = form_data.white_list.replace(/\n/g, ",");
      form_data.black_list = form_data.black_list.replace(/\n/g, ",");
      form_data.clientip_flow_limit = Number(form_data.clientip_flow_limit);
      form_data.service_flow_limit = Number(form_data.service_flow_limit);
      form_data.upstream_connect_timeout = Number(form_data.upstream_connect_timeout);
      form_data.upstream_header_timeout = Number(form_data.upstream_header_timeout);
      form_data.upstream_idle_timeout = Number(form_data.upstream_idle_timeout);
      form_data.upstream_max_idle = Number(form_data.upstream_max_idle);
      serviceAddHTTP(form_data).then((response) => {
        this.submitBtnDisabled = false;
        this.$notify({ title: "Success", message: "添加成功" + response.data.errmsg, type: "success", duration: 3000, });
      }).catch(() => {
        this.submitBtnDisabled = false;
      });
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