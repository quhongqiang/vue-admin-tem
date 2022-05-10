import checkPermission from './checkPermission'
export default {
  inserted(el, binding, vnode) {
    const {
      value
    } = binding
    if (!checkPermission(value)) { // 没有该按钮权限
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
