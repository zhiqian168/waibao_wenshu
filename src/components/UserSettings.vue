<template>
  <div class="user-settings-container">
    <aside class="sidebar">
      <div class="logo">
        <img src="/logo.png" alt="Logo" />
        <h1>司法智能辅助系统</h1>
      </div>
      <nav>
        <ul>
          <li><router-link to="/dashboard"><DashboardIcon /> 工作台</router-link></li>
          <li><router-link to="/document-management"><FileTextIcon /> 文书管理</router-link></li>
          <li><router-link to="/data-upload"><UploadCloudIcon /> 数据上传</router-link></li>
          <li><router-link to="/data-preprocessing"><DatabaseIcon /> 数据预处理</router-link></li>
          <li><router-link to="/fact-finding"><SearchIcon /> 事实查明</router-link></li>
          <li><router-link to="/case-grouping"><LayersIcon /> 案件编队</router-link></li>
          <li><router-link to="/case-management"><BriefcaseIcon /> 案件管理</router-link></li>
          <li><router-link to="/document-generation"><FileTextIcon /> 文书生成</router-link></li>
        </ul>
      </nav>
    </aside>

    <main class="main-content">
      <div class="content-wrapper">
        <div class="page-header">
          <div class="title-section">
            <h2>用户设置</h2>
            <p class="subtitle">管理您的账户信息和密码设置</p>
          </div>
        </div>

        <div class="settings-grid">
          <!-- 基本信息设置 -->
          <section class="settings-card">
            <h3><UserIcon class="section-icon" /> 基本信息</h3>
            <div class="avatar-upload">
              <div class="avatar-preview" @click="handleAvatarClick">
                <img :src="userAvatar" alt="用户头像" class="current-avatar" />
                <div class="avatar-overlay">
                  <UploadCloudIcon />
                  <span>更换头像</span>
                </div>
              </div>
              <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="handleAvatarChange"
              />
            </div>

            <div class="form-group">
              <label>用户名</label>
              <div class="input-with-icon disabled">
                <UserIcon class="input-icon" />
                <input
                    type="text"
                    v-model="userInfo.username"
                    placeholder="请输入用户名"
                    disabled
                    title="用户名不可修改"
                />
              </div>
            </div>
          </section>

          <!-- 安全设置 -->
          <section class="settings-card">
            <h3><ShieldIcon class="section-icon" /> 安全设置</h3>
            <div class="security-items">
              <div class="security-item">
                <div class="security-info">
                  <KeyIcon class="security-icon" />
                  <div>
                    <h4>登录密码</h4>
                    <p>定期更改密码可以保护账号安全</p>
                  </div>
                </div>
                <button class="btn-link" @click="showChangePassword = true">
                  修改
                </button>
              </div>
            </div>
          </section>
        </div>

        <!-- 底部操作按钮 -->
        <div class="settings-actions">
          <button class="btn-secondary" @click="resetForm">取消</button>
          <button class="btn-primary" @click="saveSettings">保存更改</button>
        </div>
      </div>
    </main>

    <!-- 修改密码弹窗 -->
    <div class="modal" v-if="showChangePassword" @click.self="handleClosePasswordModal">
      <div class="modal-content">
        <h3>修改密码</h3>
        <div class="form-group">
          <label>当前密码</label>
          <div class="input-with-icon">
            <LockIcon class="input-icon" />
            <input
                type="password"
                v-model="passwordForm.current"
                placeholder="请输入当前密码"
            />
          </div>
        </div>
        <div class="form-group">
          <label>新密码</label>
          <div class="input-with-icon">
            <KeyIcon class="input-icon" />
            <input
                type="password"
                v-model="passwordForm.new"
                placeholder="请输入新密码"
            />
          </div>
        </div>
        <div class="form-group">
          <label>确认新密码</label>
          <div class="input-with-icon">
            <CheckIcon class="input-icon" />
            <input
                type="password"
                v-model="passwordForm.confirm"
                placeholder="请再次输入新密码"
            />
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="handleClosePasswordModal">取消</button>
          <button class="btn-primary" @click="changePassword">确认修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
  DashboardIcon, FileTextIcon, UploadCloudIcon, DatabaseIcon, SearchIcon,
  LayersIcon, BriefcaseIcon, KeyIcon, LockIcon,
  UserIcon, ShieldIcon, CheckIcon
} from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8888',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加响应拦截器
api.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        ElMessage.error(error.response.data.message || '请求失败')
      } else if (error.request) {
        // 请求已发出，但没有收到响应
        ElMessage.error('服务器无响应，请稍后重试')
      } else {
        // 请求配置有误
        ElMessage.error('请求配置有误：' + error.message)
      }
      return Promise.reject(error)
    }
)

// 用户头像（默认图）
const userAvatar = ref('/avatar.jpg')

// 隐藏的 <input type="file"> 元素
const avatarInput = ref(null)

// 控制"修改密码"弹窗
const showChangePassword = ref(false)

// 用户信息
const userInfo = reactive({
  username: localStorage.getItem('username')
})

