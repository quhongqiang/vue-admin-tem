import permission from './permission'

const install = function(Vue) {
  Vue.directive('permission', permission)
  Vue.directive('enterNumber', {
    inserted: function(el) {
      el.addEventListener('keypress', function(e) {
        e = e || window.event
        const charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode
        const re = /\d/
        if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
          if (e.preventDefault) {
            e.preventDefault()
          } else {
            e.returnValue = false
          }
        }
      })
    }
  })
}

if (window.Vue) {
  window['permission'] = permission
  Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission
