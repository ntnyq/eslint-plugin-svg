import {
  defineConfig,
  presetIcons,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  presets: [
    presetWind3(),
    presetIcons({
      autoInstall: true,
      extraProperties: {},
      scale: 1.2,
    }),
  ],
  theme: {
    colors: {},
  },
})
