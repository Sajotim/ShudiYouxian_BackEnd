<template>
  <div class="login-container">
    <el-form class="login-form" autocomplete="off" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">蜀地优鲜后台管理系统 <span style="font-size:16px;color:#aaa;">v1.0 </span></h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" tabindex="1" v-model="loginForm.username" autocomplete="off" clearable placeholder="登录账号" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" tabindex="2" v-model="loginForm.password" autocomplete="off" clearable
          placeholder="登录密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" /></span>
      </el-form-item>
      <el-form-item prop="imgcode" style='position:relative;margin-bottom:10px;'>
        <span class="svg-container">
          <svg-icon icon-class="picture" />
        </span>
        <el-input name="imgcode" type="text" @keyup.enter.native="handleLogin" autocomplete="off" placeholder="验证码" v-model="loginForm.imgcode" />
        <img class='random' style='position:absolute;right:10px; top:5px;width:80px;height:40px' @click='changeRandom' />
      </el-form-item>
      <el-form-item style="border:none;background:none;height:auto;">
        <el-checkbox style="color:#ddd;" v-model="rememberMeChecked">记住登录状态</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { login_username } from '@/api/login'
import { setToken } from '@/utils/auth'

export default {
  name: 'login',
  data() {

    const validateImgCode = (rule, value, callback) => {
      if (1*value != value) {
        callback(new Error('请正确输入验证码'))
        return;
      } else if (value.length != 4) {
        callback(new Error('验证码长度为4位'))
        return;
      } else {
        callback()
        return;
      }
    }

    return {
      onlyCanLoginByMobile: false,
      loginForm: {
        merchantId: undefined,
        username: undefined,
        password: undefined,
        picKey: undefined,
        imgcode: undefined,
        pdomain: undefined
      },
      loginRules: {
        merchantId: [{ required: true, trigger: 'blur', message:'不能为空' }],
        username: [{ required: true, trigger: 'blur', message:'不能为空' }],
        password: [{ required: true, trigger: 'blur', message:'不能为空' }],
        imgcode: [{ required: true, trigger: 'blur', validator:validateImgCode, message:'不能为空' }],
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,

      rememberMeChecked: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    const onlyMobileDomains = [
      'localhost',
      '127.0.0.1',
      'admin.it120.cc'
    ]
    const domain = document.domain
    if (!onlyMobileDomains.includes(domain)) {
      this.loginForm.pdomain = domain.substring(0, domain.indexOf('.'))
    } else {
      this.onlyCanLoginByMobile = true
    }
  },
  mounted() {
    if (this.$route.query.trial) {
      this.loginForm.username = '11100000224'
      this.loginForm.password = '123456'
    }
    this.changeRandom()
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const postData = {
            userName: this.loginForm.username,
            pwd: this.loginForm.password,
            pdomain: this.loginForm.pdomain,
            imgcode: this.loginForm.imgcode,
            k: this.loginForm.picKey
          }
          if (this.rememberMeChecked) {
            postData.rememberMe = 'true'
          }
          const apiM = login_username(postData)
          apiM.then((res) => {
            this.loading = false
            this.loginForm.imgcode = ''
            if (res.code === 300) {
              this.changeRandom()
              this.$message.error('验证码错误')
              return
            }
            if (res.code === 10000) {
              this.changeRandom()
              this.$message.error('请输入正确的手机号码')
              return
            }
            if (res.code === 100) {
              this.changeRandom()
              this.$message.error('密码次数过多，该账号已被锁定')
              return
            }
            if (res.code === 404) {
              this.changeRandom()
              this.$message.error('账号或密码错误')
              return
            }
            if (res.code === 20000) {
              this.changeRandom()
              this.$message.error('当前用户状态有误')
              return
            }
            if (res.code !== 0) {
              this.changeRandom()
              this.$message.error(res.msg)
              return
            }
            if (res.data.vipLevel > 0 || res.data.registedDays <= 7) {
              // 7天内注册的免费用户或者是付费会员
              this.processingLogin(res.data.token)
            } else {
              this.queueUp(res.data.token)
            }
          }).catch((err) => {
            console.log(err)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    processingLogin(token) {
      this.$message({
        message: '登录成功',
        type: 'success'
      })
      setToken(token)
      this.$router.push({ path: this.redirect || '/' })
    },
    queueUp(token) {
      const rnd = Math.ceil(Math.random() * 15)
      const loading = this.$loading({
        lock: true,
        text: '免费线路繁忙，排队中... （升级会员极速专享）',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        customClass: 'loadding-login'
      })
      setTimeout(() => {
        loading.close()
        this.processingLogin(token)
      }, rnd * 1000)
    },
    changeRandom() {
      this.loginForm.picKey = Math.random();
      (document.getElementsByClassName('random'))[0].setAttribute('src', process.env.VUE_APP_BASE_API + '/code?k=' + this.loginForm.picKey)
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.loadding-login .el-loading-text {
  color: #fff;
}
.loadding-login .el-loading-spinner {
  top: 40%;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    display: flex;
    justify-content:space-between;
    align-items:center;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
