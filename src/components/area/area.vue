<template>
  <div id="content">
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div>
      <router-link :to="{path:'/areaadd'}">
        <button
          class="mdui-btn mdui-ripple mdui-color-green mdui-btn-raised"
          @click="dialogFormVisible = true"
        >新增</button>
      </router-link>
      <button class="mdui-btn mdui-ripple mdui-color-blue mdui-btn-raised" @click="areaalert">修改</button>
      <button
        class="mdui-btn mdui-ripple mdui-color-red mdui-btn-raised"
        @click="deldialogVisible = true"
      >删除</button>
      <div style="width:350px;display:inline-block;margin-left:10px">
        <el-input placeholder="请输入内容" v-model="searchcontent" class="input-with-select" @keyup.enter.native="getarea">
          <el-select v-model="searchname" slot="prepend" placeholder="请选择">
            <el-option label="名称" value="areaname"></el-option>
            <el-option label="编号" value="areacode"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="getarea"></el-button>
        </el-input>
      </div>
      <el-button @click="clearsearch">清空搜索</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" border style="width: 100%;margin-top:10px">
      <el-table-column align="center" width="55" label>
        <template slot-scope="scope">
          <el-radio
            :label="scope.$index"
            v-model="radio"
            @change.native="getCurrentRow(scope.$index,scope.row)"
          >&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="areacode" label="区域编号"></el-table-column>
      <el-table-column align="center" prop="areaname" label="区域名称"></el-table-column>
      <el-table-column align="center" prop="parentname" label="所属区域"></el-table-column>
    </el-table>
    <el-dialog title="删除提示" :visible.sync="deldialogVisible" width="500px">
      <span style="color:red">是否确认删除,在此区域的设备所属区域将设置为空</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deldialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletearea">确 定</el-button>
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
import { getArea, deleteArea } from '../../api/api.js'
export default {
  name: 'Area',
  data () {
    return {
      errormsg: '',
      errordialogVisible: false,
      tableData: [],
      radio: '',
      radioselect: 0,
      datatotal: 0,
      pagesize: 10000,
      deldialogVisible: false,
      deldialogVisibledips: false,
      currentPage: 1,
      searchname: '',
      searchcontent: '',
      loading: false
    }
  },
  created () {
    this.getarea()
  },
  methods: {
    getarea: function (parmas) {
      var _this = this
      _this.loading = true
      if (_this.searchname !== '') {
        parmas[_this.searchname] = _this.searchcontent
      }
      getArea(parmas)
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
      _this.getarea({
        page: val
      })
    },
    clearsearch: function () {
      this.searchcontent = ''
      this.searchname = ''
      this.getarea()
    },
    deletearea () {
      let _this = this
      deleteArea(_this.radioselect)
        .then(response => {
          _this.deldialogVisible = false
          _this.getarea()
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
    areaalert () {
      let id = this.radioselect
      this.$router.push({ path: '/areadetail', query: { id: id } })
    }
  }
}
</script>
