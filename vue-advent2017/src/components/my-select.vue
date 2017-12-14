<template>
  <div class="wrapper"
       tabindex="0"
       @focus="focus=true"
       @blur="focus=false"
       @keydown.prevent="handleKeydown"
       :style="wrapperStyle">
    <div class="current"
         @click="focus=true">
      <slot>{{ value }}</slot>
    </div>
    <transition>
      <ul v-show="focus"
          :class="listStyle"
          @click="focus=false">
        <li v-for="(item, idx) in computedOptions"
            :key="idx"
            @click="handleClick(item.value)"
            :class="{active:isActive(item.value)}">
          <slot name="option"
                :val="item.value">{{ item.label }}</slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'MySelect',
  props: {
    value: [Number, String],
    options: [Array, Object],
    layout: {
      type: String,
      default: 'block',
      validator(val) {
        return ['inline', 'block'].includes(val)
      }
    },
    width: {
      type: String,
      validator(val) {
        return val.match(/^\d+px$/)
      }
    }
  },
  data() {
    return {
      focus: false
    }
  },
  computed: {
    computedOptions() {
      if (Array.isArray(this.options) === true) {
        return this.options.map(val => {
          return {
            value: val,
            label: val
          }
        })
      } else {
        return Object.keys(this.options).map(key => {
          const item = this.options[key]
          return {
            value: key,
            label: item.label !== undefined ? item.label : key
          }
        })
      }
    },
    index() {
      return this.computedOptions.findIndex(({ value }) => value === this.value)
    },
    wrapperStyle() {
      return { width: this.width }
    },
    listStyle() {
      return this.layout
    }
  },
  methods: {
    handleKeydown(event) {
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          const go = event.key === 'ArrowDown' ? +1 : -1
          const nextIndex = this.index + go
          if (nextIndex > -1 && nextIndex < this.computedOptions.length) {
            const next = this.computedOptions[this.index + go]
            this.$emit('input', next.value)
          }
          break
        case 'Enter':
        case 'Escape':
          this.focus = false
          break
        case 'Tab':
          this.$el.blur()
          break
      }
    },
    handleClick(value) {
      this.$emit('input', value)
    },
    isActive(value) {
      return this.value === value
    }
  }
}
</script>

<style lang="scss" scoped>
.v-enter-active {
  transition: opacity 0.2s;
}
.v-leave-active {
  transition: opacity 0.2s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
.wrapper {
  position: relative;
  outline: none;
}
.current {
  position: relative;
  line-height: 32px;
  background: #333;
  color: #fff;
  padding: 0 4px;
  cursor: pointer;
  transition: background-color 0.4s;
  .wrapper:focus & {
    background-color: rgb(232, 71, 85);
  }
  &::after {
    position: absolute;
    content: '▼';
    font-size: 10px;
    right: 4px;
    transition: transform 0.4s;
    .wrapper:focus & {
      transform: scale(-1);
    }
  }
}
ul {
  position: absolute;
  top: 30px;
  box-sizing: border-box;
  min-width: 190px;
  width: 100%;
  list-style: none;
  margin: 0;
  background: #2c2c2c;
  color: #fff;
  padding: 8px;
  z-index: 2;
  max-height: 192px;
  box-shadow: 2px 2px 4px rgba(200, 200, 200, 0.8);

  overflow-y: auto;
  li {
    margin: 2px;
    padding: 4px;
    line-height: 24px;
    cursor: pointer;
    transition: background-color 0.25s;
    border-radius: 2px;
    &.active {
      background-color: rgba(234, 120, 130, 0.2);
    }
    &:hover {
      background-color: rgba(234, 120, 130, 0.4);
    }
  }
  &.inline li {
    display: inline-block;
    padding: 8px 4px;
    min-width: 50px;
    text-align: center;
  }
}
</style>
