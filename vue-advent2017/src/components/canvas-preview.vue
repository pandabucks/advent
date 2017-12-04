<template>
  <div id="canvas">
    <canvas width="750" height="1334" ref="canvas" :class="{small:isSmall}">
    </canvas>
  </div>
</template>

<script>
import calender from '../calender.js'
import { defineFonts, defaults } from '../configs.js'

export default {
  name: 'CanvasPreview',
  props: {
    isSmall: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    setup() {
      this.$nextTick(() => {
        calender.setup()
      })
    }
  },
  created() {
    WebFont.load({
      google: {
        families: Object.keys(defineFonts)
      },
      fontactive: familyName => {
        if (familyName === defaults.font) {
          this.setup()
        }
      },
      inactive: () => {
        this.setup()
      }
    })
  },
  mounted() {
    calender.load(this.$refs.canvas)
  },
  beforeDestroy() {
    calender.destroy()
  }
}
</script>

<style lang="scss" scoped>
canvas {
  border: 1px solid #000;
  width: 750px;
  height: 1334px;
  transition: width 0.4s, height 0.4s;
}
canvas.small {
  width: calc(750px * 2 / 5);
  height: calc(1334px * 2 / 5);
}
@media (max-width: 860px) {
  canvas {
    max-width: 100%;
    height: auto;
  }
}
</style>
