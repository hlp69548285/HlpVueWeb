import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import HelloWorld from '@/components/Login'
// import Tree from '@/components/Tree'
// import App from '../App'
import Nav from '@/components/index/nav'
import NavNull from '@/components/index/navnull'
import Footer from '@/components/index/footer'
import AppIndex from '@/components/index/app'
import Index from '@/components/index/index'
import User from '@/components/user/user'
import Permisson from '@/components/user/permission'
import DeviceDetail from '@/components/device/devicedetail'
import DeviceIndex from '@/components/device/deviceindex'
import DeviceAdd from '@/components/device/deviceadd'
import Area from '@/components/area/area'
import AreaAdd from '@/components/area/areaadd'
import AreaDetail from '@/components/area/areadetail'
import TerminalIndex from '@/components/terminal/terminalindex'
import TerminalDetail from '@/components/terminal/terminaldetail'
import TerminalInstall from '@/components/terminal/terminalinstall'
import TerminalAdd from '@/components/terminal/terminaladd'
import Warn from '@/components/warn/warn'
import Maintain from '@/components/warn/maintain'
import Data from '@/components/data/data'
import Login from '@/components/login/login'
import DataDetail from '@/components/data/datadetail'
import GatewayIndex from '@/components/gateway/gatewayindex'
import GatewayAdd from '@/components/gateway/gatewayadd'
import GatewayDetail from '@/components/gateway/gatewaydetail'
import LightDataDetail from '@/components/data/lightdetail'
import VibrationDataDetail from '@/components/data/vibrationdetail'
import DeviceFile from '@/components/device/devicefile'
import MaintainSetting from '@/components/warn/maintainsetting'
import Error500 from '@/components/index/500'
import Error404 from '@/components/index/404'
import NETError from '@/components/index/neterror'
import DeviceProduct from '@/components/device/deviceproduct'
import PLC from '@/components/data/plc'
import TemptureData from '@/components/data/tempture'
import Threshold from '@/components/threshold/threshold'
import SetData from '@/components/setdata/setdata'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: AppIndex,
      children: [{
        path: 'login',
        name: 'Login',
        components: {
          head: NavNull,
          content: Login,
          footer: NavNull
        },
        meta: {
          title: '合立普能源管理系统'
        }
      }, {
        path: '/500',
        name: '500',
        components: {
          head: NavNull,
          content: Error500,
          footer: NavNull
        },
        meta: {
          title: '合立普能源管理系统-后台服务器错误'
        }
      }, {
        path: '/404',
        name: '404',
        components: {
          head: NavNull,
          content: Error404,
          footer: NavNull
        },
        meta: {
          title: '合立普能源管理系统-页面丢失了'
        }
      }, {
        path: '/neterror',
        name: 'neterror',
        components: {
          head: NavNull,
          content: NETError,
          footer: NavNull
        },
        meta: {
          title: '合立普能源管理系统-网络连接错误'
        }
      }, {
        path: '/',
        name: 'Indexdefault',
        components: {
          head: Nav,
          content: Index,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统'
        }
      }, {
        path: '/index',
        name: 'Index',
        components: {
          head: Nav,
          content: Index,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统'
        }
      }, {
        path: 'user',
        name: 'User',
        components: {
          head: Nav,
          content: User,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-用户管理'
        }
      }, {
        path: 'permisson',
        name: 'Permisson',
        components: {
          head: Nav,
          content: Permisson,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-权限管理'
        }
      }, {
        path: 'device',
        name: 'Device',
        components: {
          head: Nav,
          content: DeviceIndex,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-设备管理'
        }
      }, {
        path: 'deviceadd',
        name: 'DeviceAdd',
        components: {
          head: Nav,
          content: DeviceAdd,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-增加设备'
        }
      }, {
        path: 'devicedetail',
        name: 'DeviceDetail',
        components: {
          head: Nav,
          content: DeviceDetail,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-设备详情'
        }
      }, {
        path: 'deviceproduct',
        name: 'DeviceProduct',
        components: {
          head: Nav,
          content: DeviceProduct,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-产品管理'
        }
      }, {
        path: 'area',
        name: 'Area',
        components: {
          head: Nav,
          content: Area,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-区域管理'
        }
      }, {
        path: 'areaadd',
        name: 'AreaAdd',
        components: {
          head: Nav,
          content: AreaAdd,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-增加区域'
        }
      }, {
        path: 'areadetail',
        name: 'AreaDetail',
        components: {
          head: Nav,
          content: AreaDetail,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-区域修改'
        }
      }, {
        path: 'terminalindex',
        name: 'TerminalIndex',
        components: {
          head: Nav,
          content: TerminalIndex,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-终端管理'
        }
      }, {
        path: 'terminaladd',
        name: 'TerminalAdd',
        components: {
          head: Nav,
          content: TerminalAdd,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-增加区域'
        }
      }, {
        path: 'terminaldetail',
        name: 'TerminalDetail',
        components: {
          head: Nav,
          content: TerminalDetail,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-修改终端'
        }
      }, {
        path: 'terminalinstall',
        name: 'TerminalInstall',
        components: {
          head: Nav,
          content: TerminalInstall,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-终端安装'
        }
      }, {
        path: 'warn',
        name: 'Warn',
        components: {
          head: Nav,
          content: Warn,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-报警管理'
        }
      }, {
        path: 'maintain',
        name: 'Maintain',
        components: {
          head: Nav,
          content: Maintain,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-保养管理'
        }
      }, {
        path: 'data',
        name: 'Data',
        components: {
          head: Nav,
          content: Data,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-数据统计'
        }
      }, {
        path: 'datadetail',
        name: 'DataDetail',
        components: {
          head: Nav,
          content: DataDetail,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-电量数据详情'
        }
      }, {
        path: 'plcdata',
        name: 'PLCData',
        components: {
          head: Nav,
          content: PLC,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-PLC数据详情'
        }
      }, {
        path: 'tempturedata',
        name: 'TemptureData',
        components: {
          head: Nav,
          content: TemptureData,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-温度数据详情'
        }
      }, {
        path: 'gatewayindex',
        name: 'Gateway',
        components: {
          head: Nav,
          content: GatewayIndex,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-网关管理'
        }
      }, {
        path: 'gatewayadd',
        name: 'GatewayAdd',
        components: {
          head: Nav,
          content: GatewayAdd,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-增加网关'
        }
      }, {
        path: 'gatewaydetail',
        name: 'GatewayDetail',
        components: {
          head: Nav,
          content: GatewayDetail,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-修改网关'
        }
      }, {
        path: 'lightdatadetail',
        name: 'LightDataDetail',
        components: {
          head: Nav,
          content: LightDataDetail,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-光照数据详情'
        }
      }, {
        path: 'vibrationdatadetail',
        name: 'VibrationDataDetail',
        components: {
          head: Nav,
          content: VibrationDataDetail,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-震动数据详情'
        }
      }, {
        path: 'devicefile',
        name: 'DeviceFile',
        components: {
          head: Nav,
          content: DeviceFile,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-设备文件'
        }
      }, {
        path: 'maintainsetting',
        name: 'MaintainSetting',
        components: {
          head: Nav,
          content: MaintainSetting,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-保养设定'
        }
      }, {
        path: 'threshold',
        name: 'Threshold',
        components: {
          head: Nav,
          content: Threshold,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-阈值管理'
        }
      }, {
        path: 'setdata',
        name: 'SetData',
        components: {
          head: Nav,
          content: SetData,
          footer: Footer
        },
        meta: {
          title: '合立普能源管理系统-阈值管理'
        }
      }
      ],
      meta: {
        title: '合立普能源管理系统'
      }
    }
  ]
})
