<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <!-- active属性的属性值必须是数字型，字符串型变成字符型可以减去0 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- Tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
        <!-- el-tab-pane必须是el-tabs的子组件,中间不能有其他的组件 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action: 图片上传的API接口地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品 -->
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%" :append-to-body= "true">
      <img :src="picPreviewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
// 导入lodash包
import _ from 'lodash'
import {
  onGetCateList, onTabClicked, onAddGoods
} from '@/api/list'
export default {
  data () {
    return {
      // 步骤条默认激活 与左侧Tab联动
      activeIndex: '0', // 字符串 0

      // 添加商品的表单对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },

      // 添加商品表单的验证过则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },

      // 商品列表
      cateList: [],

      // 级联选择器配置
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },

      // 动态参数列表数据
      manyTableData: [],

      // 静态属性列表数据
      onlyTableData: [],

      // 图片上传地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',

      // 图片上传组件的请求对象---图片上传组件没有使用axios发送请求，自封装的,如果使用axios需要手动添加请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },

      // 点击预览图片返回的url地址
      picPreviewPath: '',

      // 图片预览对话框
      previewDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    // 三级分类参数的计算属性
    getCateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取商品分类数据列表
    getCateList () {
      onGetCateList().then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取商品列表失败！')
        }
        this.cateList = res.data.data
        console.log('商品分类列表数据', this.cateList)
      })
    },

    // 级联选择器选中项变化时触发
    handleChange () {
      console.log(this.addForm.goods_cat)
      // 判断是否选中三级商品分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },

    // 切换需要的条件
    beforeTabLeave (activeName, odlActiveName) {
      console.log('即将离开的标签页名称', odlActiveName)
      console.log('即将进入的标签页名称', activeName)
      // 未选中商品分类阻止Tab标签跳转
      if (odlActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },

    // Tab标签被选中时触发
    tabClicked () {
      console.log('当前被激活的id', this.activeIndex)
      if (this.activeIndex === '1') {
        const params = {
          id: this.getCateId,
          sel: 'many'
        }
        onTabClicked(params).then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('获取动态参数列表失败！')
          }
          console.log('分类动态参数列表数据', res.data)
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.manyTableData = res.data.data
        })
      } else if (this.activeIndex === '2') {
        const params = {
          id: this.getCateId,
          sel: 'only'
        }
        onTabClicked(params).then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('获取动态参数列表失败！')
          }
          console.log('分类参数静态列表数据', res.data)
          this.onlyTableData = res.data.data
        })
      }
    },

    // 处理图片预览
    handlePreview (file) {
      console.log('点击预览图片的返回结果', file)
      this.picPreviewPath = file.response.data.url
      this.previewDialogVisible = true
    },

    // 处理移除图片的操作
    handleRemove (file) {
      console.log('将要删除的图片的返回结果', file)
      // 1.获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到图片对应的索引值---x参数代表数组pics里面的每一项
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3.调用splice方法，移除图片信息
      this.addForm.splice(i, 1)
    },

    // 监听图片上传成功事件
    handleSuccess (response) {
      console.log('图片上传的返回结果', response)
      // 1.拼接得到一个图片信息对象 临时路径
      const picInfo = { pic: response.data.tmp_path }
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo)
      console.log('追加之后的表单数据', this.addForm)
    },
    // 添加商品
    addGoods () {
      // 发送请求前：需对提交的表单进行处理goods_cat attrs
      // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      // 以上写法不对：级联选择器绑定的对象goods_cat要求是数组对象
      // 解决办法: 包：lodash 方法（深拷贝）：cloneDeep(boj)

      // 将this.addForm进行深拷贝
      const form = _.cloneDeep(this.addForm)
      form.goods_cat = form.goods_cat.join(',')

      // 处理动态参数
      this.manyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        }
        this.addForm.attrs.push(newInfo)
      })

      // 处理静态属性
      this.onlyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.addForm.attrs.push(newInfo)
      })
      // 将addForm的attrs属性添加到form
      form.attrs = this.addForm.attrs
      console.log(form)

      // 发起请求添加商品
      // 商品名称必须是唯一的
      const data = {
        goods_name: form.goods_name,
        goods_cat: form.goods_cat,
        goods_price: form.goods_price,
        goods_number: form.goods_number,
        goods_weight: form.goods_weight,
        goods_introduce: form.goods_introduce,
        pics: form.pics,
        attr: form.attrs
      }
      onAddGoods(data).then(res => {
        if (res.data.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功!')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang='less' scoped>
.el-checkbox {
  margin: 0 8px 0 0 !important;
}
.previewImg{
  width: 100%;
}
.btnAdd{
  margin-top: 15px
}
</style>
