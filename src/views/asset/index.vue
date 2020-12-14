<!--实例列表-->
<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.info" placeholder="Target" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
            <router-link :to="'/asset/task_create'">
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">Add</el-button>
            </router-link>
            <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="arrayDel">批量删除</el-button>
        </div>

        <el-dialog title="资产预览" :visible.sync="dialog" width="80%">
            <pre overflow="hidden">{{dialogData}}</pre>
        </el-dialog>

        <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
        :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'update_at', order: 'descending'}" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="35px">
            </el-table-column>
            <el-table-column label="资产名" width="150px" align="center">
                <template slot-scope="{row}">
                    <router-link :to="'/asset/info?instance_id='+row._id">
                        <el-button type="text" size="mini" class="operation-btn">{{ row.name }}</el-button>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="域名/目标" width="150px" align="center">
                <template slot-scope="{row}">
                    {{row.target}}
                </template>
            </el-table-column>
            <el-table-column label="IP信息" min-width="100px" align="center">
                <template slot-scope="{row}">({{row.host}})
                    <span v-if="row.ip_info">{{row.ip_info.area}}</span>
                </template>
            </el-table-column>
            <el-table-column label="Banner" min-width="100px" align="center">
                <template slot-scope="{row}">
                    <el-tag v-if="row.vendor">{{row.vendor}}</el-tag>
                    <el-tag v-if="row.mac">{{row.mac}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="扫描周期" width="120px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.recursion|loadTypeFilter }}</span>
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
                        <el-dropdown-item><el-button type="text" @click="handleDialog(row)">详情</el-button></el-dropdown-item>
                        <el-dropdown-item>
                            <router-link :to="'/asset/task_edit?id='+row._id">
                            <el-button type="text" class="operation-btn">编辑</el-button>
                            </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button type="text" @click="rescan(row)">重扫</el-button>
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
import { InfoList, PortInfoList, RescanInstance, DelInstance } from "@/api/instance"
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
            tableKey1: 1,
            list: [ //实例列表
                {
                    _id: "5f895e84230e4f1c78ac7b8b",
                    create_at: "2020-10-16 16:49:08",
                    host: "74:86:7A:D1:F5:AC",
                    hostname: "74:86:7A:D1:F5:AC",
                    is_delete: 0,
                    mac: "74:86:7A:D1:F5:AC",
                    name: "platfrom.cn",
                    port_list: [22,80,445,3306,8080,5901,9200,27017],
                    target: "172.31.50.254",
                    update_at: "2020-10-19 18:13:03",
                    vendor: "74:86:7A:D1:F5:AC",
                    status: "Processing"
                },
            ],
            dialog: false,
            dialogData: {},
            dialogPortInfoList:[],
            total: 0,
            listLoading: false,
            listQuery: {page_no: 1, page_size: 20, info: ""},
            multipleSelection: []
        };
    },
    created() {
        let task_name = this.$route.query.task_name
        this.listQuery.info = task_name
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
                DelInstance(deleteQuery).then(() => {
                    
                }).catch(() => {
                    this.$notify({title: "Failed", message: "Failed Delete", type: "danger", duration: 5000});
                });
            }
            this.$notify({ title: "Success", message: "Delete Successfully", type: "success", duration: 3000, });
            // this.list.splice(index, 1);
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
        InfoList(this.listQuery).then((response) => {
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
                // console.log(row._id)
                let deleteQuery = { id: row._id };
                DelInstance(deleteQuery).then((response) => {
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
            RescanInstance({"id": row._id}).then(() => {
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