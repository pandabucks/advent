import {
  monthNames,
  defaults,
  resolveFont,
  resolveImage
} from './configs.js'

const regexColor = new RegExp('^#[0-9a-f]{6}$')
const bgColor = createjs.Graphics.getRGB(220, 220, 220, 0)
const outColor = createjs.Graphics.getRGB(220, 220, 220, 0)

const days = []
const moveDiff = { x: 0, y: 0 }

class CalenderShape {

  constructor() {
    createjs.Ticker.framerate = 20
    createjs.ColorPlugin.install()
  }

  reset() {
    if (typeof this.stage === 'object') {
      this.stage.removeAllChildren()
      this.stage.clear()
    }
    createjs.Ticker.reset()
    createjs.Tween.removeAllTweens()
  }

  destroy() {
    this.reset()
  }

  load(el) {
    this.reset()
    this.stage = new createjs.Stage(el)

    createjs.Ticker.on('tick', this.handleTick, this)
    createjs.Ticker.addEventListener('tick', createjs.Tween)
    if (createjs.Touch.isSupported() === true) {
      createjs.Touch.enable(this.stage)
    }

    this.loading = new createjs.Text('Loading', '48px sans-serif', '#bbbbbb')
    this.loading.x = el.width / 2
    this.loading.y = el.height / 2
    this.loading.textAlign = 'center'
    this.loading.textBaseline = 'middle'
    this.stage.addChild(this.loading)
  }

  setup() {
    days.length = 0

    this.stage.removeChild(this.loading)
    this.loading = null

    const font = resolveFont.get(defaults.font)

    this.background = new createjs.Container()
    this.stage.addChild(this.background)

    const hitArea = new createjs.Shape(
      new createjs.Graphics().beginFill('#ccc').drawRect(-40, -200, 500, 600)
    )

    this.container = new createjs.Container()
    this.stage.addChild(this.container)

    this.container.mouseChildren = false
    this.container.hitArea = hitArea

    this.container.on('mousedown', this.handleDown, this)
    this.container.on('pressmove', this.handleMove, this)

    // 月の名前
    this.textMonthName = new createjs.Text('', '40px ' + font.label)
    this.textMonthName.x = 450
    this.textMonthName.y = -120
    this.textMonthName.textAlign = 'right'
    // 年
    this.textYear = new createjs.Text('', '32px ' + font.label)
    this.textYear.x = 40
    this.textYear.y = -100
    this.textYear.textAlign = 'center'
    // 月
    this.textMonth = new createjs.Text(defaults.month, '80px ' + font.label)
    this.textMonth.x = 40
    this.textMonth.y = -180
    this.textMonth.textAlign = 'center'

    this.container.addChild(this.textMonthName)
    this.container.addChild(this.textYear)
    this.container.addChild(this.textMonth)

    for (let idx = 0; idx < 42; idx++) {
      const cel = new CalenderCelShape(idx)
      this.container.addChild(cel.bg)
      this.container.addChild(cel.text)
      days.push(cel)
    }

    this.setPos(80, 400)
    this.setBgColor(defaults.bgColorSun, 0)
    this.setBgColor(defaults.bgColorSat, 6)
    this.setBgColor(defaults.bgColor, -1)

    this.setDate(defaults.year, defaults.month)
    this.setTextColor(defaults.textColorSun, 0)
    this.setTextColor(defaults.textColorSat, 6)
    this.setTextColor(defaults.textColor, -1)

    this.setImage(defaults.image)

  }

  toDataURL(cb, fb) {
    if (this.stage.canvas.toBlob) {
      this.stage.canvas.toBlob(cb)
      return true
    } else if (this.stage.canvas.msToBlob && window.navigator.msSaveBlob) {
      fb(this.stage.canvas.msToBlob())
      return true
      //fb(this.stage.toDataURL('image/png'))
    }
    throw new Error('ダウンロード出来ない環境でした…')
  }

  handleTick() {
    this.stage.update()
  }

  handleDown(event) {
    moveDiff.x = this.stage.mouseX - this.container.x
    moveDiff.y = this.stage.mouseY - this.container.y
  }

  handleMove(event) {
    this.setPos(this.stage.mouseX - moveDiff.x, this.stage.mouseY - moveDiff.y)
  }

  setPos(x, y) {
    this.container.x = x
    this.container.y = y
  }

