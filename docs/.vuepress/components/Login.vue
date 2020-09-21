<template>
  <div style="display:flex;justify-content:center;">
    <div class="login-container">
      <span class="title">登录后更精彩</span>
      <input v-model="account" class="input" placeholder="账号" />
      <input v-model="password" class="input" placeholder="密码" type="password" />
      <button class="login-btn" @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      alert('不允许长得好看的人登录！！！')
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 240px;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 30px;
  margin: 40px 0;
}

.login-container .title {
  align-self: center;
  font-size: 18px;
  margin-bottom: 10px;
}

.input {
  border: 1px solid #ddd;
  padding: 6px;
  margin: 10px 0;
  border-radius: 4px;
  outline: none;
}

.input:focus {
  border: 1px solid #3eaf7c;
}

.login-btn {
  background-color: #3eaf7c;
  border: none;
  outline: none;
  padding: 6px 0;
  border-radius: 4px;
  margin-top: 10px;
  color: white;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #4fbf8f;
}

@media (max-width: 500px) {
  .login-container {
    width: 96vw;
  }
}
</style>
