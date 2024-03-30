import {fileURLToPath, URL} from 'node:url'
import path from 'path'
import {defineConfig, loadEnv} from 'vite'
import createVitePlugins from './vite/plugins.js'

// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {

    // 根据指定的 --mode 参数获取对应的配置文件
    const env = loadEnv(mode, process.cwd())
    return {
        plugins: [
            createVitePlugins(env, command === 'build'),
        ],
        resolve: {
            alias: {
                '@':
                    fileURLToPath(new URL('./src', import.meta.url)),
                '~':
                    path.resolve('./', __dirname)
                // '~': fileURLToPath(new URL('./'), import.meta.url)
            },
            // https://cn.vitejs.dev/config/#resolve-extensions
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
        },
        server: {
            host: true,
            open: false,
            proxy: {
                // https://cn.vitejs.dev/config/#server-proxy
                '/dev-api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    rewrite: (p) => p.replace(/^\/dev-api/, '')
                }
            }
        },
    }
})

console.log('hello', __dirname, import.meta.url)
