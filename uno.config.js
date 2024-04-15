// eslint-disable-next-line no-restricted-imports
import {
    defineConfig,
    presetAttributify,
    presetUno,
} from 'unocss'

export default defineConfig({
    rules: [],
    shortcuts: {},
    presets: [
        presetUno(),
        // 属性化预设
        presetAttributify(),
    ],
})
