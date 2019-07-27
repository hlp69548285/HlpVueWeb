<template>
  <div id="content">
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="设备名称" prop="devicename">
        <el-input v-model="form.devicename"></el-input>
      </el-form-item>
      <el-form-item label="设备型号" prop="devicestyle">
        <el-input v-model="form.devicestyle"></el-input>
      </el-form-item>
      <el-form-item label="部署编码">
        <el-input v-model="form.devicedeploynum"></el-input>
      </el-form-item>
      <div class="line"></div>
      <el-form-item label="制造厂家">
        <el-input v-model="form.devicemadecompany"></el-input>
      </el-form-item>
      <el-form-item label="制造时间"  prop="devicemadetime">
        <el-date-picker v-model="form.devicemadetime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="制造编号">
        <el-input v-model="form.devicemadenum"></el-input>
      </el-form-item>
      <div class="line"></div>
      <el-form-item label="长" prop="devicelong">
        <el-input v-model.number="form.devicelong"></el-input>
      </el-form-item>
      <el-form-item label="宽" prop="devicewidth">
        <el-input v-model.number="form.devicewidth"></el-input>
      </el-form-item>
      <el-form-item label="高" prop="deviceheigh">
        <el-input v-model.number="form.deviceheigh"></el-input>
      </el-form-item>
      <el-form-item label="重量" prop="deviceweight">
        <el-input v-model.number="form.deviceweight"></el-input>
      </el-form-item>
      <el-form-item label="电压">
        <el-input v-model="form.devicevolt"></el-input>
      </el-form-item>
      <el-form-item label="电器容量">
        <el-input v-model="form.devicekw"></el-input>
      </el-form-item>
      <div class="line"></div>
      <el-form-item label="传感器类型" style="width:100% !important">
        <el-checkbox v-model="elecheck">电</el-checkbox>
        <el-checkbox v-model="gascheck">气</el-checkbox>
        <el-checkbox v-model="watercheck">水</el-checkbox>
        <el-checkbox v-model="yywdcheck">液压温度</el-checkbox>
        <el-checkbox v-model="yyylcheck">液压压力</el-checkbox>
        <el-checkbox v-model="yyywcheck">液压液位</el-checkbox>
        <el-checkbox v-model="sycheck">水压</el-checkbox>
        <el-checkbox v-model="sllcheck">水流量</el-checkbox>
        <el-checkbox v-model="swcheck">水位</el-checkbox>
        <el-checkbox v-model="swencheck">水温</el-checkbox>
        <el-checkbox v-model="wdcheck">温度</el-checkbox>
        <el-checkbox v-model="zdcheck">振动</el-checkbox>
        <el-checkbox v-model="gdcheck">高度</el-checkbox>
        <el-checkbox v-model="ywcheck">烟雾</el-checkbox>
        <el-checkbox v-model="zscheck">噪声</el-checkbox>
        <el-checkbox v-model="plccheck">PLC数据</el-checkbox>
      </el-form-item>
      <div class="line"></div>
      <el-form-item label="所属区域">
        <el-select v-model="form.area" placeholder="请选择活动区域">
          <el-option :label="item.areaname" :value="item.id" v-for="item in areas" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <div></div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <router-link :to="{path:'/device'}">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getArea, getDeviceDetail, updateDevice } from '../../api/api.js'
