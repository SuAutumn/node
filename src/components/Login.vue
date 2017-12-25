<template>
  <div>
    <input type="text" placeholder="请输入用户名"
            v-model="username">
    <input type="password" placeholder="请输入密码"
            v-model="password">
    <button @click.stop="getToken">登录</button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    getToken () {
      alert(this.username + ' ' + this.password)
    }
  }
}
</script>

