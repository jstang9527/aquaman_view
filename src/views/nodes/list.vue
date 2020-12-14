<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>选项卡</span>
        </div>
        <div style="margin-bottom:50px;">
          <el-col :span="4" class="text-center">
            <button class="pan-btn blue-btn" v-on:click="showPanal('1')">主机列表</button>
          </el-col>
          <el-col :span="4" class="text-center">
            <button class="pan-btn light-blue-btn" v-on:click="showPanal('2')" disabled="true">威胁总览</button>
          </el-col>
          <el-col :span="4" class="text-center">
            <el-badge :value="12">
              <button class="pan-btn pink-btn" v-on:click="showPanal('3')" disabled>告警列表</button>
            </el-badge>
          </el-col>
          <el-col :span="4" class="text-center">
            <button class="pan-btn green-btn" v-on:click="showPanal('4')" disabled>实时监控</button>
          </el-col>
          <el-col :span="4" class="text-center">
            <button class="pan-btn tiffany-btn" v-on:click="showPanal('5')" disabled>系统配置</button>
          </el-col>
          <el-col :span="4" class="text-center">
            <button class="pan-btn yellow-btn" v-on:click="showPanal('6')" disabled>错误日志</button>
          </el-col>
        </div>
      </el-card>
    </el-row>

    <!-- <div ><h1>主机列表-table组件</h1></div>-->
    <div class="app-container" v-if="datas.curOperation==='1'">
      <div class="filter-container">
        <el-input v-model="listQuery.info" placeholder="主机名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
        <router-link :to="'/nodes/domain_add'">
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">Add</el-button>
        </router-link>
      </div>
      <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="list" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="ID" prop="id" align="center" width="60">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="域" align="center" min-width="90px">
          <template slot-scope="{row}">
            <span>{{ row.domain }}</span>
          </template>
        </el-table-column>
        <el-table-column label="域IP" align="center" min-width="70px">
          <template slot-scope="{row}">
            <span>{{ row.domain_ip }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" min-width="40px">
          <template slot-scope="{row}">
            <span>{{ row.domain_type|domainTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作系统" align="center" min-width="50px">
          <template slot-scope="{row}">
            <span>{{ row.domain_os }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="域描述" min-width="150px">
          <template slot-scope="{row}">
            <span>{{ row.domain_desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="30px">
          <template slot-scope="{row}">
            <el-button v-if="row.domain_status" type="success" icon="el-icon-loading" size="mini" circle @click="refreshListStatue" :disabled="isrefesh"></el-button>
            <el-button v-else type="danger" icon="el-icon-warning-outline" size="mini" circle @click="refreshListStatue" :disabled="isrefesh"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="350" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-popconfirm confirmButtonText="确定" cancelButtonText="取消" icon="el-icon-info" iconColor="orange" title="Are you sure ???" class="operation-btn" @onConfirm="startDomain(row)">
              <el-button slot="reference" type="primary" size="mini">启动</el-button>
            </el-popconfirm>
            <el-popconfirm confirmButtonText="确定" cancelButtonText="取消" icon="el-icon-info" iconColor="red" title="Are you sure ???" class="operation-btn" @onConfirm="shutdownDomain(row)">
              <el-button slot="reference" type="info" size="mini">关机</el-button>
            </el-popconfirm>
            <el-popconfirm confirmButtonText="确定" cancelButtonText="取消" icon="el-icon-info" iconColor="red" title="Are you sure ???" class="operation-btn" @onConfirm="recoverDomain(row)">
              <el-button slot="reference" type="warning" size="mini">还原</el-button>
            </el-popconfirm>
            <el-popconfirm confirmButtonText="确定" cancelButtonText="取消" icon="el-icon-info" iconColor="red" title="Are you crazy !!!" class="operation-btn" @onConfirm="handleDelete(row,$index)">
              <!-- <el-button slot="reference" type="danger" size="mini" @click="handleDelete(row,$index)">移除</el-button> -->
              <el-button slot="reference" type="danger" size="mini">移除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <div v-if="datas.curOperation==='2'">
      <h1>威胁总览-chart+table组件</h1>
    </div>
    <div v-if="datas.curOperation==='3'">
      <h1>告警列表table组件</h1>
    </div>
    <div v-if="datas.curOperation==='4'">
      <h1>实时监控-chart+table组件</h1>
    </div>
    <div v-if="datas.curOperation==='5'">
      <h1>系统配置edit组件</h1>
    </div>
    <div v-if="datas.curOperation==='6'">
      <h1>错误日志table组件</h1>
    </div>
  </div>
</template>

<script>
import {
  domainList,
  domainStatus,
  domainDown,
  domainStart,
  domainRecover,
} from "@/api/domain";
import waves from "@/directive/waves/index.js"; // 水波纹指令

const domainTypeOptions = [
  { key: "0", display_name: "物理机" },
  { key: "1", display_name: "云主机" },
  { key: "2", display_name: "虚拟机" },
];

const domainTypeKeyValue = domainTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "nodes",
  directives: { waves },
  filters: {
    domainTypeFilter(type) {
      return domainTypeKeyValue[type];
    },
  },
  data() {
    return {
      datas: { curOperation: "1" },
      tableKey: 0,
      list: [
        {
          id: "3",
          domain: "example",
          domain_ip: "172.31.50.252",
          domain_type: 0,
          domain_os: "centos7.5",
          domain_status: false,
          host_ip: "172.31.50.254",
          host_desc: "Dell R320",
          domain_desc: "字段格式校验",
        },
      ],
      total: 1,
      listLoading: false,
      listQuery: { page_no: 1, page_size: 20, info: "" },
      step: 60,
      isrefesh: true
    };
  },
  created() {
    // 获取域列表
    this.getList();
  },
  mounted() {
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      setTimeout(() => { this.refreshListStatue(); }, 3 * 1000);
      this.timer = setInterval(() => { this.refreshListStatue(); }, this.step * 1000);
    }
  },
  methods: {
    showPanal: function (index) {
      this.datas.curOperation = index;
    },
    // 获取域列表
    getList() {
      this.listLoading = true;
      domainList(this.listQuery).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        // 会在1.5秒后隐藏loading
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    // 更新域状态
    refreshListStatue() {
      this.isrefesh = true
      setTimeout(() => { this.isrefesh = false; }, 10 * 1000);
      for (var i = 0; i < this.list.length; i++) {
        let item = this.list[i];
        let params = {
          domain: item.domain,
          host_ip: item.host_ip,
        };
        domainStatus(params).then((response) => {
          item.domain_status = response.data.isRunning;
        });
        this.list[i] = item;
      }
    },
    //查询操作,从第一页开始
    handleFilter() {
      this.listQuery.page_no = 1;
      this.getList();
    },
    // 关闭域
    shutdownDomain(row) {
      let params = { domain: row.domain, host_ip: row.host_ip };
      domainDown(params).then((response) => {
        console.log(response);
        if (response.data.errmsg == "") {
          this.$notify({
            title: "Success",
            message: "Shutdown " + params.domain,
            type: "success",
            duration: 5000,
          });
        } else {
          this.$notify({
            title: "Failed",
            message: response.data.errmsg,
            type: "warning",
            duration: 5000,
          });
        }
      });
    },
    // 开启域
    startDomain(row) {
      let params = { domain: row.domain, host_ip: row.host_ip };
      domainStart(params).then((response) => {
        console.log(response);
        if (response.data.errmsg == "") {
          this.$notify({
            title: "Success",
            message: "Start " + params.domain,
            type: "success",
            duration: 5000,
          });
        } else {
          this.$notify({
            title: "Failed",
            message: response.data.errmsg,
            type: "warning",
            duration: 5000,
          });
        }
      });
    },
    // 恢复域
    recoverDomain(row) {
      let params = { domain: row.domain, host_ip: row.host_ip };
      domainRecover(params).then((response) => {
        console.log(response);
        if (response.data.errmsg == "") {
          this.$notify({
            title: "Success",
            message: "Recover " + params.domain,
            type: "success",
            duration: 5000,
          });
        } else {
          this.$notify({
            title: "Failed",
            message: response.data.errmsg,
            type: "warning",
            duration: 5000,
          });
        }
      });
    },
    //删除表记录
    handleDelete() { },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.component-item {
  min-height: 100px;
}
.operation-btn {
  padding-inline-end: 10px;
}
</style>
