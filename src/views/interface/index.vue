<template>
  <!-- <div class="mixin-components-container"> -->
  <div class="dashboard-container">
    <div class="top">
      <el-button type="primary">
        <el-link href="http://172.31.50.254/xxx.xml" target="_blank" class="link" :underline="false" type>详细测试结果</el-link>
        <i class="el-icon-s-promotion el-icon--right"></i>
      </el-button>
    </div>
    <!-- <iframe src="静态文件路径" frameborder="0" scrolling="auto"></iframe> -->
    <iframe src="http://172.31.50.254/TestReport.html" height="950" width="100%"></iframe>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  name: "Interface",
  data() {
    return {};
  },
};
</script>
<style>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.top {
  float: right;
  padding: 10px;
  margin: 10px, 10px;
}
.link {
  color: white;
}
</style>