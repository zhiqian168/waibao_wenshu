<template>
    <div class="data-preprocessing-container">
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
            <li class="active"><router-link to="/data-preprocessing"><DatabaseIcon /> 数据预处理</router-link></li>
            <li><router-link to="/fact-finding"><SearchIcon /> 事实查明</router-link></li>
            <li><router-link to="/case-grouping"><LayersIcon /> 案件编队</router-link></li>
            <li><router-link to="/case-management"><BriefcaseIcon /> 案件管理</router-link></li>
            <li><router-link to="/document-generation"><FileTextIcon /> 文书生成</router-link></li>
          </ul>
        </nav>
      </aside>
  
      <div class="main-content">
        <!-- 顶部导航栏 -->
        <header class="top-nav">
          <div class="breadcrumb">
            <HomeIcon />
            <span>首页</span>
            <ChevronRightIcon />
            <span>数据预处理</span>
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
  
        <!-- 主要内容区域 -->
        <main>
          <h2>数据预处理</h2>
          
          <div class="data-type-selector">
            <button 
              :class="['data-type-btn', { active: dataType === 'indictment' }]"
              @click="dataType = 'indictment'"
            >
              <FileTextIcon /> 起诉状
            </button>
            <button 
              :class="['data-type-btn', { active: dataType === 'defense' }]"
              @click="dataType = 'defense'"
            >
              <FileTextIcon /> 答辩状
            </button>
          </div>
  
          <div class="preprocessing-content">
            <div class="file-selection">
              <h3>{{ dataType === 'indictment' ? '起诉状' : '答辩状' }}文件选择</h3>
              <div class="file-list">
                <div v-for="file in files" :key="file.id" :class="['file-item', { active: file.id === selectedFileId }]" @click="selectFile(file.id)">
                  <FileIcon />
                  <span>{{ file.name }}</span>
                </div>
              </div>
            </div>
            
            <div class="file-content">
              <h3>文件内容</h3>
              <div class="content-area">
                <div v-if="selectedFileId" class="text-content">
                  {{ getSelectedFileContent() }}
                </div>
                <div v-else class="no-file-selected">
                  请选择一个文件查看内容
                </div>
              </div>
            </div>
          </div>
  
          <div class="action-buttons">
            <button class="btn-primary" @click="startPreprocessing" :disabled="!selectedFileId">
              <PlayIcon /> 开始预处理
            </button>
            <button class="btn-secondary" @click="cancelPreprocessing">
              <XIcon /> 取消
            </button>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { 
    DashboardIcon, FileTextIcon, UploadCloudIcon, DatabaseIcon, SearchIcon, 
    LayersIcon, BriefcaseIcon, HomeIcon, ChevronRightIcon, BellIcon, 
    ChevronDownIcon, FileIcon, PlayIcon, XIcon
  } from 'lucide-vue-next'
  
  const dataType = ref('indictment')
  const selectedFileId = ref(null)
  
  const files = ref([
    { id: 1, name: '起诉状1.docx', content: '这是起诉状1的内容...' },
    { id: 2, name: '起诉状2.docx', content: '这是起诉状2的内容...' },
    { id: 3, name: '答辩状1.docx', content: '这是答辩状1的内容...' },
    { id: 4, name: '答辩状2.docx', content: '这是答辩状2的内容...' },
  ])
  
  const selectFile = (id) => {
    selectedFileId.value = id
  }
  
  const getSelectedFileContent = () => {
    const selectedFile = files.value.find(file => file.id === selectedFileId.value)
    return selectedFile ? selectedFile.content : ''
  }
  
  const startPreprocessing = () => {
    console.log('开始预处理')
    // 实现预处理逻辑
  }
  
  const cancelPreprocessing = () => {
    console.log('取消预处理')
    // 实现取消逻辑
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
  .data-preprocessing-container {
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
  
  .breadcrumb {
    display: flex;
    align-items: center;
  }
  
  .breadcrumb svg {
    margin: 0 5px;
  }
  
  .right-section {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    transition: color 0.3s ease;
  }
  
  .icon-button:hover {
    color: #1890ff;
  }
  
  .user-profile {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
  
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 24px;
  }
  
  .data-type-selector {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .data-type-btn {
    padding: 10px 20px;
    border: 1px solid #d9d9d9;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s ease;
  }
  
  .data-type-btn.active {
    background-color: #1890ff;
    color: white;
    border-color: #1890ff;
  }
  
  .preprocessing-content {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .file-selection,
  .file-content {
    flex: 1;
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
  }
  
  .file-list {
    max-height: 300px;
    overflow-y: auto;
  }
  
  .file-item {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  
  .file-item:hover,
  .file-item.active {
    background-color: #e6f7ff;
  }
  
  .file-item svg {
    margin-right: 10px;
    color: #1890ff;
  }
  
  .content-area {
    height: 300px;
    overflow-y: auto;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 10px;
  }
  
  .no-file-selected {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #999;
  }
  
  .action-buttons {
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
    display: flex;
    align-items: center;
    gap: 5px;
    transition: background-color 0.3s ease;
  }
  
  .btn-primary {
    background-color: #1890ff;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #40a9ff;
  }
  
  .btn-primary:disabled {
    background-color: #d9d9d9;
    cursor: not-allowed;
  }
  
  .btn-secondary {
    background-color: #f0f0f0;
    color: #333;
  }
  
  .btn-secondary:hover {
    background-color: #d9d9d9;
  }
  </style>
