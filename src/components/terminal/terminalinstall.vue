<template>
  <div id='content'>
    <div style="margin-bottom:10px">
      <button
        class="mdui-btn mdui-ripple mdui-color-green mdui-btn-raised"
        @click="getterminalnotinstall"
        :disabled = "isUse"
      >新增</button>
    </div>
    <el-table :data="tableData" v-loading="loading" style="width: 100%;margin-top:5px;" border>
      <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
        <span style="color:red">{{errormsg}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-table-column align="center" width="55" label>
        <template slot-scope="scope">
          <el-radio
            :label="scope.$index"
            v-model="radio"
            @change.native="getCurrentRow(scope.$index,scope.row)"
          >&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备名称" prop="devicename"></el-table-column>
      <el-table-column align="center" label="设备型号" prop="devicestyle"></el-table-column>
      <el-table-column align="center" label="所属区域" prop="areaname"></el-table-column>
      <el-table-column align="center" label="制造编号" prop="devicemadenum"></el-table-column>
    </el-table>
    <el-dialog title="删除提示" :visible.sync="deldialogVisible" width="500px">
      <span style="color:red">是否确认删除<br>注意：<br>1、移除后设备将无法获取此终端采集数据<br>2、移除后设备将移除当前采集状态的预警设置<br>3、为保护历史数据完整性，已移除的终端在系统中无法再次使用，硬件设备可以新增一个相同设置的终端再次使用</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deldialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="removeowner">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择模块安装" :visible.sync="selectdialogVisible" width="600px">
      <el-table :data="notinstall" style="width: 100%;margin-top:5px;" border>
        <el-table-column align="center" label="类型" prop="terminaltypes"></el-table-column>
        <el-table-column align="center" label="编号" prop="terminalnum"></el-table-column>
        <el-table-column align="center" label="网络ID" prop="netid"></el-table-column>
        <el-table-column align="center" label="模块ID" prop="modid"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="addownerdialog(scope.row)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <button class="mdui-btn mdui-btn-block mdui-color-blue-200 mdui-ripple">已安装模块</button>
    <el-table :data="hasinstall" v-loading="loadinginstall" style="width: 100%;margin-top:5px;" border>
      <el-table-column align="center" label="类型" prop="terminaltypes"></el-table-column>
      <el-table-column align="center" label="终端名" prop="terminalnum"></el-table-column>
      <el-table-column align="center" label="网络ID" prop="netid"></el-table-column>
      <el-table-column align="center" label="模块ID" prop="modid"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="removeownerdialog(scope.row)" type="text" size="small">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="noselectdialogVisible" width="30%">
      <span>请选择一个设备</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noselectdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="noselectdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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
</style>
<script>
import { getDevice, getTerminal, updateTerminal, deleteTerminal } from '../../api/api.js'
export default {
  name: 'TerminalInstall',
  data () {
    return {
      tableData: [],
      radio: '',
      radioselect: '',
      datatotal: 0,
      pagesize: 10,
      deldialogVisible: false,
      deldialogVisibledips: false,
      selectdialogVisible: false,
      noselectdialogVisible: false,
      currentPage: 1,
      hasinstall: [],
      notinstall: [],
      removeownerid: '',
      errormsg: '',
      errordialogVisible: false,
      loading: false,
      loadinginstall: false
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
    this.getdevice()
  },
  computed: {
    isUse () {
      if (this.radio === '') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getdevice: function (parmas) {
      var _this = this
      _this.loading = true
      getDevice(parmas)
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
      this.radioselect = row.id
      this.getterminal(row.id)
    },
    sizechange: function (val) {
      console.log(val)
    },
    currentchange: function (val) {
      var _this = this
      _this.hasinstall = []
      _this.radio = ''
      _this.getdevice({
        page: val
      })
    },
    getterminal: function (id) {
      let _this = this
      _this.loadinginstall = true
      getTerminal({
        device: id
      })
        .then(response => {
          _this.hasinstall = response.data.results
          _this.loadinginstall = false
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
    getterminalnotinstall: function () {
      let _this = this
      if (_this.radio === '') {
        _this.noselectdialogVisible = true
      } else {
        getTerminal({
          terminal_exclude: 0
        })
          .then(response => {
            _this.notinstall = response.data.results
            _this.selectdialogVisible = true
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
      }
    },
    removeownerdialog: function (row) {
      let _this = this
      _this.deldialogVisible = true
      _this.removeownerid = row.id
    },
    removeowner: function () {
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
    addownerdialog: function (row) {
      let _this = this
      updateTerminal(row.id, {
        device: _this.radioselect
      })
        .then(response => {
          _this.selectdialogVisible = false
          _this.getterminal(_this.radioselect)
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
    }
  }
}
</script>
