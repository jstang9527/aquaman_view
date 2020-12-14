<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.info" placeholder="Target" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
        </div>

        <el-dialog title="资产预览" :visible.sync="dialog" width="60%">
            <el-form ref="dataForm" :model="dialogData" label-position="left" label-width="120px" size="mini" style="width: 1000px; margin-left:50px;">
                <el-form-item label="_id"> <el-tag >{{dialogData._id}}</el-tag> </el-form-item>
                <el-form-item label="domain"> <el-tag >{{dialogData.domain}}</el-tag> </el-form-item>
                <el-form-item label="IP地址"> <el-tag >{{dialogData.ip}}</el-tag> </el-form-item>
                <el-form-item label="CDN信息"> <el-tag >{{dialogData.cdn}}</el-tag> </el-form-item>
                <el-form-item label="extrabanner"> <el-tag >{{dialogData.extrabanner}}</el-tag> </el-form-item>
                <el-form-item label="任务类型"> <el-tag >{{dialogData.task_type}}</el-tag> </el-form-item>
                <el-form-item label="站点标题"> <el-tag >{{dialogData.title}}</el-tag> </el-form-item>
                <el-form-item label="WAF信息"> <el-tag >{{dialogData.waf}}</el-tag> </el-form-item>
                <el-form-item label="业务组ID"> <el-tag >{{dialogData.asset_cus_id}}</el-tag> </el-form-item>
                <el-form-item label="state"> <el-tag >{{dialogData.state}}</el-tag> </el-form-item>
                <el-form-item label="业务组"> <el-tag >{{dialogData.asset_cus_name}}</el-tag> </el-form-item>
                <el-form-item label="IP信息"> <el-tag >{{dialogData.ip_info}}</el-tag> </el-form-item>
                <el-form-item label="hash"> <el-tag >{{dialogData.hash}}</el-tag> </el-form-item>
                <el-form-item label="站点指纹"> <el-input type="textarea" :rows="8" placeholder="null" v-model="dialogData.site_info" disabled></el-input> </el-form-item>
                <el-form-item label="资产名"> <el-tag >{{dialogData.asset_name}}</el-tag> </el-form-item>
                <el-form-item label="Web应用"> <el-tag >{{dialogData.httpserver}}</el-tag> </el-form-item>
                <el-form-item label="banner"> <el-tag >{{dialogData.banner}}</el-tag> </el-form-item>
                <el-form-item label="scan_times"> <el-tag >{{dialogData.scan_times}}</el-tag> </el-form-item>
                <el-form-item label="asset_task_id"> <el-tag >{{dialogData.asset_task_id}}</el-tag> </el-form-item>
                <el-form-item label="updatetime"> <el-tag >{{dialogData.updatetime}}</el-tag> </el-form-item>
                <el-form-item label="target"> <el-tag >{{dialogData.target}}</el-tag> </el-form-item>
                <el-form-item label="操作系统"> <el-tag >{{dialogData.os}}</el-tag> </el-form-item>
                <el-form-item label="cdn_cname"> <el-tag >{{dialogData.cdn_cname}}</el-tag> </el-form-item>
                <el-form-item label="xpb"> <el-tag >{{dialogData.xpb}}</el-tag> </el-form-item>
                <el-form-item label="cms"> <el-tag >{{dialogData.cms}}</el-tag> </el-form-item>
                <el-form-item label="ports"> <el-tag >{{dialogData.ports}}</el-tag> </el-form-item>
                <el-form-item label="端口信息"> 
                    <p v-for="(info, index) in dialogData.port_info" :key="index">
                        {{info}}
                    </p>
                </el-form-item>
                <el-form-item label="scan_node"> <el-tag >{{dialogData.scan_node}}</el-tag> </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog = false">关 闭</el-button>
            </span>
        </el-dialog>

        <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="list" border fit highlight-current-row style="width: 100%;">
            <el-table-column label="资产" min-width="30px" align="center">
                <template slot-scope="{row}">
                    <router-link :to="'/asset/info?server_id='+row._id">
                        <el-button type="text" size="mini" class="operation-btn">{{ row.domain }}</el-button>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="标题" min-width="40px" align="center">
                <template slot-scope="{row}">
                <span>{{ row.banner }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="15px" align="center">
                <template slot-scope="{row}">
                    <el-tag v-if="row.state<200" type="info">Null</el-tag>
                    <el-tag v-else-if="row.state<300" type="success">{{ row.state }}</el-tag>
                    <el-tag v-else-if="row.state<500" type="warning">{{ row.state }}</el-tag>
                    <el-tag v-else type="danger">{{ row.state }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="IP地址" min-width="25px" align="center">
                <template slot-scope="{row}"><span>{{ row.ip }}</span></template>
            </el-table-column>
            <el-table-column label="端口" min-width="40px" align="center">
                <template slot-scope="{row}"><span>{{ row.ports }}</span></template>
            </el-table-column>
            <el-table-column label="地区" min-width="20px" align="center">
                <template slot-scope="{row}"><span>{{ row.ip_info[0].area }}</span></template>
            </el-table-column>
            <el-table-column label="操作系统" min-width="40px" align="center">
                <template slot-scope="{row}"><span>{{ row.os }}</span></template>
            </el-table-column>
            <el-table-column label="扫描时间" min-width="30px" align="center">
                <template slot-scope="{row}"><span>{{ row.updatetime }}</span></template>
            </el-table-column>
            <el-table-column label="变更" min-width="10px" align="center">
                <template slot-scope="{row}"><span v-if="row.info_changed==1"><i class="el-icon-star-on" style="color: red"/></span></template>
            </el-table-column>
            <el-table-column label="Operation" align="center" width="180" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                <el-button type="primary" size="mini" class="operation-btn" @click="handleDialog($index)">预览</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(row,$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>
</template>

<script>
import { InfoList } from "@/api/asset"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
  name: "assetinfo_list",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [
        {
            domain: "www.lefeng.com", 
            scan_node: "Mars", 
            ip: "", 
            cdn: "", 
            extrabanner: "", 
            port_info: "", 
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
            ports: ""
        }
      ],
      dialog: false,
      dialogData: {},
      total: 0,
      listLoading: false,
      listQuery: {page_no: 1, page_size: 20, info: ""}, //页码、条数、查询字段
    };
  },
  created() {
    let task_name = this.$route.query.task_name
    this.listQuery.info = task_name
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.list = []
      this.listLoading = true;
      InfoList(this.listQuery).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        setTimeout(() => { this.listLoading = false; }, 1.5 * 1000);
      });
    },
    // 关键词查询
    handleFilter() {
      this.listQuery.page_no = 1;
      this.getList();
    },
    // 删除记录
    handleDelete(row, index) {
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log(row, index)
        // let deleteQuery = { id: row.id };
        // serviceDelete(deleteQuery).then((response) => {
        //   this.$notify({ title: "Success", message: "Delete Successfully" + response.data.errmsg, type: "success", duration: 3000, });
        //   this.list.splice(index, 1);
        // });
        this.$notify({
          title: "Success", message: "接口未实现", type: "success", duration: 5000,
        });
      }).catch(() => {
        this.$notify({
          title: "Cancel", message: "Delete Cancel", type: "info", duration: 5000,
        });
      });
    },
    handleDialog(index){
        this.dialogData = this.list[index]
        this.dialog = true
    },
  },
};
</script>

<style>
.operation-btn {
  margin-right: 10px;
}
</style>