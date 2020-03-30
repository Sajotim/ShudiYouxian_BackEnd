<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="off" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">注册开通新后台账号</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="off" placeholder="手机号码" />
      </el-form-item>
      <el-form-item prop="imgcode" style='position:relative;'>
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="picture" />
        </span>
        <el-input name="imgcode" type="text" @keyup.enter.native="handleLogin" autoComplete="on" placeholder="验证码" v-model="loginForm.imgcode" />
        <img class='random' style='position:absolute;right:10px; top:5px;width:80px;height:40px' @click='changeRandom' />
      </el-form-item>
      <el-form-item prop="smscode" style='position:relative;'>
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="mobile" />
        </span>
        <el-input name="smscode" type="text" @keyup.enter.native="handleLogin" autoComplete="on" placeholder="短信验证码" v-model="loginForm.smscode" />
        <el-button type="warning" round style='position:absolute;right:10px; top:5px;' @click='getsmscode'>获取验证码</el-button>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" v-model="loginForm.password" autoComplete="new-password"
          placeholder="登录密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" /></span>
      </el-form-item>
      <el-form-item prop="name">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="name" type="text" v-model="loginForm.name" autoComplete="off" placeholder="姓名" />
      </el-form-item>
      <el-form-item v-if="!loginForm.referrer" prop="referrer">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="referrer" type="text" v-model="loginForm.referrer" autoComplete="off" placeholder="邀请码（ 没有邀请码可不填，填写有意外惊喜哦~ ）" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <div class="tips">
        <div>
          <router-link to="/login">现有账号登陆</router-link>
        </div>
        <div style="color:orange;">
          <router-link to="/resetpwd">忘记密码?</router-link>
        </div>
        <div style="display: flex;align-items:center;">
          <div>有问题找客服&nbsp;</div>
          <a target=blank href="http://wpa.qq.com/msgrd?V=3&uin=53932376&Site=api工厂&Menu=yes">
            <img border="0" SRC="https://pub.idqqimg.com/qconn/wpa/button/button_old_11.gif" alt="在线咨询">
          </a>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>

import { register, smscode_register, logout, getInfo } from '@/api/login'
import { Message, MessageBox } from 'element-ui'
import { setToken } from '@/utils/auth'
import Cookies from 'js-cookie'

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
      loginForm: {
        username: '',
        password: '',
        picKey:'',
        imgcode:'',
        smscode:'',
        name:'',
        referrer:''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }],
        imgcode: [{ required: true, trigger: 'blur', validator:validateImgCode }],
      },
      loading: false,
      pwdType: 'password'
    }
  },
  mounted() {
    this.changeRandom();
    // 读取邀请码
    const referrer = Cookies.get('referrer')
    if (referrer) {
      this.loginForm.referrer = referrer
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    getsmscode() {
      if (this.loginForm.username == "") {
        Message({
          message: '请输入手机号码',
          type: 'error',
          duration: 3 * 1000
        })
        return;
      }
      if (this.loginForm.imgcode == "") {
        Message({
          message: '请输入图形验证码',
          type: 'error',
          duration: 3 * 1000
        })
        return;
      }
      this.loading = true
      smscode_register(this.loginForm.username, this.loginForm.imgcode, this.loginForm.picKey).then((res) =>{
        this.loading = false
        if (res.code == 0) {
          Message({
            message: '验证码已发送',
            type: 'success',
            duration: 3 * 1000
          })
          return;
        } else {
          this.changeRandom()
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
          return;
        }
      }).catch((err) => {
        console.log(err);
        this.loading = false
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          register(this.loginForm.username, this.loginForm.password, this.loginForm.smscode, this.loginForm.name, this.loginForm.referrer).then((res) => {
            this.loading = false
            if (res.code == 404) {
              this.changeRandom()
              Message({
                message: '手机号码已被注册',
                type: 'error',
                duration: 3 * 1000
              })
              return;
            }
            if (res.code != 0) {
              this.changeRandom()
              Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
              })
              return;
            }
            Message({
              message: '注册完成，请登录',
              type: 'success',
              duration: 3 * 1000
            })
            this.$router.push({ path: '/login' })
          }).catch((err) => {
            console.log(err);
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeRandom() {
      this.loginForm.picKey = Math.random();
      (document.getElementsByClassName('random'))[0].setAttribute('src', process.env.VUE_APP_BASE_API + '/code?k=' + this.loginForm.picKey)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

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
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
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

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: relative;
  background-color: $bg;
  .login-form {
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 220px;
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
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
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
