<template>
  <div class="dashboard">
    <!-- 侧边栏 -->
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
          <li class="active"><router-link to="/case-management"><BriefcaseIcon /> 案件管理</router-link></li>
          <li><router-link to="/document-generation"><FileTextIcon /> 文书生成</router-link></li>
        </ul>
      </nav>
    </aside>

    <div class="main-content">
      <!-- 顶部导航 -->
      <header class="top-nav">
        <div class="breadcrumb">
          <HomeIcon />
          <span>首页</span>
          <ChevronRightIcon />
          <span>案件管理</span>
          <ChevronRightIcon />
          <span>{{ isEdit ? '编辑案件' : '新建案件' }}</span>
        </div>
        <div class="right-section">
          <button class="icon-button" @click="toggleSearch"><SearchIcon /></button>
          <button class="icon-button" @click="toggleNotifications"><BellIcon /></button>
          <button class="icon-button help-button" @click="goToHelpCenter">
            <HelpCircleIcon />
            <span>帮助中心</span>
          </button>
          <div class="user-profile" @click="goToUserSettings">
            <img src="/avatar.jpg" alt="用户头像" class="avatar" />
            <span>张三</span>
            <ChevronDownIcon />
          </div>
        </div>
      </header>

      <!-- 主要内容区域 -->
      <div class="content-wrapper">
        <div class="page-header">
          <div class="title-section">
            <h2>{{ isEdit ? '编辑案件' : '新建案件' }}</h2>
            <p class="subtitle">{{ isEdit ? '修改现有案件信息' : '创建新的案件记录' }}</p>
          </div>
        </div>

        <div class="form-container">
          <form @submit.prevent="handleSubmit" class="case-form">
            <div class="form-group">
              <label>案件号</label>
              <div class="input-with-icon">
                <HashIcon class="input-icon" />
                <input v-model="form.number" required placeholder="请输入案件号">
              </div>
            </div>
            
            <div class="form-group">
              <label>案件名称</label>
              <div class="input-with-icon">
                <FileTextIcon class="input-icon" />
                <input v-model="form.title" required placeholder="请输入案件名称">
              </div>
            </div>
            
            <div class="form-group">
              <label>案件类型</label>
              <div class="input-with-icon">
                <FolderIcon class="input-icon" />
                <select v-model="form.type" required>
                  <option value="">请选择案件类型</option>
                  <option value="民事案件">民事案件</option>
                  <option value="刑事案件">刑事案件</option>
                  <option value="行政案件">行政案件</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label>承办法院</label>
              <div class="input-with-icon">
                <BuildingIcon class="input-icon" />
                <input v-model="form.court" required placeholder="请输入承办法院">
              </div>
            </div>
            
            <div class="form-group">
              <label>承办法官</label>
              <div class="input-with-icon">
                <UserIcon class="input-icon" />
                <input v-model="form.judge" required placeholder="请输入承办法官">
              </div>
            </div>
            
            <div class="form-group">
              <label>立案日期</label>
              <div class="input-with-icon">
                <CalendarIcon class="input-icon" />
                <input type="date" v-model="form.date" required>
              </div>
            </div>
            
            <div class="form-group">
              <label>案件状态</label>
              <div class="input-with-icon">
                <ActivityIcon class="input-icon" />
                <select v-model="form.status" required>
                  <option value="">请选择案件状态</option>
                  <option value="not_started">未开始</option>
                  <option value="in_progress">进行中</option>
                  <option value="completed">已完成</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="$router.back()">
                <ArrowLeftIcon class="icon" />
                返回
              </button>
              <button type="submit" class="btn-primary">
                <SaveIcon class="icon" />
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { caseService } from '@/services/caseService'
import { ElMessage } from 'element-plus'
import {
  DashboardIcon, FileTextIcon, UploadCloudIcon, DatabaseIcon, SearchIcon,
  LayersIcon, BriefcaseIcon, HomeIcon, ChevronRightIcon, BellIcon,
  UserIcon, HashIcon, FolderIcon, BuildingIcon, CalendarIcon,
  ActivityIcon, ArrowLeftIcon, SaveIcon, HelpCircleIcon, ChevronDownIcon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => route.params.id)

const form = ref({
  number: '',
  title: '',
  type: '',
  court: '',
  judge: '',
  date: '',
  status: 'not_started'
})

onMounted(async () => {
  if (isEdit.value) {
    try {
      const data = await caseService.getCaseById(route.params.id)
      console.log(data)
      // 确保日期字段格式一致
      form.value = {
        ...data,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : ''
      }
    } catch (error) {
      console.error('获取案件详情失败:', error)
      ElMessage.error('获取案件详情失败')
    }
  }
})

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await caseService.updateCase(route.params.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await caseService.createCase(form.value)
      ElMessage.success('创建成功')
    }
    router.push('/case-management')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
  color: #333;
  font-family: 'Arial', sans-serif;
}

.sidebar {
  width: 240px;
  background-color: #001529;
  color: white;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
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
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}

.top-nav {
  background-color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  margin-bottom: 20px;
  border-radius: 4px;
}

.form-container {
  background: white;
  padding: 24px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.case-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  width: 16px;
  height: 16px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #40a9ff;
}

.btn-secondary {
  background-color: white;
  color: #666;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  color: #40a9ff;
  border-color: #40a9ff;
}

.icon {
  width: 16px;
  height: 16px;
}
</style> 