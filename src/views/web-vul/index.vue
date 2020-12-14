<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.info" placeholder="TaskID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
    </div>
    <!--弹出组件-->
    <el-dialog title="检出详情" :visible.sync="dialog" width="60%">
      <pre overflow="hidden">{{dialogData}}</pre>
    </el-dialog>

    <el-dialog title="导出报告" :visible.sync="updldialog" width="30%">
      <el-form ref="dataForm" :model="reportDialog" label-position="left" label-width="120px" size="mini" style="width: 400px; margin-left:50px;">
          <el-form-item class="dl-panel">
              <el-link :href=reportDialog.html_url target="_blank" icon="el-icon-link" type="success" class="dl-a">HTML</el-link>
              <el-link :href=reportDialog.pdf_url target="_blank" type="primary" class="dl-a"><svg-icon icon-class="pdf" /> PDF</el-link>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updldialog = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
     :data="list" border fit highlight-current-row style="width: 100%;"  :default-sort = "{prop: 'start_date', order: 'descending'}">
      <!-- <el-table-column label="ID" prop="id" align="center" min-width="55px">
        <template slot-scope="{row}">
          <span>{{ row.scan_id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="目标" min-width="40px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扫描类型" min-width="30px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.profile_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扫描状态" min-width="30px" align="center">
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
      <el-table-column label="检测结果" width="200px" align="center">
        <template slot-scope="{row}">
          <el-tag type="danger" style="width: 40px">{{row.vul_high}}</el-tag>
          <el-tag type="warning" style="width: 40px">{{row.vul_medium}}</el-tag>
          <el-tag type="" style="width: 40px">{{row.vul_low}}</el-tag>
          <el-tag type="info" style="width: 40px">{{row.vul_info}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="扫描日期" min-width="35px" align="center" prop="start_date" sortable>
        <template slot-scope="{row}">
          <span>{{ row.start_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细报告" min-width="30px" align="center">
        <template slot-scope="{row}">
          <el-button v-if="row.status==='completed'" plain type="success" size="mini" class="operation-btn" icon="el-icon-download" @click="openFullScreen(row)">导出报告</el-button>
          <el-button v-else plain type="info" size="mini" class="operation-btn" icon="el-icon-download" disabled>导出报告</el-button>  
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
import { DetectList, DownloadReport, DetectInfo } from "@/api/web_vul"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
  name: "authtester_detect_list",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      link: 'http://172.31.50.177/static/aquaman/download/', // /static/aquaman/download/201009_9.html
      list: [
        {
          scan_id: "6c88d599-c356-467c-b6df-adc5d378e804",
          start_date: "2019-10-30 13:39:04",
          address: "192.168.1.141",
          desc: "",
          profile_name: "Full Scan",
          status: "success",
          target_id: "6cfda3fa-d6f1-4c65-8f5f-cd522b69264f",
          vul_high: 0,
          vul_medium: 0,
          vul_low: 0,
          vul_info: 0,
        }
      ],
      dialog: false,
      dialogData: {},
      downloadDialog: {},
      updldialog: false, 
      total: 0,
      listLoading: false,
      listQuery: {page_no: 1, page_size: 20, info: ""}, //页码、条数、查询字段
      reportDialog: {},
    };
  },
  created() {
    this.listQuery.info = this.$route.query.task_id
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
      DetectInfo({scan_id: row.scan_id}).then((response) => {
        this.dialogData = response.data
        this.dialog = true
      }).catch(() => {
        this.$notify({title: "Failed", message: "Failed Get Detail", type: "danger", duration: 5000});
      });
    },
    openFullScreen(row){
        const loading = this.$loading({lock: true, text: 'Loading', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
        let query = {'scan_id': row.scan_id} 
        // 调API接口
        DownloadReport(query).then((response)=>{
            this.reportDialog = {
                html_url: this.link + response.data.html_url,
                pdf_url: this.link + response.data.pdf_url
            }
            console.log(this.reportDialog)
            loading.close()
            this.updldialog = true
        }).catch(() => {
        this.$notify({ title: "Unknow Error", message: "Can't Receive Data From Server.", type: "danger", duration: 5000,})
            loading.close();
        })
    },
  },
};
</script>

<style>
.operation-btn {
  margin-right: 10px;
}
.dl-a{
    display:inline-block; width:33%; margin-right: 10%;
}
pre{
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>