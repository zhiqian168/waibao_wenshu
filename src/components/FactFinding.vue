<template>
  <div class="fact-finding-container">
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
          <li class="active"><router-link to="/fact-finding"><SearchIcon /> 事实查明</router-link></li>
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
          <span>事实查明</span>
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
      <main class="content">
        <h2>事实查明</h2>
        
        <div class="fact-finding-content">
          <div class="file-selection">
            <h3>文件选择</h3>
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
          <button class="btn-primary" @click="startConflictIdentification">
            <AlertTriangleIcon /> 冲突识别
          </button>
          <button class="btn-secondary" @click="cancelOperation">
            <XIcon /> 取消
          </button>
        </div>
      </main>
    </div>

    <!-- 冲突识别弹窗 -->
    <div v-if="showConflictModal" class="modal-overlay">
      <div class="modal-content">
        <h3>冲突识别结果</h3>
        <p>在选定的文件中发现以下冲突：</p>
        <ul>
          <li v-for="(conflict, index) in conflictResults" :key="index">
            {{ conflict }}
          </li>
        </ul>
        <button class="btn-primary" @click="closeConflictModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  SearchIcon, BellIcon, HomeIcon, ChevronRightIcon, ChevronDownIcon,
  FileIcon, AlertTriangleIcon, XIcon,
  DashboardIcon, FileTextIcon, UploadCloudIcon, DatabaseIcon, LayersIcon, BriefcaseIcon
} from 'lucide-vue-next'

const files = ref([
  { id: 1, name: '起诉状.docx', content: '这是起诉状的内容...' },
  { id: 2, name: '答辩状.docx', content: '这是答辩状的内容...' },
  { id: 3, name: '证据1.pdf', content: '这是证据1的内容...' },
])

const selectedFileId = ref(null)
const showConflictModal = ref(false)
const conflictResults = ref([])

const selectFile = (fileId) => {
  selectedFileId.value = fileId
}

const getSelectedFileContent = () => {
  const selectedFile = files.value.find(file => file.id === selectedFileId.value)
  return selectedFile ? selectedFile.content : ''
}

const startConflictIdentification = () => {
  conflictResults.value = [
    '原告陈述与被告陈述在时间点上存在矛盾',
    '证据1与证据2的内容相互矛盾',
    '原告提供的合同与被告提供的合同版本不一致'
  ]
  showConflictModal.value = true
}

const closeConflictModal = () => {
  showConflictModal.value = false
}

const cancelOperation = () => {
  // 实现取消操作的逻辑
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
.fact-finding-container {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
}

.sidebar {
  width: 240px;
  background-color: #001529;
  color: white;
  padding: 20px 0;
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
.sidebar li.active a {
  background-color: #1890ff;
  color: white;
}

.sidebar li a svg {
  margin-right: 10px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-nav {
  background-color: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb svg {
  margin: 0 8px;
}

.right-section {
  display: flex;
  align-items: center;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 16px;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 16px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.content {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.fact-finding-content {
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
  margin-top: 20px;
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
}

.btn-primary {
  background-color: #1890ff;
  color: white;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  max-width: 500px;
  width: 100%;
}

.modal-content h3 {
  margin-top: 0;
}

.modal-content ul {
  padding-left: 20px;
}

.modal-content button {
  margin-top: 20px;
}
</style>
