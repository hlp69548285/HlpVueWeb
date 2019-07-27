<template>
  <div id="content">
    <div style="margin-bottom:10px">
      <button
        class="mdui-btn mdui-ripple mdui-color-green mdui-btn-raised"
        @click="addmaintainsetting"
        :disabled="adddisable"
      >新增</button>
      <button
        class="mdui-btn mdui-ripple mdui-color-green mdui-btn-raised"
        @click="alertdialogFormVisible = true"
        :disabled="alertdisable"
      >修改</button>
    </div>
    <!-- 新增规则 -->
    <el-dialog title="新增规则" :visible.sync="dialogFormVisible" width="500px">
      <el-form :terminal="form">
        <el-form-item label="初始时间" :label-width="formLabelWidth">
          <el-input v-model="form.starttime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="当前时间" :label-width="formLabelWidth">
          <el-input v-model="form.nowtime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保养时间" :label-width="formLabelWidth">
          <el-input v-model="form.targettime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="预警状态" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="有效" value="0"></el-option>
            <el-option label="无效" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addmaintainsetting">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增规则" :visible.sync="alertdialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="初始时间" :label-width="formLabelWidth">
          <el-input v-model="form.starttime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="当前时间" :label-width="formLabelWidth">
          <el-input v-model="form.nowtime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保养时间" :label-width="formLabelWidth">
          <el-input v-model="form.targettime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="预警状态" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="alertdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatemaintainsetting">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="tableData" v-loading="loading" style="width: 100%;margin-top:5px;" border>
      <el-table-column align="center" width="55" label>
        <template slot-scope="scope">
          <el-radio
            :label="scope.$index"
            v-model="radio"
            @change.native="getCurrentRow(scope.$index,scope.row)"
          >&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" prop="terminaltypes"></el-table-column>
      <el-table-column align="center" label="编号" prop="terminalnum"></el-table-column>
      <el-table-column align="center" label="网络ID" prop="netid"></el-table-column>
      <el-table-column align="center" label="模块ID" prop="modid"></el-table-column>
      <el-table-column align="center" label="所属设备" prop="devicename"></el-table-column>
      <el-table-column align="center" label="所属网关" prop="gateway"></el-table-column>
    </el-table>
    <button class="mdui-btn mdui-btn-block mdui-color-blue-200 mdui-ripple">已安装模块</button>
    <el-table :data="hasinstall" v-loading="loadingsetting" style="width: 100%;margin-top:5px;" border>
      <el-table-column align="center" label="状态" prop="maintainstatus"></el-table-column>
      <el-table-column align="center" label="当前时间" prop="nowtime"></el-table-column>
      <el-table-column align="center" label="开始时间" prop="starttime"></el-table-column>
      <el-table-column align="center" label="预计时间" prop="targettime"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="delmaintainsetting(scope.row)" type="text" size="small">移除</el-button>
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
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="datatotal"
      :page-size="pagesize"
      style="float:right;margin-top:10px"
      :current-page.sync="currentPage"
      @current-change="currentchange"
      @size-change="sizechange"
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
import {
  getTerminal,
  getMaintainSetting,
  addMaintainSetting,
  updateMaintainSetting,
  deleteMaintainSetting
} from '../../api/api.js'
export default {
  name: 'MaintainSetting',
  data () {
    return {
      form: {
        starttime: '',
        nowtime: '',
        targettime: '',
        status: ''
      },
      tableData: [],
      radio: '',
      radioselect: '',
      datatotal: 0,
      pagesize: 10,
      deldialogVisible: false,
      deldialogVisibledips: false,
      currentPage: 1,
      errormsg: '',
      errordialogVisible: false,
      searchname: '',
      searchcontent: '',
      dialogFormVisible: false,
      alertdialogFormVisible: false,
      adddisable: false,
      formLabelWidth: '150',
      hasinstall: [],
      alertdisable: false,
      noselectdialogVisible: false,
      loading: false,
      loadingsetting: false
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
    this.getmodule()
  },
  methods: {
    getmodule: function (parmas) {
      var _this = this
      _this.loading = true
      if (_this.searchname !== '') {
        parmas[_this.searchname] = _this.searchcontent
      }
      getTerminal(parmas)
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
      this.getmaintainsetting(this.radioselect)
    },
    sizechange: function (val) {
      console.log(val)
    },
    currentchange: function (val) {
      var _this = this
      _this.getdevice({
        page: val
      })
    },
    getSetting: function (val) {
      console.log(val)
    },
    clearsearch: function () {
      this.searchcontent = ''
      this.searchname = ''
      this.getmodule()
    },
    modulealert () {
      let id = this.radioselect
      this.$router.push({ path: '/moduledetail', query: { id: id } })
    },
    addsetting: function () {
      console.log(123)
    },
    getmaintainsetting: function (val) {
      let _this = this
      _this.loadingsetting = true
      if (_this.radio === '') {
        _this.noselectdialogVisible = true
        return
      }
      getMaintainSetting({
        terminal: val
      })
        .then(response => {
          console.log(response)
          _this.hasinstall = response.data.results
          if (_this.hasinstall.length > 0) {
            _this.adddisable = true
            _this.alertdisable = false
            _this.form.starttime = _this.hasinstall[0].starttime
            _this.form.nowtime = _this.hasinstall[0].nowtime
            _this.form.targettime = _this.hasinstall[0].targettime
            _this.form.status = _this.hasinstall[0].status
          } else {
            _this.adddisable = false
            _this.alertdisable = true
          }
          _this.loadingsetting = false
        })
        .catch(error => {
          let count = 0
          _this.errormsg = ''
          let msg = ''
          for (let i in error) {
            if (i === 'starttime') {
              msg = '开始时间'
            }
            if (i === 'nowtime') {
              msg = '当前时间'
            }
            if (i === 'targettime') {
              msg = '结束时间'
            }
            if (i === 'status') {
              msg = '状态'
            }
            _this.errormsg += count + '、' + msg + ':' + error[i] + '\n'
            count++
          }
          _this.errordialogVisible = true
        })
    },
    addmaintainsetting: function () {
      let _this = this
      if (_this.radio === '') {
        _this.noselectdialogVisible = true
        return
      }
      if (_this.dialogFormVisible === false) {
        _this.dialogFormVisible = true
        return
      }
      addMaintainSetting({
        terminal: _this.radioselect,
        nowtime: _this.form.nowtime,
        starttime: _this.form.starttime,
        targettime: _this.form.targettime,
        status: _this.form.status
      })
        .then(response => {
          console.log(response)
          _this.form.nowtime = ''
          _this.form.starttime = ''
          _this.form.targettime = ''
          _this.form.status = ''
          _this.dialogFormVisible = false
          _this.getmaintainsetting(_this.radioselect)
        })
        .catch(error => {
          _this.errormsg = error
          let count = 1
          _this.errormsg = ''
          let msg = ''
          for (let i in error) {
            if (i === 'starttime') {
              msg = '开始时间'
            }
            if (i === 'nowtime') {
              msg = '当前时间'
            }
            if (i === 'targettime') {
              msg = '结束时间'
            }
            if (i === 'status') {
              msg = '状态'
            }
            _this.errormsg += count + '、' + msg + ':' + error[i] + '\n'
            count++
          }
          _this.errordialogVisible = true
        })
    },
    delmaintainsetting: function (val) {
      let _this = this
      console.log(val)
      deleteMaintainSetting(val.id)
        .then(response => {
          _this.getmaintainsetting(_this.radioselect)
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
    updatemaintainsetting: function () {
      let _this = this
      if (_this.radio === '') {
        _this.noselectdialogVisible = true
        return
      }
      updateMaintainSetting(_this.hasinstall[0].id, {
        nowtime: _this.form.nowtime,
        starttime: _this.form.starttime,
        targettime: _this.form.targettime,
        status: _this.form.status
      })
        .then(response => {
          console.log(response)
          _this.getmaintainsetting(_this.radioselect)
          _this.form.nowtime = ''
          _this.form.starttime = ''
          _this.form.targettime = ''
          _this.form.status = ''
          _this.alertdialogFormVisible = false
        })
        .catch(error => {
          _this.errormsg = error
          let count = 1
          _this.errormsg = ''
          let msg = ''
          for (let i in error) {
            if (i === 'starttime') {
              msg = '开始时间'
            }
            if (i === 'nowtime') {
              msg = '当前时间'
            }
            if (i === 'targettime') {
              msg = '结束时间'
            }
            if (i === 'status') {
              msg = '状态'
            }
            _this.errormsg += count + '、' + msg + ':' + error[i] + '\n'
            count++
          }
          _this.errordialogVisible = true
        })
    }
  }
}
</script>
<style scoped>
</style>
