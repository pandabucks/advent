const date = new Date()
const year = date.getFullYear()
const month = date.getMonth() + 1

// 月の名前
export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

// 初期値
export const defaults = {
  year: year,
  month: month,
  font: 'Montserrat',
  image: 'image1',
  bgColor: '#ffffff',
  bgColorSun: '#ffa700',
  bgColorSat: '#0093d1',
  textColor: '#000000',
  textColorSun: '#ffffff',
  textColorSat: '#ffffff'
}

// フォントリスト
export const defineFonts = {
  'Montserrat': {
    size: '32px',
    label: 'Montserrat'
  },
  'Merriweather': {
    size: '32px',
    label: 'Merriweather'
  },
  'Signika': {
    size: '32px',
    label: 'Signika'
  },
  'Passion One': {
    size: '38px',
    label: 'Passion One'
  }
}

// 背景画像リスト
export const defineImages = {
  'image1': {
    label: 'ぱくたそコラージュ1',
    file: 'images/image1.jpg'
  },
  'image2': {
    label: 'ぱくたそコラージュ2',
    file: 'images/image2.jpg'
  }
}


Object.keys(defineFonts).forEach(el => {
  Object.defineProperty(defineFonts[el], 'cels', {
    get() { return `${this.size} ${this.label}` }
  })
})

export const resolveFont = {
  get(key) {
    if (defineFonts.hasOwnProperty(key) !== true) {
      throw new Error('フォントが見つかりません!')
    }
    return defineFonts[key]
  }
}

export const resolveImage = {
  get(key) {
    if (defineImages.hasOwnProperty(key) !== true) {
      throw new Error('画像が見つかりません!')
    }
    return defineImages[key]
  }
}
