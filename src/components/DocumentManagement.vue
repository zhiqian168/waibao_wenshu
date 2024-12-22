<template>
  <div class="document-management-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="logo">
        <img src="/logo.png" alt="Logo" />
        <h1>司法智能辅助系统</h1>
      </div>
      <nav>
        <ul>
          <li><router-link to="/dashboard"><DashboardIcon /> 工作台</router-link></li>
          <li class="active"><router-link to="/document-management"><FileTextIcon /> 文书管理</router-link></li>
          <li><router-link to="/data-upload"><UploadCloudIcon /> 数据上传</router-link></li>
          <li><router-link to="/data-preprocessing"><DatabaseIcon /> 数据预处理</router-link></li>
          <li><router-link to="/fact-finding"><SearchIcon /> 事实查明</router-link></li>
          <li><router-link to="/case-grouping"><LayersIcon /> 案件编队</router-link></li>
          <li><router-link to="/case-management"><BriefcaseIcon /> 案件管理</router-link></li>
          <li><router-link to="/document-generation"><FileTextIcon /> 文书生成</router-link></li>
        </ul>
      </nav>
    </aside>

    <!-- 主要内容区 -->
    <main class="main-content">
      <div class="document-management">
        <header class="page-header">
          <div class="breadcrumb">
            <router-link to="/dashboard">首页</router-link>
            <span class="separator">/</span>
            <span class="current">文书管理</span>
          </div>
          <div class="user-info">
            <span class="notification-icon">
              <i class="fas fa-bell"></i>
              <span class="notification-count">3</span>
            </span>
            <img :src="require('@/assets/avatar.png')" alt="用户头像" class="avatar" width="50px"/>
            <span class="username">{{ username }}</span>
          </div>
        </header>

        <section class="content-section">
          <div class="search-bar">
            <div class="filter-group">
              <select v-model="creationTimeFilter" class="filter-select" @change="fetchDocuments">
                <option value="">创建时间</option>
                <option value="today">今天</option>
                <option value="week">本周</option>
                <option value="month">本月</option>
              </select>
            </div>

            <div class="search-group">
              <input type="text" v-model="searchKeyword" placeholder="搜索文书名称或负责人" class="search-input">
              <button class="search-button" @click="fetchDocuments">
                <i class="fas fa-search"></i> 搜索
              </button>
            </div>
          </div>

          <div class="action-bar">
            <button class="create-document" @click="openCreateModal">
              <i class="fas fa-plus"></i> 新建文书
            </button>
          </div>

          <div class="table-container">
            <table class="document-table">
              <thead>
              <tr>
                <th>创建时间</th>
                <th>文书名称</th>
                <th>负责人</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="doc in documents" :key="doc.id">
                <td>{{ doc.creationTime }}</td>
                <td>{{ doc.name }}</td>
                <td>{{ doc.responsible }}</td>
                <td>
                  <button class="action-button edit" @click="openEditModal(doc)">
                    <i class="fas fa-edit"></i> 编辑
                  </button>
                  <button class="action-button delete" @click="deleteDocument(doc.id)">
                    <i class="fas fa-trash-alt"></i> 删除
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination">
            <span class="total-items">共 {{ totalItems }} 条数据</span>
            <div class="pagination-controls">
              <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                  v-for="page in displayedPages"
                  :key="page"
                  :class="{ active: page === currentPage, 'page-number': typeof page === 'number' }"
                  @click="changePage(page)"
                  :disabled="typeof page !== 'number'"
              >
                {{ page }}
              </button>
              <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 弹窗组件 -->
    <DocumentModal
        :visible="modalVisible"
        :isEditing="isEditing"
        :document="currentDocument"
        @close="closeModal"
        @submit="submitDocument"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  DashboardIcon, FileTextIcon, UploadCloudIcon, DatabaseIcon, SearchIcon,
  LayersIcon, BriefcaseIcon
} from 'lucide-vue-next'
import DocumentModal from './DocumentModal.vue'
import {useRouter} from "vue-router";

