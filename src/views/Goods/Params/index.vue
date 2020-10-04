<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeTabsName" @tab-click="handleTabsClick">

        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数
          </el-button>

          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>

                <!-- 输入Tag文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>

            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>

          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>

                <!-- 输入Tag文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>

            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title=" '添加' + getTitleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
      :append-to-body= "true"
    >
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog
      :title=" '修改' + getTitleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
      :append-to-body= "true"
    >
      <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="100px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  onGetCateList, onGetParamsData, onAddParams, onShowEditDialog, onEditParams, onRemoveParams,
  onSaveAttrVals
} from '@/api/params'
export default {
  name: 'ParamsIndex',
  data () {
    return {
      // 商品分类列表
      cateList: [],

      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },

      // 级联选择框双向绑定数据
      selectedCateKeys: [],

      // 激活页签名称
      activeTabsName: 'many',

      // 动态参数数据
      manyTableData: [],

      // 静态属性数据
      onlyTableData: [],

      // 控制添加参数对话框的显示与隐藏
      addDialogVisible: false,

      // 添加表单的数据对象
      addFrom: {
        attr_name: ''
      },

      //   添加表单的验证规则
      addFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },

      // 编辑对话框
      editDialogVisible: false,

      // 修改表单数据对象
      editFrom: {},

      // 修改表单验证规则
      editFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
      // inputVisible: false,
      // inputValue: ''
    }
  },

  created () {
    this.getCateList()
  },

  computed: {
    // 按钮需要被禁用返回true, 否则返回false-----计算属性的应用
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },

    // 当前选中的三级分类Id
    getCateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },

    // 当前激活的参数面板
    getTitleText () {
      if (this.activeTabsName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },

  methods: {
    // 获取所有的商品分类列表
    getCateList () {
      onGetCateList().then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取商品数据列表失败！')
        }
        this.cateList = res.data.data
        console.log('商品分类列表', this.cateList)
      })
    },

    // 级联选择框选中变化触发
    handleChange () {
      this.getParamsData()
      console.log('未处理前选中的商品分类', this.selectedCateKeys)
    },

    // Tab页签点击事件的处理函数
    handleTabsClick () {
      console.log('被激活当前页签名称', this.activeTabsName)
      this.getParamsData()
    },

    // 获取参数的列表数据--抽离出一个单独的函数，切换面板或者三级分类都触发事件
    getParamsData () {
      // 只允许选择三级分类：
      // 通过数组的长度判断-监听被选中的商品分类的数组长度
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        // 在定义了可以选择一级和二级分类的级联选择器时，在不选择三级分类时，需要清空表格数据
        // 清空表格数据
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const params = {
        id: this.getCateId,
        sel: this.activeTabsName
      }
      // 根据所选分类的Id,和当前面板的参数, 获取对应的参数
      onGetParamsData(params).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取参数列表失败！')
        }
        console.log('当前动态参数列表数据---展开列', res.data.data)
        res.data.data.forEach(item => {
          // 通过三元表达式判断attr_vals是否为空
          // 使用三元表达式的目的： 添加参数后会生成一个attr_vals是一个空的字符串，空字符串的split是一个包含空字符串的数组
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏---为了防止newtag标签共用data中的inputVisiable属性
          item.inputVisible = false
          // // 文本框的输入值---为了防止newtag标签共用data中的inputValue属性
          item.inputValue = ''
        })
        // 和上面的顺序可能不能改变
        // 动态获取 动态参数和静态属性
        if (this.activeTabsName === 'many') {
          this.manyTableData = res.data.data
        } else {
          this.onlyTableData = res.data.data
        }
      })
    },

    // 监听对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFromRef.resetFields()
    },

    // 添加参数
    addParams () {
      const data = {
        id: this.getCateId,
        attr_name: this.addFrom.attr_name,
        attr_sel: this.activeTabsName
      }
      onAddParams(data).then(res => {
        if (res.data.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },

    // 显示编辑对话框--根据id查询参数
    showEditDialog (attrId) {
      console.log('参数id', attrId)
      const params = {
        id: this.getCateId,
        attrId: attrId,
        attr_sel: this.activeTabsName
      }
      onShowEditDialog(params).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取分类失败！')
        }
        this.editFrom = res.data.data
        this.editDialogVisible = true
      })
    },

    // 重置修改表单
    editDialogClosed () {
      this.$refs.editFromRef.resetFields()
    },

    // 修改参数并提交
    editParams () {
      const data = {
        id: this.getCateId,
        attrId: this.editFrom.attr_id,
        attr_name: this.editFrom.attr_name,
        attr_sel: this.editFrom.attr_sel
      }
      onEditParams(data).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },

    // 根据Id删除对应的参数项
    removeParams (attrId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        const data = {
          id: this.getCateId,
          attrId: attrId
        }
        onRemoveParams(data).then(res => {
          this.$message.success('删除分类成功')
          this.getParamsData()
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 文本框失去焦点,或者按下Enter触发
    handleInputConfirm (row) {
      // 输入的内容为空时，清空---防止空格对文本框的影响
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      }
      // // 内容不为空时
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // // 提交数据库，保存修改
      this.saveAttrVals(row)
    },

    // 将对attr_vals（Tag） 的操作 保存到数据库
    saveAttrVals (row) {
      const data = {
        id: this.getCateId,
        attrId: row.attr_id,
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }
      onSaveAttrVals(data).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('修改参数项失败！')
        }
        this.$message.success('修改参数项成功！')
      })
    },

    // 点击按钮显示输入框
    // row---接收showInput传过来的整行数据
    showInput (row) {
      row.inputVisible = true
      console.log('你好')
      // 让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 删除对应的参数可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}
.el-cascader {
  width: 25%;
}
.el-tag {
  margin: 8px;
}
.input-new-tag {
  width: 90px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
