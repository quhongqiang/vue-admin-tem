<template>
  <div class="add">
    <el-dialog
      :title="typeStatus == 'add' ? '添加用户' : '编辑用户'"
      :visible="visible"
      :before-close="handleClose"
      width="30%"
    >
      <el-form ref="formInfo" :model="formInfo" :rules="rules" label-width="80px">
        <el-form-item label="所属机构:" prop="mechanism">
          <el-input v-model="formInfo.mechanism" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="登录名:" prop="loginname">
          <el-input v-model="formInfo.loginname" autocomplete="off" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="formInfo.password" autocomplete="off" show-password maxlength="20" />
        </el-form-item>
        <el-form-item label="真实姓名:" prop="name">
          <el-input v-model="formInfo.name" autocomplete="off" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="启用状态:" prop="states">
          <el-switch
            v-model="formInfo.states"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="备注信息:" prop="comments">
          <el-input
            v-model="formInfo.comments"
            type="textarea"
            placeholder="请输入备注信息"
            maxlength="100"
            show-word-limit
            rows="3"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('formInfo')">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('formInfo')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addUser, userDetail } from '@/api/system/userPage'
const formInfo = {
  mechanism: '中能源油链通平台',
  loginname: '',
  password: '',
  name: '',
  states: true,
  comments: ''
}
export default {
  name: 'Add',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    typeStatus: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      id: null,
      formInfo: Object.assign({}, formInfo),
      rules: {
        loginname: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserDetail(id) {
      this.id = id
      const res = await userDetail({ id: id, orgid: 1 })
      console.log(res, 'res')
      this.formInfo = {
        mechanism: res.data.user.orgname,
        loginname: res.data.user.loginname,
        password: res.data.user.password,
        name: res.data.user.name,
        states: res.data.user.states === 1,
        comments: res.data.user.comments
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$refs['formInfo'].resetFields()
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { mechanism, loginname, password, name, states, comments } = this.formInfo
          const data = {
            id: this.typeStatus === 'edit' ? this.id : '',
            orgid: 1,
            mechanism,
            loginname,
            password,
            name,
            states: states ? 1 : 2,
            comments
          }
          this.$confirm('确认要保存吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            addUser(data).then(res => {
              this.$message({
                type: 'success',
                message: this.typeStatus === 'edit' ? '编辑成功!' : '保存成功!'
              })
              this.$emit('update:visible', false)
              this.$refs[formName].resetFields()
              this.$emit('updateList')
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel(formName) {
      this.$refs[formName].resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>
