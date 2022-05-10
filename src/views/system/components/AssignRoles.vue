<template>
  <div class="assign-roles">
    <el-dialog
      title="分配角色"
      :visible="visible"
      :before-close="handleClose"
      width="40%"
    >
      <el-form label-width="100px">
        <el-form-item label="当前用户:">
          <span>{{ currentNme || '-' }}</span>
        </el-form-item>
        <el-form-item label="角色:">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.id"
            >
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('sava')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { userRoleList, saveUserRole } from '@/api/system/userPage'

export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentNme: '',
      checkList: [],
      userId: null,
      roleList: []
    }
  },
  methods: {
    async initRoleList(userId) {
      this.userId = userId
      const res = await userRoleList({ userId: userId })
      this.currentNme = res.data.user.name
      this.roleList = res.data.roleList
      const arr = []
      res.data.roleList.map(item => {
        if (item.LAY_CHECKED) {
          arr.push(item.id)
        }
      })
      this.checkList = arr
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.checkList = []
    },
    handleConfirm(type) {
      // console.log(this.checkList)
      const data = {
        id: this.userId,
        orgid: 1, // 这玩意是写死的吗？？？
        roleArray: String(this.checkList)
      }
      this.$confirm('确认要保存吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        saveUserRole(data).then(res => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.$emit('update:visible', false)
          this.checkList = []
        })
      })
    }
  }
}
</script>
