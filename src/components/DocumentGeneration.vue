<template>
  <div class="document-generation-container">
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
          <li class="active"><router-link to="/document-generation"><FileTextIcon /> 文书生成</router-link></li>
        </ul>
      </nav>
    </aside>

    <div class="main-content">
      <header class="top-nav">
        <div class="breadcrumb">
          <HomeIcon />
          <span>首页</span>
          <ChevronRightIcon />
          <span>文书生成</span>
        </div>
        <div class="right-section">
          <button class="icon-button" @click="toggleSearch"><SearchIcon /></button>
          <button class="icon-button" @click="toggleNotifications"><BellIcon /></button>
          <div class="user-profile" @click="toggleUserMenu">
            <img src="/avatar.jpg" alt="用户头像" class="avatar" />
            <span>张三</span>
            <ChevronDownIcon />
          </div>
        </div>
      </header>

      <main>
        <h2>文书生成</h2>

        <div class="document-generation-content">
          <div class="file-list">
            <h3>列表</h3>
            <div class="file-items">
              <div v-for="file in fileList" :key="file.id" class="file-item">
                <div class="file-info">
                  <h4>{{ file.fileTitle }}</h4>
                  <p>处理时间：{{ formatDateTime(file.processTime) }}</p>
                </div>
                <button class="download-btn" @click="downloadFile(file.fileUrl)">
                  <DownloadIcon />
                  下载
                </button>
              </div>
            </div>
          </div>

<!--          <div class="generated-document">-->
<!--            <h3>生成的文书</h3>-->
<!--            <div class="document-preview" v-if="generatedDocument">-->
<!--              <div v-html="generatedDocument"></div>-->
<!--            </div>-->
<!--            <div class="no-document" v-else>-->
<!--              请选择要处理的文件-->
<!--            </div>-->
<!--          </div>-->
<!--          -->
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  HomeIcon, ChevronRightIcon, SearchIcon, BellIcon, ChevronDownIcon,
  DashboardIcon, FileTextIcon, UploadCloudIcon, DatabaseIcon, LayersIcon,
  BriefcaseIcon, DownloadIcon
} from 'lucide-vue-next'

const fileList = ref([])
// const generatedDocument = ref('')

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8888/moonshot/fileList')
    fileList.value = response.data.list
  } catch (error) {
    console.error('获取文件列表失败:', error)
  }
})

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const downloadFile = (url) => {
  window.open(url, '_blank')
}
const toggleSearch = () => {
  // 实现搜索功能
}

const toggleNotifications = () => {
  // 实现通知功能
}

const toggleUserMenu = () => {
  // 实现用户菜单功能
}
  </script>
  
  <style scoped>
  .document-generation-container {
    display: flex;
    min-height: 100vh;
    background-color: #f0f2f5;
  }
  
  .sidebar {
    width: 240px;
    background-color: #001529;
    color: white;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    overflow-y: auto;
    z-index: 100;
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
    flex: 1;
    padding: 20px;
    background-color: #f0f2f5;
    margin-left: 240px;
    min-height: 100vh;
  }
  
  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .breadcrumb {
    display: flex;
    align-items: center;
  }
  
  .right-section {
    display: flex;
    align-items: center;
  }
  
  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    margin-left: 10px;
  }
  
  .user-profile {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
  }
  
  .document-generation-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .document-type-selection,
  .case-info-input,
  .generated-document {
    background-color: white;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input[type="text"],
  textarea,
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }
  
  textarea {
    height: 100px;
  }
  
  .document-preview {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    padding: 20px;
    min-height: 300px;
    max-height: 500px;
    overflow-y: auto;
  }
  
  .no-document {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    color: #999;
  }
  
  .action-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #1890ff;
    color: white;
  }
  
  .btn-secondary {
    background-color: #f0f0f0;
    color: #333;
  }
  
  .btn-primary:disabled,
  .btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .document-generation-container {
    display: flex;
    min-height: 100vh;
    background-color: #f0f2f5;
  }

  .sidebar {
    width: 240px;
    background-color: #001529;
    color: white;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    overflow-y: auto;
    z-index: 100;
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

  .main-content {
    flex: 1;
    padding: 20px;
    margin-left: 240px;
  }

  .file-list {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
  }

  .file-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
  }

  .file-info h4 {
    margin: 0 0 8px 0;
    color: #333;
  }

  .file-info p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }

  .download-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 15px;
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .download-btn:hover {
    background-color: #40a9ff;
  }

  </style>
