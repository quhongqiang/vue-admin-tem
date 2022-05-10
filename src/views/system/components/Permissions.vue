<template>
  <div class="add">
    <el-dialog
      title="分配权限"
      :visible="visible"
      :before-close="handleClose"
      width="30%"
    >
      <el-tree
        ref="tree"
        :data="MenuList"
        node-key="name"
        show-checkbox
        :default-checked-keys="defaultCheckedKeys"
        :expand-on-click-node="false"
        @check="handleCheckChange"
      />

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="handleConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { asyncRoutes } from '@/router/index'
import { deepClone } from '@/utils/index'
import apiAll from '@/api/'
import { saveRolePage } from '@/api/system'
const roleApi = apiAll.permissions

export default {
  name: 'Add',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      MenuList: [],
      defaultCheckedKeys: [],
      page: [],
      btns: []
    }
  },
  methods: {
    clearTree() {
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    setKeys(page, btns) {
      this.page = page
      this.btns = btns
      this.defaultCheckedKeys = btns
    },
    setRoleTree() {
      var tree = this.getRoleTree(asyncRoutes, roleApi)
      this.MenuList = tree
    },
    getRoleTree(routes, roleApi) {
      // 2. roleApi // 角色路由
      // 3. 给每个节点加个type标识为 menu, page, btn
      var tree = [] // 合成的角色树结构
      var i = 0
      var len = routes.length
      var item = null
      for (i = 0; i < len; i++) {
        item = {}
        item.name = routes[i].name
        if (roleApi[routes[i].name]) {
          // 路由中角色有定义
          item.label = roleApi[routes[i].name].label
        } else {
          // 路由没有定义
          item.label = routes[i].meta ? routes[i].meta.title : ''
        }

        if (routes[i].children) { // 节点是菜单
          item.type = 'menu'
          item.children = this.getRoleTree(routes[i].children, roleApi)
        } else {
          if (roleApi[routes[i].name] && roleApi[routes[i].name].children) { // 节点是按钮
            // 给每一个按钮，挂一个父name
            item.children = deepClone(roleApi[routes[i].name].children)
            item.children.forEach(item => {
              item.masterName = routes[i].name
              item.name = routes[i].name + '|' + item.name // 以父name作为命名空间
              item.type = 'btn'
            })
          } else {
            item.type = 'page'
          }
        }
        tree.push(item)
      }
      // console.log(tree, 'treeee')
      return tree
    },
    handleCheckChange(curNode, checkedNode) {
      var page = [] // 选中的页面name数组容器
      var btns = [] // 选中的name对应的按钮数组容器
      var checkedNodes = checkedNode.checkedNodes.concat(
        checkedNode.halfCheckedNodes
      )
      var i = checkedNodes.length
      while (i--) {
        // 聚合所有page，btns
        if (checkedNodes[i].masterName) {
          // 它是个按钮
          btns.push(checkedNodes[i].name)
        } else {
          // 它是个页面或菜单
          page.push(checkedNodes[i].name)
        }
      }

      this.page = page
      this.btns = btns
      // console.log(page, btns, 'pagepage')
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$refs.tree.setCheckedKeys([])
    },
    handleConfirm() {
      this.$emit('update:visible', false)
      var data = {
        id: this.id,
        pageList: this.page || [],
        buttonList: this.btns || []
      }
      saveRolePage(data).then(res => {
        this.$refs.tree.setCheckedKeys([])
        this.$emit('update:visible', false)
        this.$message({
          type: 'success',
          message: res.msg
        })
      })
    },
    handleCancel() {
      this.$emit('update:visible', false)
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>
