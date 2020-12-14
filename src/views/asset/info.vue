<template>
  <div class="dashboard-editor-container">
      <div class="app-container">
           <div class="page-header">
                <button class="pan-btn pink-btn" v-if="pannel1" @click="pannel1=!pannel1">[ - ] 资产信息</button>
                <button class="pan-btn pink-btn" v-else @click="pannel1=!pannel1">[+] 资产信息</button>
                <el-form ref="form" v-if="pannel1" :model="form" label-width="80px" size="mini">
                    <el-form-item></el-form-item>
                    <el-form-item label="资产名称">
                        <el-tag type="success">{{form.name}}</el-tag>
                        <!-- <el-tag type="success">{{form.state}}</el-tag> -->
                    </el-form-item>
                    <el-form-item label="Target">
                        <el-input v-model="form.target" disabled style="width:250px"></el-input>
                    </el-form-item>
                    <el-form-item label="IP 信息">
                        <el-tag type="info">{{form.host}}</el-tag>
                        <el-tag type="warning" style="margin-left: 1%; color: yellow; background-color: gray">{{form.ip_info}}</el-tag>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-tag type="info">{{form.create_at}}</el-tag>
                    </el-form-item>
                    <el-form-item label="更新时间">
                        <el-tag type="info">{{form.update_at}}</el-tag>
                    </el-form-item>
                   <el-form-item label="检测状态" min-width="20px"> <!--align="center"-->
                        <el-tag v-if="form.status=='Completed'" effect="dark" type="success">
                            <i  class="el-icon-finished">{{ form.status }}</i>
                        </el-tag>
                        <el-tag v-else-if="form.status=='New'">
                            <i  class="el-icon-video-play">{{ form.status }}</i>
                        </el-tag>
                        <el-tag v-else>
                            <i  class="el-icon-loading">{{ form.status }}</i>
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="Banner">
                        <el-checkbox-group v-model="banner" fill="#FFA500">
                            <el-checkbox-button :label="form.host" name="type"></el-checkbox-button>
                            <el-checkbox-button :label="form.hostname" name="type"></el-checkbox-button>
                            <el-checkbox-button :label="form.hostname_type" name="type"></el-checkbox-button>
                            <el-checkbox-button :label="form.mac" name="type"></el-checkbox-button>
                            <el-checkbox-button :label="form.vendor" name="type"></el-checkbox-button>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="高危端口">
                        <el-checkbox-group v-model="open_port" fill="#CD0000">
                            <el-checkbox-button v-for="(j,jj) in form.port_list" :key="jj" :label="j" name="type"></el-checkbox-button>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
           </div>
           <div class="info-content">
                <button class="pan-btn green-btn" v-if="pannel2" @click="pannel2=!pannel2">[ - ] 服务漏洞</button>
                <button class="pan-btn green-btn" v-else @click="pannel2=!pannel2">[+] 服务漏洞</button>
                <p />
                <div v-if="pannel2">
                    <el-tabs v-if="list.length>0" tab-position="left" type="border-card" style="height: 800px;" v-loading="service_loading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                        <el-tab-pane v-for="(item, index) in list" :key="index" :label="item.port">
                            <el-form ref="form" :model="item" label-width="80px" size="mini">
                                <el-form-item></el-form-item>
                                <div v-if="item['name'] && item['name'].indexOf('http') != -1">
                                    <svg-icon style="float:left; height: 40px; width: 40px; color: #00BFFF" icon-class="international"/>   
                                    <el-link type="primary" style="font-size: 30px; line-height: 40px; margin-left:1%" >{{item.name}}://{{form.host}}:{{item.port}}</el-link>
                                    <p />
                                </div>
                                <div v-else>
                                    <svg-icon style="float:left; height: 40px; width: 40px; color: #00BFFF" icon-class="people"/>   
                                    <el-link type="primary" style="font-size: 30px; line-height: 40px; margin-left:1%" >{{item.name}}://{{form.host}}:{{item.port}}</el-link>
                                    <p />
                                </div>

                                <el-form-item v-if="item['name'] && item['name'].indexOf('http') != -1" label="标题">
                                    {{item.web_fingerprint['title']}}
                                </el-form-item>
                                <el-form-item v-else label="协议">
                                    <span>{{item['protocol']}}</span>
                                </el-form-item>

                                <el-form-item v-if="item['name'] && item['name'].indexOf('http') != -1" label="状态">
                                    <el-tag effect="dark" type="success">{{item.web_fingerprint['status_code']}}</el-tag>
                                    <span style="margin-left: 20%; font-weight: 600; color: #606266">Web指纹 </span><el-button @click="web_dialog=!web_dialog">获取</el-button>
                                </el-form-item>
                                <el-form-item v-else label="状态">
                                    <el-tag effect="dark" type="success" v-if="item.state===''">closed[{{item.state}}]</el-tag>
                                    <el-tag effect="dark" type="success" v-else>{{item.state}}</el-tag>
                                </el-form-item>
                                <el-form-item label="实例ID">
                                    <el-input v-model="item.instance_id" disabled style="width:250px"></el-input>
                                </el-form-item>
                                <el-form-item label="应用">
                                    <el-tag v-if="item.product" type="success">{{item.product}}</el-tag><span> </span>
                                    <el-tag v-if="item.version">{{item.version}}</el-tag>
                                    <el-tag v-if="!item.product" type="success">Unkown</el-tag>
                                </el-form-item>
                                <el-dialog title="Web指纹" :visible.sync="web_dialog" width="30%">
                                    <pre overflow="hidden">{{item.web_fingerprint}}</pre>
                                </el-dialog>
                            </el-form>
                            <el-dialog title="漏洞详情" :visible.sync="dialog" width="80%">
                                <pre overflow="hidden">{{vul_info}}</pre>
                            </el-dialog>
                            <!--AWVS table-->
                            <el-table :data="item.vulnerabilities" style="width: 100%" border height="500px" :row-class-name="tableRowClassName" >
                                <el-table-column label="漏洞名称" width="180" align="center" fixed>
                                    <template slot-scope="{row}"><span>{{ row.vt_name }}</span></template>
                                </el-table-column>
                                <el-table-column label="Affects_URL" width="180" align="center" fixed>
                                    <template slot-scope="{row}"><span>{{ row.affects_url }}</span></template>
                                </el-table-column>
                                <el-table-column label="渗透方式" width="160" align="center">
                                    <template slot-scope="{row}"><span>{{ row.method }}</span></template>
                                </el-table-column>
                                <el-table-column label="Tags" width="220" align="center">
                                    <template slot-scope="{row}"><span>{{ row.tags }}</span></template>
                                </el-table-column>
                                <el-table-column label="漏洞复现" width="300" align="center" :show-overflow-tooltip="true">
                                    <template slot-scope="{row}"><span>{{ row.attack_result }}</span></template>
                                </el-table-column>
                                <el-table-column label="exploit" width="180" align="center" :show-overflow-tooltip="true">
                                    <template slot-scope="{row}"><span>{{ row.exploit }}</span></template>
                                </el-table-column>
                                <el-table-column label="payload" width="400" align="center" :show-overflow-tooltip="true">
                                    <template slot-scope="{row}"><span>{{ row.payload }}</span></template>
                                </el-table-column>
                                <el-table-column label="操作" width="80" align="center" fixed="right">
                                    <template slot-scope="{row}">
                                        <el-button type="primary" size="mini" class="operation-btn" @click="vul_detail(row)">详情</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>   
                    </el-tabs>
                    <el-tabs v-if="list.length===0" tab-position="left" type="border-card" style="height: 400px;">
                        <el-tab-pane label="null">
                            <el-form ref="form" label-width="80px" size="mini">
                                <el-form-item></el-form-item>
                                <el-form-item label="协议"><el-tag type="info">Null</el-tag></el-form-item>
                                <el-form-item label="实例ID"><el-input disabled style="width:250px"></el-input></el-form-item>
                                <el-form-item label="应用"><el-tag type="success">Unkown</el-tag></el-form-item>
                            </el-form>
                            <el-table v-model="list" style="width: 100%" border height="200px" :row-class-name="tableRowClassName" >
                                <el-table-column label="漏洞名称" width="180" align="center" fixed>
                                    <template slot-scope="{row}"><span>{{ row.vt_name }}</span></template>
                                </el-table-column>
                                <el-table-column label="Affects_URL" width="180" align="center" fixed>
                                    <template slot-scope="{row}"><span>{{ row.affects_url }}</span></template>
                                </el-table-column>
                                <el-table-column label="渗透方式" width="160" align="center">
                                    <template slot-scope="{row}"><span>{{ row.method }}</span></template>
                                </el-table-column>
                                <el-table-column label="Tags" width="220" align="center">
                                    <template slot-scope="{row}"><span>{{ row.tags }}</span></template>
                                </el-table-column>
                                <el-table-column label="漏洞复现" width="300" align="center" :show-overflow-tooltip="true">
                                    <template slot-scope="{row}"><span>{{ row.attack_result }}</span></template>
                                </el-table-column>
                                <el-table-column label="exploit" width="180" align="center">
                                    <template slot-scope="{row}"><span>{{ row.exploit }}</span></template>
                                </el-table-column>
                                <el-table-column label="payload" width="400" align="center" :show-overflow-tooltip="true">
                                    <template slot-scope="{row}"><span>{{ row.payload }}</span></template>
                                </el-table-column>
                                <el-table-column label="操作" width="80" align="center" fixed="right">
                                    <template slot-scope="{row}">
                                        <el-button type="primary" size="mini" class="operation-btn" @click="vul_detail(row)">详情</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>   
                    </el-tabs>
                </div>
           </div>
      </div>
  </div>
