import router from '@/router/router.js'
import {ElMessage} from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getToken} from '@/js/token.js'
import {isHttp} from '@/utils/validate.js'
import {isReLogin} from '@/utils/request.js'
import useUserStore from '@/store/modules/user.js'
import useSettingsStore from '@/store/modules/settings.js'
import usePermissionStore from '@/store/modules/permission.js'

NProgress.configure({showSpinner: false});

const whiteList = ['/login', '/register'];


router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      next({path: '/'})
      NProgress.done()
    } else if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if (!useUserStore().isFetch) {
        // isReLogin.show = true
        // 判断当前用户是否已拉取完user_info信息
        useUserStore().getInfo().then(() => {
          isReLogin.show = false
          usePermissionStore().generateRoutes().then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            accessRoutes.forEach(route => {
              if (!isHttp(route.path)) {
                router.addRoute(route) // 动态添加可访问路由表
              }
            })
            // debugger
            next({...to, replace: true}) // hack方法 确保addRoutes已完成
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})


// 放行的路由都会走后置守卫，在这里停止进度条即可
router.afterEach((to, from) => {
  NProgress.done()
})
