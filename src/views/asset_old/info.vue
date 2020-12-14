<template>
  <div class="dashboard-editor-container">
      <div v-if="page_type==2" class="app-container">
           <div class="page-header">
                <button class="pan-btn pink-btn" @click="pannel1=!pannel1">站点信息</button>
                <el-form ref="form" v-if="pannel1" :model="form" label-width="80px" size="mini">
                    <el-form-item></el-form-item>
                    <el-form-item label="站点域名">
                        <el-tag type="info">{{form.domain}}</el-tag> <span> </span> <el-tag type="success">{{form.state}}</el-tag>
                    </el-form-item>
                    <el-form-item label="站点标题">
                        <el-input v-model="form.title" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="所属业务">
                        <el-tag type="info">{{form.asset_name}}</el-tag>
                    </el-form-item>
                    <el-form-item label="所属资产">
                        <el-tag type="info">{{form.asset_cus_name}}</el-tag>
                    </el-form-item>
                    <el-form-item label="站点Hash">
                        <el-tag type="info">{{form.hash}}</el-tag>
                    </el-form-item>
                    <el-form-item v-if="form.extrabanner!=''" label="ExtraBanner:">
                        <el-tag type="info">{{form.extrabanner}}</el-tag>
                    </el-form-item>
                    <el-form-item v-if="form.ip_info" label="IP信息">
                        <el-tag type="info">{{form.ip_info[0].area}}</el-tag><span> </span>
                        <el-tag type="info">{{form.ip_info[0].gps}}</el-tag><span> </span>
                        <el-tag type="info">{{form.ip_info[0].isp}}</el-tag>
                    </el-form-item>
                    <el-form-item label="Banner">
                        <el-checkbox-group v-model="beaty">
                            <el-checkbox-button :label="form.banner" name="type"></el-checkbox-button>
                            <el-checkbox-button :label="form.httpserver" name="type"></el-checkbox-button>
                            <el-checkbox-button :label="form.cdn" name="type"></el-checkbox-button>
                            <el-checkbox-button :label="form.os" name="type"></el-checkbox-button>
                            <el-checkbox-button :label="form.cdn_cname" name="type"></el-checkbox-button>
                            <el-checkbox-button :label="form.xpb" name="type"></el-checkbox-button>
                            <el-checkbox-button :label="form.cms" name="type"></el-checkbox-button>
                            <el-checkbox-button :label="form.waf" name="type"></el-checkbox-button>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
           </div>
           <div class="info-content">
                <!--弹出框-->
                <el-dialog title="端口详情" :visible.sync="port_dialog">
                    <p>{{port_dialogdata}}</p>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="port_dialog = false">关 闭</el-button>
                    </span>
                </el-dialog>
                <button class="pan-btn green-btn" @click="pannel2=!pannel2">端口信息</button>
                <el-form ref="form" v-if="pannel2" :model="form" label-width="80px" size="mini">
                    <el-form-item></el-form-item>
                    <el-form-item label="扫描时间">
                        <el-tag>{{form.updatetime}}</el-tag>
                    </el-form-item>
                    <el-table :key="tableKey" :data="form.port_info" border fit highlight-current-row style="width: 100%;">
                        <el-table-column label="主机" min-width="30px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.host }}</span>
                                <router-link :to="'/asset/index?task_name='+row.task_name">
                                    <el-button type="text" size="mini" class="operation-btn">{{ row.domain }}</el-button>
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口" min-width="15px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.port }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="服务" min-width="18px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="应用" min-width="25px" align="center">
                            <template slot-scope="{row}"><span>{{ row.product }}</span></template>
                        </el-table-column>
                        <el-table-column label="版本" min-width="40px" align="center">
                            <template slot-scope="{row}"><span>{{ row.version }}</span></template>
                        </el-table-column>
                        <el-table-column label="Title" min-width="20px" align="center">
                            <template slot-scope="{row}">
                                <span :v-if="row.script['http-title']">{{ row.script['http-title'] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="Header" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span v-if="row.script['http-server-header']">{{ row.script['http-server-header'] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="CPE" min-width="30px" align="center">
                            <template slot-scope="{row}"><span>{{ row.cpe }}</span></template>
                        </el-table-column>
                        <el-table-column label="其他" min-width="40px" align="center">
                            <template slot-scope="{row}"><span>{{ row.extrainfo }}</span></template>
                        </el-table-column>
                        <el-table-column label="Operation" align="center" width="180" class-name="small-padding fixed-width">
                            <template slot-scope="{row,$index}">
                                <el-button type="primary" size="mini" class="operation-btn" @click="portDetail($index,1)">预览</el-button>
                                <el-button type="danger" size="mini" @click="handleDelete(row,$index)" disabled>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
           </div>
           <div class="info-content">
                <!--弹出框-->
                <el-dialog title="指纹信息" :visible.sync="mark_dialog">
                    <p>{{mark_dialogdata}}</p>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="mark_dialog = false">关 闭</el-button>
                    </span>
                </el-dialog>
                <button class="pan-btn blue-btn" @click="pannel3=!pannel3">信息变更</button>
                <el-form ref="form" v-if="pannel3" :model="form" label-width="80px" size="mini">
                    <el-form-item></el-form-item>
                    <!--IP解析变更记录-->
                    <el-form-item label="" style="text-align: center">
                        <el-tag v-if="form.ip_changed" effect="dark" type="warning">IP解析变更记录</el-tag>
                    </el-form-item>
                    <el-table v-if="form.ip_changed" :key="tableKey1" :data="form.ip_changed" border fit highlight-current-row style="width: 100%;">
                        <el-table-column label="主机" min-width="30px" align="center">
                            <template >
                                <span>{{ form.target }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="当前IP" min-width="15px" align="center">
                            <template>
                                <span>{{ form.ip }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="历史IP" min-width="25px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row[0] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="站点标题" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row[1] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口信息" min-width="20px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row[2] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="变更时间" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row[3] }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--站点标题变更记录-->
                    <el-form-item></el-form-item>
                    <el-form-item label="" style="text-align: center">
                        <el-tag v-if="form.title_changed" effect="dark" type="warning">站点标题变更记录</el-tag>
                    </el-form-item>
                    <el-table v-if="form.title_changed" :key="tableKey2" :data="form.title_changed" border fit highlight-current-row style="width: 100%;">
                        <el-table-column label="主机" min-width="30px" align="center">
                            <template >
                                <span>{{ form.target }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="IP地址" min-width="15px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row[0] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="当前标题" min-width="25px" align="center">
                            <template>
                                <span>{{ form.title }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="历史标题" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row[1] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口信息" min-width="20px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row[2] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="变更时间" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row[3] }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--端口变更记录2-->
                    <el-form-item></el-form-item>
                    <el-form-item label="" style="text-align: center">
                        <el-tag v-if="form.port_info_2" effect="dark" type="warning">端口变更记录 ②</el-tag>
                    </el-form-item>
                    <el-table v-if="form.port_info_2" :key="tableKey3" :data="form.port_info_2" border fit highlight-current-row style="width: 100%;">
                        <el-table-column label="主机" min-width="30px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.host }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口" min-width="15px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.port }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="服务" min-width="25px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="应用" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.product }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="版本" min-width="20px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.version }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="Title" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.script['http-title'] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="Header" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.script['http-server-header'] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="CPE" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.cpe }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="其它" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.extrainfo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="指纹" align="center" width="180" class-name="small-padding fixed-width">
                            <template slot-scope="{row,$index}">
                                <el-button type="primary" size="mini" class="operation-btn" @click="portDetail($index,2)">预览</el-button>
                                <el-button type="danger" size="mini" @click="handleDelete(row,$index)" disabled>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--端口变更记录2-->
                    <el-form-item></el-form-item>
                    <el-form-item label="" style="text-align: center">
                        <el-tag v-if="form.port_info_3" effect="dark" type="warning">端口变更记录 ③</el-tag>
                    </el-form-item>
                    <el-table v-if="form.port_info_3" :key="tableKey4" :data="form.port_info_3" border fit highlight-current-row style="width: 100%;">
                        <el-table-column label="主机" min-width="30px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.host }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口" min-width="15px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.port }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="服务" min-width="25px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="应用" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.product }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="版本" min-width="20px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.version }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="Title" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.script['http-title'] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="Header" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.script['http-server-header'] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="CPE" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.cpe }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="其它" min-width="40px" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.extrainfo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="指纹" align="center" width="180" class-name="small-padding fixed-width">
                            <template slot-scope="{row,$index}">
                                <el-button type="primary" size="mini" class="operation-btn" @click="portDetail($index,3)">预览</el-button>
                                <el-button type="danger" size="mini" @click="handleDelete(row,$index)" disabled>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
           </div>
      </div>
  </div>
</template>

<script>
import { InfoDetail } from "@/api/asset";
import waves from "@/directive/waves"; // waves directive

export default {
    name: "asset_info",
    directives: { waves },
    data() {
      return {
        pannel1: true,
        pannel2: true,
        pannel3: true,
        pannel4: true,
        tableKey: 0,
        tableKey1: 1,
        tableKey2: 2,
        tableKey3: 3,
        tableKey4: 4,
        page_type: 1, //1为创建资产,2为资产详情
        beaty: [],
        port_dialog: false,
        port_dialogdata: {},
        mark_dialog: false,
        mark_dialogdata:{},
        form: {
            domain: "www.lefeng.com", 
            scan_node: "Mars", 
            ip: "", 
            cdn: "", 
            extrabanner: "", 
            port_info: [], 
            task_type: "web", 
            title: "", 
            waf: "UnDetect", 
            asset_cus_id: "5eb3a3627a25ee49ed21ec40", 
            state: "", 
            asset_cus_name: "\u552f\u54c1\u4f1aSRC", 
            ip_info: "", 
            hash: "d542e15db3ac3e28b6f388436588011b", 
            site_info: "", 
            asset_name: "lefeng.com", 
            httpserver: "", 
            banner: "", 
            scan_times: 1, 
            asset_task_id: "5eb3a4687a25ee49ed21ec96", 
            updatetime: "2020-05-07 14:22:14", 
            target: "http://www.lefeng.com", 
            os: "", 
            cdn_cname: "", 
            xpb: "", 
            _id: '5eb3a916671f0222f770b439', 
            cms: "", 
            ports: [],
            ip_changed:[],
            title_changed:[],
        },
      };
    },
    created(){
        let id = this.$route.query.server_id
        if (id) {
            this.page_type = 2
            this.getDetail(id)
        }else{ //创建POC任务
            
        }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      portDetail(index, flag){
            this.port_dialog = true
            if (flag==1){
                this.port_dialogdata = this.form.port_info[index]
            }else if(flag==2){
                console.log(index,flag)
                console.log(this.form)
                this.port_dialogdata = this.form.port_info_2[index]
                
            }else{
                this.port_dialogdata = this.form.port_info_3[index]
            }
          
      },
      getDetail(id) {
        let query = { server_id: id }
        InfoDetail(query).then((response) => {
            let resp = response.data
            this.beaty =[resp.banner,resp.httpserver, resp.os, resp.cdn, resp.waf, resp.cdn_cname, resp.xpb, resp.cms]
            let temp_ipchanged = []
            if (resp.ip_changed){
                for (let i=0;i<resp.ip_changed.length;i++){
                    let temp = resp.ip_changed[i].split('||')
                    temp_ipchanged.push(temp)
                }
            }
            let temp_titlechanged = []
            if (resp.title_changed){
                for (let i=0;i<resp.title_changed.length;i++){
                    let temp = resp.title_changed[i].split('||')
                    temp_titlechanged.push(temp)
                }
            }
            this.form = resp
            this.form.ip_changed = temp_ipchanged
            this.form.title_changed = temp_titlechanged
            setTimeout(() => { this.isLoading = false; }, 1.5 * 1000);
        });
    },
    }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
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
   padding: 2%;
   background-color:#fff; 
}
.info-content{
    margin-top: 1%;
}
</style>