<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.info" placeholder="TaskName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <router-link :to="'/web_vul/task_create'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">Add</el-button>
      </router-link>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="arrayDel">批量删除</el-button>
    </div>
    <!--弹出框-->
    <el-dialog title="任务详情" :visible.sync="dialog" width="40%">
      <pre overflow="hidden">{{dialogData}}</pre>
    </el-dialog>

    <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
    :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'date', order: 'descending'}" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35px"></el-table-column>
      <el-table-column label="ID" prop="id" min-width="38px" align="center">
        <template slot-scope="{row}">
          <router-link :to="'/web_vul/index?task_id='+row._id">
              <el-button type="text" size="mini" class="operation-btn">{{ row._id }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="任务名" min-width="30px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扫描类型" min-width="25px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.scan_type|loadTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务目标" width="300px" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="(item,index) in row.target_list" :key="index" type="" effect="plain" style="margin-right:10px;margin-top:2px">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" min-width="30px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.status=='completed'" effect="dark" type="success">
            <i  class="el-icon-check"  style="margin-left:2%">{{ row.status }}</i>
          </el-tag>
          <el-tag v-else-if="row.status=='failed'" effect="dark" type="danger" style="width:96px">
            <i  class="el-icon-warning" style="margin-left:2%" >{{ row.status }}</i>
          </el-tag>
          <el-tag v-else-if="row.status=='aborted'" effect="dark" type="danger" style="width:96px">
            <i  class="el-icon-warning" style="margin-left:2%" >{{ row.status }}</i>
          </el-tag>
          <el-tag v-else>
            <i  class="el-icon-loading" style="margin-left:2%" >处理中{{ row.status }}</i>
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="检测结果" min-width="30px" align="center">
        <template>
          <el-button type="info" size="mini" class="operation-btn" icon="el-icon-download" disabled>导出报告</el-button>  
        </template>
      </el-table-column> -->
      <el-table-column label="检测时间" min-width="30px" align="center" prop="date" sortable>
        <template slot-scope="{row}">
            <span>{{row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" min-width="40px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" class="operation-btn" @click="handleDialog(row)">详情</el-button>
          <!-- <router-link :to="'/auth_tester/task_create?id='+row._id">
            <el-button type="success" size="mini" class="operation-btn">编辑</el-button>
          </router-link> -->
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { TaskList, DelTask } from "@/api/web_vul"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const TypeOptions = [
  { key: "0", display_name: "完全扫描" },
  { key: "1", display_name: "高危扫描" },
  { key: "2", display_name: "XSS检测" },
  { key: "3", display_name: "SQL注入" },
  { key: "4", display_name: "弱口令检测" },
  { key: "5", display_name: "仅用爬虫" },
];

const loadTypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "webvul",
  components: { Pagination },
  directives: { waves },
  filters: {
    loadTypeFilter(type) {
      return loadTypeKeyValue[type];
    },
  },
  data() {
    return {
      tableKey: 0,
      bug: true,
      colors: ['#F7BA2A', '#F7BA2A', '#FF4500'],
      list: [
        {
          _id: "123",
          args:"",
          date:"",
          password:["123456","admin"],
          recursion: 0,
          service: ["ssh"],
          status: "Completed",
          target_list: ["172.31.50.124","192.168.1.141"],
          task_name: "tidesec.com",
          username: ["root","admin"],
          week_count: 2,
          scan_type: "0"
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
    this.getList();
  },
  methods: {
    arrayDel(){
      if (this.multipleSelection.length<1){
        return
      }
      for(let i=0;i<this.multipleSelection.length;i++){
        let _id = this.multipleSelection[i]._id
        DelTask({ task_id: _id }).then(() => {}).catch(() => {
          this.$notify({title: "Failed", message: "Failed Delete", type: "danger", duration: 5000});
          return
        });
      }
      this.$notify({ title: "Success", message: "Delete Successfully", type: "success", duration: 3000, });
      this.getList()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {this.$refs.multipleTable.toggleRowSelection(row)});
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取列表
    getList() {
      this.list = []
      this.listLoading = true;
      TaskList(this.listQuery).then((response) => {
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
      this.$confirm("此操作将删除该记录, 已被组装上的流水线不会因此受影响, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log(row, index)
        DelTask({ task_id: row._id }).then((response) => {
          this.$notify({ title: "Success", message: "Delete Successfully" + response.data.errmsg, type: "success", duration: 3000, });
          this.list.splice(index, 1);
        });
      }).catch(() => {
        this.$notify({title: "Cancel", message: "Delete Cancel", type: "info", duration: 5000});
      });
    },
    // 弹出任务详情
    handleDialog(row){
        this.dialogData = row
        this.dialog = true
    }
  },
};
</script>

<style>
.operation-btn {
  margin-right: 10px;
}
.dialog-list{
  width: 60%;
  word-wrap:break-word; 
  word-break:break-all;  
  overflow: hidden;   
}
pre{
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>