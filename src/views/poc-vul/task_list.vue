<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.info" placeholder="任务名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <router-link :to="'/poc_vul/task_create'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">Add</el-button>
      </router-link>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="arrayDel">批量删除</el-button>
    </div>
    <!--弹出框-->
    <el-dialog title="任务详情" :visible.sync="dialog" width="40%">
      <pre overflow="hidden">{{dialogData}}</pre>
    </el-dialog>

    <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
    :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'update_at', order: 'descending'}" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="35px"></el-table-column>
      <el-table-column label="任务名称" min-width="30px" align="center">
        <template slot-scope="{row}">
          <router-link :to="'/poc_vul/index?task_name='+row.task_name">
            <el-button type="text" size="mini" class="operation-btn">{{ row.task_name }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="任务目标" min-width="60px" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="(item,index) in row.target_list" :key="index" type="info" effect="plain" style="margin-right:10px;margin-top:2px">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="隶属端口ID" min-width="30px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.portinfo_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扫描周期" min-width="15px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.recursion|loadTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" min-width="20px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.status=='Completed'" effect="dark" type="success">
            <i  class="el-icon-finished"  style="margin-left:2%">{{ row.status }}</i>
          </el-tag>
          <el-tag v-else>
            <i  class="el-icon-loading" style="margin-left:2%" >{{ row.status }}</i>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="扫描日期" min-width="30px" align="center" prop="update_at" sortable>
        <template slot-scope="{row}">
          <span>{{ row.update_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" width="150" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link">选项卡<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button type="text" @click="handleDialog(row)">详情</el-button></el-dropdown-item>
              <el-dropdown-item>
                <router-link :to="'/poc_vul/task_edit?id='+row._id">
                  <el-button type="text" class="operation-btn">编辑</el-button>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" @click="handleRescan(row)">重扫</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" @click="handleDelete(row,$index)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { TaskList, DelTask, TaskRescan } from "@/api/poc_vul"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const TypeOptions = [
  { key: "0", display_name: "一次" },
  { key: "1", display_name: "每天" },
  { key: "7", display_name: "每周" },
  { key: "30", display_name: "每月" },
];

const loadTypeKeyValue = TypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "pocvul_tasks",
  components: { Pagination },
  directives: { waves },
  filters: {
    loadTypeFilter(type) {return loadTypeKeyValue[type]}
  },
  data() {
    return {
        tableKey: 0,
        list: [],
        dialog: false,
        dialogData: {},
        total: 0,
        listLoading: false,
        listQuery: {page_no: 1, page_size: 20, info: ""},
        multipleSelection: []
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
        let deleteQuery = { id: _id };
        DelTask(deleteQuery).then(() => {}).catch(() => {
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
      this.listQuery.page_no = 1;
      this.getList();
    },
    // 删除记录
    handleDelete(row, index) {
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定", cancelButtonText: "取消", type: "warning",
      }).then(() => {
        DelTask({ id: row._id }).then((response) => {
          this.$notify({ title: "Success", message: "Delete Successfully" + response.errmsg, type: "success", duration: 3000 });
          this.list.splice(index, 1);
        }).catch(()=>{
          this.$notify({ title: "Failed", message: "Delete Failed", type: "danger", duration: 5000 });
        })
      })
    },
    // 弹出任务详情
    handleDialog(row){
        this.dialogData = row
        this.dialog = true
    },
    // 立即重扫
    handleRescan(row){
      let query = {id: row._id}
      TaskRescan(query).then(() =>{
        this.$notify({ title: "Success", message: "Rescan Successfully", type: "info", duration: 5000 });
        this.getList()
      }).catch(()=>{this.$notify({ title: "Failed", message: "Rescan Task Failed", type: "danger", duration: 5000 });})
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
</style>