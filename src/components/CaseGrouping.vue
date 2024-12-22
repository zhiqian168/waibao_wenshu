<template>
  <div class="case-grouping-container">
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
          <li class="active"><router-link to="/case-grouping"><LayersIcon /> 案件编队</router-link></li>
          <li><router-link to="/case-management"><BriefcaseIcon /> 案件管理</router-link></li>
          <li><router-link to="/document-generation"><FileTextIcon /> 文书生成</router-link></li>
        </ul>
      </nav>
    </aside>

    <div class="main-content">
      <header class="top-nav">
        <div class="breadcrumb">
          <HomeIcon />
          <span>首页</span>
          <ChevronRightIcon />
          <span>案件编队</span>
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
        <h2>案件编队</h2>
        
        <div class="case-grouping-content">
          <div class="case-list">
            <h3>待分组案件</h3>
            <div class="case-items">
              <div class="case-item" 
                   v-for="caseItem in pendingCases" 
                   :key="caseItem.id" 
                   draggable="true" 
                   @dragstart="dragStart($event, caseItem)"
                   @dragend="dragEnd($event)"
                   @click="onCaseClick(caseItem)">
                <h4>{{ caseItem.title }}</h4>
                <p>{{ caseItem.description }}</p>
                <span class="case-type">{{ caseItem.type }}</span>
              </div>
            </div>
          </div>
          
          <div class="group-containers">
            <div class="group-container" 
                 v-for="group in caseGroups" 
                 :key="group.id" 
                 @dragover="onDragOver($event)"
                 @dragleave="onDragLeave"
                 @drop="onDrop($event, group)">
              <h3>{{ group.name }}</h3>
              <div class="grouped-cases">
                <div class="case-item" 
                     v-for="caseItem in group.cases" 
                     :key="caseItem.id"
                     draggable="true"
                     @dragstart="dragStart($event, caseItem)"
                     @dragend="dragEnd($event)">
                  <h4>{{ caseItem.title }}</h4>
                  <p>{{ caseItem.description }}</p>
                  <span class="case-type">{{ caseItem.type }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-primary" @click="confirmGrouping">确认分组</button>
          <button class="btn-secondary" @click="resetGrouping">重置分组</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  HomeIcon, ChevronRightIcon, SearchIcon, BellIcon, ChevronDownIcon,
  DashboardIcon, FileTextIcon, UploadCloudIcon, DatabaseIcon, LayersIcon, BriefcaseIcon
} from 'lucide-vue-next'

const router = useRouter()

const pendingCases = ref([
  { id: 1, title: '张三诉李四合同纠纷案', description: '关于房屋租赁合同的纠纷', type: '民事案件' },
  { id: 2, title: '王五诉赵六侵权纠纷案', description: '关于交通事故的损害赔偿', type: '民事案件' },
  { id: 3, title: '李某某盗窃案', description: '涉嫌盗窃手机等财物', type: '刑事案件' },
  { id: 4, title: '周某某诈骗案', description: '涉嫌网络诈骗', type: '刑事案件' },
  { id: 5, title: '赵某某行政处罚案', description: '不服城管局的行政处罚决定', type: '行政案件' },
])

const caseGroups = ref([
  { id: 1, name: '合同纠纷组', cases: [] },
  { id: 2, name: '侵权纠纷组', cases: [] },
  { id: 3, name: '刑事案件组', cases: [] },
  { id: 4, name: '行政案件组', cases: [] },
])

const dragStart = (event, caseItem) => {
  event.dataTransfer.setData('text/plain', JSON.stringify(caseItem))
  event.target.classList.add('dragging')
}

const dragEnd = (event) => {
  event.target.classList.remove('dragging')
}

const onDragOver = (event) => {
  event.preventDefault()
  event.currentTarget.classList.add('drag-over')
}

const onDragLeave = (event) => {
  event.currentTarget.classList.remove('drag-over')
}

