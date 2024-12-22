<template>
  <form @submit.prevent="handleSubmit" class="forgot-password-form">
    <h2 class="form-title">忘记密码</h2>
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
      <label for="email">邮箱</label>
      <input 
        id="email" 
        v-model="email" 
        type="email" 
        required 
        placeholder="请输入注册时的邮箱"
      >
    </div>
    <button type="submit" class="submit-button">发送重置链接</button>
    <div class="form-footer">
      <router-link to="/login" class="link">返回登录</router-link>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const email = ref('')

const handleSubmit = () => {
  // 这里应该是实际的验证逻辑
  console.log('验证尝试', { username: username.value, email: email.value })
  // 验证成功后跳转到重置密码页面
  router.push('/reset-password')
}
</script>

<style scoped>
.forgot-password-container {
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
  opacity: 0.3;
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

.forgot-password-form {
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

.sms-group {
  display: flex;
  gap: 10px;
}

.sms-button {
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.sms-button:hover:not(:disabled) {
  background-color: #357abd;
}

.sms-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
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

.form-footer {
  display: flex;
  justify-content: center;
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
  .forgot-password-form {
    padding: 1.5rem;
  }
}
</style>