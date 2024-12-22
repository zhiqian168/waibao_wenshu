<template>
  <div class="case-management-container">
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

    <main class="main-content">
      <header class="top-nav">
        <div class="breadcrumb">
          <HomeIcon />
          <span>首页</span>
          <ChevronRightIcon />
          <span>案件管理</span>
        </div>
        <div class="right-section">
          <button class="icon-button" @click="toggleSearch"><SearchIcon /></button>
          <button class="icon-button" @click="toggleNotifications"><BellIcon /></button>
          <div class="user-profile" @click="goToUserSettings">
            <img src="/avatar.jpg" alt="用户头像" class="avatar" />
            <span class="username">{{ username }}</span>
            <ChevronDownIcon />
          </div>
        </div>
      </header>

      <div class="content-wrapper">
        <div class="page-header">
          <div class="title-section">
            <h2>案件管理</h2>
            <p class="subtitle">管理所有案件信息，包括案件详情、进度跟踪和相关文书</p>
          </div>
          <div class="header-actions">
            <button class="btn-secondary" @click="fetchCases">
              <RefreshIcon class="icon" />
              刷新
            </button>
            <button class="btn-primary" @click="$router.push('/case/new')">
              <PlusIcon class="icon" />
              新建案件
            </button>
          </div>
        </div>

        <div class="search-toolbar">
          <div class="search-filters">
            <div class="search-input-wrapper">
              <SearchIcon class="search-icon" />
              <input
                type="text"
                v-model="searchQuery"
                placeholder="搜索案件号、案件名称、承办法官..."
                class="search-input"
                @input="handleSearch"
              />
            </div>

            <div class="filter-group">
              <select v-model="filters.type" class="filter-select" @change="handleSearch">
                <option value="">全部类型</option>
                <option value="民事案件">民事案件</option>
                <option value="刑事案件">刑事案件</option>
                <option value="行政案件">行政案件</option>
              </select>

              <select v-model="filters.status" class="filter-select" @change="handleSearch">
                <option value="">全部状态</option>
                <option value="completed">已完成</option>
                <option value="in_progress">进行中</option>
                <option value="not_started">未开始</option>
              </select>

              <div class="date-range">
                <input
                  type="date"
                  v-model="filters.startDate"
                  class="date-input"
                  @change="handleSearch"
                />
                <span>至</span>
                <input
                  type="date"
                  v-model="filters.endDate"
                  class="date-input"
                  @change="handleSearch"
                />
              </div>
            </div>
          </div>

          <div class="search-actions">
            <button class="btn-secondary" @click="resetFilters">
              <RefreshIcon class="icon" />
              重置
            </button>
            <button class="btn-primary" @click="handleSearch">
              <SearchIcon class="icon" />
              搜索
            </button>
          </div>
        </div>

        <div class="batch-toolbar" v-if="selectedCases.length">
          <span class="selected-count">已选择 {{ selectedCases.length }} 项</span>
          <div class="batch-actions">
            <button class="btn-secondary" @click="exportCases(selectedCases)">
              <DownloadIcon class="icon" />
              导出
            </button>
            <button class="btn-danger" @click="handleDelete(selectedCases)">
              <TrashIcon class="icon" />
              删除
            </button>
          </div>
        </div>

        <div class="table-container">
          <table class="case-table">
            <thead>
              <tr>
                <th><input type="checkbox" @change="handleSelectAll" /></th>
                <th>案件号</th>
                <th>案件名称</th>
                <th>案件类型</th>
                <th>承办法院</th>
                <th>承办法官</th>
                <th>立案日期</th>
                <th>状态</th>
                <th>更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cases" :key="item.id">
                <td><input type="checkbox" v-model="selectedCases" :value="item.id" /></td>
                <td>{{ item.number }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.court }}</td>
                <td>{{ item.judge }}</td>
                <td>{{ formatDate(item.date) }}</td>
                <td>
                  <span :class="['status-tag', item.status]">
                    {{ getStatusText(item.status) }}
                  </span>
                </td>
                <td>{{ formatDateTime(item.updateTime) }}</td>
                <td class="actions">
                  <router-link :to="`/case/${item.id}`" class="action-link">
                    <EyeIcon class="icon" />
                  </router-link>
                  <router-link :to="`/case/${item.id}/edit`" class="action-link">
                    <EditIcon class="icon" />
                  </router-link>
                  <button class="action-link" @click="handleDelete([item.id])">
                    <TrashIcon class="icon" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
          >
            上一页
          </button>
          <span class="page-info">第 {{ currentPage }} 页，共 {{ Math.ceil(total / pageSize) }} 页</span>
          <button
            class="page-btn"
            :disabled="currentPage >= Math.ceil(total / pageSize)"
            @click="handlePageChange(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { caseService } from '@/services/caseService'