</template>

<script>
import { InfoDetail } from "@/api/instance"
import waves from "@/directive/waves";

export default {
    name: "instance_info",
    directives: { waves },
    data() {
      return {
        pannel1: true,
        pannel2: true,
        tableKey: 0,
        tableKey1: 1,
        banner: [],
        dialog: false,
        web_dialog: false,
        service_loading: true,
        form: {
            "_id": "string",
            "create_at": "string",
            "host": "string",
            "hostname": "string",
            "hostname_type": "string",
            "is_delete": 0,
            "mac": "string",
            "name": "string",
            "port_list": [0],
            "portid_list": ["string"], // [-]
            "target": "string",
            "update_at": "string",
            "vendor": "string"
        },
        list: [],
        open_port:[],
        vul_info:{},
      };
    },
    created(){
        let id = this.$route.query.instance_id
        this.getDetail(id)
    },
    methods: {
        tableRowClassName({row}) {
            if (row.severity === 3) {return 'danger-row'}
            else if (row.severity === 2) {return 'warning-row'}
            return 'success-row';
        },
        vul_detail(row){
            this.dialog = true
            this.vul_info = row
        },
        getDetail(id) {
            let query = { instance_id: id }
            InfoDetail(query).then((response) => {
                let resp = response.data
                this.banner =[resp.host, resp.hostname, resp.hostname_type, resp.mac, resp.vendor]
                this.form = resp
                this.list = response.data.portinfo_list
                for(let i=0;i<this.list.length;i++){
                    if(this.list[i].vulnerabilities.length>0){
                        this.open_port.push(String(this.list[i].port))
                    }
                }
                setTimeout(() => { this.isLoading = false; this.service_loading = false }, 1 * 1000);
            });
        },
    }
};
</script>

<style>
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
.el-table .warning-row {
    background: rgb(255, 247, 233);
}

.el-table .success-row {
    background: #f3fdee;
}
.el-table .danger-row {
background: #fde7e7;
}
</style>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 4px;
  background-color: rgb(239, 239, 240);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
.page-header, .info-content{
   padding: 1%;
   background-color:#fff; 
}
.info-content{
    margin-top: 1%;
}

</style>