<template>
  <aside class="sidebar">
    <div class="logo">
      <img src="/logo.png" alt="Logo" />
      <h1>司法智能辅助系统</h1>
    </div>
    <nav>
      <ul>
        <li><router-link to="/dashboard" :class="{ active: currentRoute === '/dashboard' }"><DashboardIcon /> 工作台</router-link></li>
        <li><router-link to="/document-management" :class="{ active: currentRoute === '/document-management' }"><FileTextIcon /> 文书管理</router-link></li>
        <li><router-link to="/data-upload" :class="{ active: currentRoute === '/data-upload' }"><UploadCloudIcon /> 数据上传</router-link></li>
        <li><router-link to="/data-preprocessing" :class="{ active: currentRoute === '/data-preprocessing' }"><DatabaseIcon /> 数据预处理</router-link></li>
        <li><router-link to="/fact-finding" :class="{ active: currentRoute === '/fact-finding' }"><SearchIcon /> 事实查明</router-link></li>
        <li><router-link to="/case-grouping" :class="{ active: currentRoute === '/case-grouping' }"><LayersIcon /> 案件编队</router-link></li>
        <li><router-link to="/case-management" :class="{ active: currentRoute === '/case-management' }"><BriefcaseIcon /> 案件管理</router-link></li>
        <li><router-link to="/document-generation" :class="{ active: currentRoute === '/document-generation' }"><FileTextIcon /> 文书生成</router-link></li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  DashboardIcon, FileTextIcon, UploadCloudIcon, DatabaseIcon, SearchIcon, 
  LayersIcon, BriefcaseIcon
} from 'lucide-vue-next'

const route = useRoute()
const currentRoute = computed(() => route.path)
</script>

<style scoped>
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
</style>
