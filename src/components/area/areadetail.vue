<template>
  <div id="content">
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="区域名称" prop="areaname">
        <el-input v-model="form.areaname"></el-input>
      </el-form-item>
      <el-form-item label="区域编码" prop="areacode">
        <el-input v-model="form.areacode"></el-input>
      </el-form-item>
      <el-form-item label="所属区域">
        <el-select v-model="form.area" placeholder="请选择活动区域">
          <el-option label="无" value></el-option>
          <el-option :label="item.areaname" :value="item.id" v-for="item in areas" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <router-link :to="{path:'/area'}">
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getArea, updateArea, getAreaDetail } from '../../api/api.js'
export default {
  name: 'AreaDetail',
  data () {
    return {
      errormsg: '',
      errordialogVisible: false,
      form: {
        areaname: '',
        areacode: '',
        area: ''
      },
      rules: {
        areaname: [{ required: true, message: '不能为空', tigger: 'blur' }],
        areacode: [{ required: true, message: '不能为空', tigger: 'blur' }]
      },
      areas: []
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
      let id = _this.$route.query.id
      updateArea(id, {
        areaname: _this.form.areaname,
        areacode: _this.form.areacode,
        parentid: _this.form.area
      })
        .then(response => {
          console.log(_this)
          _this.$router.push({ path: '/area' })
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
      getArea()
        .then(response => {
          _this.areas = response.data.results
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
    getdetail () {
      let _this = this
      let id = _this.$route.query.id
      getAreaDetail(id)
        .then(response => {
          _this.form.areaname = response.data.areaname
          _this.form.areacode = response.data.areacode
          _this.form.area = response.data.parentid
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
  display: inline-block
}
</style>
