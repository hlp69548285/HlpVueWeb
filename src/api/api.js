import axios from 'axios'
// // import $ from 'jquery'
// let apihost = 'http://192.168.1.199:8000/api_v1'
// let host = 'http://192.168.1.199:8000'
let apihost = 'http://127.0.0.1:8000/api_v1'
let host = 'http://127.0.0.1:8000'
export const cookie = {
  setCookie (cName, value, expiredays, path = '/') {
    var exdate = new Date()
    exdate.setTime(exdate.getTime() + expiredays)
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = cName + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
  },
  getCookie (name) {
    var arr
    var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if ((arr = document.cookie.match(reg)) != null) {
      return (arr[2])
    } else {
      return null
    }
  },
  delCookie (name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = cookie.getCookie(name)
    if (cval != null) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    }
  }
}

export const login = params => {
  return axios.post(`${host}/login/`, params)
}

export const resetPassword = params => {
  return axios.post(`${host}/resetpassword/`, params)
}

export const getuser = params => {
  return axios.get(`${apihost}/users/`, { params: params })
}

export const addUser = params => {
  return axios.post(`${apihost}/users/`, params)
}

export const getchangePassword = () => {
  return axios.get(`${host}/change/`)
}

export const changeP = (headers, params) => {
  return axios.post(`${host}/change/`, params, { headers: headers, withCredentials: true })
}

export const changePassword = params => {
  return axios.post(`${host}/changepassword/`, params)
}

export const deleteUser = userId => {
  return axios.delete(`${apihost}/users/` + userId + '/')
}

export const getDevice = params => {
  return axios.get(`${apihost}/device/`, { params: params })
}

export const getDeviceDetail = (deviceid) => {
  return axios.get(`${apihost}/device/${deviceid}/`)
}

export const addDevice = params => {
  console.log(params)
  return axios.post(`${apihost}/device/`, params)
}

export const deleteDevice = deviceId => {
  return axios.delete(`${apihost}/device/` + deviceId + '/')
}

export const updateDevice = (deviceId, params) => {
  return axios.patch(`${apihost}/device/` + deviceId + '/', params)
}

export const getTerminal = params => {
  return axios.get(`${apihost}/terminal/`, { params: params })
}

export const deleteTerminal = terminalId => {
  return axios.delete(`${apihost}/terminal/` + terminalId + '/')
}

export const addTerminal = params => {
  console.log(params)
  return axios.post(`${apihost}/terminal/`, params)
}

export const updateTerminal = (terminalId, params) => {
  return axios.patch(`${apihost}/terminal/` + terminalId + '/', params)
}

export const getTerminalDetail = (terminalId) => {
  return axios.get(`${apihost}/terminal/${terminalId}/`)
}

export const getArea = params => {
  return axios.get(`${apihost}/area/`, { params: params })
}

export const addArea = params => {
  console.log(params)
  return axios.post(`${apihost}/area/`, params)
}

export const updateArea = (areaId, params) => {
  return axios.patch(`${apihost}/area/` + areaId + '/', params)
}

export const getAreaDetail = (areaId, params) => {
  return axios.get(`${apihost}/area/${areaId}/`, { params: params })
}

export const deleteArea = areaId => {
  return axios.delete(`${apihost}/area/` + areaId + '/')
}

export const getWarn = params => {
  return axios.get(`${apihost}/warn/`, { params: params })
}

export const updateWarn = (warnId, params, headers) => {
  return axios.patch(`${apihost}/warn/` + warnId + '/', params, headers)
}

export const getMaintain = params => {
  return axios.get(`${apihost}/maintain/`, { params: params })
}

export const addMaintain = (params, headers) => {
  return axios.post(`${apihost}/maintain/`, params, headers)
}

export const updateMaintain = (warnId, params, headers) => {
  return axios.patch(`${apihost}/maintain/` + warnId + '/', params, headers)
}

export const getEleTerminalData = params => {
  return axios.get(`${host}/geteleterminaldata/`, { params: params })
}

export const getUserPermission = params => {
  return axios.get(`${apihost}/userpermission/`, { params: params })
}

export const updateUserPermission = (userid, params) => {
  return axios.patch(`${apihost}/userpermission/` + userid + '/', params)
}

