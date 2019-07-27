<template>
  <div id='content'>
    <div>
      <button
        class='mdui-btn mdui-ripple mdui-color-green mdui-btn-raised'
        @click="adddialogVisible = true"
      >新增</button>
      <button
        class='mdui-btn mdui-ripple mdui-color-blue mdui-btn-raised'
        @click="alertdialogVisible = true"
      >修改</button>
      <button class="mdui-btn mdui-ripple mdui-btn-raised">是否查看已处理<el-switch
        v-model="switchvalue"
        active-color="#13ce66"
        inactive-color="gray"
        active-text="">
      </el-switch></button>
      <div style="width:350px;display:inline-block;margin-left:10px">
        <el-input placeholder="请输入内容" v-model="searchcontent" class="input-with-select" @keyup.enter.native="getterminal">
          <el-select v-model="searchname" slot="prepend" placeholder="请选择">
            <el-option label="所属设备" value="devicename"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="getmaintain"></el-button>
        </el-input>
      </div>
      <el-button @click="clearsearch">清空搜索</el-button>
    </div>
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
      <el-table-column align="center" label="保养编码" prop="maintainnum"></el-table-column>
      <el-table-column align="center" label="保养设备" prop="manintaindevices"></el-table-column>
      <el-table-column align="center" label="保养内容" prop="maintaininfo"></el-table-column>
      <el-table-column align="center" label="保养时间" prop="lastmaintain"></el-table-column>
      <el-table-column align="center" label="是否完成" prop="maintaindeals"></el-table-column>
      <el-table-column align="center" label="保养人员" prop="maintainpeople"></el-table-column>
      <el-table-column align="center" label="附件">
        <template slot-scope="scope">
          <a :href="scope.row.maintainfile" download>
            <el-button type="text" size="small" :disabled="checkdisable(scope.row.maintainfile)">下载</el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改信息" :visible.sync="alertdialogVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="保养人员">
          <el-input v-model="form.maintainpeople" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保养方式">
          <el-input v-model="form.deallog" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保养文件">
          <input type="file" name="保养文件" :model="form.maintainfile" ref="addmaintainfile" @change="addfilechange">
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
        <el-button type="primary" @click="updatemaintain">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增信息" :visible.sync="adddialogVisible" width="500px">
      <el-form :model="addform">
        <el-form-item label="保养编码">
          <el-input v-model="addform.maintainnum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保养人员">
          <el-input v-model="addform.maintainpeople" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保养内容">
          <el-input v-model="addform.maintaininfo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保养方式">
          <el-input v-model="addform.maintainlog" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备:" prop="device">
        <el-select v-model="addform.device" placeholder="请选择设备">
          <el-option
            :label="item.devicename"
            :value="item.id"
            v-for="item in devices"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="是否解决">
          <el-select v-model="addform.maintaindeal" placeholder="请选择是否解决">
            <el-option label="已解决" value="1"></el-option>
            <el-option label="未解决" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保养文件">
          <input type="file" name="保养文件" :model="addform.maintainfile" ref="maintainfile" @change="filechange">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addmaintain">确 定</el-button>
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
import { getMaintain, updateMaintain, getDevice, addMaintain } from '../../api/api.js'
export default {
  name: 'Maintain',
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
      adddialogVisible: false,
      currentPage: 1,
      selectindex: 1,
      addform: {
        maintainnum: '',
        device: '',
        maintaininfo: '',
        maintainpeople: '',
        maintainlog: '',
        maintainfile: '',
        maintaindeal: '1'
      },
      form: {
        formLabelWidth: '200px',
        maintainpeople: '',
        deallog: '',
        maintainfile: '',
        deal: '1'
      },
      loading: false,
      switchvalue: false,
      devices: [],
      searchname: '',
      searchcontent: ''
    }
  },
  mounted () {
    this.getdevice()
    this.getmaintain()
  },
  methods: {
    getdevice: function () {
      let _this = this
      getDevice({
        'limit': 1000,
        'format': 'json'
      }).then((response) => {
        _this.devices = response.data.results
      }).catch((error) => {
        console.log(error)
      })
    },
    checkdisable: function (url) {
      if (url === null) {
        return true
      }
      return false
    },
    clearsearch: function () {
      this.searchcontent = ''
      this.searchname = ''
      this.getmaintain()
    },
    addmaintain: function () {
      let _this = this
      let fileFormData = new FormData()
      fileFormData.append('maintainnum', this.addform.maintainnum)
      fileFormData.append('maintaininfo', this.addform.maintaininfo)
      fileFormData.append('maintainlog', this.addform.maintainlog)
      fileFormData.append('maintaindeal', this.addform.maintaindeal)
      fileFormData.append('maintainpeople', this.addform.maintainpeople)
      fileFormData.append('lastmaintain', _this.gettime())
      fileFormData.append('maintainfile', this.addform.maintainfile)
      fileFormData.append('device', this.addform.device)
      let requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      addMaintain(fileFormData, requestConfig).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    },
    gettime () {
      let timenow = new Date()
      return `${timenow.getFullYear()}-${timenow.getMonth()}-${timenow.getDate()} ${timenow.getHours()}:${timenow.getMinutes()}:${timenow.getSeconds()}`
    },
    getmaintain: function () {
      var _this = this
      _this.loading = true
      let parmas = {}
      if (_this.searchname !== '') {
        parmas[_this.searchname] = _this.searchcontent
      }
      if (_this.switchvalue) {
        parmas['maintaindeal'] = '1'
      } else {
        parmas['maintaindeal'] = '0'
      }
      getMaintain(parmas).then(response => {
        _this.tableData = response.data.results
        _this.datatotal = response.data.count
        if (_this.datatotal > 0) {
          _this.radio = 0
          _this.radioselect = _this.tableData[0].id
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
    getCurrentRow: function (index, row) {
      this.radioselect = row.id
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
    updatemaintain () {
      let _this = this
      console.log('123')
      if (_this.form.maintainpeople === '') {
        alert('请输入保养人员')
        return
      }
      if (_this.form.deallog === '') {
        alert('请输入保养方法')
        return
      }
      let fileFormData = new FormData()
      fileFormData.append('maintainlog', _this.form.deallog)
      fileFormData.append('maintaindeal', _this.form.deal)
      fileFormData.append('maintainpeople', _this.form.maintainpeople)
      fileFormData.append('maintainfile', _this.form.maintainfile)
      let requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      updateMaintain(_this.radioselect, fileFormData, requestConfig).then(response => {
        _this.alertdialogVisible = false
        _this.getmaintain()
        _this.currentPage = 1
      })
    },
    warnalert () {
      let id = this.radioselect
      this.$router.push({ path: '/moduledetail', query: { id: id } })
    },
    filechange (e) {
      this.addform.maintainfile = e.target.files[0]
    },
    addfilechange (e) {
      this.form.maintainfile = e.target.files[0]
    }
  },
  watch: {
    switchvalue: function () {
      this.getmaintain()
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
