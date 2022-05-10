<template>
  <div class="role-page">
    <el-form ref="formInline" :inline="true" :model="formInline">
      <el-form-item label="登录名" prop="loginname">
        <el-input v-model="formInline.loginname" placeholder="登录名" @keyup.enter.native="onSubmit" />
      </el-form-item>
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
      <el-button v-permission="'UserPage|add'" plain type="primary" @click="showDialog('add')">添加</el-button>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#eff3f6'}"
      border
    >
      <el-table-column prop="loginname" label="登录名称" />
      <el-table-column prop="name" label="真实姓名" />
      <el-table-column prop="orgname" label="所属机构" />
      <el-table-column label="状态">
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
          <el-button v-permission="'UserPage|edit'" type="text" @click="showDialog('edit', scope.row)">编辑</el-button>
          <el-button v-permission="'UserPage|role'" type="text" @click="showPer(scope.row)">分配角色</el-button>
          <el-button v-permission="'UserPage|delete'" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="page"
      :limit.sync="pageSize"
      @pagination="pagination"
    />

    <add-user ref="child" :visible.sync="visible" :type-status="typeStatus" @update-list="onSubmit" />
    <assign-roles ref="assignChild" :visible.sync="AssignRoles" />
  </div>
</template>

<script>
import AddUser from './components/AddUser'
import AssignRoles from './components/AssignRoles'
import { userList, delUser } from '@/api/system/userPage'

export default {
  name: 'UserPage',
  components: { AddUser, AssignRoles },
  data() {
    return {
      total: 0,
      page: 1,
      pageSize: 10,
      formInline: {
        loginname: '',
        user: '',
        region: ''
      },
      tableData: [],
      visible: false, // 添加编辑弹窗
      typeStatus: 'add',
      AssignRoles: false // 分配权限弹窗
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList(page, size) {
      this.loading = true
      const { loginname, name, states } = this.formInline
      const data = {
        orgid: 1,
        pageIndex: this.page,
        pageSize: this.pageSize,
        loginname,
        name,
        states
      }
      const res = await userList(data)
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
      console.log(formName, 'formName')
      this.$refs[formName].resetFields()
    },
    showPer(row) {
      this.AssignRoles = true
      this.$refs.assignChild.initRoleList(row.id)
    },
    handleDelete(row) {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const formData = new FormData()
        formData.append('idArray', row.id)
        delUser(formData).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getList()
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
        this.$refs.child.getUserDetail(row.id)
      }
    }
  }
}
</script>
