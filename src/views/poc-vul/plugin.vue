<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.info" placeholder="Target" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-upload" @click="uploadBtn">上传插件</el-button>
    </div>

    <el-dialog title="上传插件" :visible.sync="upload" width="40%">
        
      <el-form ref="dataForm" label-position="left" label-width="120px" size="mini" style="width: 600px; margin-left:50px;">
          <el-form-item>
              <!-- <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple> -->
              <el-upload class="upload-demo" 
                  :http-request="uploadPlugin" drag multiple
                  action="" ref="upload"
                  :auto-upload="true"
                  :limit=1
                  :on-change="onchange"
                  :on-remove="onremove"
                  :file-list="fileList">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传.py文件, 且不超过500kb文件</div>
              </el-upload>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upload = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="插件详情" :visible.sync="dialog" width="80%">
        <pre overflow="hidden">{{dialogData}}</pre>
    </el-dialog>

    <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
    :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'plugin_date', order: 'descending'}">
      <el-table-column label="POC名称" min-width="40px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.plugin_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="POC类型" min-width="30px" align="center">
        <template slot-scope="{row}">
          <span><el-tag effect="dark" type="warning">{{ row.plugin_type }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="受影响应用" min-width="20px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.plugin_app }}</span>
        </template>
      </el-table-column>
      <el-table-column label="受影响版本" min-width="40px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.plugin_version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="100px" align="center" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.plugin_desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发现时间" min-width="40px" align="center" prop="plugin_date" sortable>
        <template slot-scope="{row}">
          <span>{{ row.plugin_date }}</span>
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
import { PluginList, AddPlugin, DelPlugin } from "@/api/poc_vul"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
  name: "pocvul_plugin_list",
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
      listQuery: {page_no: 1, page_size: 20, info: ""}, //页码、条数、查询字段
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
      PluginList(this.listQuery).then((response) => {
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
      console.log(index)
      this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let deleteQuery = { id: row._id };
        DelPlugin(deleteQuery).then((response) => {
          this.$notify({ title: "Success", message: "Delete Successfully" + response.data.errmsg, type: "success", duration: 3000, });
          this.list.splice(index, 1);
        });
      }).catch(() => {
        this.$notify({title: "Failed", message: "Failed Delete Plugin.", type: "danger", duration: 5000});
      });
    },
    handleDialog(row){
        this.dialogData = row
        this.dialog = true
    },
    uploadBtn(){
        this.upload = !this.upload
        this.fileList = []
    },
    uploadPlugin(param){
        const formData = new FormData()
        formData.append('file', param.file)
        AddPlugin(formData).then((response) => {
            this.$notify({title: "Success", message: "上传成功"+ response.errmsg, type: "success", duration: 5000});
            param.onSuccess()
        }).catch((response) => {
            this.$notify({title: "Failed", message: response.errmsg, type: "danger", duration: 5000});
            param.onError()
        })
    },
    onchange(file){
        this.param = new FormData();
        this.param.append('file', file.raw, file.name)
        this.fileList = [{name: file.name, url: file.url}]
    },
    onremove(file){
      console.log(file)
      console.log(this.fileList)
      this.param.delete('file')
    }
  },
};
</script>

<style>
.operation-btn {
  margin-right: 10px;
}
</style>