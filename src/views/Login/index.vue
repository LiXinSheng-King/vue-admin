<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头部区域 -->
      <div class="login_header">
        <h2>欢迎登录</h2>
      </div>

      <!-- 登录表单区域 -->
      <el-form ref="login-FormRef" :model="loginForm" label-width="0px" class="login_form" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-s-goods"></el-input>
        </el-form-item>
        <!-- 勾选区域 -->
        <el-form-item prop="agree">
        <el-checkbox v-model="loginForm.agree">我以阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login" :loading="loginLoading">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { onLogin } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      //  登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
        agree: false // 是否同意协议
      },

      loginLoading: false, // 登录的loading状态

      // 表单的验证规则对象
      loginFormRules: {

        //  验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],

        //  验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],

        // 是否勾选同意
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },

  methods: {
    // ref="loginFormRef" 是表单的实例对象，通过设置ref可以的使用表单实例对象的方法
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      this.$refs['login-FormRef'].resetFields()
    },
    login () {
      this.$refs['login-FormRef'].validate(valid => {
        if (!valid) {
          return
        }
        // 验证通过，提交表单
        this.onLogin()
      })
    },
    onLogin () {
      this.loginLoading = true
      onLogin(this.loginForm).then(res => { // 登录成功
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.loginLoading = false
        window.sessionStorage.setItem('token', res.data.data.token)
        console.log(res)
        this.$router.push({
          name: 'home'
        })
      }).catch(err => { // 登录失败
        this.$message.error('登录失败，手机号或验证码错误')
        console.log('登陆失败', err)
        this.loginLoading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
    .login_container {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url('../../assets/login_bg.jpg') no-repeat
    }
    .login_header {
        text-align: center;
    }
    .login_box {
        width: 450px;
        height: 310px;
        background-color: #fff;
        border-radius: 15px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .btns {
        display: flex;
        justify-content: center;
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>