export default {
  name: 'DocumentManagement',
  components: {
    DashboardIcon, FileTextIcon, UploadCloudIcon, DatabaseIcon, SearchIcon,
    LayersIcon, BriefcaseIcon, DocumentModal
  },
  setup() {
    const creationTimeFilter = ref('')
    const searchKeyword = ref('')
    const documents = ref([])
    const currentPage = ref(1)
    const totalItems = ref(0)
    const itemsPerPage = 10
    const modalVisible = ref(false)
    const isEditing = ref(false)
    const currentDocument = ref({
      name: '',
      creationTime: '',
      responsible: ''
    })
    const router = useRouter()
    const username = ref(localStorage.getItem('username') || '未知用户')
    console.log(localStorage.getItem('username') )
    if (!username.value) {
      // 用户未登录，重定向到登录页面
      router.push('/login');
    }

    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
    const displayedPages = computed(() => {
      const pages = []
      const maxVisiblePages = 7
      const halfVisible = Math.floor(maxVisiblePages / 2)

      if (totalPages.value <= maxVisiblePages) {
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i)
        }
      } else if (currentPage.value <= halfVisible + 1) {
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages.value)
      } else if (currentPage.value >= totalPages.value - halfVisible) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages.value - maxVisiblePages + 2; i <= totalPages.value; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage.value - halfVisible + 1; i <= currentPage.value + halfVisible - 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages.value)
      }

      return pages
    })

    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:8888/api/documents/getByPage', {
          params: {
            page: currentPage.value,
            size: itemsPerPage,
            creationTimeFilter: creationTimeFilter.value,
            keyword: searchKeyword.value
          }
        })
        documents.value = response.data.data.list
        totalItems.value = response.data.data.total
      } catch (error) {
        console.error('获取文书数据失败:', error)
      }
    }

    onMounted(() => {
      fetchDocuments()
    })

    const openCreateModal = () => {
      isEditing.value = false
      currentDocument.value = {
        name: '',
        creationTime: '',
        responsible: ''
      }
      modalVisible.value = true
    }

    const openEditModal = (doc) => {
      isEditing.value = true
      currentDocument.value = { ...doc }
      modalVisible.value = true
    }

    const closeModal = () => {
      modalVisible.value = false
    }

    const submitDocument = async (document) => {
      try {
        if (isEditing.value) {
          await axios.put(`http://localhost:8888/api/documents/${currentDocument.value.id}`, document)
          const index = documents.value.findIndex(doc => doc.id === currentDocument.value.id)
          documents.value[index] = document
        } else {
          const response = await axios.post('http://localhost:8888/api/documents', document)
          documents.value.push(response.data)
          totalItems.value += 1
        }
        closeModal()
      } catch (error) {
        console.error(isEditing.value ? '修改文档失败:' : '新建文档失败:', error)
      }
    }

    const deleteDocument = async (id) => {
      try {
        await axios.delete(`http://localhost:8888/api/documents/${id}`);
        documents.value = documents.value.filter(doc => doc.id !== id);
        totalItems.value -= 1;
      } catch (error) {
        console.error('删除文档失败:', error);
      }
    };

    const changePage = (page) => {
      if (typeof page === 'number' && page > 0 && page <= totalPages.value) {
        currentPage.value = page
        fetchDocuments()
      }
    }

    return {
      creationTimeFilter,
      searchKeyword,
      documents,
      currentPage,
      totalItems,
      totalPages,
      displayedPages,
      modalVisible,
      isEditing,
      currentDocument,
      username,
      fetchDocuments,
      openCreateModal,
      openEditModal,
      closeModal,
      submitDocument,
      deleteDocument,
      changePage
    }
  }
}
</script>

<style scoped>
.document-management-container {
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
.sidebar li.active a {
  background-color: #1890ff;
  color: white;
}

.sidebar li a svg {
  margin-right: 10px;
}

.main-content {
  flex: 1;
  background-color: #f0f2f5;
}

.document-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.breadcrumb a {
  color: #1890ff;
  text-decoration: none;
}

.breadcrumb .separator {
  margin: 0 8px;
  color: #d9d9d9;
}

.breadcrumb .current {
  color: rgba(0, 0, 0, 0.65);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-icon {
  position: relative;
  font-size: 18px;
  color: #8c8c8c;
}

.notification-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff4d4f;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.username {
  font-weight: 500;
}

.content-section {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  padding: 20px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filter-group, .search-group {
  display: flex;
  gap: 10px;
}

.filter-select, .search-input {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-width: 150px;
}

.search-button {
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #40a9ff;
}

.action-bar {
  margin-bottom: 20px;
}

.create-document {
  background-color: #52c41a;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-document:hover {
  background-color: #73d13d;
}

.table-container {
  overflow-x: auto;
}

.document-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.document-table th,
.document-table td {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px;
  text-align: left;
}

.document-table th {
  background-color: #fafafa;
  font-weight: 500;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  color: #1890ff;
}

.action-button.delete {
  color: #ff4d4f;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls {
  display: flex;
  gap: 5px;
}

.pagination button {
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border: 1px solid #d9d9d9;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination button.active {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

.pagination button:disabled {
  cursor: not-allowed;
  color: rgba(0, 0, 0, 0.25);
}

.pagination .page-number {
  border-radius: 2px;
}
</style>


