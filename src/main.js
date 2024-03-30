import {createApp} from 'vue'

import router from '@/router'
import store from '@/store'
import Cookies from 'js-cookie'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/es/locale/lang/zh-cn'

// 生成svg
import 'virtual:svg-icons-register'
import elementIcons from '@/components/SvgIcon/svgicon'

// 样式
import '@/assets/styles/index.scss'
import 'virtual:uno.css'

// 注册指令
import plugins from './plugins'



// SVG组件  分页组件 自定义表格工具组件  富文本组件 文件上传组件 图片上传组件  图片预览组件 自定义树选择组件  字典标签组件
import App from './App.vue'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import Pagination from '@/components/Pagination/index.vue'
import RightToolbar from '@/components/RightToolbar/index.vue'
import Editor from "@/components/Editor/index.vue"
import FileUpload from "@/components/FileUpload/index.vue"
import ImageUpload from "@/components/ImageUpload/index.vue"
import ImagePreview from "@/components/ImagePreview/index.vue"
import TreeSelect from '@/components/TreeSelect/index.vue'
import DictTag from '@/components/DictTag/index.vue'

const app = createApp(App)


// 注册全局组件
app.component('svg-icon', SvgIcon)
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('TreeSelect', TreeSelect)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)
app.component('Editor', Editor)

app.use(store).use(router)
    .use(elementIcons)
    .use(plugins)
    .use(ElementPlus, {
        locale: locale,
        // size 用于设置表单组件的默认尺寸
        size: Cookies.get('size') || 'default'
    })

// directive(app)
app.mount('#app')


