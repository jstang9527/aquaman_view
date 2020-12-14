<template>
    <div class="mixin-components-container">
        <el-row>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-weight: 800" >线程设置</span>
                </div>
                <div style="margin-bottom:50px;">
                    <el-form ref="form" :model="form" label-width="180px" size="mini">
                        <el-form-item label="Poc Scanner">
                            <el-input-number size="mini" v-model="form.poc_thread" :min="1" :max="50"></el-input-number>
                        </el-form-item>
                        <el-form-item label="Discovery">
                            <el-input-number size="mini" v-model="form.discovery_thread" :min="1" :max="50"></el-input-number>
                        </el-form-item>
                        <el-form-item label="SubDomain">
                            <el-input-number size="mini" v-model="form.subdomain_thread" :min="1" :max="50"></el-input-number>
                        </el-form-item>
                        <el-form-item label="Port Scanner">
                            <el-input-number size="mini" v-model="form.port_thread" :min="1" :max="50"></el-input-number>
                        </el-form-item>
                        <el-form-item label="Auth Tester">
                            <el-input-number size="mini" v-model="form.auth_tester_thread" :min="1" :max="50"></el-input-number>
                        </el-form-item>
                        <el-form-item label="Poc Frequency">
                            <el-input-number size="mini" v-model="form.poc_frequency" :min="1" :max="100"></el-input-number>
                        </el-form-item>
                        <el-form-item label="Discovery Time">
                            <el-input type="time" v-model="form.discovery_time" class="number_input"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
            <el-card class="box-card" style="margin-top: 20px">
                <div slot="header" class="clearfix">
                    <span style="font-weight: 800">检测端口</span>
                </div>
                <div style="margin-bottom:50px;">
                    <el-form ref="form" :model="form" label-width="80px" size="medium">
                        <el-form-item label="">
                            <el-input type="textarea" v-model="form.port_list" :rows="3" placeholder="20,21,22,25,80,110,443,445,3306,8080"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
            <el-card class="box-card" style="margin-top: 20px">
                <div slot="header" class="clearfix">
                    <span style="font-weight: 800">认证爆破</span>
                </div>
                <div style="margin-bottom:50px;">
                    <el-form ref="form" :model="form" label-width="180px" size="medium">
                        <el-form-item label="服务字典">
                            <el-input type="textarea" v-model="form.auth_service" :rows="3" placeholder="rdp,ssh,ftp"></el-input>
                        </el-form-item>
                        <el-form-item label="账户字典">
                            <el-input type="textarea" v-model="form.username_dict" :rows="3" placeholder="root,admin"></el-input>
                        </el-form-item>
                        <el-form-item label="密码字典">
                            <el-input type="textarea" v-model="form.password_dict" :rows="3" placeholder="root,admin,123456"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
            <el-card class="box-card" style="margin-top: 20px">
                <div slot="header" class="clearfix">
                    <span style="font-weight: 800">域名爆破</span>
                </div>
                <div style="margin-bottom:50px;">
                    <el-form ref="form" :model="form" label-width="180px" size="medium">
                        <el-form-item label="二级域名">
                            <el-input type="textarea" v-model="form.subdomain_dict_2" :rows="3" placeholder="www,mail,test"></el-input>
                        </el-form-item>
                        <el-form-item label="三级域名">
                            <el-input type="textarea" v-model="form.subdomain_dict_3" :rows="3" placeholder="www,mail,test"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
            <el-button type="danger" style="margin: 10px, 0, 0, 0px" @click="PutSystemConfig">确认修改</el-button>
        </el-row>
    </div>
</template>

