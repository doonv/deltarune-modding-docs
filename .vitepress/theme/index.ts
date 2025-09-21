// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme, { VPImage } from 'vitepress/theme'
import HexColorDisplay from './components/HexColorDisplay.vue'
import CaptionImage from './components/CaptionImage.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('hexclr', HexColorDisplay);
    app.component('imgcaption', CaptionImage);
    app.component('Image', VPImage);
  }
} satisfies Theme
