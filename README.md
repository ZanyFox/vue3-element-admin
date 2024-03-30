# vue3-admin-template

使用sass插件

`pnpm add sass -D`

安装element-plus

`pnpm install element-plus`

自动引入插件

`pnpm install -D unplugin-vue-components unplugin-auto-import`

SVG组件生成插件

```
pnpm add -D vite-plugin-svg-icons

// main.js
import 'virtual:svg-icons-register'


// vite.config.js

import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'

plugins: [
    createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: isBuild
    })
]
```

压缩插件

`pnpm add -D vite-plugin-compression`
