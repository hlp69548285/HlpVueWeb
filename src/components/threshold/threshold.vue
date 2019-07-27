<template>
  <div id="content">
    <div style="margin-bottom:10px">
      <div style="width:350px;display:inline-block;margin-left:10px">
        <el-input placeholder="请输入内容" v-model="searchcontent" class="input-with-select" @keyup.enter.native="getterminal">
          <el-select v-model="searchname" slot="prepend" placeholder="请选择">
            <el-option label="所属设备" value="devicename"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="getthreshold"></el-button>
        </el-input>
      </div>
      <el-button @click="clearsearch">清空搜索</el-button>
      <!-- <button class="mdui-btn mdui-ripple mdui-color-amber mdui-btn-raised">修改密码</button> -->
    </div>
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
      <el-table-column prop="devicename" label="设备名称"></el-table-column>
      <el-table-column prop="terminalname" label="终端名称"></el-table-column>
      <el-table-column prop="terminaltype" label="终端类型"></el-table-column>
      <el-table-column prop="thresholdname" label="阈值名称"></el-table-column>
      <el-table-column prop="threshold" label="阈值"></el-table-column>
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
    <el-dialog title="新增阈值" :visible.sync="addThreshold" width="500px">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="阈值名称" :label-width="formLabelWidth" prop="thresholdname">
          <el-input v-model="form.thresholdname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="阈值" :label-width="formLabelWidth" prop="threshold">
          <el-input v-model="form.threshold" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="终端" :label-width="formLabelWidth" prop="terminal">
          <el-select v-model="form.terminal">
            <el-option :label="item.terminalnum + '-' + item.terminaltypes" :value="item.id" :key="item.id" v-for="item in terminals"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addThreshold = false">取 消</el-button>
        <el-button type="primary" @click="addthreshold">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改阈值" :visible.sync="alertThreshold" width="500px">
      <el-form :model="updateform" ref="updateform" :rules="rules">
        <el-form-item label="阈值名称" :label-width="formLabelWidth" prop="thresholdname">
          <el-input v-model="updateform.thresholdname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="阈值" :label-width="formLabelWidth" prop="threshold">
          <el-input v-model="updateform.threshold" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="终端" :label-width="formLabelWidth" prop="terminal">
          <el-select v-model="updateform.terminal">
            <el-option :label="item.terminalnum + '-' + item.terminaltypes" :value="item.id" :key="item.id" v-for="item in terminals"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="alertThreshold = false">取 消</el-button>
        <el-button type="primary" @click="updatethreshold">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除提示" :visible.sync="delThreshold" width="500px">
      <span style="color:red">是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delThreshold = false">取 消</el-button>
        <el-button type="primary" @click="deletethreshold">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red" v-html="errormsg">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getThreshold, getTerminal } from '../../api/api.js'
