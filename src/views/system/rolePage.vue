<template>
  <div class="role-page">
    <el-form ref="formInline" :inline="true" :model="formInline">
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="formInline.name" autocomplete="off" placeholder="真实姓名" :maxlength="20" clearable @keyup.enter.native="onSubmit" />
      </el-form-item>
      <el-form-item label="状态" prop="states">
        <el-select v-model="formInline.states" placeholder="启用状态" clearable>
          <el-option label="全部" value="" />
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button @click="resetForm('formInline')">重置</el-button>

      </el-form-item>
    </el-form>
    <div class="btn-group">
      <el-button v-permission="'RolePage|add'" plain type="primary" @click="showDialog('add')">添加</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      :header-cell-style="{background:'#eff3f6'}"
      border
    >
      <el-table-column prop="name" label="真实姓名" />
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.states === 1">
            <el-switch disabled :value="true" />
            <span style="margin-left: 10px;">启用</span>
          </div>
          <div v-else-if="scope.row.states === 2">
            <el-switch disabled :value="false" />
            <span style="margin-left: 10px;">禁用</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="300"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="'RolePage|edit'"
            type="text"
            @click="showDialog('edit', scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="'RolePage|power'"
            type="text"
            @click="showPer(scope.row)"
          >分配权限</el-button>
          <el-button
            v-permission="'RolePage|delete'"
            type="text"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="page"
      :limit.sync="pageSize"
      @pagination="pagination"
    />

    <add-role ref="child" :visible.sync="visible" :type-status="typeStatus" @update-data="onSubmit" />
    <permissions :id="id" ref="ruleList" :visible.sync="visiblePer" />
  </div>
</template>

<script>
import { roleList, roleDel, getRolePageList } from '@/api/system'
import AddRole from './components/AddRole'
import Permissions from './components/Permissions'

export default {
  name: 'RolePage',
  components: { AddRole, Permissions },
  data() {
    return {
      total: 0,
      page: 1,
      pageSize: 10,
      formInline: {
        name: '',
        states: ''
      },
      tableData: [],
      visible: false, // 添加编辑弹窗
      typeStatus: 'add',
      visiblePer: false, // 分配权限弹窗
      loading: false,
      id: null
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const { name, states } = this.formInline
      const data = {
        pageIndex: this.page,
        pageSize: this.pageSize,
        name,
        states
      }
      const res = await roleList(data)
      this.loading = false
      this.tableData = res.data.list
      this.total = res.data.splitPage.totalCount
    },
    pagination(val) {
      this.page = val.page
      this.pageSize = val.limit
      this.getList()
    },
    onSubmit() {
      this.page = 1
      this.pageSize = 10
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async showPer(row) {
      this.$refs.ruleList.clearTree()
      var newFormData = new FormData()
      newFormData.append('id', row.id)
      const res = await getRolePageList(newFormData)

      if (res.data) {
        this.visiblePer = true
        this.id = row.id
        this.$refs.ruleList.setKeys(res.data.pageList || [], res.data.buttonList || [])
        this.$refs.ruleList.setRoleTree()
      }
    },
    handleDelete(row) {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var newFormData = new FormData()
        newFormData.append('idArray', row.id)
        roleDel(newFormData).then(res => {
          this.onSubmit()
          this.$message({
            type: 'success',
            message: res.msg
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showDialog(typeStatus, row) {
      if (typeStatus === 'add') {
        this.visible = true
        this.typeStatus = 'add'
      } else {
        this.visible = true
        this.typeStatus = 'edit'
        this.$refs.child.getRoleDetail(row.id)
      }
    }
  }
}
</script>
