<template>
  <div id="content">
    <div style="margin-bottom:10px">
      <button
        class="mdui-btn mdui-ripple mdui-color-green mdui-btn-raised"
        @click="dialogFormVisible = true"
      >新增</button>
      <button class="mdui-btn mdui-ripple mdui-color-blue mdui-btn-raised" @click="resetpass">重置密码</button>
      <button
        class="mdui-btn mdui-ripple mdui-color-red mdui-btn-raised"
        @click="deldialogVisible = true"
      >删除</button>
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
      <el-table-column align="center" prop="username" label="姓名"></el-table-column>
      <el-table-column align="center" prop="mobile" label="电话"></el-table-column>
      <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
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
    <el-dialog title="新增人员" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除提示" :visible.sync="deldialogVisible" width="500px">
      <span style="color:red">是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deldialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteuser">确 定</el-button>
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
import { getuser, addUser, deleteUser, resetPassword } from '../../api/api.js'
export default {
  name: 'User',
  data () {
    return {
      tableData: [],
      dialogFormVisible: false,
      radio: 1,
      radioselect: 0,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: '',
        region: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }]
      },
      errormsg: '',
      formLabelWidth: '120px',
      deldialogVisible: false,
      errordialogVisible: false,
      datatotal: 100,
      pagesize: 10
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
    this.getuser()
  },
  methods: {
    resetpass: function () {
      let _this = this
      resetPassword({
        id: _this.tableData[_this.radio]['id']
      })
        .then(response => {
          _this.$alert('密码重置成功，请用初始密码（123456）登录', '密码重置', {
            confirmButtonText: '确定'
          })
        })
        .catch(error => {
          this.errormsg = error
          this.errordialogVisible = true
        })
    },
    getuser: function (parmas) {
      var _this = this
      _this.loading = true
      getuser(parmas)
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
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.adduser()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    adduser: function () {
      var _this = this
      this.$refs['form'].validate(valid => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
      })
      addUser({
        username: _this.form.username,
        password: _this.form.password,
        email: _this.form.email,
        mobile: _this.form.mobile
      })
        .then(response => {
          _this.dialogFormVisible = false
          _this.form.username = ''
          _this.form.password = ''
          _this.form.email = ''
          _this.form.mobile = ''
          _this.getuser()
        })
        .catch(error => {
          let count = 1
          _this.errormsg = ''
          let fieldname = ''
          for (let i in error) {
            if (i === 'email') {
              fieldname = '邮箱'
            }
            if (i === 'password') {
              fieldname = '密码'
            }
            if (i === 'username') {
              fieldname = '用户名'
            }
            _this.errormsg +=
              '<div>' + count + '、' + fieldname + ':' + error[i] + '</div>'
            count++
          }
          _this.errordialogVisible = true
        })
    },
    getCurrentRow: function (index, row) {
      this.radioselect = row
    },
    deleteuser: function () {
      var _this = this
      deleteUser(_this.radioselect.id)
        .then(response => {
          _this.deldialogVisible = false
          _this.getuser()
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
    sizechange: function (val) {
      console.log(val)
    },
    currentchange: function (val) {
      var _this = this
      _this.getuser({
        page: val
      })
    }
  },
  filters: {
    timeformat: function (val) {
      var date = new Date(val)
      var years = date.getFullYear()
      var months = padDate(date.getMonth() + 1)
      var days = padDate(date.getDay())
      var hours = padDate(date.getHours())
      var minutes = padDate(date.getMinutes())
      var seconds = padDate(date.getSeconds())
      return `${years}-${months}-${days} ${hours}:${minutes}:${seconds}`
    }
  }
}
var padDate = function (value) {
  return value < 10 ? '0' + value : value
}
</script>
<style scoped>
button {
  margin-left: 5px;
}
</style>
