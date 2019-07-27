<template>
  <div id="content">
    <div style="margin-top: 15px;margin-bottom:15px;width:350px;display:inline-block">
      <el-input placeholder="请输入内容" v-model="searchcontent" class="input-with-select">
        <el-select v-model="searchname" slot="prepend" placeholder="请选择">
          <el-option label="设备名" value="devicenameselect"></el-option>
          <el-option label="模块名" value="terminalnameselect"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="gettemperturedata"></el-button>
      </el-input>
    </div>
    <el-button @click="clearsearch">清空搜索</el-button>
    <el-table :data="tableData" v-loading="loading" style="width: 100%" border empty-text="暂无数据">
      <el-table-column align="center" width="55" label>
        <template slot-scope="scope">
          <el-radio
            :label="scope.$index"
            v-model="radio"
            @change.native="getCurrentRow(scope.$index,scope.row)"
          >&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="id" width="100" label="编号"></el-table-column>
      <el-table-column align="center" prop="devicename" label="设备名"></el-table-column>
      <el-table-column align="center" prop="terminalname" label="模块名"></el-table-column>
      <el-table-column align="center" prop="add_time" label="添加时间"></el-table-column>
      <el-table-column align="center" prop="data" label="温度"></el-table-column>
      <el-table-column align="center" prop="iswarns" label="是否为报警"></el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="datatotal"
      :page-size="pagesize"
      style="float:right;margin-top:10px"
      @size-change="sizechange"
      @current-change="currentchange"
    ></el-pagination>
  </div>
</template>
<script>
import {getTemperturedata} from '../../api/api'
export default {
  name: 'TemptureData',
  data () {
    return {
      datatotal: 0,
      pagesize: 10,
      tableData: [],
      radio: '',
      searchcontent: '',
      searchname: '',
      loading: false
    }
  },
  mounted () {
    this.gettemperturedata()
  },
  methods: {
    gettemperturedata (parmas) {
      var _this = this
      _this.loading = true
      if (_this.searchname !== '') {
        parmas[_this.searchname] = _this.searchcontent
      }
      getTemperturedata(parmas)
        .then(response => {
          _this.tableData = response.data.results
          _this.datatotal = response.data.count
          _this.loading = false
        })
        .catch(error => {
          let count = 1
          _this.errormsg = ''
          for (let i in error) {
            _this.errormsg += count + '、' + i + ':' + error[i] + '\n'
            count++
          }
          _this.errordialogVisible = true
        })
    },
    sizechange () {
    },
    currentchange (val) {
      var _this = this
      _this.gettemperturedata({
        page: val
      })
    },
    clearsearch: function () {
      this.searchcontent = ''
      this.searchname = ''
      this.gettemperturedata()
    }
  }
}
</script>
<style scoped>

</style>