const onDrop = (event, group) => {
  event.currentTarget.classList.remove('drag-over')
  const caseItem = JSON.parse(event.dataTransfer.getData('text/plain'))
  
  // 从所有组中移除该案件
  caseGroups.value.forEach(g => {
    const index = g.cases.findIndex(c => c.id === caseItem.id)
    if (index !== -1) {
      g.cases.splice(index, 1)
    }
  })
  
  // 从待分组案件中移除
  const pendingIndex = pendingCases.value.findIndex(c => c.id === caseItem.id)
  if (pendingIndex !== -1) {
    pendingCases.value.splice(pendingIndex, 1)
  }
  
  // 添加到目标组
  group.cases.push(caseItem)
}

const confirmGrouping = () => {
  // 实现确认分组逻辑
  console.log('分组已确认')
}

const resetGrouping = () => {
  // 实现重置分组逻辑
  caseGroups.value.forEach(group => group.cases = [])
  // 重新加载待分组案件
  pendingCases.value = [
    { id: 1, title: '张三诉李四合同纠纷案', description: '关于房屋租赁合同的纠纷', type: '民事案件' },
    { id: 2, title: '王五诉赵六侵权纠纷案', description: '关于交通事故的损害赔偿', type: '民事案件' },
    { id: 3, title: '李某某盗窃案', description: '涉嫌盗窃手机等财物', type: '刑事案件' },
    { id: 4, title: '周某某诈骗案', description: '涉嫌网络诈骗', type: '刑事案件' },
    { id: 5, title: '赵某某行政处罚案', description: '不服城管局的行政处罚决定', type: '行政案件' },
  ]
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

const onCaseClick = (caseItem) => {
  router.push({
    name: 'DocumentGeneration',
    params: { caseId: caseItem.id },
    query: { 
      title: caseItem.title,
      type: caseItem.type,
      description: caseItem.description
    }
  })
}
</script>

<style scoped>
.case-grouping-container {
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

.case-grouping-content {
  display: flex;
  gap: 20px;
}

.case-list, .group-container {
  flex: 1;
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.case-item {
  background-color: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  cursor: move;
}

.case-type {
  display: inline-block;
  padding: 2px 8px;
  background-color: #e6f7ff;
  color: #1890ff;
  border-radius: 10px;
  font-size: 12px;
}

.group-containers {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.group-container {
  min-width: 250px;
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

/* 修改案件列表容器样式 */
.case-list {
  flex: 1;
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  height: 600px; /* 固定高度 */
  display: flex;
  flex-direction: column;
}

.case-list > h3 {
  margin-top: 0;
  margin-bottom: 16px;
}

/* 添加滚动容器 */
.case-list .case-items {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px; /* 为滚动条预留空间 */
}

/* 修改分组容器样式 */
.group-containers {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  flex: 2; /* 分组区域占更多空间 */
}

.group-container {
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  height: 600px; /* 固定高度 */
  display: flex;
  flex-direction: column;
}

.group-container > h3 {
  margin-top: 0;
  margin-bottom: 16px;
}

/* 添加分组内的滚动容器 */
.grouped-cases {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px; /* 为滚动条预留空间 */
}

/* 美化滚动条 */
.case-items::-webkit-scrollbar,
.grouped-cases::-webkit-scrollbar {
  width: 6px;
}

.case-items::-webkit-scrollbar-track,
.grouped-cases::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.case-items::-webkit-scrollbar-thumb,
.grouped-cases::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.case-items::-webkit-scrollbar-thumb:hover,
.grouped-cases::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* 修改案件项样式 */
.case-item {
  background-color: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  cursor: move;
  transition: all 0.3s ease;
}

.case-item:hover {
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.case-item.dragging {
  opacity: 0.5;
}

/* 拖拽目标样式 */
.group-container.drag-over {
  border: 2px dashed #1890ff;
  background-color: #f0f7ff;
}
</style>
