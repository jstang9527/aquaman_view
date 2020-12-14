<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.info" placeholder="TaskName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
    </div>

    <el-dialog title="检出详情" :visible.sync="dialog" width="30%">
      <pre overflow="hidden">{{dialogData}}</pre>
    </el-dialog>

    <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="250px">
        <template slot-scope="{row}">
          <span>{{ row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="隶属任务" min-width="40px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标" min-width="40px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.target }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务" width="90px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.service }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" min-width="40px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扫描日期" min-width="40px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" class="operation-btn" @click="handleDialog($index)">详情</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { DetectList, DeleteDetect } from "@/api/auth_tester"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
  name: "authtester_detect_list",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      colors: ['#00FA9A', '#F7BA2A', '#FF4500'],
      list: [
        {
          _id: "5db921f8671f024d11bc812b",
          date: "2019-10-30 13:39:04",
          password: "1qaz2wsx",
          service: "ssh",
          tag: "",
          target: "192.168.1.141",
          task_id: "5db921f2671f024d11bc8124",
          task_name: "191030_ssh_check",
          username: "root",
        }
      ],
      dialog: false,
      dialogData: {},
      total: 0,
      listLoading: false,
      listQuery: {page: 1, limit: 20, info: ""},
    };
  },
  created() {
    this.listQuery.info = this.$route.query.task_name
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
      this.listQuery.page = 1;
      this.getList();
    },
    // 删除记录
    handleDelete(row, index) {
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let deleteQuery = { id: row._id };
        DeleteDetect(deleteQuery).then((response) => {
          this.$notify({ title: "Success", message: "Delete Successfully"+response.errmsg, type: "success", duration: 3000, });
          this.list.splice(index, 1);
        }).catch(() => {this.$notify({title: "Failed", message: "Failed Delete Record", type: "danger", duration: 5000})});
      }).catch(() => {
        this.$notify({
          title: "Cancel", message: "Delete Cancel", type: "info", duration: 5000,
        });
      });
    },
    handleDialog(index){
        this.dialogData = this.list[index]
        this.dialog = true
    }
  },
};
</script>

<style>
.operation-btn {
  margin-right: 10px;
}
</style>