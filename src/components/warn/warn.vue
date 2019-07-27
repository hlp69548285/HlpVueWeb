<template>
  <div id="content">
    <div>
      <button
        class="mdui-btn mdui-ripple mdui-color-blue mdui-btn-raised"
        @click="alertdialogVisible = true"
      >修改</button>
      <button class="mdui-btn mdui-ripple mdui-btn-raised">是否查看已处理<el-switch
        v-model="switchvalue"
        active-color="#13ce66"
        inactive-color="gray"
        active-text="">
      </el-switch></button>
    </div>
    <el-table :data="tableData" v-loading = "loading"  style="width: 100%;margin-top:5px;" border>
      <el-table-column align="center" width="55" label>
        <template slot-scope="scope">
          <el-radio
            :label="scope.$index"
            v-model="radio"
            @change.native="getCurrentRow(scope.$index,scope.row)"
          >&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" label="报警编码" prop="warnnum"></el-table-column>
      <el-table-column align="center" label="报警设备" prop="warndevices"></el-table-column>
      <el-table-column align="center" label="报警终端" prop="warnterminal"></el-table-column>
      <el-table-column align="center" label="报警时间" prop="warntime"></el-table-column>
      <el-table-column align="center" label="报警内容" prop="warninfo"></el-table-column>
      <el-table-column align="center" label="报警数据" prop="warndata"></el-table-column>
      <el-table-column align="center" label="产生数量" prop="warncount"></el-table-column>
      <el-table-column align="center" label="是否解决" prop="warndeals"></el-table-column>
      <el-table-column align="center" label="解决人员" prop="warnperple"></el-table-column>
      <el-table-column align="center" label="附件">
        <template slot-scope="scope">
          <a :href="scope.row.warnfile" download>
            <el-button type="text" size="small" :disabled="checkdisable(scope.row.warnfile)">下载</el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改信息" :visible.sync="alertdialogVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="解决人员">
          <el-input v-model="form.warnperple" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <input type="file" name="附件" :model="form.warnfile" ref="addwarnfile" @change="addfilechange">
        </el-form-item>
        <el-form-item label="是否解决">
          <el-select v-model="form.deal" placeholder="请选择是否解决">
            <el-option label="已解决" value="1"></el-option>
            <el-option label="未解决" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alertdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatewarn">确 定</el-button>
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
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red" v-html="errormsg">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
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
import { getWarn, updateWarn } from '../../api/api.js'
export default {
  name: 'Warn',
  data () {
    return {
      errordialogVisible: false,
      errormsg: '',
      tableData: [],
      radio: '',
      radioselect: 0,
      datatotal: 0,
      pagesize: 10,
      alertdialogVisible: false,
      currentPage: 1,
      selectindex: 1,
      form: {
        formLabelWidth: '200px',
        warncode: '',
        terminal: '',
        warnperple: '',
        warnfile: '',
        deal: '1'
      },
      loading: false,
      switchvalue: false
    }
  },
  created () {
    this.getwarn({})
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
  methods: {
    getwarn: function (parmas) {
      var _this = this
      _this.loading = false
      if (_this.switchvalue) {
        parmas['warndeal'] = '1'
      } else {
        parmas['warndeal'] = '0'
      }
      getWarn(parmas).then(response => {
        _this.tableData = response.data.results
        _this.datatotal = response.data.count
        if (_this.datatotal > 0) {
          _this.radio = 0
          _this.radioselect = _this.tableData[0].id
          this.form.warncode = _this.tableData[0].warncode
          this.form.terminal = _this.tableData[0].terminal
        }
        _this.loading = false
      }).catch(error => {
        let count = 1
        _this.errormsg = ''
        for (let i in error) {
          _this.errormsg += count + '、' + i + ':' + error[i] + '\n'
          count++
        }
        _this.errordialogVisible = true
      })
    },
    checkdisable: function (url) {
      if (url === null) {
        return true
      }
      return false
    },
    getCurrentRow: function (index, row) {
      this.radioselect = row.id
    },
    sizechange: function (val) {
      console.log(val)
    },
    currentchange: function (val) {
      var _this = this
      _this.getwarn({
        page: val
      })
    },
    updatewarn () {
      console.log('warn')
      let _this = this
      if (_this.form.warnperple === '') {
        alert('请输入解决人员')
        return
      }
      let fileFormData = new FormData()
      fileFormData.append('warncode', this.form.warncode)
      fileFormData.append('terminal', this.form.terminal)
      fileFormData.append('warnpeple', this.form.warnperple)
      fileFormData.append('warnfile', this.form.warnfile)
      fileFormData.append('deal', this.form.deal)
      let requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      updateWarn(_this.radioselect, fileFormData, requestConfig).then(response => {
        _this.alertdialogVisible = false
        _this.getwarn()
        _this.currentPage = 1
      //   console.log(response)
      // }).catch((error) => {
      //   console.log(error)
      // })
      })
    },
    warnalert () {
      let id = this.radioselect
      this.$router.push({ path: '/moduledetail', query: { id: id } })
    },
    addfilechange (e) {
      this.form.warnfile = e.target.files[0]
    }
  },
  watch: {
    switchvalue: function () {
      this.getwarn({})
    },
    alertdialogVisible: function (newvalue, oldvalue) {
      console.log(newvalue)
      if (newvalue === true) {
        if (this.radio === '') {
          this.alertdialogVisible = false
          alert('请选择修改项')
        }
      }
    }
  }
}
</script>
