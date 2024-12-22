<template>
  <div class="login-container">
    <div class="background-animation"></div>
    <div class="floating-elements">
      <div class="floating-element" v-for="n in 10" :key="n"></div>
    </div>
    <form @submit.prevent="handleSubmit" class="login-form">
      <h2 class="form-title">登录您的账户</h2>
      <div class="input-group">
        <label for="username">用户名</label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          placeholder="请输入用户名"
        >
      </div>
      <div class="input-group">
        <label for="password">密码</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="请输入密码"
        >
      </div>
      <div class="checkbox-group">
        <input id="remember-me" type="checkbox" v-model="rememberMe">
        <label for="remember-me">记住我</label>
      </div>
      <button type="submit" class="submit-button">登录</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div class="form-footer">
        <router-link to="/register" class="link">注册新账户</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// 创建 axios 实例并设置基础 URL
const api = axios.create({
  baseURL: 'http://localhost:8888/', // 替换为你的后端 API 地址
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

const router = useRouter()
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  try {

    console.log("/user/login,",username.value)
    console.log("/user/login,",password.value)

    const response = await api.post('/user/login', {
        userName: username.value,
        password: password.value
    })

    console.log("/user/login,response",response)
    if (response.data.status) {
      // 存储 token 或用户信息
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', username.value)
      console.log(localStorage.getItem('username'))
      // 跳转到仪表盘
      router.push('/dashboard')
    } else {
      errorMessage.value = response.data.msg || '登录失败'
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.msg || '登录失败，请稍后重试'
    console.error('登录错误:', error)
  }
}


</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  position: relative;
  overflow: hidden;
  background-image: url('/src/assets/images/legal-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.background-animation {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  opacity: 0.2;
  z-index: 1;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
}

.floating-element {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
}

.floating-element:nth-child(1) { width: 80px; height: 80px; left: 10%; animation: float 15s infinite; }
.floating-element:nth-child(2) { width: 60px; height: 60px; left: 20%; animation: float 25s infinite; }
.floating-element:nth-child(3) { width: 70px; height: 70px; left: 30%; animation: float 20s infinite; }
.floating-element:nth-child(4) { width: 50px; height: 50px; left: 40%; animation: float 18s infinite; }
.floating-element:nth-child(5) { width: 90px; height: 90px; left: 50%; animation: float 22s infinite; }
.floating-element:nth-child(6) { width: 75px; height: 75px; left: 60%; animation: float 19s infinite; }
.floating-element:nth-child(7) { width: 55px; height: 55px; left: 70%; animation: float 24s infinite; }
.floating-element:nth-child(8) { width: 85px; height: 85px; left: 80%; animation: float 17s infinite; }
.floating-element:nth-child(9) { width: 65px; height: 65px; left: 90%; animation: float 21s infinite; }
.floating-element:nth-child(10) { width: 95px; height: 95px; left: 95%; animation: float 23s infinite; }

.login-form {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 3;
  animation: formAppear 0.6s ease-out;
}

.form-title {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-group input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  outline: none;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.checkbox-group input {
  margin-right: 0.5rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.submit-button:hover {
  background-color: #357abd;
}

.submit-button:active {
  transform: scale(0.98);
}

.error-message {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

.forgot-password {
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #4a90e2;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: #357abd;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.link {
  color: #4a90e2;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.link:hover {
  color: #357abd;
}


@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes formAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-100vh) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
  }
}
</style>