  setDate(year, month) {
    try {
      if (typeof year !== 'number' || year < 1900 || year > year + 1 || typeof month !== 'number' || month < 1 || month > 12) {
        throw new Error('日付が正しくありません')
      }
      const dStart = new Date(year, month - 1, 1)
      const dEnd = new Date(year, month, 0)
      const startWDay = dStart.getDay()
      const endDay = dEnd.getDate()

      let day = 0
      days.forEach((item, idx) => {
        if (idx % 7 === startWDay || day > 0) {
          day++
        }
        item.setText(day !== 0 && day <= endDay ? day : ' ')
      })
      this.textMonthName.text = monthNames[month - 1]
      this.textYear.text = year
      this.textMonth.text = month
    } catch (e) {
      console.error(e)
    }
  }

  setBgColor(color, wday) {
    try {
      if (!regexColor.test(color)) {
        throw new Error('色の値が正しくありません')
      }
      days.forEach((item, idx) => {
        if (!item.checkWeekDay(wday)) {
          return false
        }
        item.setBgCrossFade(color)
      })
    } catch (e) {
      console.error(e)
    }
  }

  setTextColor(color, wday) {
    try {
      if (!regexColor.test(color)) {
        throw new Error('色の値が正しくありません')
      }
      days.forEach(item => {
        if (!item.checkWeekDay(wday)) {
          return false
        }
        item.setTextCrossFade(color)
      })
    } catch (e) {
      console.error(e)
    }
  }

  setImage(image) {
    try {
      const file = resolveImage.get(image).file
      const queue = new createjs.LoadQueue()
      queue.loadFile(file)
      queue.on('fileload', event => {
        this.background.removeAllChildren()
        const shape = new createjs.Shape()
        shape.graphics.beginBitmapFill(event.result).drawRect(0, 0, 750, 1334)
        this.background.addChild(shape)
      })
    } catch (e) {
      console.error(e)
    }
  }

  setFont(fontKey) {
    try {
      const { label, cels } = resolveFont.get(fontKey)
      days.forEach(item => item.setFont(cels))
      // ヘッダーの月表示
      this.textMonthName.font = '40px ' + label
      this.textYear.font = '32px ' + label
      this.textMonth.font = '80px ' + label
    } catch (e) {
      console.error(e)
    }
  }

}

class CalenderCelShape {

  constructor(idx) {
    this.wday = idx % 7
    this.row = Math.floor(idx / 7)

    this.text = new createjs.Text(' ', resolveFont.get(defaults.font).cels)
    this.text.textAlign = 'center'
    this.text.textBaseline = 'middle'
    this.text.color = outColor

    this.bg = new createjs.Shape()
    this.fillCmd = this.bg.graphics.beginFill(outColor).command
    this.bg.graphics.drawCircle(0, 0, 30)
    this.bg.graphics.endFill()
    this.bg.alpha = 0.6

    this.bg.x = this.text.x = 70 * this.wday
    this.bg.y = this.text.y = 70 * this.row

    this.isSun = this.wday === 0
    this.isSat = this.wday === 6
    this.isWeekday = !this.isSun && !this.isSat
  }

  checkWeekDay(wday) {
    if (wday === -1 && this.isWeekday) {
      return true
    } else if (this.wday === wday) {
      return true
    }
  }

  setTextColor(value) {
    this.text.color = value
  }

  setText(day) {
    this.text.text = day.toString()
  }

  setFont(font) {
    this.text.font = font
  }

  setBgCrossFade(value) {
    createjs.Tween.get(this.fillCmd).wait(this.row % 7 * 50)
      .to({ style: outColor }, 600, createjs.Ease.cubicOut)
      .to({ style: value }, 600, createjs.Ease.cubicOut)

    createjs.Tween.get(this.bg).wait(this.row % 7 * 50)
      .to({ scale: 1.6 }, 600, createjs.Ease.cubicOut)
      .to({ scale: 1 }, 600, createjs.Ease.cubicOut)
    //.call(() => { item.bgColor.style = value })
  }

  setTextCrossFade(value) {
    if (this.text.text) {
      createjs.Tween.get(this.text).wait(this.row % 7 * 50)
        .to({ color: value }, 600, createjs.Ease.cubicOut)
    }
  }
}

export default new CalenderShape()
