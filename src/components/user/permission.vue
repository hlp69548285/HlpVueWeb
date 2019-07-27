<template>
  <div id='content'>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户权限" name="user">
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
          <el-table-column align="center" prop="username" label="姓名" width="180"></el-table-column>
          <el-table-column align="center" prop="mobile" label="电话" width="180"></el-table-column>
          <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
          <el-table-column align="center" label="上次登录时间">
            <template slot-scope="scope">
              <span>{{scope.row.last_login}}</span>
            </template>
          </el-table-column>
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
        <button class="mdui-btn mdui-btn-block mdui-color-blue-200 mdui-ripple">权限分配</button>
        <div id="transfer">
          <el-transfer v-model="valueselect" :data="data" :titles="['未拥有权限', '已拥有权限']"></el-transfer>
        </div>
        <el-button @click="savepermission" type="primary" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="数据保存中" class="mdui-float-right">保存</el-button>
      </el-tab-pane>
      <!-- <el-tab-pane label="用户组权限" name="group">

      </el-tab-pane>-->
    </el-tabs>
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getuser,
  getUserPermission,
  updateUserPermission
} from '../../api/api.js'
export default {
  data () {
    return {
      activeName: 'user',
      tableData: [],
      radio: '',
      radioselect: 0,
      datatotal: 100,
      pagesize: 10,
      data: [],
      valueselect: [],
      csrf: '',
      errormsg: '',
      errordialogVisible: false,
      loading: false,
      fullscreenLoading: false
    }
  },
  created () {
    this.getuser()
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
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
    getCurrentRow: function (index, row) {
      this.radioselect = row
      let _this = this
      _this.data = []
      _this.valueselect = []
      getUserPermission({ userid: row.id })
        .then(response => {
          let allpermission = response.data.all
          let userpermission = response.data.userpermission
          for (let i = 0; i < allpermission.length; i++) {
            _this.data.push({
              key: allpermission[i].id,
              label: allpermission[i].name
            })
          }
          for (let i = 0; i < userpermission.length; i++) {
            _this.valueselect.push(userpermission[i].id)
          }
          _this.csrf = response.data.csrf
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
    },
    getpermisson: function (value) {
      console.log(value)
    },
    savepermission: function () {
      let _this = this
      let userid = _this.radioselect.id
      let valueselect = _this.valueselect
      _this.fullscreenLoading = true
      updateUserPermission(
        userid,
        {
          valueselect: valueselect,
          csrfmiddlewaretoken: _this.csrf
        },
        {
          'X-CSRFToken': _this.csrf
        }
      )
        .then(response => {
          _this.fullscreenLoading = false
          this.$alert('权限设置成功', '权限设置', {
            confirmButtonText: '确定'
          })
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
<style>
#transfer {
  padding: 30px 10% 0 10%;
}
#transfer .el-transfer-panel {
  width: 38% !important;
}
.el-transfer-panel__item.el-checkbox{
  display: block;
}
</style>