export default {
  name: 'DeviceDetail',
  data () {
    return {
      errormsg: '',
      errordialogVisible: false,
      form: {
        devicename: '',
        devicestyle: '',
        devicedeploynum: '',
        devicemadecompany: '',
        devicemadenum: '',
        devicemadetime: '',
        devicelong: '',
        devicewidth: '',
        deviceheigh: '',
        deviceweight: '',
        devicevolt: '',
        devicekw: '',
        area: ''
      },
      elecheck: false,
      gascheck: false,
      watercheck: false,
      yywdcheck: false,
      yyylcheck: false,
      yyywcheck: false,
      sycheck: false,
      sllcheck: false,
      swcheck: false,
      swencheck: false,
      wdcheck: false,
      zdcheck: false,
      gdcheck: false,
      ywcheck: false,
      zscheck: false,
      plccheck: true,
      areas: [],
      rules: {
        devicename: [
          { required: true, message: '设备名不能为空', trigger: 'blur' }
        ],
        devicestyle: [
          { required: true, message: '设备型号不能为空', trigger: 'blur' }
        ],
        devicemadetime: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        devicelong: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '此值必须为数字值'
          }
        ],
        devicewidth: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '此值必须为数字值'
          }
        ],
        deviceheigh: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '此值必须为数字值'
          }
        ],
        deviceweight: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '此值必须为数字值'
          }
        ]
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
  created () {
    this.getarea()
    this.getdetail()
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.onSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onSubmit () {
      let _this = this
      let deviceid = _this.$route.query.id
      updateDevice(deviceid, {
        devicename: _this.form.devicename,
        devicestyle: _this.form.devicestyle,
        devicedeploynum: _this.form.devicedeploynum,
        devicemadecompany: _this.form.devicemadecompany,
        devicemadenum: _this.form.devicemadenum,
        devicemadetime: _this.form.devicemadetime,
        devicelong: _this.form.devicelong,
        devicewidth: _this.form.devicewidth,
        deviceheigh: _this.form.deviceheigh,
        deviceweight: _this.form.deviceweight,
        devicevolt: _this.form.devicevolt,
        devicekw: _this.form.devicekw,
        area: _this.form.area,
        elecheck: _this.elecheck,
        gascheck: _this.gascheck,
        watercheck: _this.watercheck,
        yywdcheck: _this.yywdcheck,
        yyylcheck: _this.yyylcheck,
        yyywcheck: _this.yyywcheck,
        sycheck: _this.sycheck,
        sllcheck: _this.sllcheck,
        swcheck: _this.swcheck,
        swencheck: _this.swencheck,
        wdcheck: _this.wdcheck,
        zdcheck: _this.zdcheck,
        gdcheck: _this.gdcheck,
        ywcheck: _this.ywcheck,
        zscheck: _this.zscheck,
        plccheck: _this.plccheck
      })
        .then(response => {
          console.log(_this)
          _this.$router.push({ path: '/device' })
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
    getarea () {
      var _this = this
      getArea().then(response => {
        _this.areas = response.data.results
      })
    },
    getdetail () {
      let _this = this
      let id = _this.$route.query.id
      getDeviceDetail(id)
        .then(response => {
          _this.form.devicename = response.data.devicename
          _this.form.devicestyle = response.data.devicestyle
          _this.form.devicedeploynum = response.data.devicedeploynum
          _this.form.devicemadecompany = response.data.devicemadecompany
          _this.form.devicemadenum = response.data.devicemadenum
          _this.form.devicemadetime = response.data.devicemadetime
          _this.form.devicelong = response.data.devicelong
          _this.form.devicewidth = response.data.devicewidth
          _this.form.deviceheigh = response.data.deviceheigh
          _this.form.deviceweight = response.data.deviceweight
          _this.form.devicevolt = response.data.devicevolt
          _this.form.devicekw = response.data.devicekw
          _this.form.area = response.data.area
          _this.elecheck = response.data.elecheck
          _this.gascheck = response.data.gascheck
          _this.watercheck = response.data.watercheck
          _this.yywdcheck = response.data.yywdcheck
          _this.yyylcheck = response.data.yyylcheck
          _this.yyywcheck = response.data.yyywcheck
          _this.sycheck = response.data.sycheck
          _this.sllcheck = response.data.sllcheck
          _this.swcheck = response.data.swcheck
          _this.swencheck = response.data.swencheck
          _this.wdcheck = response.data.wdcheck
          _this.zdcheck = response.data.zdcheck
          _this.gdcheck = response.data.gdcheck
          _this.ywcheck = response.data.ywcheck
          _this.zscheck = response.data.zscheck
          _this.plccheck = response.data.plccheck
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
<style scoped>
.el-form-item {
  display: inline-block;
  width: 300px
}
</style>
