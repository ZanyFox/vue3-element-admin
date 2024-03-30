import path from "path"
import vue from '@vitejs/plugin-vue';
// 压缩插件
import viteCompression from 'vite-plugin-compression'
// 使用自动引入插件
import AutoImport from 'unplugin-auto-import/vite'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import UnoCSS from 'unocss/vite'

export default function createVitePlugins(env, isBuild) {

    // 在配置阶段获取不到import.meta.env  需要使用loadEnv获取
    console.log('import.meta.env: ', import.meta.env, 'env: ', env)

    return [
        vue(),
        AutoImport({
            imports: [
                'vue',
                'vue-router',
                'pinia'
            ],
            dts: false
        }),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
            symbolId: 'icon-[dir]-[name]',
            svgoOptions: isBuild
        }),
        viteCompression({
            verbose: true, // 是否在控制台输出压缩结果
            disable: false, // 是否禁用
            threshold: 10240, // 体积大于 threshold 才会被压缩,单位 B 不指定全压缩
            algorithm: 'gzip', // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
            ext: '.gz', // 生成的压缩包后缀
            deleteOriginFile: false //压缩后是否删除源文件
        }),
        UnoCSS()
    ]
}
