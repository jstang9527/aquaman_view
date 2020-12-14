<!--资产任务列表-->
<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.info" placeholder="Target" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
            <router-link :to="'/asset/discovery/task_create'">
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">Add</el-button>
            </router-link>
        </div>

        <el-dialog title="任务预览" :visible.sync="dialog" width="80%">
            <pre overflow="hidden">{{dialogData}}</pre>
        </el-dialog>

        <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
        :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'update_at', order: 'descending'}">
            <el-table-column label="资产名" width="150px" align="center">
                <template slot-scope="{row}">
                    <!-- <router-link :to="'/asset/info?instance_id='+row._id"> -->
                        <el-button type="text" size="mini" class="operation-btn">{{ row.name }}</el-button>
                    <!-- </router-link> -->
                </template>
            </el-table-column>
            <el-table-column label="探测目标" min-width="15px" align="center">
                <template slot-scope="{row}">
                    <span>{{row.target}}</span>
                </template>
            </el-table-column>
            <el-table-column label="Banner" min-width="30px" align="center">
                <template slot-scope="{row}">
                    <el-tag v-if="row.open_auth" type="info">权限爆破</el-tag>
                    <el-tag v-if="row.open_poc" type="warning">漏洞检测</el-tag>
                    <el-tag v-if="row.open_web" type="danger">Web渗透</el-tag>
                    <el-tag v-if="row.user_port" type="success">自定义端口</el-tag>
                    <el-tag v-else type="success">默认端口</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="扫描周期" width="100px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.recursion|loadTypeFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作员" width="120px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.user }}</span>
                </template>
            </el-table-column>
            <el-table-column label="检测状态" width="120px" align="center">
                <template slot-scope="{row}">
                <el-tag v-if="row.status=='Completed'" effect="dark" type="success">
                    <i  class="el-icon-finished"  style="margin-left:2%">{{ row.status }}</i>
                </el-tag>
                <el-tag v-else-if="row.status=='New'">
                    <i  class="el-icon-video-play" style="margin-left:2%" >{{ row.status }}</i>
                </el-tag>
                <el-tag v-else>
                    <i  class="el-icon-loading" style="margin-left:2%" >{{ row.status }}</i>
                </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="扫描时间" width="160px" align="center" prop="update_at" sortable>
                <template slot-scope="{row}"><span>{{ row.update_at }}</span></template>
            </el-table-column>
            <el-table-column fixed="right" label="Operation" align="center" width="120px" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-dropdown :hide-on-click="false">
                        <span class="el-dropdown-link">选项卡<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><el-button type="text" @click="handleDialog(row)">任务详情</el-button></el-dropdown-item>
                        <el-dropdown-item>
                            <router-link :to="'/asset/discovery/task_edit?id='+row._id">
                            <el-button type="text" class="operation-btn">编辑任务</el-button>
                            </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button type="text" @click="rescan(row)">立即重扫</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button type="text" @click="handleDelete(row,$index)">删除任务</el-button>
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
import { DiscoveryList, DelDiscovery, ExeDiscovery, PortInfoList } from "@/api/instance"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const StatusOptions = [
    { key: "0", display_name: "一次" },
    { key: "1", display_name: "每天" },
    { key: "7", display_name: "每周" },
    { key: "30", display_name: "每月" },
];

const loadTypeKeyValue = StatusOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name;
    return acc;
}, {});

export default {
    name: "instanceinfo_list",
    components: { Pagination },
    directives: { waves },
    filters: {
            loadTypeFilter(type) {return loadTypeKeyValue[type]},
    },
    data() {
        return {
            tableKey: 0,
            list: [
                {
                    _id: "5f895e84230e4f1c78ac7b8b",                            //任务ID
                    create_at: "2020-10-16 16:49:08",                           //创建时间
                    update_at: "2020-10-19 18:13:03",                           //执行时间
                    is_delete: 0,                                               //软删除标记
                    target: "172.31.50.0/24",                                      //网段
                    name: "开发环境资产探测",                                    //任务名
                    port_list: [22,80,445,3306,8080,5901,9200,27017],           //用户自定义端口
                    status: "Processing",                                       //任务状态
                    open_web: 1,                                                //开启web漏洞检测
                    open_poc: 1,                                                //开启poc漏洞检测
                    open_auth: 1,                                               //开启认证检测
                    userport: 1,                                                //用户自定义端口
                    recursion: 7,                                               //0一次,1每天,7每周,30每月,
                    user: 'Admin'                                               //操作员 
                },
            ],
            dialog: false,
            dialogData: {},
            dialogPortInfoList:[],
            total: 0,
            listLoading: false,
            listQuery: {page_no: 1, page_size: 20, info: ""},
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
        DiscoveryList(this.listQuery).then((response) => {
            this.list = response.data.list;
            this.total = response.data.total;
            setTimeout(() => { this.listLoading = false; }, 1 * 1000);
        });
        },
        // 根据单个实例，获取它的端口信息列表
        get_portinfo(instance_id){
            let query = {page_no: 1, page_size: 1000, info: instance_id}
            PortInfoList(query).then((response) => {
                this.dialogPortInfoList = response.data.list;
                this.dialog = true
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
                DelDiscovery({ id: row._id }).then((response) => {
                    this.$notify({ title: "Success", message: "Delete Successfully" + response.data.errmsg, type: "success", duration: 3000, });
                    this.list.splice(index, 1);
                }).catch(() => {
                    this.$notify({title: "Failed", message: "Failed Delete", type: "danger", duration: 5000});
                });
            })
        },
        handleDialog(row){
            this.dialogData = row
            this.dialog = true
        },
        rescan(row){
            ExeDiscovery({"id": row._id}).then((response) => {
                console.log(response)
                this.$notify({title: "Success", message: "Rescan Successfully", type: "success", duration: 5000});
                this.getList() //刷新列表
            }).catch(() => {
                this.$notify({title: "Failed", message: "Failed Execte Rescan.", type: "danger", duration: 5000});
            });
        }
    },
};
</script>

<style>
.operation-btn {
  margin-right: 0px;
}
pre{
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>