import {
  DashboardIcon, FileTextIcon, UploadCloudIcon, DatabaseIcon, SearchIcon,
  LayersIcon, BriefcaseIcon, BellIcon, RefreshIcon,  // 删除 FilterIcon
  PlusIcon, EditIcon, TrashIcon, EyeIcon, DownloadIcon, HomeIcon, ChevronRightIcon
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToUserSettings = () => {
  router.push('/user-settings')
}

// 状态管理
const searchQuery = ref('')
const filters = ref({
  type: '',
  status: '',
  startDate: '',
  endDate: ''
})
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const selectedCases = ref([])
const cases = ref([])

// API 调用函数
const fetchCases = async () => {
  try {
    loading.value = true
    const response = await caseService.getCases({
      page: currentPage.value,
      size: pageSize.value,
      searchQuery: searchQuery.value,
      filters: filters.value
    })
    console.log(response)
    cases.value = response.list
    total.value = response.total
  } catch (error) {
    console.error('获取案件列表失败:', error)
    ElMessage.error('获取案件列表失败')
  } finally {
    loading.value = false
  }
}

const username = ref(localStorage.getItem('username') || '未知用户')
if (!username.value) {
  // 用户未登录，重定向到登录页面
  router.push('/login');
}

// 删除案件
const handleDelete = async (ids) => {
  try {
    if (!confirm('确认删除选中的案件吗？')) return

    loading.value = true
    await caseService.deleteCases(ids)
    ElMessage.success('删除成功')
    selectedCases.value = selectedCases.value.filter(id => !ids.includes(id))
    await fetchCases()
  } catch (error) {
    console.error('删除案件失败:', error)
    ElMessage.error('删除案件失败')
  } finally {
    loading.value = false
  }
}

// 导出案件
const exportCases = async (ids) => {
  try {
    loading.value = true
    const blob = await caseService.exportCases(ids)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `案件导出_${new Date().toISOString()}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出案件失败:', error)
    ElMessage.error('导出案件失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchCases()
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  filters.value = {
    type: '',
    status: '',
    startDate: '',
    endDate: ''
  }
  handleSearch()
}

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page
  fetchCases()
}

// 全选处理
const handleSelectAll = (e) => {
  if (e.target.checked) {
    selectedCases.value = cases.value.map(item => item.id)
  } else {
    selectedCases.value = []
  }
}

onMounted(() => {
  fetchCases()
})

// 添加 getStatusText 函数
const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return '已完成'
    case 'in_progress':
      return '进行中'
    case 'not_started':
      return '未开始'
    default:
      return '未知'
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(date).toLocaleDateString('zh-CN', options)
}

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }
  return new Date(dateTime).toLocaleDateString('zh-CN', options)
}
</script>

<style scoped>
.case-management-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f2f5;
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
  flex: 1;
  margin-left: 240px;
  height: 100vh;
  background-color: #f0f2f5;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 24px;
  background: white;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.search-bar input,
.search-bar select {
  margin-right: 10px;
  padding: 5px 10px;
}

.search-icon {
  background: none;
  border: none;
  cursor: pointer;
}

.search-button {
  padding: 5px 15px;
  background-color: #1890ff;
  color: white;
  border: none;
  cursor: pointer;
}

.case-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.case-table th,
.case-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
}

.status.completed {
  background-color: #52c41a;
  color: white;
}

.status.in_progress {
  background-color: #faad14;
  color: white;
}

.status.not_started {
  background-color: #f5222d;
  color: white;
}

.pagination {
  margin-top: 0;
  padding: 16px;
  background: white;
}

/* 新增样式 */
.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-section {
  display: flex;
  gap: 10px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar .icon {
  position: absolute;
  left: 10px;
  color: #999;
}

.search-bar input {
  padding: 8px 10px 8px 35px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  width: 300px;
}

.table-container {
  flex: 1;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  overflow: hidden;
  margin-bottom: 0;
}

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-link {
  color: #1890ff;
  cursor: pointer;
}

.action-link:hover {
  color: #40a9ff;
}

/* 按钮样式 */
.primary-button,
.secondary-button,
.danger-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.primary-button {
  background: #1890ff;
  color: white;
}

.secondary-button {
  background: #f0f0f0;
  color: #666;
}

.danger-button {
  background: #ff4d4f;
  color: white;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-wrapper {
  flex: 1;
  padding: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-bar {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-bar input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
}

.search-bar input:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
}

.status-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-width: 120px;
}

.batch-toolbar {
  position: sticky;
  top: 64px;
  z-index: 99;
  background: white;
  padding: 12px 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-count {
  color: #666;
}

.batch-actions {
  display: flex;
  gap: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 12px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.page-btn:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

/* 状态标签样式 */
.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.completed {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-tag.in_progress {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.status-tag.not_started {
  background-color: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

/* 添加新的标题样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.title-section {
  flex: 1;
}

.title-section h2 {
  font-size: 24px;
  color: #000000;
  margin: 0;
  margin-bottom: 8px;
  font-weight: 500;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 修改按钮样式 */
.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.btn-secondary:hover {
  background: #d9d9d9;
}

.icon {
  width: 16px;
  height: 16px;
}

.search-toolbar {
  background: white;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
}

.search-filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.filter-group {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  min-width: 120px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

/* 输入框焦点样式 */
.search-input:focus,
.filter-select:focus,
.date-input:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
}

/* 使用原生滚动条 */
.table-container {
  scrollbar-width: thin; /* Firefox */
  -ms-overflow-style: -ms-autohiding-scrollbar; /* IE/Edge */
}

.table-container::-webkit-scrollbar,
.table-container::-webkit-scrollbar-thumb,
.table-container::-webkit-scrollbar-track {
  display: none;
}
</style>