export const getGateway = params => {
  return axios.get(`${apihost}/gateway/`, { params: params })
}

export const getTerminalData = params => {
  return axios.get(`${apihost}/terminaldata/`, { params: params })
}

export const deleteGateway = gatewayId => {
  return axios.delete(`${apihost}/gateway/` + gatewayId + '/')
}

export const addGateway = params => {
  return axios.post(`${apihost}/gateway/`, params)
}

export const updateGateway = (gatewayId, params) => {
  return axios.patch(`${apihost}/gateway/` + gatewayId + '/', params)
}

export const getGatewayDetail = (gatewayId, params) => {
  return axios.get(`${apihost}/gateway/${gatewayId}/`, { params: params })
}

export const getVibrationData = params => {
  return axios.get(`${apihost}/vibrationterminaldata/`, { params: params })
}

export const getLightData = params => {
  return axios.get(`${apihost}/lightterminaldata/`, { params: params })
}

export const getLightDataDetail = params => {
  return axios.get(`${host}/getlightterminaldata/`, { params: params })
}

export const getVibrationDataDetail = params => {
  return axios.get(`${host}/getvibrationterminaldata/`, { params: params })
}

export const getTempertureDetail = params => {
  return axios.get(`${host}/gettemperturedata/`, { params: params })
}

export const uploadfile = (params, headers) => {
  return axios.post(`${apihost}/equipfile/`, params, headers)
}

export const getdevicefile = params => {
  return axios.get(`${apihost}/equipfile/`, { params: params })
}

export const deleteEquipfile = equipfileId => {
  return axios.delete(`${apihost}/equipfile/` + equipfileId + '/')
}

export const getDeviceFile = fileid => {
  return axios.post(`${host}/download/` + fileid + '/')
}

export const getMaintainSetting = params => {
  return axios.get(`${apihost}/maintainsetting/`, { params: params })
}

export const addMaintainSetting = params => {
  return axios.post(`${apihost}/maintainsetting/`, params)
}

export const updateMaintainSetting = (maintainsettingId, params) => {
  return axios.patch(`${apihost}/maintainsetting/` + maintainsettingId + '/', params)
}

export const deleteMaintainSetting = maintainsettingId => {
  return axios.delete(`${apihost}/maintainsetting/` + maintainsettingId + '/')
}

export const getDeviceProduct = params => {
  return axios.get(`${apihost}/deviceproduct/`, {params: params})
}

export const addDeviceProduct = params => {
  return axios.post(`${apihost}/deviceproduct/`, params)
}

export const updateDeviceProduct = (deviceproductid, params) => {
  return axios.patch(`${apihost}/deviceproduct/${deviceproductid}/`, params)
}

export const delDeviceProduct = (deviceproductid) => {
  return axios.delete(`${apihost}/deviceproduct/${deviceproductid}/`)
}

export const getIndex = params => {
  return axios.get(`${host}/getindex/`, {params: params})
}

export const getPlcData = params => {
  return axios.get(`${apihost}/plcdata/`, {params: params})
}

export const getThreshold = params => {
  return axios.get(`${apihost}/threshold/`, { params: params })
}

export const addThreshold = params => {
  console.log(params)
  return axios.post(`${apihost}/threshold/`, params)
}

export const deleteThreshold = thresholdId => {
  return axios.delete(`${apihost}/threshold/` + thresholdId + '/')
}

export const updateThreshold = (thresholdId, params) => {
  return axios.patch(`${apihost}/threshold/` + thresholdId + '/', params)
}

export const getTemperturedata = params => {
  return axios.get(`${apihost}/tempertureterminaldata/`, {params: params})
}

export const setData = (headers, params) => {
  return axios.post(`${host}/setdata/`, params, { headers: headers })
}

export const setThreshold = (headers, params) => {
  return axios.post(`${host}/setthresholddata/`, params, { headers: headers })
}

export const addQuickSet = (params) => {
  return axios.post(`${apihost}/quickset/`, params)
}

export const getQuickSet = params => {
  return axios.get(`${apihost}/quickset/`, {params: params})
}

export const delQuickSet = (quicksetid) => {
  return axios.delete(`${apihost}/quickset/${quicksetid}/`)
}

export const getStatus = params => {
  return axios.get(`${host}/getstatus/`, {params: params})
}
