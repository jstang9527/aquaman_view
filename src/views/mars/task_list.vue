<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.info" placeholder="TaskName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <router-link :to="'/mars/task_create'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">Add</el-button>
      </router-link>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名" min-width="40px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="targets" min-width="150px" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="(item,index) in row.task_targets" :key="index" type="success" effect="plain" style="margin-right:10px;margin-top:2px">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="40px" align="center">
        <template slot-scope="{row}">
          <i v-if="row.task_status==0" class="el-icon-watch" style="margin-left:2%"></i>
          <i v-else-if="row.task_status==1" class="el-icon-loading" style="margin-left:2%"></i>
          <i v-else class="el-icon-check" style="margin-left:2%"></i>
          <span>{{ row.task_status|loadTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检测结果" min-width="70px" align="center">
        <template slot-scope="{row}">
          <el-rate disabled v-model="row.task_result" :colors="colors" show-text :texts="['低危','中危','中危','高危','高危']"></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="检测报告" min-width="50px" align="center">
        <template slot-scope="{row}">
          <router-link :to="'/mars/report?id='+row.id">
            <el-button type="success" size="mini" class="operation-btn">
              Report
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="Operation" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/mars/task_update?id='+row.id">
            <el-button type="primary" size="mini" class="operation-btn">edit</el-button>
          </router-link>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)" disabled>delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { taskList } from "@/api/mars"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const StatusOptions = [
  { key: "0", display_name: "Pending" },
  { key: "1", display_name: "Schedule" },
  { key: "2", display_name: "Finished" },
];

const loadTypeKeyValue = StatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "task_list",
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
      colors: ['#00FA9A', '#F7BA2A', '#FF4500'],
      list: [
        {
          id: "123",
          task_name: "tidesec.com",
          task_status: 9, //pending、finished
          task_result: 9, //安全、低危、高危(1,3,5)
          task_targets: ["tidesec.com", "cdn.tidesec.com"],
        },
        {
          id: "124",
          task_name: "zan71.com",
          task_status: 9, //pending、finished、
          task_result: 9,
          task_targets: ["zan71.com", "cdn.zan71.com"],
        },
        {
          id: "125",
          task_name: "iqiyi.com",
          task_status: 9, //pending、finished、
          task_result: 9,
          task_targets: ["iqiyi.com", "cdn.iqiyi.com"],
        },
      ],
      total: 0,
      listLoading: false,
      listQuery: {
        page_no: 1, page_size: 20, info: "",
      }, //页码、条数、查询字段
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.list = []
      this.listLoading = true;
      taskList(this.listQuery).then((response) => {
        console.log(response.data)
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
      this.$confirm("此操作将删除该记录, 已被组装上的流水线不会因此受影响, 是否继续?", "提示", {
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
  },
};
</script>

<style>
.operation-btn {
  margin-right: 10px;
}
</style>