export default {
  name: 'Threshold',
  data () {
    return {
      tableData: [],
      addThreshold: false,
      radio: '',
      radioselect: '',
      searchcontent: '',
      searchname: '',
      form: {
        threshold: '',
        thresholdname: '',
        terminal: ''
      },
      updateform: {
        threshold: '',
        thresholdname: '',
        terminal: ''
      },
      rules: {
        threshold: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        thresholdname: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        terminal: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      errormsg: '',
      formLabelWidth: '120px',
      delThreshold: false,
      errordialogVisible: false,
      alertThreshold: false,
      datatotal: 0,
      pagesize: 10,
      terminals: []
    }
  },
  mounted () {
    if (
      document.body.scrollHeight >
      (window.innerHeight || document.documentElement.clientHeight)
    ) {
      document.getElementsByTagName('body')[0].className = ''
    } else {
      document.getElementsByTagName('body')[0].className =
        'mdui-bottom-nav-fixed mdui-bottom-nav-scroll-hide'
    }
  },
  created () {
    this.getthreshold()
    this.getterminal()
  },
  methods: {
    getthreshold: function (parmas) {
      var _this = this
      _this.loading = true
      if (_this.searchname !== '') {
        parmas[_this.searchname] = _this.searchcontent
      }
      getThreshold(parmas)
        .then(response => {
          _this.tableData = response.data.results
          _this.datatotal = response.data.count
          _this.loading = false
        })
        .catch(error => {
          _this.errormsg = error
          _this.errordialogVisible = true
        })
    },
    getterminal: function (parmas) {
      var _this = this
      getTerminal(parmas)
        .then(response => {
          _this.terminals = response.data.results
        })
        .catch(error => {
          _this.errormsg = error
          _this.errordialogVisible = true
        })
    },
    clearsearch: function () {
      this.searchcontent = ''
      this.searchname = ''
      this.getthreshold()
    },
    // addthreshold: function () {
    //   var _this = this
    //   this.$refs['form'].validate(valid => {
    //     if (!valid) {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    //   addThreshold({
    //     thresholdname: _this.form.thresholdname,
    //     threshold: _this.form.threshold,
    //     terminal: _this.form.terminal
    //   })
    //     .then(response => {
    //       _this.addThreshold = false
    //       _this.form.threshold = ''
    //       _this.form.thresholdname = ''
    //       _this.form.terminal = ''
    //       _this.getthreshold()
    //     })
    //     .catch(error => {
    //       let count = 1
    //       _this.errormsg = ''
    //       let fieldname = ''
    //       for (let i in error) {
    //         if (i === 'threshold') {
    //           fieldname = '阈值'
    //         }
    //         if (i === 'thresholdname') {
    //           fieldname = '阈值名称'
    //         }
    //         if (i === 'terminal') {
    //           fieldname = '终端'
    //         }
    //         _this.errormsg +=
    //           '<div>' + count + '、' + fieldname + ':' + error[i] + '</div>'
    //         count++
    //       }
    //       _this.errordialogVisible = true
    //     })
    // },
    getCurrentRow: function (index, row) {
      this.radioselect = row
      this.updateform.threshold = row.threshold
      this.updateform.thresholdname = row.thresholdname
      this.updateform.terminal = row.terminal
    },
    fieldinsert: function () {
      if (this.radio === '') {
        this.errormsg = '请选择一个需要修改的阈值'
        this.errordialogVisible = true
      } else {
        this.alertThreshold = true
      }
    },
    // deletethreshold: function () {
    //   var _this = this
    //   deleteThreshold(_this.radioselect.id)
    //     .then(response => {
    //       _this.delThreshold = false
    //       _this.radio = ''
    //       _this.radioselect = ''
    //       _this.getthreshold()
    //     })
    //     .catch(error => {
    //       _this.errormsg = error
    //       _this.errordialogVisible = true
    //     })
    // },
    // updatethreshold: function () {
    //   var _this = this
    //   this.$refs['updateform'].validate(valid => {
    //     if (!valid) {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    //   updateThreshold(_this.radioselect.id, {
    //     thresholdname: _this.updateform.thresholdname,
    //     threshold: _this.updateform.threshold,
    //     terminal: _this.updateform.terminal
    //   })
    //     .then(response => {
    //       _this.addThreshold = false
    //       _this.updateform.threshold = ''
    //       _this.updateform.thresholdname = ''
    //       _this.updateform.terminal = ''
    //       _this.getthreshold()
    //       _this.alertThreshold = false
    //       _this.radioselect = ''
    //       _this.radio = ''
    //     })
    //     .catch(error => {
    //       let count = 1
    //       _this.errormsg = ''
    //       let fieldname = ''
    //       for (let i in error) {
    //         if (i === 'threshold') {
    //           fieldname = '阈值'
    //         }
    //         if (i === 'thresholdname') {
    //           fieldname = '阈值名称'
    //         }
    //         if (i === 'terminal') {
    //           fieldname = '终端'
    //         }
    //         _this.errormsg +=
    //           '<div>' + count + '、' + fieldname + ':' + error[i] + '</div>'
    //         count++
    //       }
    //       _this.errordialogVisible = true
    //     })
    // },
    sizechange: function (val) {
      console.log(val)
    },
    currentchange: function (val) {
      var _this = this
      _this.getthreshold({
        page: val
      })
    }
  }
}
</script>
<style scoped>
button {
  margin-left: 5px;
}
</style>
