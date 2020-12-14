<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.info" placeholder="BlockName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <router-link :to="'/chain/block'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">Add</el-button>
      </router-link>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="BlockName" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.block_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Priority" min-width="70px" align="center">
        <template slot-scope="{row}">
          <!-- <span>{{ row.priority|loadTypeFilter }}</span> -->
          <el-rate disabled :show-score="false" text-color="#ff9900" v-model="row.priority"></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="Expect" min-width="30px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.expect }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" min-width="300px" align="center">
        <template slot-scope="{row}">
          <el-tag v-for="(item,index) in row.actions" :key="index" type="success" effect="plain" style="margin-right:10px;margin-top:2px">{{ item.action_name }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Operation" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/chain/update_block?id='+row.id">
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
import { blockList, blockDetail } from "@/api/chain"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

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
          block_name: "temp",
          priority: undefined,
          expect: undefined,
          actions: [
            {
              "id": 1,
              "block_id": 1,
              "action_name": "打开登录页",
            },
            {
              "id": 2,
              "block_id": 1,
              "action_name": "输入用户名",
            },
          ]
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
    // 获取组件详情
    getBlockDetail(list, total) {
      let query = { id: 0 };
      // let item = undefined;
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        query = { id: item.id }
        blockDetail(query).then((response) => {
          let temp = {
            id: item.id,
            block_name: item.block_name,
            priority: item.priority,
            expect: item.expect,
            actions: response.data.actions
          }
          list[i] = temp
        });
      }
      setTimeout(() => { this.list = list; this.total = total }, 1 * 200);
    },
    // 获取列表
    getList() {
      this.listLoading = true;
      blockList(this.listQuery).then((response) => {
        let list = response.data.list;
        let total = response.data.total;
        this.getBlockDetail(list, total)
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