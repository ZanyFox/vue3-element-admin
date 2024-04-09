import axios from 'axios'
import {ElNotification, ElMessageBox, ElMessage, ElLoading} from 'element-plus'
import {getToken} from '@/js/token.js'
import errorCode from '@/js/errorCode'
import {tansParams, blobValidate} from '@/utils/util.js'
import cache from '@/plugins/cache'
import {saveAs} from 'file-saver'
import useUserStore from '@/store/modules/user'
import NProgress from 'nprogress'

let downloadLoadingInstance;
// 是否显示重新登录
export let isReLogin = {show: false};

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API, // 超时
  timeout: 5_000
})

// request拦截器
service.interceptors.request.use(config => {
  // debugger;
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
    const limitSize = 5 * 1024 * 1024; // 限制存放数据5M
    if (requestSize >= limitSize) {
      console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
      return config;
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url;                // 请求地址
      const s_data = sessionObj.data;              // 请求数据
      const s_time = sessionObj.time;              // 请求时间
      const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交';
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器  use 相当于then传两个参数第一个是 onFulfilled，第二个是 onRejected
// 当响应没成功时 会走到 onRejected 就比如404 401 500 这些
service.interceptors.response.use(resp => {

  // 未设置状态码则默认成功状态
  let code = resp.data.code

  // 获取错误信息
  // const msg = errorCode[code] || res.data.msg || errorCode['default']


  // 二进制数据则直接返回
  if (resp.request.responseType === 'blob' || resp.request.responseType === 'arraybuffer') {
    return resp.data
  }
  const msg = errorCode[code] || resp.data.message || errorCode['default'];

  if (code === 500) {
    ElMessage({message: msg, type: 'error'})
    return Promise.reject(new Error(msg))
  } else if (code === 601) {
    ElMessage({message: msg, type: 'warning'})
    return Promise.reject(new Error(msg))
  } else if (code !== 0) {
    ElNotification.error({title: msg})
    return Promise.reject('error')
  } else {
    // 直接把响应中的data数据，也就是后端的json 传给下游
    return Promise.resolve(resp.data.data)
  }
}, error => {


  // 获取状态码  如果是超时异常 那么根本就没有响应
  const status = (error.response && error.response.status) || error.code
  const errorMsg = errorCode[status] || (error.response && error.response.statusText) || errorCode['default']

  if (status === 401) {
    processNotAuth()
  } else {
    ElNotification.error({title: errorMsg})
  }
  NProgress.done()
  return Promise.reject(error)
})


function processNotAuth() {
  if (!isReLogin.show) {
    isReLogin.show = true;
    ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
      confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning'
    }).then(() => {
      isReLogin.show = false;
      useUserStore().clearInfo()
      location.href = '/login';
    }).catch(() => {
      isReLogin.show = false;
    });
  }
}

// 通用下载方法
export function download(url, params, filename, config) {
  downloadLoadingInstance = ElLoading.service({text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)",})
  return service.post(url, params, {
    transformRequest: [(params) => {
      return tansParams(params)
    }], headers: {'Content-Type': 'application/x-www-form-urlencoded'}, responseType: 'blob', ...config
  }).then(async (data) => {
    const isBlob = blobValidate(data);
    if (isBlob) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}

export default service
