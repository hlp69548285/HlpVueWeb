<template>
  <div>
    <el-card class="box-card center">
      <div slot="header" class="clearfix">
        <span>系统提示</span>
        <router-link :to="{path:'/'}">
          <el-button style="float: right; padding: 3px 0" type="text">返回首页</el-button>
        </router-link>
      </div>
      <div class="text item">
        <span style="color:red">404：所请求的页面不存在或已被删除!</span>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Error404'
}
</script>
<style scoped>
.center {
  left: 50%;
  top: 50%;
  position: absolute;
  margin-left: -241px;
  margin-top: -67px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>
