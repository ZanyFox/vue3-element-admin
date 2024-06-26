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
        presetAttributify(),
    ],
})
