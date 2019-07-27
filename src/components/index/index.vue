<template>
  <div id="content" class="mdui-clearfix">
    <div class="mdui-container-fluid">
      <div class="mdui-col-xs-6 mdui-col-sm-4 mdui-col-md-2">
        <router-link :to="{path:'/user'}">
          <div class="mdui-list-item mdui-ripple mdui-card">
            <i class="mdui-list-item-icon mdui-icon material-icons mdui-color-blue">&#xe851;</i>
            <div class="mdui-list-item-content">人员管理</div>
          </div>
        </router-link>
      </div>
      <div class="mdui-col-xs-6 mdui-col-sm-4 mdui-col-md-2">
        <router-link :to="{path:'/device'}">
          <div class="mdui-list-item mdui-ripple mdui-card">
            <i class="mdui-list-item-icon mdui-icon material-icons mdui-color-indigo">&#xeb47;</i>
            <div class="mdui-list-item-content">设备管理</div>
          </div>
        </router-link>
      </div>
      <div class="mdui-col-xs-6 mdui-col-sm-4 mdui-col-md-2">
        <router-link :to="{path:'/terminalindex'}">
          <div class="mdui-list-item mdui-ripple mdui-card">
            <i class="mdui-list-item-icon mdui-icon material-icons mdui-color-orange">&#xe307;</i>
            <div class="mdui-list-item-content">终端管理</div>
          </div>
        </router-link>
      </div>
      <div class="mdui-col-xs-6 mdui-col-sm-4 mdui-col-md-2">
        <router-link :to="{path:'/gatewayindex'}">
          <div class="mdui-list-item mdui-ripple mdui-card">
            <i class="mdui-list-item-icon mdui-icon material-icons mdui-color-grey">&#xe328;</i>
            <div class="mdui-list-item-content">网关管理</div>
          </div>
        </router-link>
      </div>
      <div class="mdui-col-xs-6 mdui-col-sm-4 mdui-col-md-2">
        <router-link :to="{path:'/warn'}">
          <div class="mdui-list-item mdui-ripple mdui-card">
            <i class="mdui-list-item-icon mdui-icon material-icons mdui-color-red">&#xe002;</i>
            <div class="mdui-list-item-content ">报警管理</div>
          </div>
        </router-link>
      </div>
      <div class="mdui-col-xs-6 mdui-col-sm-4 mdui-col-md-2">
        <router-link :to="{path:'/data'}">
          <div class="mdui-list-item mdui-ripple mdui-card">
            <i class="mdui-list-item-icon mdui-icon material-icons mdui-color-green">&#xe24b;</i>
            <div class="mdui-list-item-content">数据统计</div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="mdui-container-fuild" style="margin-top:20px;">
      <div class="mdui-col-xs-12 mdui-col-md-8">
        <div id="devicewarnchart" class="mdui-card"></div>
      </div>
      <div class="mdui-col-xs-12 mdui-col-md-4" style="height:400px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>需处理的报警</span>
          </div>
          <div v-for="o in warninfo" :key="o" class="text item">
            <p v-html="o"></p>
          </div>
        </el-card>
      </div>
    </div>
    <div class="mdui-container-fuild" style="margin-top:20px;">
      <div class="mdui-col-xs-12 mdui-col-md-6 chart">
         七天每天用电情况
        <div id="elechart"  class="mdui-card"></div>
      </div>
      <div class="mdui-col-xs-12 mdui-col-md-6 chart">
        设备用电情况
        <div id="deviceelechart" class="mdui-card"></div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import {getIndex} from '../../api/api'
export default {
  name: 'Index',
  data () {
    return {
      warninfo: []
    }
  },
  mounted () {
    this.getindex()
  },
  methods: {
    initChart (chartname, data) {
      let mychartdiv = document.getElementById(chartname)
      let newchart = document.createElement('div')
      newchart.style.cssText = 'width: 100%;height:400px;display: inline-block'
      let Chart = echarts.init(newchart)
      let Option = data
      Chart.setOption(Option)
      mychartdiv.appendChild(newchart)
      Chart.resize()
    },
    getindex () {
      let _this = this
      getIndex().then((response) => {
        console.log(response)
        _this.initChart('devicewarnchart', response.data['warnChartData'])
        _this.initChart('elechart', response.data['eleWeekData'])
        _this.initChart('deviceelechart', response.data['deviceWeekData'])
        _this.warninfo = response.data['warninfo']
      })
    }
  }
}
</script>
<style scoped>
.paddingtop {
  padding-top: 80px;
}
.mdui-list-item{
  min-height: 80px;
}
.mdui-container {
  width:94%;
}
.mdui-list-item {
  padding:0;
  margin-top: 10px;
  border-radius: 5px;
}
.mdui-list-item i{
  height: 80px;
  width: 85px;
  line-height: 80px;
  font-size: 30px;
  color: white !important;
}
a{
  text-decoration: none;
}
.chart{
  margin-top: 20px;
}
.mdui-list-item-content {
  margin-left: 50px;
  color: #57a3f3;
  font-size: 18px;
  font-weight: bold;
}
#content div.el-card__body > div{
  height: 30px;
}
</style>
