<template>
  <div id="app">
    <h1>Nantoka Generator</h1>
    <ul class="view-state">
      <li>
        <label><input type="checkbox" v-model="isSmall"> 縮小表示</label>
      </li>
      <li>
        <button @click="enabledPanel=!enabledPanel" class="button">操作パネル</button>
      </li>
    </ul>
    <main>
      <canvas-preview :isSmall="isSmall"></canvas-preview>
      <p>ドラッグ＆ドロップで動かせます</p>
    </main>
    <transition>
      <div id="controlWrapper" v-show="enabledPanel">
        <canvas-control @close="enabledPanel=false"></canvas-control>
      </div>
    </transition>
  </div>
</template>

<script>
import CanvasPreview from './components/canvas-preview'
import CanvasControl from './components/canvas-control'
export default {
  name: 'app',
  data() {
    return {
      enabledPanel: true,
      isSmall: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (window.innerWidth < 750) {
        this.enabledPanel = false
      }
    })
  },
  components: {
    CanvasPreview,
    CanvasControl
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 14px;
}
h1 {
  text-align: center;
  font-family: 'Merriweather';
  font-size: 3em;
}

ul.view-state {
  list-style: none;
  text-align: center;
  li {
    margin: 4px;
    display: inline-block;
  }
}
main {
  text-align: center;
}
#controlWrapper {
  position: fixed;
  background: rgba(230, 230, 230, 0.85);
  top: 0;
  right: 0;
  height: 100%;
  width: 310px;
  padding: 10px;
}
.button {
  background: rgb(232, 71, 85);
  border: none;
  border-radius: 20px;
  padding: 0 8px;
  line-height: 32px;
  text-align: center;
  color: #fff;
}
@media screen and (max-width: 480px) {
  h1 {
    font-size: 2em;
  }
  #controlWrapper {
    width: 100%;
  }
}

.v-enter-active,
.v-leave-active {
  transition: transform 0.6s;
}
.v-enter,
.v-leave-to {
  transform: translateX(100%);
}
</style>
