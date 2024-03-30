import * as components from '@element-plus/icons-vue'

// 导入所有图标并进行全局注册
export default function install(app) {
    for (const key in components) {
        const componentConfig = components[key];
        app.component(componentConfig.name, componentConfig);
    }
}
