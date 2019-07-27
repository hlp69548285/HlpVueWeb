<template>
  <div id='content'>
    <div>
      <router-link :to="{path:'/terminaladd'}">
        <button
          class="mdui-btn mdui-ripple mdui-color-green mdui-btn-raised"
          @click="dialogFormVisible = true"
        >新增</button>
      </router-link>
      <button class="mdui-btn mdui-ripple mdui-color-blue mdui-btn-raised" @click="terminalalert">修改</button>
      <button
        class="mdui-btn mdui-ripple mdui-color-red mdui-btn-raised"
        @click="deldialogVisible = true"
      >删除</button>
      <div style="width:350px;display:inline-block;margin-left:10px">
        <el-input placeholder="请输入内容" v-model="searchcontent" class="input-with-select" @keyup.enter.native="getterminal">
          <el-select v-model="searchname" slot="prepend" placeholder="请选择">
            <el-option label="模块类型" value="terminaltypes"></el-option>
            <el-option label="网络编号" value="netid"></el-option>
            <el-option label="模块编号" value="modid"></el-option>
            <el-option label="模块名" value="terminalnum"></el-option>
            <el-option label="所属设备" value="devicename"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="getterminal"></el-button>
        </el-input>
      </div>
      <el-button @click="clearsearch">清空搜索</el-button>
    </div>
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-table
    :data="tableData"
    v-loading="loading"
    style="width: 100%;margin-top:5px;"
    border>
      <el-table-column align="center" width="55" label>
        <template slot-scope="scope">
          <el-radio
            :label="scope.$index"
            v-model="radio"
            @change.native="getCurrentRow(scope.$index,scope.row)"
          >&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="串口波特率">
              <span>{{ props.row.serialband }}</span>
            </el-form-item>
            <el-form-item label="数据位">
              <span>{{ props.row.serialdatabit }}</span>
            </el-form-item>
            <el-form-item label="停止位">
              <span>{{ props.row.serialstop }}</span>
            </el-form-item>
            <el-form-item label="保存频率">
              <span>{{ props.row.rfband }}</span>
            </el-form-item>
            <el-form-item label="采集频率">
              <span>{{ props.row.rfdatarate }}</span>
            </el-form-item>
            <el-form-item label="互感器倍数">
              <span>{{ props.row.rfpower }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属设备" prop="devicename"></el-table-column>
      <el-table-column align="center" label="模块类型" prop="terminaltypes"></el-table-column>
      <el-table-column align="center" label="模块名" prop="terminalnum"></el-table-column>
      <el-table-column align="center" label="网络编号" prop="netid"></el-table-column>
      <el-table-column align="center" label="模块编号" prop="modid"></el-table-column>
      <el-table-column align="center" label="所属网关" prop="gatewayname"></el-table-column>
    </el-table>
    <el-dialog title="删除提示" :visible.sync="deldialogVisible" width="500px">
      <span style="color:red">是否确认删除<br>注意：<br>1、移除后设备将无法获取此终端采集数据<br>2、移除后设备将移除此终端的预警设置</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deldialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteterminal">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除提示" :visible.sync="deldialogVisibledips" width="500px">
      <span style="color:red">请先选中一行</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deldialogVisibledips = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="datatotal"
      :page-size="pagesize"
      style="float:right;margin-top:10px"
      @size-change="sizechange"
      :current-page.sync="currentPage"
      @current-change="currentchange"
    ></el-pagination>
  </div>
</template>
<style scoped>
button {
  margin-left: 5px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-select .el-input {
  width: 120px;
}
</style>
<script>
import { getTerminal, deleteTerminal } from '../../api/api.js'
export default {
  name: 'TerminalIndex',
  data () {
    return {
      tableData: [],
      radio: '',
      radioselect: 0,
      datatotal: 0,
      pagesize: 10,
      deldialogVisible: false,
      deldialogVisibledips: false,
      currentPage: 1,
      errormsg: '',
      errordialogVisible: false,
      searchname: '',
      searchcontent: '',
      loading: true
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
    this.getterminal()
  },
  methods: {
    getterminal: function (parmas) {
      var _this = this
      _this.loading = true
      if (_this.searchname !== '') {
        parmas[_this.searchname] = _this.searchcontent
      }
      getTerminal(parmas)
        .then(response => {
          _this.tableData = response.data.results
          _this.datatotal = response.data.count
          if (_this.datatotal > 0) {
            _this.radio = 0
            _this.radioselect = _this.tableData[0].id
          }
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
      this.radioselect = row.id
    },
    sizechange: function (val) {
      console.log(val)
    },
    currentchange: function (val) {
      var _this = this
      _this.getterminal({
        page: val
      })
    },
    clearsearch: function () {
      this.searchcontent = ''
      this.searchname = ''
      this.getterminal()
    },
    deleteterminal () {
      let _this = this
      deleteTerminal(_this.radioselect)
        .then(response => {
          _this.deldialogVisible = false
          _this.getterminal()
          _this.currentPage = 1
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
    terminalalert () {
      let id = this.radioselect
      this.$router.push({ path: '/terminaldetail', query: { id: id } })
    }
  }
}
</script>
