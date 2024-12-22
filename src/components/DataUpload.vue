<template>
  <div class="data-upload-container">
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
          <li class="active"><router-link to="/data-upload"><UploadCloudIcon /> 数据上传</router-link></li>
          <li><router-link to="/data-preprocessing"><DatabaseIcon /> 数据预处理</router-link></li>
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
          <span>数据上传</span>
        </div>
        <div class="right-section">
          <button class="icon-button" @click="toggleSearch"><SearchIcon /></button>
          <button class="icon-button" @click="toggleNotifications"><BellIcon /></button>
          <div class="user-profile" @click="goToUserSettings">
            <img src="/avatar.jpg" alt="用户头像" class="avatar" />
            <span>张三</span>
            <ChevronDownIcon />
          </div>
        </div>
      </header>

      <!-- 主要内容区域 -->
      <main>
        <h2>数据上传</h2>

<!--        <div class="upload-section">-->
<!--          <div class="upload-card">-->
<!--            <h3>起诉状上传</h3>-->
<!--            <div class="upload-area" @click="triggerFileInput('indictment')" @dragover.prevent @drop="onFileDrop('indictment', $event)">-->
<!--              <UploadCloudIcon size="48" />-->
<!--              <p>点击或拖拽文件到此处上传</p>-->
<!--              <span>支持 .doc, .docx, .pdf 格式</span>-->
<!--            </div>-->
<!--            <input type="file" ref="indictmentInput" style="display: none" @change="onFileSelected('indictment', $event)" accept=".doc,.docx,.pdf" />-->
<!--            <ul class="file-list">-->
<!--              <li v-for="file in uploadedFiles.indictment" :key="file.name">-->
<!--                <FileIcon /> {{ file.name }}-->
<!--                <button @click="removeFile('indictment', file)"><XIcon /></button>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->
<!--        </div>-->

        <div class="upload-section">
          <div class="upload-card">
<!--            <h3>起诉状上传</h3>-->
            <div class="upload-area" @click="triggerFileInput('indictment')" @dragover.prevent @drop="onFileDrop('indictment', $event)">
              <UploadCloudIcon size="48" />
              <p>点击或拖拽文件到此处上传</p>
              <span>支持 .doc, .docx, .pdf 格式</span>
            </div>
            <input type="file" ref="indictmentInput" style="display: none" @change="onFileSelected('indictment', $event)" accept=".doc,.docx,.pdf" />
            <ul class="file-list">
              <li v-for="file in uploadedFiles.indictment" :key="file.name">
                <FileIcon /> {{ file.name }}
                <button @click="removeFile('indictment', file)"><XIcon /></button>
              </li>
            </ul>
            <!-- 添加下载链接显示 -->
            <div v-if="downloadLink" class="download-section">
              <a :href="downloadLink" target="_blank" class="download-link">
                <DownloadIcon /> 下载处理结果
              </a>
            </div>
          </div>
        </div>


