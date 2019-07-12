/*
* 生成原始数据
* @param num Int, 从0开始统计
* */
function createOriginData (num) {
  const data = {}
  for (let i = 0; i <= num; i++) {
    data[i] = ''
  }
  return data
}

/*
* 针对数据的处理，带特殊标示的
* @param obj JSON {a:1, b:2, kkk1: 1, kkk2: 2, kkk3: 3}
* @param k String 'kkk'
* return String '1,2,3'
 */
function objToStr (obj, k) {
  let str = ''
  for (const attr in obj) {
    if (attr.includes(k)) {
      str += (',' + obj[attr])
    }
  }
  if (str.length > 0) {
    str = str.slice(1)
  }
  return str
}

/*
* 对数据处理，有序
* @param obj JSON {0:0, 1:1, 2:2}
* return String '0,1,2'
* */
function objToStrNormal(obj) {
  let str = ''
  for (const attr in obj) {
    str += (',' + obj[attr])
  }
  if (str.length > 0) {
    str = str.slice(1)
  }
  return str
}

/*
* 数组特定的值，转为字符串
* */
function arrToStr (arr, k) {
  let str = ''
  arr.forEach(v => {
    const tmp = objToStr(v, k)
    if (tmp.length > 0) {
      str += (',' + tmp)
    }
  })
  if (str.length > 0) {
    str = str.slice(1)
  }
  return str
}

/*
* 字符串平分成二维数组
* */
function strToArr (str, len) {
  let index = 0
  const arr = str.split(',')
  const newArray = []
  while (index < arr.length) {
    newArray.push(arr.slice(index, index += len))
  }
  return newArray
}

/*
* 数组的值 赋予给 原始特定数组的值
* */
function arrValToArrVal (tArr, sArr, k) {
  tArr = JSON.parse(JSON.stringify(tArr))
  tArr.forEach((obj, i) => {
    let index = 0
    for (const attr in obj) {
      if (attr.includes(k)) {
        obj[attr] = sArr[i][index]
        index++
      }
    }
  })
  return tArr
}

/*
* 格式化特殊的数据，并返回特殊数据的位置
* */
function formatArrData (arr, mark) {
  arr = JSON.parse(JSON.stringify(arr))
  const markArr = []
  arr.forEach((v, i) => {
    markArr[i] = {}
    for (const attr in arr[i]) {
      if (arr[i][attr].includes(mark)) {
        arr[i][attr] = arr[i][attr].replace(mark, '')
        markArr[i][attr] = true
      }
    }
  })
  return { arr, markArr }
}

/*
* @param dom Obj 页面元素dom
* return String 返回结果
 */
function checkValues (dom) {
  const inputs = dom.getElementsByTagName('input')
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].getAttribute('data-no')) continue
    if (inputs[i].type === 'text' && inputs[i].value.trim() === '') {
      inputs[i].classList.add('border-red')
      inputs[i].focus()
      return 'empty'
    } else {
      inputs[i].classList.remove('border-red')
    }
  }
  const textareas = dom.getElementsByTagName('textarea')
  for (let i = 0; i < textareas.length; i++) {
    if (textareas[i].getAttribute('data-no')) continue
    if (textareas[i].type === 'textarea' && textareas[i].value.trim() === '') {
      textareas[i].focus()
      return 'empty'
    }
    const maxLength = textareas[i].getAttribute('data-max-length')
    if (maxLength) {
      const value = textareas[i].value.trim()
      if (value.length > +maxLength) {
        textareas[i].classList.add('border-red')
        textareas[i].focus()
        return 'limit'
      } else {
        textareas[i].classList.remove('border-red')
      }
    }
  }
  return 'ok'
}
