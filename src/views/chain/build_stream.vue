<template>
  <div class="components-container">
    <div class="editor-container">
      <dnd-list :list1="list1" :list2="list2" list1-title="流水组装" list2-title="组件工厂" />
    </div>
    <div>
      <el-button type="primary" @click="onSubmit" size="small">立即构建</el-button>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_no" :limit.sync="listQuery.page_size" @pagination="getData" style="float:right;" class="pagination-container pagination-container[data-v-72233bcd]" />
    </div>
    <!--弹出组件-->
    <el-dialog title="配置信息" :visible.sync="dialog">
      <el-form ref="dataForm" :model="dialogData" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="线名" class="is-required" style="width:500px;">
          <el-input v-model="dialogData.name" />
        </el-form-item>
        <el-form-item label="描述/备注" class="is-required" style="width:500px;">
          <el-input v-model="dialogData.desc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelConfirm()">Cancel</el-button>
        <el-button type="primary" @click="onConfirm()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DndList from '@/components/DndList'
import Pagination from "@/components/Pagination";
import { blockList, chainAddStream } from "@/api/chain"

export default {
  name: 'DndListDemo',
  components: { DndList, Pagination },
  data() {
    return {
      list1: [], //{ id: 1, author: "xxx", title: "ads" }
      list2: [],
      listQuery: { page_no: 1, page_size: 20, info: "", },
      total: 0,
      dialog: false,
      dialogData: {
        name: "",
        desc: ""
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.listLoading = true
      blockList(this.listQuery).then((response) => {
        this.list2 = response.data.list
        this.list1 = [this.list2[this.list2.length - 1]]
        this.total = response.data.total;
        setTimeout(() => { this.listLoading = false; }, 1.5 * 1000);
      });
    },
    //提交行为链
    onSubmit() {
      if (this.list1.length == 0) { this.$message({ message: "流水线是空的", type: 'warning' }); return }
      // console.log(this.list1)
      this.dialog = true
    },
    // 提交dialog
    onConfirm() {
      if (this.dialogData.name == "") {
        this.$message({ message: "线名不能为空", type: "warning" })
        return
      }
      // 组装data数组
      let blockIDList = []
      for (let i = 0; i < this.list1.length; i++) {
        blockIDList.push(this.list1[i].id)
      }
      let postData = { stream_name: this.dialogData.name, stream_desc: this.dialogData.desc, block_list: blockIDList }
      // +++++ API接口
      chainAddStream(postData).then((response) => {
        this.$notify({ title: "Success", message: "Create Successfully" + response.data.errmsg, type: "success", duration: 4000, });
        this.dialog = false
      }).catch(() => {
        this.$notify({
          title: "Error", message: "Server interval error", type: "danger", duration: 5000,
        });
      });
    },
    // 取消dialog
    cancelConfirm() {
      this.dialog = false
    }
  }
}
</script>

<style>
.pagination-container {
  margin-top: 0px;
}
.pagination-container[data-v-72233bcd] {
  padding: 0px;
}
</style>