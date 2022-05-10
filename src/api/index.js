const permissions = {}

const requireAll = require.context('./', true, /\.js$/)

requireAll.keys().forEach(name => {
  if (requireAll(name) && requireAll(name).default) {
    // console.log(requireAll(name).default, 'requireAll(name).default')
    const permission = requireAll(name).default.permission
    permissions[permission.name] = permission
  }
})
export default { permissions }
