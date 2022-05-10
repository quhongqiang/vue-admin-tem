<template>
  <div class="add">
    <el-dialog
      :title="typeStatus == 'add' ? '添加角色' : '编辑角色'"
      :visible="visible"
      :before-close="handleClose"
      width="30%"
    >
      <el-form ref="formInfo" :model="formInfo" :rules="rules" label-width="100px">
        <el-form-item label="角色名称:" prop="name">
          <el-input v-model="formInfo.name" autocomplete="off" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="是否有效:" prop="states">
          <el-switch v-model="formInfo.states" />
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
import { AddRole, roleDetail } from '@/api/system'

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
      formInfo: {
        name: '',
        states: true,
        comments: ''
      },
      id: null,
      rules: {
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getRoleDetail(id) {
      this.id = id
      const res = await roleDetail({ id: id })
      this.formInfo = {
        name: res.data.role.name,
        states: res.data.role.states === 1,
        comments: res.data.role.comments
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { name, states, comments } = this.formInfo
          var newFormData = new FormData()
          newFormData.append('id', this.typeStatus === 'edit' ? this.id : '')
          newFormData.append('name', name)
          newFormData.append('states', states ? 1 : 2)
          newFormData.append('comments', comments)

          this.$confirm('确认要保存吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            AddRole(newFormData).then(res => {
              this.$message({
                type: 'success',
                message: this.typeStatus === 'edit' ? '编辑成功!' : '保存成功!'
              })
              this.$emit('update:visible', false)
              this.$emit('updateData')
              this.$refs[formName].resetFields()
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
