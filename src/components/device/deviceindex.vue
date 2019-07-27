<template>
  <div id="content">
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div>
      <router-link :to="{path:'/deviceadd'}">
        <button
          class="mdui-btn mdui-ripple mdui-color-green mdui-btn-raised"
          @click="dialogFormVisible = true"
        >新增</button>
      </router-link>
      <button class="mdui-btn mdui-ripple mdui-color-blue mdui-btn-raised" @click="devicealert">修改</button>
      <button
        class="mdui-btn mdui-ripple mdui-color-red mdui-btn-raised"
        @click="deldialogVisible = true"
      >删除</button>
      <div style="width:350px;display:inline-block;margin-left:10px">
        <el-input placeholder="请输入内容" v-model="searchcontent" class="input-with-select" @keyup.enter.native="getdevice">
          <el-select v-model="searchname" slot="prepend" placeholder="请选择">
            <el-option label="设备名称" value="devicename"></el-option>
            <el-option label="设备型号" value="devicestyle"></el-option>
            <el-option label="所属区域" value="areaname"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="getdevice"></el-button>
        </el-input>
      </div>
      <el-button @click="clearsearch">清空搜索</el-button>
    </div>
    <el-table :data="tableData" v-loading = "loading" style="width: 100%;margin-top:5px;" border>
      <el-table-column align="center" width="55" label="选择">
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
            <el-form-item label="部署编码">
              <span>{{ props.row.devicedeploynum }}</span>
            </el-form-item>
            <el-form-item label="制造厂家">
              <span>{{ props.row.devicemadecompany }}</span>
            </el-form-item>
            <el-form-item label="开始使用">
              <span>{{ props.row.devicestarttime }}</span>
            </el-form-item>
            <el-form-item label="长">
              <span>{{ props.row.devicelong }}</span>
            </el-form-item>
            <el-form-item label="宽">
              <span>{{ props.row.devicewidth }}</span>
            </el-form-item>
            <el-form-item label="高">
              <span>{{ props.row.deviceheigh }}</span>
            </el-form-item>
            <el-form-item label="电压">
              <span>{{ props.row.devicevolt }}</span>
            </el-form-item>
            <el-form-item label="电气容量">
              <span>{{ props.row.devicekw }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备名称" prop="devicename"></el-table-column>
      <el-table-column align="center" label="设备型号" prop="devicestyle"></el-table-column>
      <el-table-column align="center" label="所属区域" prop="areaname"></el-table-column>
      <el-table-column align="center" label="制造编号" prop="devicemadenum"></el-table-column>
    </el-table>
    <el-dialog title="删除提示" :visible.sync="deldialogVisible" width="500px">
      <span style="color:red">是否确认删除?<br>注意：<br>1、删除将同时删除设备文件，设备产品！<br>2、当前设备绑定的数据采集终端也将移除！<br>3、设备的保养设定将会停用<br>4、设备将不会产生报警和保养提醒</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deldialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletedevice">确 定</el-button>
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
</style>
<script>
import { getDevice, deleteDevice } from '../../api/api.js'
export default {
  name: 'DeviceIndex',
  data () {
    return {
      errormsg: '',
      errordialogVisible: false,
      tableData: [],
      radio: '',
      radioselect: 0,
      datatotal: 0,
      pagesize: 10,
      deldialogVisible: false,
      deldialogVisibledips: false,
      currentPage: 1,
      searchname: '',
      searchcontent: '',
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
    this.getdevice()
  },
  methods: {
    getdevice: function (parmas) {
      var _this = this
      _this.loading = true
      if (_this.searchname !== '') {
        parmas[_this.searchname] = _this.searchcontent
      }
      getDevice(parmas)
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
      _this.getdevice({
        page: val
      })
    },
    deletedevice () {
      let _this = this
      deleteDevice(_this.radioselect)
        .then(response => {
          _this.deldialogVisible = false
          _this.getdevice()
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
    clearsearch: function () {
      this.searchcontent = ''
      this.searchname = ''
      this.getdevice()
    },
    devicealert () {
      let id = this.radioselect
      this.$router.push({ path: '/devicedetail', query: { id: id } })
    }
  }
}
</script>
