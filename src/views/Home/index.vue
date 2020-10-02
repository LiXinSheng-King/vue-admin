<template>
  <div>
    <el-container class="home-container">
      <!-- 折叠的两种方式 -->
      <!-- <el-aside width="auto"> -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false "
          :router="true"
          :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

          <!-- 二级菜单 -->
          <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
                        :key="subItem.id" @click="saveNavState('/'+subItem.path)">
            <!-- 二级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div>
            <img src="../../assets/lang.jpg">
            <span>
              <i
                :class = "{
                  'el-icon-s-fold': isCollapse,
                  'el-icon-s-unfold': !isCollapse
                }"
                @click="toggleCollapse"
              ></i>
              <span>电商后台管理系统</span>
            </span>
          </div>
          <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { onGetMenuList } from '@/api/user'
export default {
  name: 'HomeIndex',
  data () {
    return {
      // 左侧菜单数据
      menulist: [],

      // 左侧以及菜单的图标
      iconsObj: {
        125: 'iconfont iconicon35',
        103: 'iconfont iconSettingscontroloptions',
        101: 'iconfont iconshop',
        102: 'iconfont iconcommodity',
        145: 'iconfont icondata'
      },

      // 左侧菜单是否折叠
      isCollapse: false,

      // 被激活的链接地址
      activePath: ''
    }
  },

  created () {
    // 调用getMenuList获取所有左侧导航栏菜单
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 清空token
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    },

    // 获取所有左侧菜单
    getMenuList () {
      onGetMenuList().then(res => {
        console.log('左侧导航栏数据', res) // 左侧导航的所有数据
        this.menulist = res.data.data // 获取导航所有数据
      })
    },

    // 点击按钮切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },

    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped lang="less">
  .home-container {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    align-items: center;
    >div {
      display: flex;
      align-items: center;
      img {
        width: 60px;
        height: 60px;
        margin-right: 20px;
      }
    }
  }
  .el-aside {
    background-color: #333744
  }
  .iconfont {
      margin-right: 10px;
  }
  .el-menu {
      border-right: none;
  }
  .el-main {
    background-color: #eaedf1
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing:2px;
    cursor: pointer;
  }
</style>
