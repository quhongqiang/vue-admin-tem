import store from '@/store'

export default function checkPermission(value) {
  const roles = store.getters && store.getters.permission_buttons
  return roles === 'super_user' || value === 'super_user' || roles.indexOf(value) >= 0
}
