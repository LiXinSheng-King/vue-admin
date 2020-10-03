<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类对话框 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        index-text="#"
        :show-row-hover="false"
        show-index
        border
      >
        <!-- 是否有效列 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i
            class="el-icon-error"
            style="color: red"
            v-else
          ></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类"
    :visible.sync="addCateDialogVisible"
    width="50%"
    @close="addCateDialogClosed"
    :append-to-body="true">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options：数据源 -->
          <!-- props：指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            filterable
            change-on-select
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类"
    :visible.sync="editCateDialogVisible"
    width="50%"
    :append-to-body="true">
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  onGetCateList, onGetParentCateList, onAddCate,
  onShowEditCateDialog, onEidtCate, onRemoveCate
} from '@/api/goods'
export default {
  name: 'CatesIndex',
  data () {
    return {
      // 商品分类数据
      cateList: [],

      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },

      // 数据总数
      total: 0,

      // 为tree-table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 当前列 自定义模板
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          // 当前列 自定义模板
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // 当前列 自定义模板
          type: 'template',
          template: 'opt'
        }
      ],

      // 添加分类
      addCateDialogVisible: false,

      // 添加分类对象
      addCateForm: {
        // 将要添加分类名称
        cat_name: '',
        // 分类父级id
        cat_pid: 0,
        // 分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0
      },

      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },

      // 父级分类列表
      parentCateList: [],

      // 指定级联选择器的配置对象
      cascaderProps: {
        // 配置触发选项 hover/click 经过和点击
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },

      // 选中的父级Id数组
      selectedKeys: [],

      // 编辑对话框 控制
      editCateDialogVisible: false,

      // 编辑分类表单验证
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },

      // 编辑表单 绑定对象
      editCateForm: ''
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类
    getCateList () {
      const params = {
        type: this.queryInfo.type,
        pagenum: this.queryInfo.pagenum,
        pagesize: this.queryInfo.pagesize
      }
      onGetCateList(params).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取商品分类失败！')
        }
        // 给数据列表赋值
        this.cateList = res.data.data.result
        // 总数据条数
        this.total = res.data.data.total
        console.log('商品分类数据', res)
      })
    },

    // 监听 pageSizeChange
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },

    // 监听 pagenum改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },

    // 添加操作
    showAddCateDialog () {
      // 先获取父级分类数据
      this.getParentCateList()
      // 再打开对话框
      this.addCateDialogVisible = true
    },

    // 获取父级分类的数据
    getParentCateList () {
      const params = {
        type: 2
      }
      onGetParentCateList(params).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取父级分类失败！')
        }
        this.parentCateList = res.data.data
        console.log('前两级的父级数据', res.data.data)
      })
    },

    // 添加分类 选择项发生变化触发
    parentCateChanged () {
      console.log('选中的父级Id', this.selectedKeys)
      // 如何selectKeys 数组的长度>0 说明选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 当前分类的等级
        this.addCateForm.cat_level = 0
      }
    },

    // 添加分类
    addCate () {
      const data = {
        cat_pid: this.addCateForm.cat_pid,
        cat_name: this.addCateForm.cat_name,
        cat_level: this.addCateForm.cat_level
      }
      onAddCate(data).then(res => {
        if (res.data.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        console.log('添加的分类', this.addCateForm)
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },

    // 添加分类 重置表单
    addCateDialogClosed () {
      if (this.$refs.addRoleFormRef !== undefined) {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },

    // 删除分类
    removeCate (ID) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        onRemoveCate(ID).then(res => {
          this.$message.success('删除分类成功')
          this.getCateList()
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 显示编辑对话框
    showEditCateDialog (ID) {
      onShowEditCateDialog(ID).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取分类失败！')
        }
        this.editCateForm = res.data.data
        this.editCateDialogVisible = true
      })
    },

    // 编辑分类并提交
    editCate () {
      const data = {
        cat_id: this.editCateForm.cat_id,
        cat_name: this.editCateForm.cat_name
      }
      onEidtCate(data).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('更新分类名失败！')
        }
        this.$message.success('更新分类名成功！')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
.treeTable {
  margin-top: 20px;
}
</style>
