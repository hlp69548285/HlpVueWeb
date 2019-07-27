<template>
  <div id="content">
    <div style="margin-top: 15px;margin-bottom:15px;width:350px;display:inline-block">
      <el-input placeholder="请输入内容" v-model="searchcontent" class="input-with-select">
        <el-select v-model="searchname" slot="prepend" placeholder="请选择">
          <el-option label="设备名" value="equipnameselect"></el-option>
          <el-option label="模块名" value="terminalnameselect"></el-option>
          <el-option label="数据" value="data"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getvibrationmodledata"></el-button>
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
      <el-table-column align="center" prop="id" label="编号"></el-table-column>
      <el-table-column align="center" prop="devicename" label="设备名"></el-table-column>
      <el-table-column align="center" prop="terminalname" label="模块名"></el-table-column>
      <el-table-column align="center" prop="add_time" label="添加时间"></el-table-column>
      <el-table-column align="center" prop="datax" label="最大值"></el-table-column>
      <el-table-column align="center" prop="datay" label="平均值"></el-table-column>
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
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red" v-html="errormsg">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getVibrationData } from '../../api/api.js'
export default {
  name: 'VibrationDataDetail',
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      radio: 1,
      radioselect: 0,
      errormsg: '',
      formLabelWidth: '120px',
      deldialogVisible: false,
      errordialogVisible: false,
      datatotal: 100,
      pagesize: 10,
      searchcontent: '',
      searchname: '',
      loading: false
    }
  },
  mounted () {
    console.log('1')
    if (
      document.body.scrollHeight >
      (window.innerHeight || document.documentElement.clientHeight)
    ) {
      console.log('2')
      document.getElementsByTagName('body')[0].className = ''
    } else {
      document.getElementsByTagName('body')[0].className =
        'mdui-bottom-nav-fixed mdui-bottom-nav-scroll-hide'
    }
  },
  created () {
    this.getvibrationmodledata()
  },
  methods: {
    getvibrationmodledata: function (parmas) {
      var _this = this
      _this.loading = true
      if (_this.searchname !== '') {
        parmas[_this.searchname] = _this.searchcontent
      }
      getVibrationData(parmas)
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
    getCurrentRow: function (index, row) {
      this.radioselect = row
    },
    clearsearch: function () {
      this.searchcontent = ''
      this.searchname = ''
      this.getvibrationmodledata()
    },
    sizechange: function (val) {
      console.log(val)
    },
    currentchange: function (val) {
      var _this = this
      _this.getvibrationmodledata({
        page: val
      })
    }
  },
  filters: {}
}
</script>
<style>
</style>
