<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.info" placeholder="Target" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
    </div>

    <el-dialog title="检出详情" :visible.sync="dialog" width="60%">
        <pre overflow="hidden">{{dialogData}}</pre>
        poc_content:
        <textarea v-model="poc_content" :rows="20" style="width:100%"></textarea>
    </el-dialog>
    <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
    :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column label="漏洞名称" min-width="40px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.plugin_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标" min-width="30px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.target }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标应用" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.plugin_app }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用版本" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.plugin_version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="POC类型" min-width="30px" align="center">
        <template slot-scope="{row}">
          <span><el-tag effect="dark" type="warning">{{ row.plugin_type }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="所属任务" min-width="30px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测日期" width="160px" align="center" prop="date" sortable>
        <template slot-scope="{row}">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" class="operation-btn" @click="handleDialog(row)">详情</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { DetectList } from "@/api/poc_vul"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
  name: "poc_detect_list",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [
        {
          task_id: '5db92996671f024d11bc81fb', 
          scan_result: "{'VerifyInfo': {'URL': u'http://192.168.1.25', 'URL1': u'http://192.168.1.25/www.zip', 'URL2': u'http://192.168.1.25/phpinfo.php'}}", 
          hash: "239efcd533d25919daa3d1d5949df773", 
          target: "http://192.168.1.25", 
          plugin_version: "all", 
          plugin_filename: "/root/Mars/instance/../mars/views/modules/scanner/pocsuite_plugin/_190528_Info_disclosure.py", 
          plugin_name: "scan Information Disclosure", 
          tag: "", 
          task_name: "191030_weakfile", 
          plugin_app: "all", 
          date: "2019-10-30 14:11:35", 
          plugin_id: '5cec986230ccce1e87137d23', 
          _id: '5db92997671f025ccebc8201', 
          plugin_type: "Information Disclosure"
        }
      ],
      dialog: false,
      dialogData: {},
      poc_content: '',
      total: 0,
      listLoading: false,
      listQuery: {page_no: 1, page_size: 20, info: ""},
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
      DetectList(this.listQuery).then((response) => {
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
    handleDialog(row){
        this.poc_content = row.poc_content
        this.dialogData = {
            "_id": row._id, // "5fc363fce7385b5d4338992b",
            "date": row.date, //"2020-11-29 17:03:56",
            "plugin_app": row.plugin_app, //"JBoss",
            "plugin_desc": row.plugin_desc, //"JBOSSAS 5.x/6.x 反序列化命令执行漏洞(CVE-2017-12149)",
            "plugin_filename": row.plugin_filename, //"JBoss_171122_CVE_2017_12149_RCE.py",
            "plugin_id": row.plugin_id, //"5fc25ad274c4373e973b8efb",
            "plugin_name": row.plugin_name, //"JBoss 5.x/6.x RCE",
            "plugin_type": row.plugin_type, //"RCE",
            "plugin_version": row.plugin_version, //"5.x/6.x",
            "scan_result": row.scan_result, //"{'VerifyInfo': {'URL': u'http://172.31.50.252:8080', 'Command': 'id', 'Result': 'uid=0(root) gid=0(root) groups=0(root)\\n'}}",
            "target": row.target, //"172.31.50.252:8080",
            "task_id": row.task_id, //"5fc361754e23ac6cf4389926",
            "task_name": row.task_name, //"201129s8yz_252"
        }
        this.dialog = true
    },
  },
};
</script>

<style>
.operation-btn {
  margin-right: 10px;
}
pre { 
  white-space: pre-wrap; /*css-3*/ 
  white-space: -moz-pre-wrap; /*Mozilla,since1999*/ 
  white-space: -pre-wrap; /*Opera4-6*/ 
  white-space: -o-pre-wrap; /*Opera7*/ 
  word-wrap: break-word; /*InternetExplorer5.5+*/ 
}
</style>