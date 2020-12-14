<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.info" placeholder="asset_id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
    </div>

    <el-dialog title="服务详情" :visible.sync="dialog" width="80%">
        <pre overflow="hidden">{{dialogData}}</pre>
    </el-dialog>
    
    <el-checkbox-group v-model="listQuery.history">
      <el-checkbox label="显示历史" :true-label="1" :false-label="0"></el-checkbox>
    </el-checkbox-group>

    <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
    :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'plugin_date', order: 'descending'}">
      <el-table-column label="Product" width="150px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.product">{{ row.product }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" width="150px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.name">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Port" width="90px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Version" width="90px" align="center">
        <template slot-scope="{row}">
          <el-tag effect="dark" type="warning" v-if="row.version">{{ row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="State" width="90px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="隶属资产" width="200px" align="center" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.instance_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测结果" width="200px" align="center">
        <template slot-scope="{row}">
          <el-tag type="danger" style="width: 40px">{{row.vul_high}}</el-tag>
          <el-tag type="warning" style="width: 40px">{{row.vul_medium}}</el-tag>
          <el-tag type="" style="width: 40px">{{row.vul_low}}</el-tag>
          <el-tag type="info" style="width: 40px">{{row.vul_info}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Web指纹" min-width="40px" align="center" prop="plugin_date" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span v-if="row.web_fingerprint==='{}'">{{ row.web_fingerprint }}</span>
          <span v-else>{{ row.web_fingerprint }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" class="operation-btn" @click="handleDialog(row)">详情</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { PortInfoList } from "@/api/instance"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
  name: "service_list",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      fileList: [],
      param: "",
      list: [
        {
            _id: "5f84103054c3a2632ad61f9e",
            plugin_app: "Zabbix",
            plugin_author: "jeffzhang",
            plugin_date: "2017-08-26",
            plugin_filename: "_190528_Zabbix_303_SQL_Injection.py",
            plugin_name: "Zabbix SQl 注入漏洞 PoC",
            plugin_type: "SQL Injection",
            plugin_version: "3.0.3"
        }
      ],
      dialog: false,
      upload: false,
      dialogData: {},
      total: 0,
      listLoading: false,
      listQuery: {page: 1, limit: 20, info: "", history: 0}, //页码、条数、查询字段
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
      PortInfoList(this.listQuery).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        setTimeout(() => { this.listLoading = false; }, 1.5 * 1000);
      });
    },
    // 关键词查询
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 删除记录
    handleDelete(row, index) {
      console.log(row,index)
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // let deleteQuery = { id: row._id };
        // DelPlugin(deleteQuery).then((response) => {
        //   this.$notify({ title: "Success", message: "Delete Successfully" + response.data.errmsg, type: "success", duration: 3000, });
        //   this.list.splice(index, 1);
        // });
      }).catch(() => {
        this.$notify({title: "Failed", message: "Failed Delete Plugin.", type: "danger", duration: 5000});
      });
    },
    handleDialog(row){
        this.dialogData = row
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