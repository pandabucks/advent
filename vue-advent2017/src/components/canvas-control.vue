<template>
  <div id="control">
    <button @click="$emit('close')" class="close">×</button>
    <dl>
      <dt>カレンダー</dt>
      <dd class="rows">
        <my-select :options="yearOptions" v-model.number="year" layout="inline" width="60px" key="hoge"></my-select>
        <label>年</label>
        <my-select :options="monthOptions" v-model.number="month" layout="inline" width="40px"></my-select>
        <label>年</label>
      </dd>
      <dt>文字背景色</dt>
      <dd>
        <label>日曜 <input type="color" v-model="bgColorSun"></label>
        <label>平日 <input type="color" v-model="bgColor"></label>
        <label>土曜 <input type="color" v-model="bgColorSat"></label>
      </dd>
      <dt>文字色</dt>
      <dd>
        <label>日曜 <input type="color" v-model="textColorSun"></label>
        <label>平日 <input type="color" v-model="textColor"></label>
        <label>土曜 <input type="color" v-model="textColorSat"></label>
      </dd>
      <dt>背景画像</dt>
      <dd>
        <my-select :options="imageOptions" v-model="image">
          {{ imageOptions[image].label }}
        </my-select>
      </dd>
      <dt>フォント</dt>
      <dd>
        <my-select :options="fontOptions" v-model="font">
          <span slot="option" slot-scope="{val}" :style="{'font-family':fontLabel(val)}">
            {{ fontLabel(val) }}
          </span>
        </my-select>
      </dd>
    </dl>
    <button @click="handleDownloadButtonClick" class="button">ファイルを保存</button>
  </div>
</template>

<script>
import MySelect from './my-select.vue'
import calendar from '../calendar.js'
import { defineFonts, defineImages, defaults, options } from '../configs.js'
import { createRange } from '../utils.js'

export default {
  name: 'CanvasControl',
  data() {
    return {
      ...Object.assign({}, defaults)
    }
  },
  computed: {
    fontOptions() {
      return defineFonts
    },
    imageOptions() {
      return defineImages
    },
    yearOptions() {
      return createRange(2010, defaults.year + 1).reverse()
    },
    monthOptions() {
      return createRange(1, 12)
    },
    fullDate() {
      return [this.year, this.month]
    }
  },
  watch: {
    fullDate([year, month]) {
      calendar.setDate(year, month)
    },
    image(value) {
      calendar.setImage(value)
    },
    font(value) {
      calendar.setFont(value)
    },
    bgColor(value) {
      calendar.setBgColor(value, -1)
    },
    bgColorSun(value) {
      calendar.setBgColor(value, 0)
    },
    bgColorSat(value) {
      calendar.setBgColor(value, 6)
    },
    textColor(value) {
      calendar.setTextColor(value, -1)
    },
    textColorSun(value) {
      calendar.setTextColor(value, 0)
    },
    textColorSat(value) {
      calendar.setTextColor(value, 6)
    }
  },
  methods: {
    fontLabel(value) {
      return this.fontOptions[value].label
    },
    fontStyle(value) {
      return `font-family: ${defineFonts[value].value}`
    },
    handleDownloadButtonClick() {
      if (window.confirm('現在の画像をファイルとして保存します')) {
        try {
          calendar.toDataURL(
            blob => {
              const a = document.createElement('a')
              a.href = window.URL.createObjectURL(blob)
              a.setAttribute('download', 'canvas.png')
              if (window.URL && window.URL.createObjectURL) {
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            },
            msblob => {
              window.navigator.msSaveBlob(msblob, 'canvas.png')
            }
          )
        } catch (e) {
          alert(e)
        }
      }
    }
  },
  components: {
    MySelect
  }
}
</script>

<style lang="scss" scoped>
#control {
  width: 100%;
}
dl {
  margin: 0;
  dt {
    margin: 16px 0 8px;
    font-weight: bold;
  }
  dd {
    margin: 0;
  }
}
select {
  height: 24px;
  border: 1px solid #ccc;
  border-radius: 2px;
}
input[type='color'] {
  width: 50px;
  height: 24px;
  border: 1px solid #ccc;
  border-radius: 2px;
}
.rows {
  display: flex;
  > label {
    display: block;
    padding: 0 4px;
    line-height: 32px;
  }
}
.button {
  display: block;
  background: rgb(232, 71, 85);
  border: none;
  border-radius: 20px;
  margin: 20px auto 10px;
  padding: 0 8px;
  line-height: 32px;
  text-align: center;
  width: 180px;
  color: #fff;
}

.close {
  box-sizing: content-box;
  position: absolute;
  right: 10px;
  top: 10px;
  display: block;
  background: #fff;
  border-radius: 20px;
  padding: 0;
  width: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 20px;
}
</style>
