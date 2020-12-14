<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.info" placeholder="信息检索[项目名|状态]" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <span class="err-swicth">
        <el-switch v-model="listQuery.onlyerr" active-color="#13ce66" :active-value="1" :inactive-value="0"></el-switch>
        <span>只看错误/看全部</span>
      </span>
    </div>

    <el-carousel :interval="5000" type="card" height="600px">
      <el-carousel-item v-for="(index,item) in srcList" :key="item">
        <div style="text-align:center">
          <span>{{index.name}}</span>
        </div>

        <h3 class="medium">
          <el-image style="width: 100%; height: 600px" :src="index.url[0]" alt="item.name" :preview-src-list="index.url" />
        </h3>
      </el-carousel-item>
    </el-carousel>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import Axios from 'axios';


export default {
  name: "service_list",
  components: { Pagination },
  directives: { waves },
  filters: {},
  allow_err: 0,
  data() {
    return {
      tableKey: 0,
      srcList: [
        { name: "服务管理", url: ["http://172.31.50.254/imgs/2a4ee219985eb7bb624611f4e3db2d1e/3415edc8d9e06c94690ac5014a07541b.png"] },
        { name: "创建服务", url: ["http://172.31.50.254/imgs/2a4ee219985eb7bb624611f4e3db2d1e/a10fe0efecb39dcf8b799c57eb200262.png"] },
        { name: "资产管理", url: ["http://172.31.50.254/imgs/2a4ee219985eb7bb624611f4e3db2d1e/113edf4c00d6a1f7aab2ab1be1011668.png"] }
      ],
      total: 0,
      proxy_img: "http://172.31.50.254/imgs/",
      listQuery: {
        page_no: 1, page_size: 20, info: "selm2", onlyerr: 1 //1看全部
      }, //页码、条数、查询字段
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      let api = "http://172.31.50.254:9200/test/_search";
      let data = {
        "query": {
          "bool": {
            "must": { "match": { "ProjectName": this.listQuery.info } }
          }
        },
        "size": this.listQuery.page_size
      }
      if (this.listQuery.onlyerr == 0) { //只看错误
        data = {
          "query": {
            "bool": {
              "must": [
                { "match": { "ProjectName": this.listQuery.info } },
                { "match": { "Status": "Error" } }
              ]
            }
          },
          "size": this.listQuery.page_size
        }
      }
      Axios({
        method: 'POST',
        url: api,
        data: data
      }).then(res => {
        let array = res.data.hits.hits
        this.srcList = []
        let templist = []
        for (let i = 0; i < array.length; i++) {
          let item = array[i]._source
          templist.push({
            name: item.FuncName + item.Message,
            url: [this.proxy_img + item.ProjectID + "/" + item.Screenshot]
          })
        }
        this.srcList = templist
        this.total = array.length
        if (array.length == 0) {
          this.$message({ message: "没有相关记录,请修改查询关键词!", type: "warning", duration: 6000 })
        }
      })
    },
    // 关键词查询
    handleFilter() {
      this.listQuery.page_no = 1;
      this.getList();
    },
  },
};
</script>

<style>
.el-carousel__item h3 {
  /* color: #475669; */
  font-size: 14px;
  opacity: 0.75;
  line-height: 600px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  /* background-color: #99a9bf; */
  background-color: white;
}

.el-carousel__item:nth-child(2n + 1) {
  /* background-color: #d3dce6; */
  background-color: white;
}
.err-swicth {
  float: right;
  margin-right: 3%;
  margin-top: 10px;
  font-size: 16px;
  color: lightslategray;
}
</style>