// 修改密码表单
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

// 点击"更换头像"区时，触发文件选择
const handleAvatarClick = () => {
  avatarInput.value.click()
}

// 当选择了新头像文件
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 1. 检查格式
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件')
    return
  }

  // 2. 检查大小
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 2MB')
    return
  }

  // 3. 本地预览
  const reader = new FileReader()
  reader.onload = (e) => {
    userAvatar.value = e.target.result
  }
  reader.readAsDataURL(file)

  // 4. 上传到后端
  uploadAvatarToServer(file)
}

// 将头像文件上传到服务端
const uploadAvatarToServer = async (file) => {
  try {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await api.post('/oss/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.code === 200) {
      ElMessage.success('头像上传成功')
    } else {
      throw new Error(response.data.message || '上传失败')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
  }
}

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
}

// 关闭密码修改弹窗
const handleClosePasswordModal = () => {
  showChangePassword.value = false
  resetPasswordForm()
}

// 保存基本信息
const saveSettings = async () => {
  try {
    const response = await api.post('/user/update', userInfo)
    if (response.data.code === 200) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    console.error('保存设置失败:', error)
  }
}

// 重置表单（返回上一页）
const resetForm = () => {
  router.back()
}


// 修改密码函数的相关部分
const changePassword = async () => {
  try {
    // 表单验证
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      ElMessage.error('请填写完整信息')
      return
    }

    if (passwordForm.new !== passwordForm.confirm) {
      ElMessage.error('两次输入的新密码不一致')
      return
    }

    if (passwordForm.current === passwordForm.new) {
      ElMessage.error('新密码不能与当前密码相同')
      return
    }

    // 调用修改密码接口
    const response = await api.put('/user/password', {
      userName: userInfo.username,
      current: passwordForm.current,
      newPassword: passwordForm.new,
      confirm: passwordForm.confirm
    })
    console.log("responseresponseresponse",response)

    if (response.data.code === 0) {
      // 显示成功提示
      ElMessage({
        type: 'success',
        message: '密码修改成功',
        duration: 2000  // 显示2秒
      })

      // 清空表单并关闭弹窗
      handleClosePasswordModal()

      // 可选：延迟一段时间后刷新页面或跳转
      // setTimeout(() => {
      //   window.location.reload()
      // }, 2000)
    } else {
      ElMessage.error(response.data.message || '修改失败')
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('修改密码失败，请稍后重试')
    }
  }
}




</script>
<style scoped>
.user-settings-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f7; /* 苹果风格的浅灰色背景 */
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background-color: #001529;
  color: white;
  padding: 24px 0;
  overflow-y: hidden;
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
}

.logo img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.logo h1 {
  font-size: 18px;
  margin: 0;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar li a {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #a6adb4;
  text-decoration: none;
  transition: all 0.3s ease;
}

.sidebar li a:hover,
.sidebar li a.active {
  background-color: #1890ff;
  color: white;
}

.sidebar li a svg {
  margin-right: 10px;
}

.main-content {
  margin-left: 240px;
  padding: 24px 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  min-height: 100vh;
}

.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 20px 0;
  background: rgba(245, 245, 247, 0.8);
  backdrop-filter: blur(20px);
  margin-bottom: 40px;
}

.settings-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

.settings-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: transform 0.3s ease;
}

.settings-card:hover {
  transform: translateY(-4px);
}

.settings-card h3 {
  color: #1890ff;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  font-size: 20px;
}

.section-icon {
  padding: 8px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 12px;
  color: #1890ff;
}

.avatar-upload {
  margin-bottom: 32px;
}

.avatar-preview {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.avatar-preview:hover {
  transform: scale(1.05);
}

.avatar-preview:hover .avatar-overlay {
  opacity: 1;
}

.current-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-overlay svg {
  width: 24px;
  height: 24px;
  margin-bottom: 8px;
}

.avatar-overlay span {
  font-size: 14px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #86868b;
  margin-bottom: 8px;
}

.form-group input {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(24, 144, 255, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  background: white;
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.security-items {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.security-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(24, 144, 255, 0.1);
  transition: all 0.3s ease;
}

.security-item:hover {
  transform: translateX(4px);
  border-color: #1890ff;
  background: white;
}

.security-info h4 {
  font-size: 18px;
  font-weight: 500;
  color: #1d1d1f;
  margin-bottom: 8px;
}

.security-info p {
  color: #86868b;
  font-size: 14px;
}

.security-icon {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
  padding: 8px;
  border-radius: 50%;
  margin-right: 16px;
}

.btn-primary {
  background: #0071e3;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0077ed;
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(0, 0, 0, 0.05);
  color: #1d1d1f;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-secondary:hover {
  background: rgba(0, 0, 0, 0.1);
}

.btn-link {
  color: #1890ff;
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-link:hover {
  background: rgba(24, 144, 255, 0.1);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  z-index: 999;
}

.modal-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  width: 480px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #1d1d1f;
}

.modal-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
</style>
