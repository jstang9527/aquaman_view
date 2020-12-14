<template>
  <!-- <div class="mixin-components-container"> -->
  <div class="dashboard-container">
    <!-- <iframe src="静态文件路径" frameborder="0" scrolling="auto"></iframe> -->
    <iframe src="http://172.31.50.254/stat" height="950" width="100%"></iframe>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  name: "Detail",
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
</style>