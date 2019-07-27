<template>
  <div id="content">
    <el-dialog title="错误提示" :visible.sync="errordialogVisible" width="500px">
      <span style="color:red">{{errormsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div>
        <button
          class="mdui-btn mdui-ripple mdui-color-green mdui-btn-raised" @click="addProductDialog = true"
        >新增</button>
      <button class="mdui-btn mdui-ripple mdui-color-blue mdui-btn-raised" @click="updateProductDialog = true">修改</button>
      <button
        class="mdui-btn mdui-ripple mdui-color-red mdui-btn-raised" @click="delproduct"
      >删除</button>
      <div style="width:350px;display:inline-block;margin-left:10px">
        <el-input
          placeholder="请输入内容"
          v-model="searchcontent"
          class="input-with-select"
        >
          <el-select v-model="searchname" slot="prepend" placeholder="请选择">
            <el-option label="产品名称" value="productname"></el-option>
            <el-option label="程序名称" value="codename"></el-option>
            <el-option label="产品型号" value="producttype"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="getdeviceproduct"></el-button>
        </el-input>
      </div>
      <el-button>清空搜索</el-button>
    </div>
    <el-table
    :data="productData"
    border
    highlight-current-row
    @current-change="handleCurrentChange"
    style="width: 100%">
    <el-table-column align="center"
      type="index"
      width="50">
    </el-table-column>
      <el-table-column align="center" width="55" label="选择">
        <template slot-scope="scope">
          <el-radio
            :label="scope.$index"
            v-model="radio"
            @change.native="getCurrentRow(scope.$index,scope.row)"
          >&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="productname" label="产品名称"></el-table-column>
      <el-table-column align="center" prop="codename" label="程序名称"></el-table-column>
      <el-table-column align="center" prop="producttype" label="产品型号"></el-table-column>
      <el-table-column align="center" prop="devicename" label="设备名称"></el-table-column>
    </el-table>

    <el-dialog
    title="新增产品"
    :visible.sync="addProductDialog"
    >
      <el-form
      ref="form"
      :model="form">
        <el-form-item label="产品名称">
          <el-input v-model="form.productname"></el-input>
        </el-form-item>
        <el-form-item label="程序编号">
          <el-input v-model="form.codename"></el-input>
        </el-form-item>
        <el-form-item label="产品型号">
          <el-input v-model="form.producttype"></el-input>
        </el-form-item>
        <el-form-item label="所属设备">
          <el-select v-model="form.device">
            <el-option :label="item.devicename" :value="item.id" :key="item.id" v-for="item in devices"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="倍率">
          <el-input v-model="form.power"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addproduct">保存</el-button>
          <el-button @click="addProductDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
        <el-dialog
    title="修改产品"
    :visible.sync="updateProductDialog"
    >
      <el-form
      ref="updateform"
      :model="updateform">
        <el-form-item label="产品名称">
          <el-input v-model="updateform.productname"></el-input>
        </el-form-item>
        <el-form-item label="程序编号">
          <el-input v-model="updateform.codename"></el-input>
        </el-form-item>
        <el-form-item label="产品型号">
          <el-input v-model="updateform.producttype"></el-input>
        </el-form-item>
        <el-form-item label="所属设备">
          <el-select v-model="updateform.device">
            <el-option :label="item.devicename" :value="item.id" :key="item.id" v-for="item in devices"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="倍率">
          <el-input v-model="updateform.power"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateproduct">保存</el-button>
          <el-button @click="updateProductDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getDeviceProduct, updateDeviceProduct, addDeviceProduct, delDeviceProduct, getDevice} from '../../api/api'
export default {
  name: 'DeviceProduct',
  data () {
    return {
      productData: [],
      searchname: '',
      searchcontent: '',
      device: [],
      addProductDialog: false,
      updateProductDialog: false,
      devices: [],
      radioselect: '',
      radio: '',
      currentRow: null,
      errormsg: '',
      errordialogVisible: false,
      form: {
        productname: '',
        codename: '',
        producttype: '',
        device: '',
        power: ''
      },
      updateform: {
        productname: '',
        codename: '',
        producttype: '',
        device: '',
        power: ''
      }
    }
  },
  mounted () {
    this.getdevice()
    this.getdeviceproduct()
  },
  methods: {
    getdevice: function () {
      let _this = this
      getDevice().then((response) => {
        _this.devices = response.data.results
      }).catch((error) => {
        console.log(error)
      })
    },
    getdeviceproduct: function (parmas) {
      let _this = this
      if (_this.searchname !== '') {
        parmas[_this.searchname] = _this.searchcontent
      }
      getDeviceProduct(parmas).then((response) => {
        console.log(response)
        _this.productData = response.data
      }).catch((error) => {
        let count = 1
        _this.errormsg = ''
        for (let i in error) {
          _this.errormsg += count + '、' + i + ':' + error[i] + '\n'
          count++
        }
        _this.errordialogVisible = true
      })
    },
    addproduct: function () {
      let _this = this
      addDeviceProduct({
        'productname': _this.form.productname,
        'producttype': _this.form.producttype,
        'codename': _this.form.codename,
        'device': _this.form.device,
        'power': _this.form.power
      }).then((response) => {
        _this.addProductDialog = false
        _this.getdeviceproduct()
      }).catch((error) => {
        let count = 1
        _this.errormsg = ''
        for (let i in error) {
          _this.errormsg += count + '、' + i + ':' + error[i] + '\n'
          count++
        }
        _this.errordialogVisible = true
      })
    },
    updateproduct: function () {
      let _this = this
      updateDeviceProduct(_this.currentRow.id, {
        'productname': _this.updateform.productname,
        'producttype': _this.updateform.producttype,
        'codename': _this.updateform.codename,
        'device': _this.updateform.device,
        'power': _this.updateform.power
      }).then((response) => {
        _this.updateProductDialog = false
        _this.getdeviceproduct()
      }).catch((error) => {
        let count = 1
        _this.errormsg = ''
        for (let i in error) {
          _this.errormsg += count + '、' + i + ':' + error[i] + '\n'
          count++
        }
        _this.errordialogVisible = true
      })
    },
    delproduct: function () {
      let _this = this
      delDeviceProduct(_this.currentRow.id).then((response) => {
        _this.getdeviceproduct()
      }).catch((error) => {
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
      this.updateform.productname = row.productname
      this.updateform.codename = row.codename
      this.updateform.producttype = row.producttype
      this.updateform.device = row.device
      this.updateform.power = row.power
    },
    handleCurrentChange (val) {
      this.currentRow = val
      this.radio = val
    }
  }
}
</script>

<style scoped>
.current-row {
  background-color: #2c3e50 !important;
}
</style>
