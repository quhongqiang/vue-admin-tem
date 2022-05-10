<template>
  <div class="dashboard-editor-container">
    <span class="xian" />
    <span>
      欢迎！来到首页
    </span>
  </div>
</template>

<script>
export default {
  name: 'DashboardAdmin',
  components: {},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
  .xian {
    width: 5px;
    height: 50px;
    background-color: #009688;
    display: inline-block;
    border-radius: 4px;
    margin-right: 20px;
  }
}
</style>
