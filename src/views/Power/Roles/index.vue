<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>

      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="AddRoleDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>

        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二级和三级 -->
              <el-col :span="19">

                <!-- 通过for循环 渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6 ">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 通过for循环，渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{ item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
      :append-to-body="true"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色"
      :visible.sync="AddRoleDialogVisible"
      width="40%"
      @close="addRoleDialogClosed"
      :append-to-body="true">
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="40%"
      @close="addRoleDialogClosed"
      :append-to-body="true">
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  onGetRolesList, onAddRoles, onShowEditDialog, onEditRoles, onRemoveRoleById,
  onRemoveRightById, onShowSetRightDialog, onAllotRights
} from '@/api/power'
export default {
  data () {
    return {
      // 所有角色列表
      rolesList: [],

      // 分配权限框
      setRightDialogVisible: false,

      // 分配权限列表
      rightsList: [],

      //  树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },

      //   默认选中节点ID值
      defKeys: [],

      // 添加角色对话框
      AddRoleDialogVisible: false,

      // 添加角色表单数据
      addRoleForm: {},

      // 编辑角色对话框
      editRoleDialogVisible: false,

      // 编辑角色表单数据
      editRoleForm: {},

      // 添加角色表单验证
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },

      // 编辑角色表单验证规则
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },

      // 当前即将分配权限的Id,默认是0
      roleId: 0
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    getRolesList () {
      onGetRolesList().then(res => {
        this.rolesList = res.data.data
        console.log('角色列表数据', this.rolesList)
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取角色列表失败')
        }
      })
    },

    // 根据ID删除对应角色的权限
    removeRightById (role, rightId) {
      const params = {
        roleId: role.id,
        rightId: rightId
      }
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        onRemoveRightById(params).then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('删除权限失败！')
          }
          this.$message.success('删除用户成功')
          // 把当前服务器返回的最新权限数据直接赋值给当前角色的children属性 避免页面自动合起来
          role.children = res.data.data
          // 不建议使用，因为会重新渲染整个页面
          // this.getRolesList()
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 分配权限
    showSetRightDialog (role) {
      const params = {
        type: 'tree'
      }
      // 获取角色的所有权限
      onShowSetRightDialog(params).then(res => {
        this.roleId = role.id
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取权限数据失败')
        }
        // 获取权限树
        this.rightsList = res.data.data

        //   递归获取三级节点的id
        this.getLeafkeys(role, this.defKeys)

        this.setRightDialogVisible = true
      })
    },

    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getLeafkeys (node, arr) {
      // 没有children属性，则是三级节点,node：节点， arr： 数组
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafkeys(item, arr))
    },

    // 监听权限对话框关闭事件
    setRightDialogClosed () {
      this.rightsList = []
    },

    // 添加角色对话框的关闭
    // 因为代码量过大，对应的对象来不及生成，从而导致了读取了空对象。 所有用if这段代码来解决报错的问题
    addRoleDialogClosed () {
      if (this.$refs.addRoleFormRef !== undefined) {
        this.$refs.addRoleFormRef.resetFields()
      }
    },

    // 添加角色
    addRoles () {
      const data = {
        roleName: this.addRoleForm.roleName,
        roleDesc: this.addRoleForm.roleDesc
      }
      onAddRoles(data).then(res => {
        if (res.data.meta.status !== 201) {
          this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        this.AddRoleDialogVisible = false
        this.getRolesList()
      })
    },

    // 删除角色
    removeRoleById (ID) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        onRemoveRoleById(ID).then(res => {
          this.$message.success('删除用户成功')
          this.getRolesList()
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 编辑角色
    showEditDialog (ID) {
      onShowEditDialog(ID).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('查询角色信息失败！')
        }
        this.editRoleForm = res.data.data
        this.editRoleDialogVisible = true
      })
    },

    // 编辑角色并提交
    editRoles () {
      const data = {
        // roleId为响应id
        roleId: this.editRoleForm.roleId,
        roleName: this.editRoleForm.roleName,
        roleDesc: this.editRoleForm.roleDesc
      }
      onEditRoles(data).then(res => {
        if (res.data.meta.status !== 200) {
          this.$message.error('更新角色信息失败！')
        }
        this.editRoleDialogVisible = false
        this.getRolesList()
        this.$message.success('更新角色信息成功！')
      })
    },

    // 分配权限
    allotRights (roleId) {
      // 获得当前选中和半选中的Id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log('被选中的权限id', keys)
      // join() 方法用于把数组中的所有元素放入一个字符串
      const idStr = keys.join(',')
      const data = {
        roleId: this.roleId,
        rids: idStr
      }
      onAllotRights(data).then(res => {
        if (res.data.meta.status !== 200) { return this.$message.error('分配权限失败！') }
        this.$message.success('分配权限成功!')
        this.getRolesList()
        this.setRightDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
