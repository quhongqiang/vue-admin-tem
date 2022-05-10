<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">欢迎来到首页</h3>
      </div>

      <el-form-item prop="username">
        <i class="el-icon-user" style="color: #fff; font-size: 18px;margin: 0 18px;" />
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="tel"
          maxlength="20"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <i class="el-icon-lock" style="color: #fff; font-size: 18px;margin: 0 18px;" />
        <el-input
          ref="password"
          v-model="loginForm.password"
          type="password"
          show-password
          placeholder="请输入密码"
          autocomplete="on"
          maxlength="20"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-form-item prop="vercode">
        <div style="display: flex;justify-content: space-between;">
          <div style="display: flex;align-items: center;">
            <i class="el-icon-lock" style="color: #fff; font-size: 18px;margin: 0 18px;" />
            <el-input
              ref="vercode"
              v-model="loginForm.vercode"
              placeholder="验证码"
              name="vercode"
              type="text"
              autocomplete="on"
            />
          </div>
          <div @click="clickImg">
            <img v-if="codeImg" style="width: 100%;height: 100%;" :src="codeImg" alt="">
          </div>
        </div>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登 录</el-button>
    </el-form>
  </div>
</template>

<script>
import { getCode } from '@/api/user'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if ((!value)) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于8位'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
        vercode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        vercode: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      loading: false,
      redirect: undefined,
      codeImg: '',
      flag: true
    }
  },
  mounted() {
    this.init()
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    async init() {
      const res = await getCode()
      const myBlob = new window.Blob([res], { type: 'image/jpeg' })
      const qrUrl = window.URL.createObjectURL(myBlob)

      this.codeImg = qrUrl
    },
    clickImg() {
      if (this.flag) {
        this.flag = false
        this.init()
        setTimeout(() => {
          this.flag = true
        }, 2000)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: '/' })
              this.loading = false
            })
            .catch(() => {
              this.$router.push({
                path: this.redirect || '/'
              })
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
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
      padding: 12px 5px 12px 0;
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
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

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

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
