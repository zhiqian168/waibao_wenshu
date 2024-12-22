/* eslint-disable no-unused-vars */
import {
  FileClockIcon,
  FileEditIcon,
  AlertTriangleIcon,
  // ...其他导入
} from 'lucide-vue-next'

<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  SearchIcon, BellIcon, HomeIcon, ChevronRightIcon, ChevronDownIcon,
  CheckCircleIcon,
  FileTextIcon, EyeIcon, PlusCircleIcon, ArrowRightIcon,
  UserIcon, UserCheckIcon, ClockIcon,
  DashboardIcon, DatabaseIcon, LayersIcon, BriefcaseIcon, UploadCloudIcon,
  InfoIcon, AlertCircleIcon, EditIcon, UploadIcon, MessageSquareIcon, ActivityIcon, HelpCircleIcon,
  MapPinIcon, ThermometerIcon, CloudRainIcon, WindIcon, SunIcon
} from 'lucide-vue-next'

const username = ref(localStorage.getItem('username') || '未知用户')
if (!username.value) {
  // 用户未登录，重定向到登录页面
  router.push('/login');
}

const reviewItems = ref([
  { id: 1, title: '张三诉李四合同纠纷案', status: 'pending', statusText: '待审核', description: '起诉书内容需要进行修改，请尽快处理。', reviewer: '���核', time: '2小时前' },
  { id: 2, title: '王五诉赵六侵权纠纷案', status: 'in-progress', statusText: '审核中', description: '证据材料不足，需要补充。', reviewer: '李审核', time: '4小时前' },
  // 更多审核项...
])

const caseItems = ref([
  { id: 1, title: '张三诉李四合同纠纷案', progress: 30, party: '张三', responsible: '王律师', time: '2小时前' },
  { id: 2, title: '王五诉赵六侵权纠纷案', progress: 60, party: '王五', responsible: '王律师', time: '4小时前' },
  // 更多案件...
])

const notifications = ref([
  { id: 1, type: 'info', title: '系统更新通知', content: '系统将于今晚22:00进行例行维护，请提前保存工作内容。', time: '10分钟前' },
  { id: 2, type: 'warning', title: '案件截止提醒', content: '您负责的"张三诉李四合同纠纷"将在3天后截止，请及时处理。', time: '1小时前' },
  // 更多通知...
])

const activities = ref([
  { id: 1, type: 'edit', title: '文书修改', description: '王律师修改了"张三李四同纠纷案"起诉书', time: '30分钟前' },
  { id: 2, type: 'upload', title: '证据上传', description: '李律师上传了"王五诉赵六侵权纠纷案"的新证据', time: '2小时前' },
  // 更多活动...
])

const router = useRouter()

const getNotificationIcon = (type) => {
  switch (type) {
    case 'info': return InfoIcon
    case 'warning': return AlertCircleIcon
    case 'success': return CheckCircleIcon
    default: return BellIcon
  }
}

const getActivityIcon = (type) => {
  switch (type) {
    case 'edit': return EditIcon
    case 'upload': return UploadIcon
    case 'comment': return MessageSquareIcon
    default: return ActivityIcon
  }
}

const toggleSearch = () => {
  // 实现搜索功能
}

const toggleNotifications = () => {
  // 实现通知功能
}

const goToHelpCenter = () => {
  router.push('/help-center')
}

const goToUserSettings = () => {
  router.push('/user-settings')
}

const location = ref('')
const currentTime = ref('')
const temperature = ref(0)
const humidity = ref(0)
const windSpeed = ref(0)
const weatherDescription = ref('')

