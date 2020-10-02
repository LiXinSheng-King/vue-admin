<template>
  <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="12">
        <!-- 搜索与添加区域 -->
        <el-input placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary"
          @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- 自定义索引 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱" ></el-table-column>
        <el-table-column prop="mobile" label="电话" ></el-table-column>
        <el-table-column prop="role_name" label="角色" ></el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <!-- scope.row对用当前行的数据 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
            <!-- {{typeof(scope.row.id)}} -->
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
      :append-to-body="true">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="ruleFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
     <!-- 底部区域 -->
     <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
     </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户"
    :visible.sync="editDialogVisible"
    width="50%"
    @close="editDialogClosed"
    :append-to-body="true">
      <span>
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
    title="分配角色"
    :visible.sync="setRoleDialogVisible"
    width="50%"
    @close="setRoleDialogClosed"
    :append-to-body="true">
      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <p>
          分配角色：
          <el-select
            v-model="selectRoleId"
            filterable
            allow-create
            default-first-option
            placeholder="请选择文章标签"
          >
            <el-option
              v-for="item in rolesLsit"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  onGetUserList, onUserStateChanged, onAddUser,
  onShowEditDialog, onEditUserInfo, onRemoveUserById, onShowSetRole,
  onSaveRoleInfo
} from '@/api/user'
export default {
  name: 'UserIndex',
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      // 手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 4
      },

      // 用户数据列表
      userlist: [],

      // 总数据条数
      total: 0,

      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,

      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },

      // 修改用户对话框的显示与隐藏
      editDialogVisible: false,

      // 查询到的用户信息对象
      editForm: {},

      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      // 分配角色对话框的显示已隐藏
      setRoleDialogVisible: false,

      // 当前行需要被分配角色的用户
      userInfo: {},

      // 所有角色数据列表
      rolesLsit: [],

      // 已选中的角色Id值
      selectRoleId: ''
    }
  },

  created () {
    // 渲染用户列表数据
    this.getUserList()
  },

  methods: {
    getUserList () {
      const params = {
        query: this.queryInfo.query,
        pagenum: this.queryInfo.pagenum,
        pagesize: this.queryInfo.pagesize
      }
      onGetUserList(params).then(res => {
        console.log('用户列表数据', res)
        this.userlist = res.data.data.users
        this.total = res.data.data.total
      })
    },

    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      console.log('当前页中数据的条数', newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },

    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      console.log('当前的页数', newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },

    // 监听switch开关状态的改变
    userStateChanged (userinfo) {
      console.log('当前列的数据及状态', userinfo)
      const params = {
        uId: userinfo.id,
        type: userinfo.mg_state
      }
      onUserStateChanged(params)
        .then(res => {
          this.$message.success('更新用户状态成功')
          console.log('改变状态的用户的id和mg_state', userinfo.id, userinfo.mg_state)
        })
    },

    // 监听用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.ruleFormRef.resetFields()
    },

    // 点击按钮，添加新用户
    addUser () {
      const params = {
        username: this.addForm.username,
        password: this.addForm.password,
        email: this.addForm.email,
        mobile: this.addForm.mobile
      }
      onAddUser(params)
        .then(res => {
          this.$message.success('添加用户成功')
          // 隐藏添加用户的对话框
          this.addDialogVisible = false
          // 重新获取用户列表数据
          this.getUserList()
        })
    },

    // 展示编辑用户的对话框
    showEditDialog (ID) {
      // 大错误点
      // const params = {
      //   id: ID
      // }
      onShowEditDialog(ID).then(res => {
        this.editForm = res.data.data
        this.editDialogVisible = true
        console.log('赋值的表单数据', this.editForm)
        console.log('输出的数据', res.data.data)
        // console.log('输出结果', res.data)
        console.log('被选中要修改的用户id', ID)
      })
    },

    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },

    // 修改用户信息并提交
    editUserInfo () {
      const data = {
        id: this.editForm.id,
        email: this.editForm.email,
        mobile: this.editForm.mobile
      }
      onEditUserInfo(data).then(res => {
        // 关闭对话框
        this.editDialogVisible = false

        // 刷新数据列表
        this.getUserList()

        // 提示修改成功
        this.$message.success('更新用户信息成功')
        console.log('修改后的用户id,email,mobile', data.email, data.mobile)
      })
    },

    // 根据id删除对应的用户信息
    removeUserById (ID) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        onRemoveUserById(ID).then(res => {
          this.$message.success('删除用户成功')
          this.getUserList()
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 展示分配角色的对话框
    showSetRole (role) {
      this.userInfo = role
      console.log('当前行的用户信息', this.userInfo)
      onShowSetRole(role).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }
        this.rolesLsit = res.data.data
        this.setRoleDialogVisible = true
      })
    },

    // 分配角色并提交
    saveRoleInfo (userInfo) {
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const data = {
        id: this.userInfo.id,
        rid: this.selectRoleId
      }
      onSaveRoleInfo(data).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('更新用户角色失败！')
        }
        this.$message.success('更新角色成功！')
        this.getUserList()
        this.setRoleDialogVisible = false
      })
    },

    // 分配角色对话框关闭事件
    setRoleDialogClosed () {
      this.selectRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style scoped lang="less">
</style>