<!--        <div v-if="isUploading" class="upload-progress">-->
<!--          <div class="progress-bar">-->
<!--            <div class="progress-bar-fill" :style="{width: `${uploadProgress}%`}"></div>-->
<!--          </div>-->
<!--          <span>{{ uploadProgress }}%</span>-->
<!--        </div>-->

        <div class="action-buttons">
          <button
              class="btn-primary"
              @click="uploadFiles"
              :disabled="!hasFilesToUpload || isUploading"
          >
            <UploadIcon />
            {{ isUploading ? '上传中...' : '开始上传' }}
          </button>
          <button class="btn-secondary" @click="clearAllFiles">
            <TrashIcon /> 清空所有
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import {
  DashboardIcon, FileTextIcon, UploadCloudIcon, DatabaseIcon, SearchIcon,
  LayersIcon, BriefcaseIcon, HomeIcon, ChevronRightIcon, BellIcon,
  ChevronDownIcon, FileIcon, XIcon, UploadIcon, TrashIcon,DownloadIcon
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'

export default {
  name: 'DataUpload',
  components: {
    DashboardIcon, FileTextIcon, UploadCloudIcon, DatabaseIcon, SearchIcon,
    LayersIcon, BriefcaseIcon, HomeIcon, ChevronRightIcon, BellIcon,
    ChevronDownIcon, FileIcon, XIcon, UploadIcon, TrashIcon,DownloadIcon
  },
  setup() {
    const uploadedFiles = ref({
      indictment: [],
      defense: []
    })

    const indictmentInput = ref(null)
    const defenseInput = ref(null)
    const isUploading = ref(false)
    const uploadProgress = ref(0)

    const downloadLink = ref('')

    const hasFilesToUpload = computed(() => {
      return uploadedFiles.value.indictment.length > 0 || uploadedFiles.value.defense.length > 0
    })

    const validateFile = (file) => {
      // 限制文件大小为10MB
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert(`文件 ${file.name} 超过10MB限制`)
        return false
      }

      // 验证文件类型
      const allowedTypes = ['.doc', '.docx', '.pdf']
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if (!allowedTypes.includes(ext)) {
        alert(`文件 ${file.name} 格式不支持`)
        return false
      }

      return true
    }

    const triggerFileInput = (type) => {
      if (type === 'indictment') {
        indictmentInput.value.click()
      } else if (type === 'defense') {
        defenseInput.value.click()
      }
    }

    const onFileSelected = (type, event) => {
      const files = Array.from(event.target.files)
      const validFiles = files.filter(validateFile)
      uploadedFiles.value[type].push(...validFiles)
    }

    const onFileDrop = (type, event) => {
      event.preventDefault()
      const files = Array.from(event.dataTransfer.files)
      const validFiles = files.filter(validateFile)
      uploadedFiles.value[type].push(...validFiles)
    }

    const removeFile = (type, file) => {
      const index = uploadedFiles.value[type].indexOf(file)
      if (index > -1) {
        uploadedFiles.value[type].splice(index, 1)
      }
    }

    // const uploadFiles = async () => {
    //   if (isUploading.value) return
    //
    //   isUploading.value = true
    //   uploadProgress.value = 0
    //
    //   try {
    //     const formData = new FormData()
    //     uploadedFiles.value.indictment.forEach((file, index) => {
    //       formData.append(`file${index}`, file)
    //     })
    //
    //     const response = await fetch('http://localhost:8888/moonshot/uploadAndFetchContent', {
    //       method: 'POST',
    //       body: formData
    //     })
    //
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`)
    //     }
    //
    //     const result = await response.json()
    //     clearAllFiles()
    //     alert('文件上传成功！')
    //     return result
    //   } catch (error) {
    //     console.error('上传失败:', error)
    //     alert('文件上传失败，请重试')
    //   } finally {
    //     isUploading.value = false
    //     uploadProgress.value = 0
    //   }
    // }

    // 在 vue 文件的 uploadFiles 方法中修改：
    // const uploadFiles = async () => {
    //   if (isUploading.value) return
    //
    //   isUploading.value = true
    //   uploadProgress.value = 0
    //
    //   try {
    //     const formData = new FormData()
    //
    //     // 修改这里：使用'file'作为参数名
    //     // 如果是单文件上传
    //     if (uploadedFiles.value.indictment.length > 0) {
    //       formData.append('file', uploadedFiles.value.indictment[0])
    //     }
    //
    //     // 如果需要多文件上传，使用同样的参数名
    //     // uploadedFiles.value.indictment.forEach((file) => {
    //     //   formData.append('file', file)
    //     // })
    //
    //     const response = await fetch('http://localhost:8888/moonshot/uploadAndFetchContent', {
    //       method: 'POST',
    //       body: formData
    //     })
    //
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`)
    //     }
    //
    //     const result = await response.json()
    //     clearAllFiles()
    //     alert('文件上传成功！')
    //     return result
    //   } catch (error) {
    //     console.error('上传失败:', error)
    //     alert('文件上传失败，请重试')
    //   } finally {
    //     isUploading.value = false
    //     uploadProgress.value = 0
    //   }
    // }

    const uploadFiles = async () => {
      if (isUploading.value) return

      isUploading.value = true
      uploadProgress.value = 0
      downloadLink.value = ''  // 重置下载链接

      try {
        const formData = new FormData()
        if (uploadedFiles.value.indictment.length > 0) {
          formData.append('file', uploadedFiles.value.indictment[0])
        }

        const response = await fetch('http://localhost:8888/moonshot/uploadAndFetchContent', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.code === 200) {
          downloadLink.value = result.link
          alert('文件上传成功！')
        } else {
          alert(result.message || '上传失败')
        }

        clearAllFiles()
      } catch (error) {
        console.error('上传失败:', error)
        alert('文件上传失败，请重试')
      } finally {
        isUploading.value = false
        uploadProgress.value = 0
      }
    }

    const clearAllFiles = () => {
      uploadedFiles.value.indictment = []
      uploadedFiles.value.defense = []
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

    const router = useRouter()
    const goToUserSettings = () => {
      router.push('/user-settings')
    }

    return {
      uploadedFiles,
      indictmentInput,
      defenseInput,
      isUploading,
      uploadProgress,
      hasFilesToUpload,
      triggerFileInput,
      onFileSelected,
      onFileDrop,
      removeFile,
      uploadFiles,
      clearAllFiles,
      toggleSearch,
      toggleNotifications,
      toggleUserMenu,
      goToUserSettings,
      downloadLink,  // 添加下载链接到返回值
    }
  }
}
</script>

<style scoped>
.data-upload-container {
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
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
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

main {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
}

.upload-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.upload-card {
  flex: 1;
  background-color: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 20px;
}

.upload-card h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.upload-area:hover {
  border-color: #1890ff;
}

.upload-area p {
  margin: 10px 0;
}

.upload-area span {
  font-size: 12px;
  color: #888;
}

.file-list {
  list-style-type: none;
  padding: 0;
  margin-top: 15px;
}

.file-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
}

.file-list li button {
  background: none;
  border: none;
  cursor: pointer;
  color: #ff4d4f;
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

.upload-progress {
  margin-top: 10px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: #1890ff;
  transition: width 0.3s ease;
}

.download-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e8e8e8;
}

.download-link {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #1890ff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.download-link:hover {
  color: #40a9ff;
}

.download-link svg {
  width: 16px;
  height: 16px;
}
</style>