export function formatMoney(val) {
  var money = (+val).toFixed(2)
  if (Math.abs(money) === 0) {
    return '0.00'
  } else {
    var show = (+money).toLocaleString('en-US')
    if (isNaN(Number(money))) {
      return val
    }
    if (show.indexOf('.') === -1) {
      return show + '.00'
    }
    if (show.length - show.indexOf('.') === 2) {
      return show + '0'
    }
    return show
  }
}