<script>
import { GetConfig, PutConfig } from "@/api/sys_config"
export default {
    data() {
        return {
            title: "系统设置",
            form: {},
            info: {  // 样板
                _id: "5c483205cc599e1032f2a6fb",
                auth_service: ["asterisk", "cisco", "cisco-enable", "cvs", "firebird", "ftp", "ftps", "http-proxy", "http-proxy-urlenum"],
                auth_tester_thread: 50,
                config_name: "mars",
                discovery_thread: 50,
                discovery_time: "10:31:00",
                password_dict: ["123456", "password", "12345678", "admin", "admin123", "000000", "111111", "666666"],
                poc_frequency: 15,
                poc_thread: 50,
                port_list: [20, 21, 22, 25, 445, 3389],
                port_thread: 50,
                subdomain_dict_2: ["www", "mail", "test"],
                subdomain_dict_3: ["www", "mail", "test"],
                subdomain_thread: 50,
                username_dict: ["admin", "root", "administrators"]
            },
        };
    },
    created() {
        this.GetSystemConfig()
    },
    methods: {
        update(){
            this.$notify({ title: "Warning", message: "接口未实现", type: "info", duration: 5000, });
        },
        // 获取配置数据
        GetSystemConfig(){
            GetConfig().then((response) => {
                let info = response.data
                let ports_str = ''
                let users_str = ''
                let passwd_str = ''
                let srvs_str = ''
                let s2 = ''
                let s3 = ''
                for(let i=0;i<info.port_list.length;i++){
                    ports_str = ports_str + info.port_list[i] +","
                }
                for(let i=0;i<info.username_dict.length;i++){
                    users_str = users_str + info.username_dict[i] + ','
                }
                for(let i=0;i<info.password_dict.length;i++){
                    passwd_str = passwd_str + info.password_dict[i] + ','
                }
                for(let i=0;i<info.subdomain_dict_2.length;i++){
                    s2 = s2 + info.subdomain_dict_2[i] + ','
                }
                for(let i=0;i<info.subdomain_dict_3.length;i++){
                    s3 = s3 + info.subdomain_dict_3[i] + ','
                }
                for(let i=0;i<info.auth_service.length;i++){
                    srvs_str = srvs_str + info.auth_service[i] + ','
                }
                this.form = {
                    _id: info._id,
                    auth_tester_thread: info.auth_tester_thread,
                    config_name: info.config_name,
                    discovery_thread: info.discovery_thread,
                    discovery_time: info.discovery_time,
                    poc_frequency: info.poc_frequency,
                    poc_thread: info.poc_thread,
                    port_thread: info.port_thread,
                    subdomain_thread: info.subdomain_thread,
                    // 以下是经过处理的
                    port_list: ports_str,
                    username_dict: users_str,
                    password_dict: passwd_str,
                    subdomain_dict_2: s2,
                    subdomain_dict_3: s3,
                    auth_service: srvs_str
                }
            }).catch(() => {
                this.$notify({ title: "Failed", message: "服务未得到响应", type: "error", duration: 5000, });
            });
        },
        PutSystemConfig(){
            // 处理数据
            this.form.port_list = this.form.port_list.trim()
            this.form.username_dict = this.form.username_dict.trim()
            this.form.password_dict = this.form.password_dict.trim()
            this.form.subdomain_dict_2 = this.form.subdomain_dict_2.trim()
            this.form.subdomain_dict_3 = this.form.subdomain_dict_3.trim()
            this.form.auth_service = this.form.auth_service.trim()
            // let a = 'www,mail , test,'
            // let m = a.split(",").map(el => el.trim()).filter(item => item.trim() != '')
            // console.log(m)
            let data = {
                _id: this.form._id,
                auth_tester_thread: this.form.auth_tester_thread,  //
                config_name: this.form.config_name, // 创建数据库手动建库
                discovery_thread: this.form.discovery_thread,  //
                discovery_time: this.form.discovery_time, //
                poc_frequency: this.form.poc_frequency,  //
                poc_thread: this.form.poc_thread, //
                port_thread: this.form.port_thread, //
                subdomain_thread: this.form.subdomain_thread, //
                // 以下需要经过处理的
                port_list: this.form.port_list.split(',').map(el => el.trim()).filter(item => item.trim() != ''),
                username_dict: this.form.username_dict.split(',').map(el => el.trim()).filter(item => item.trim() != ''),
                password_dict: this.form.password_dict.split(',').map(el => el.trim()).filter(item => item.trim() != ''),
                subdomain_dict_2: this.form.subdomain_dict_2.split(',').map(el => el.trim()).filter(item => item.trim() != ''),
                subdomain_dict_3: this.form.subdomain_dict_3.split(',').map(el => el.trim()).filter(item => item.trim() != ''),
                auth_service: this.form.auth_service.split(',').map(el => el.trim()).filter(item => item.trim() != '')
            }
            // console.log(data)
            PutConfig(data).then(() =>{
                this.$notify({ title: "Success", message: "Update Successfully", type: "success", duration: 5000, });
            }).catch((response) => {
                this.$notify({ title: "Failed", message: response.errmsg, type: "error", duration: 5000, });
            });
        }
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
.number_input{
    width: 40%
}
</style>