const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchWeatherData = async () => {
  try {
    // 设置默认值
    location.value = '正在获取位置...'
    temperature.value = '--'
    humidity.value = '--'
    windSpeed.value = '--'
    weatherDescription.value = '正在获取天气信息...'

    // 1. 先通过 IP 定位获取城市编码
    console.log('开始获取位置...')
    const ipLocationResponse = await fetch(
      `https://restapi.amap.com/v3/ip?key=67d805007c0ab7e2e5a935a2264a11eb`
    )

    if (!ipLocationResponse.ok) {
      throw new Error('IP定位失败')
    }

    const locationData = await ipLocationResponse.json()
    console.log('IP定位数据:', locationData)

    if (locationData.status !== '1') {
      throw new Error(locationData.info || 'IP定位失败')
    }

    const cityCode = locationData.adcode
    
    // 2. 获取天气信息
    console.log('开始获取天气...')
    const weatherResponse = await fetch(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=67d805007c0ab7e2e5a935a2264a11eb&city=${cityCode}&extensions=base`
    )

    if (!weatherResponse.ok) {
      throw new Error(`天气数据获取失败: ${weatherResponse.status}`)
    }

    const weatherData = await weatherResponse.json()
    console.log('天气数据:', weatherData)

    if (weatherData.status === '1' && weatherData.lives && weatherData.lives[0]) {
      const weather = weatherData.lives[0]
      location.value = `${weather.province}${weather.city}`
      temperature.value = weather.temperature
      humidity.value = weather.humidity
      windSpeed.value = weather.windpower
      weatherDescription.value = weather.weather
    } else {
      throw new Error('无法获取天气数据')
    }

  } catch (error) {
    console.error('获取天气信息失败:', error)
    // 设置默认值
    location.value = '位置获取失败'
    temperature.value = '--'
    humidity.value = '--'
    windSpeed.value = '--'
    weatherDescription.value = '获取失败'
  }
}

onMounted(() => {
  console.log('组件加载完成')
  
  // 更新时间
  updateCurrentTime()
  setInterval(updateCurrentTime, 60000)

  // 获取天气
  fetchWeatherData()
  setInterval(fetchWeatherData, 1800000)
})
</script>

<script>
export default {
  name: 'DashboardView'
}
</script>

<template>
  <div class="dashboard">
    <!-- 添加一个隐藏的地图容器，但保持最小尺寸 -->
    <div id="container" style="position: absolute; visibility: hidden; height: 100px; width: 100px;"></div>
    
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="logo">
        <img src="/logo.png" alt="Logo" />
        <h1>司法智能辅助系统</h1>
      </div>
      <nav>
        <ul>
          <li><router-link to="/dashboard" active-class="active"><DashboardIcon /> 工作台</router-link></li>
          <li><router-link to="/document-management" active-class="active"><FileTextIcon /> 文书管理</router-link></li>
          <li><router-link to="/data-upload" active-class="active"><UploadCloudIcon /> 数据上传</router-link></li>
          <li><router-link to="/data-preprocessing" active-class="active"><DatabaseIcon /> 数据预处理</router-link></li>
          <li><router-link to="/fact-finding" active-class="active"><SearchIcon /> 事实查明</router-link></li>
          <li><router-link to="/case-grouping" active-class="active"><LayersIcon /> 案件编队</router-link></li>
          <li><router-link to="/case-management" active-class="active"><BriefcaseIcon /> 案件管理</router-link></li>
          <li><router-link to="/document-generation" active-class="active"><FileTextIcon /> 文书生成</router-link></li>
        </ul>
      </nav>
    </aside>

    <div class="main-content">
      <!-- 顶导航栏 -->
      <header class="top-nav">
        <div class="breadcrumb">
          <HomeIcon />
          <span>首页</span>
          <ChevronRightIcon />
          <span>工作台</span>
        </div>
        <div class="right-section">
          <button class="icon-button" @click="toggleSearch"><SearchIcon /></button>
          <button class="icon-button" @click="toggleNotifications"><BellIcon /></button>
          <button class="icon-button help-button" @click="goToHelpCenter">
            <HelpCircleIcon />
            <span>帮助中心</span>
          </button>
          <div class="user-profile" @click="goToUserSettings">
            <img src="/avatar.jpg" alt="用头像" class="avatar" />
            <span class="username">{{ username }}</span>
            <ChevronDownIcon />
          </div>
        </div>
      </header>

      <!-- 主要内容区 -->
      <main>
        <!-- 天气卡片 -->
        <section class="weather-card">
          <div class="weather-info">
            <div class="location-time">
              <h3><MapPinIcon class="icon" /> {{ location || '正在获取位置...' }}</h3>
              <p><ClockIcon class="icon" /> {{ currentTime }}</p>
            </div>
            <div class="weather-main">
              <div class="temperature">
                <ThermometerIcon class="icon" />
                <span class="temp-value">{{ temperature }}°C</span>
              </div>
              <div class="weather-details">
                <div class="detail-item">
                  <CloudRainIcon class="icon" />
                  <span>湿度: {{ humidity }}%</span>
                </div>
                <div class="detail-item">
                  <WindIcon class="icon" />
                  <span>风力: {{ windSpeed }}级</span>
                </div>
                <div class="detail-item">
                  <SunIcon class="icon" />
                  <span>天气: {{ weatherDescription }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 操作按钮 -->
        <section class="action-buttons">
          <button class="action-button action-primary"><FileTextIcon /> 规定文书</button>
          <button class="action-button action-secondary"><EyeIcon /> 案件监</button>
          <button class="action-button action-tertiary"><PlusCircleIcon /> 新建案件</button>
        </section>

        <div class="dashboard-grid">
          <!-- 工作审核 -->
          <section class="work-review dashboard-card">
            <h2>工作审核 <a href="#" class="view-all">全部审核 <ArrowRightIcon /></a></h2>
            <div class="tabs">
              <button class="tab active">起诉书审核</button>
              <button class="tab">答辩状审核</button>
              <button class="tab">证据材料审核</button>
            </div>
            <div class="tab-content">
              <div class="review-item" v-for="item in reviewItems" :key="item.id">
                <div class="review-item-header">
                  <h4>{{ item.title }}</h4>
                  <span :class="['status', item.status]">{{ item.statusText }}</span>
                </div>
                <p>{{ item.description }}</p>
                <div class="review-item-footer">
                  <span>{{ item.reviewer }}</span>
                  <span>{{ item.time }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 案件管理/监测 -->
          <section class="case-management dashboard-card">
            <h2>案件管/监测 <a href="#" class="view-all">全部案件 <ArrowRightIcon /></a></h2>
            <div class="tabs">
              <button class="tab active">正在处理案件 <span class="count">20</span></button>
              <button class="tab">特殊案件 <span class="count">20</span></button>
              <button class="tab">未完成案件 <span class="count">20</span></button>
            </div>
            <div class="tab-content">
              <div class="case-item" v-for="caseItem in caseItems" :key="caseItem.id">
                <div class="case-info">
                  <h4>{{ caseItem.title }}</h4>
                  <div class="progress-bar">
                    <div class="progress" :style="{ width: caseItem.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ caseItem.progress }}%</span>
                </div>
                <div class="case-meta">
                  <span><UserIcon /> 当事人：{{ caseItem.party }}</span>
                  <span><UserCheckIcon /> 责任人：{{ caseItem.responsible }}</span>
                  <span><ClockIcon /> {{ caseItem.time }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 消息通知 -->
          <section class="notifications dashboard-card">
            <h2>消息通知</h2>
            <div class="notification-tabs">
              <button class="tab active">未读消息 <span class="count">20</span></button>
              <button class="tab">已读消息</button>
            </div>
            <div class="notification-content">
              <div class="notification-item" v-for="notification in notifications" :key="notification.id">
                <div class="notification-icon" :class="notification.type">
                  <component :is="getNotificationIcon(notification.type)" />
                </div>
                <div class="notification-details">
                  <h4>{{ notification.title }}</h4>
                  <p>{{ notification.content }}</p>
                  <span class="time">{{ notification.time }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 工作动态 -->
          <section class="work-activity dashboard-card">
            <h2>工作动态</h2>
            <div class="activity-timeline">
              <div class="activity-item" v-for="activity in activities" :key="activity.id">
                <div class="activity-icon" :class="activity.type">
                  <component :is="getActivityIcon(activity.type)" />
                </div>
                <div class="activity-content">
                  <h4>{{ activity.title }}</h4>
                  <p>{{ activity.description }}</p>
                  <span class="time">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

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

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.stat-icon {
  font-size: 48px;
  margin-right: 20px;
  color: #1890ff;
}

.stat-info h3 {
  margin: 0;
  font-size: 14px;
  color: #8c8c8c;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  margin: 5px 0;
}

.stat-change {
  font-size: 12px;
}

.stat-change.increase {
  color: #52c41a;
}

.stat-change.decrease {
  color: #f5222d;
}

.action-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.action-button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.action-button svg {
  margin-right: 8px;
}

.action-primary {
  background-color: #1890ff;
  color: white;
}

.action-secondary {
  background-color: #fff;
  color: #1890ff;
  border: 1px solid #1890ff;
}

.action-tertiary {
  background-color: #f0f2f5;
  color: #333;
}

.action-button:hover {
  opacity: 0.8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.dashboard-card {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

h2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
}

.view-all {
  font-size: 14px;
  color: #1890ff;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.view-all svg {
  margin-left: 5px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.tab {
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.tab.active {
  color: #1890ff;
  background-color: #e6f7ff;
}

.count {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
  margin-left: 5px;
}

.review-item,
.case-item,
.notification-item,
.activity-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 15px 0;
}

.review-item:last-child,
.case-item:last-child,
.notification-item:last-child,
.activity-item:last-child {
  border-bottom: none;
}

.review-item-header,
.case-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.status.pending {
  background-color: #fffbe6;
  color: #faad14;
}

.status.in-progress {
  background-color: #e6f7ff;
  color: #1890ff;
}

.progress-bar {
  background-color: #f0f0f0;
  height: 6px;
  border-radius: 3px;
  margin-top: 10px;
  overflow: hidden;
}

.progress {
  background-color: #1890ff;
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #8c8c8c;
  margin-left: 10px;
}

.case-meta,
.review-item-footer {
  display: flex;
  justify-content: space-between;
  color: #8c8c8c;
  font-size: 12px;
  margin-top: 10px;
}

.case-meta span,
.review-item-footer span {
  display: flex;
  align-items: center;
}

.case-meta svg,
.review-item-footer svg {
  margin-right: 5px;
}

.notification-item,
.activity-item {
  display: flex;
  align-items: flex-start;
}

.notification-icon,
.activity-icon {
  margin-right: 15px;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-icon.info,
.activity-icon.edit {
  background-color: #e6f7ff;
  color: #1890ff;
}

.notification-icon.warning,
.activity-icon.upload {
  background-color: #fffbe6;
  color: #faad14;
}

.notification-icon.success,
.activity-icon.comment {
  background-color: #f6ffed;
  color: #52c41a;
}

.notification-details h4,
.activity-content h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.notification-details p,
.activity-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.time {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 5px;
  display: block;
}

.activity-timeline {
  position: relative;
}

.activity-timeline::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #f0f0f0;
}

.activity-item {
  padding-left: 40px;
  position: relative;
}

.activity-icon {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.help-button {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #1890ff;
  font-size: 14px;
}

.help-button:hover {
  opacity: 0.8;
}

.weather-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.weather-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.location-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location-time h3 {
  font-size: 18px;
  color: #1d1d1f;
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-time p {
  color: #86868b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.weather-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.temperature {
  display: flex;
  align-items: center;
  gap: 12px;
}

.temp-value {
  font-size: 48px;
  font-weight: 500;
  color: #1d1d1f;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #86868b;
}

.icon {
  color: #1890ff;
}
</style>


