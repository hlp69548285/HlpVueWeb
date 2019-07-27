<template>
  <div id="content">
    <div style="margin-bottom:10px">
      <button
        class="mdui-btn mdui-ripple mdui-color-green mdui-btn-raised"
        @click="addfiledialogVisible=true"
        :disabled="isUse"
      >新增</button>
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
      <el-table-column align="center" label="设备名称" prop="devicename"></el-table-column>
      <el-table-column align="center" label="设备型号" prop="devicestyle"></el-table-column>
      <el-table-column align="center" label="所属区域" prop="areaname"></el-table-column>
      <el-table-column align="center" label="制造编号" prop="devicemadenum"></el-table-column>
    </el-table>
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除提示" :visible.sync="deldialogVisible" width="500px">
      <span style="color:red">是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deldialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="removedevice">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="上传文件" :visible.sync="addfiledialogVisible" width="600px">
      <el-upload
        class="upload-demo"
        action="123"
        ref="upload"
        :limit="1"
        :on-change="handleBeforeUpload"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
        >上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip" style="color:red">*请不超过500kb</div>
      </el-upload>
      <el-form :rules="rule">
        <el-input placeholder="请输入文件备注" v-model="deviceinfo" prop="deviceinfo" style="margin-top:10px">
          <template slot="prepend">文件备注</template>
        </el-input>
      </el-form>
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
    <button class="mdui-btn mdui-btn-block mdui-color-blue-200 mdui-ripple">已上传文件</button>
    <el-table :data="hasinstall" v-loading="loadingfile" style="width: 100%;margin-top:5px;" border>
      <el-table-column align="center" label="文件名" prop="devicefilename"></el-table-column>
      <el-table-column align="center" label="所属设备" prop="devicename"></el-table-column>
      <el-table-column align="center" label="文件备注" prop="deviceinfo"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <a :href="scope.row.devicefile" download>
            <el-button type="text" size="small">下载</el-button>
          </a>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="removedevicedialog(scope.row)" type="text" size="small">移除</el-button>
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
import {
  getDevice,
  uploadfile,
  getdevicefile,
  deleteEquipfile,
  getDeviceFile
} from '../../api/api.js'
export default {
  name: 'DeviceFile',
  data () {
    return {
      tableData: [],
      radio: '',
      radioselect: '',
      datatotal: 0,
      pagesize: 10,
      addfiledialogVisible: false,
      deldialogVisibledips: false,
      deldialogVisible: false,
      selectdialogVisible: false,
      noselectdialogVisible: false,
      currentPage: 1,
      hasinstall: [],
      notinstall: [],
      removedeviceid: '',
      errormsg: '',
      errordialogVisible: false,
      filename: '',
      file: '',
      deviceinfo: '',
      fileList: [],
      filedata: {
        device: 4,
        devicefilename: 1
      },
      loading: false,
      loadingfile: false,
      rule: {
        deviceinfo: [
          { required: true, message: '不能为空' }
        ]
      }
    }
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
  created  () {
    this.getdevice()
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
      this.getfile(row.id)
    },
    sizechange: function (val) {
      console.log(val)
    },
    currentchange: function (val) {
      var _this = this
      _this.radio = ''
      _this.getdevice({
        page: val
      })
    },
    getfile: function (id) {
      let _this = this
      _this.loadingfile = true
      getdevicefile({
        device: id
      })
        .then(response => {
          _this.hasinstall = response.data
          _this.loadingfile = false
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
    removedevicedialog: function (row) {
      let _this = this
      _this.deldialogVisible = true
      _this.removedeviceid = row.id
    },
    removedevice: function () {
      let _this = this
      deleteEquipfile(_this.removedeviceid)
        .then(response => {
          _this.deldialogVisible = false
          _this.getfile(_this.radioselect)
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
    submitUpload () {
      console.log('上传' + this.file.name)
      let _this = this
      if (this.fileName === '') {
        this.$message.warning('请选择要上传的文件！')
        return false
      }
      let fileFormData = new FormData()
      fileFormData.append('devicefile', this.file.raw)
      fileFormData.append('device', this.radioselect)
      fileFormData.append('devicefilename', this.file.name)
      fileFormData.append('deviceinfo', this.deviceinfo)
      let requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      uploadfile(fileFormData, requestConfig)
        .then(respnese => {
          console.log(respnese)
          if (respnese.status === 201) {
            _this.file = ''
            _this.fileList = []
            _this.addfiledialogVisible = false
            _this.deviceinfo = ''
            _this.getfile(_this.radioselect)
          }
        })
        .catch(error => {
          let count = 1
          _this.errormsg = ''
          let msg = ''
          for (let i in error) {
            if (i === 'devicefile') {
              msg = '设备文件'
            } else if (i === 'deviceinfo') {
              msg = '文件备注'
            }
            _this.errormsg += count + '、' + msg + ':' + error[i] + '\n'
            count++
          }
          _this.errordialogVisible = true
        })
    },
    handleBeforeUpload (file) {
      this.file = file
      return false
    },
    handleRemove (file) {
      console.log(file)
    },
    downloaddevicefile (row) {
      getDeviceFile(row.id).then(response => {
        console.log('123')
        console.log(response)
        let blob = new Blob([response.data])
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        let title = row.devicefilename
        link.download = title
        link.click()
      })
    }
  }
}
</script>
