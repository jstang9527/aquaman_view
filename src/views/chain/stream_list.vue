<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.info" placeholder="StreamName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <router-link :to="'/chain/build_stream'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">新建流水</el-button>
      </router-link>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="StreamName" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stream_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="StreamDesc" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stream_desc }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Webhook (是给Jenkins进行调用的自动化测试接口)" min-width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{row.api}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Operation" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/redirect/404'">
            <el-button type="primary" size="mini" class="operation-btn" disabled>edit</el-button>
          </router-link>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)" disabled>delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { StreamList } from "@/api/chain"

const loadTypeOptions = [
  { key: "1", display_name: "Low" },
  { key: "2", display_name: "Nomal" },
  { key: "3", display_name: "High" },
];

const loadTypeKeyValue = loadTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "service_list",
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
      list: [
        {
          id: "123",
          stream_name: "temp",
          stream_desc: "占位测试",
          api: "http://172.31.50.254:8880/chain/stream/test/id=123&host=xxxx"
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
      this.listLoading = true;
      StreamList(this.listQuery).then((response) => {
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
      this.$confirm("此操作将删除该流水线, 是否继续?", "提示", {
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