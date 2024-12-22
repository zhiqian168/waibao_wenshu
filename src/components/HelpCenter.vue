<script setup>
import { ref, onMounted } from 'vue'
import { 
  HomeIcon, ChevronRightIcon, SearchIcon,
  BookOpenIcon, VideoIcon, FileTextIcon, GraduationCapIcon,
  DashboardIcon, DatabaseIcon, LayersIcon, BriefcaseIcon, UploadCloudIcon,
  BellIcon, ChevronDownIcon, ClockIcon, TrendingUpIcon
} from 'lucide-vue-next'

const searchQuery = ref('')
const showSearchDropdown = ref(false)
const searchResults = ref([])
const isSearching = ref(false)

const categories = [
  { id: 'all', name: '全部', icon: BookOpenIcon },
  { id: 'video', name: '视频教程', icon: VideoIcon },
  { id: 'article', name: '文章文献', icon: FileTextIcon },
  { id: 'law', name: '普法知识', icon: GraduationCapIcon },
  { id: 'civil-code', name: '民法典专区', icon: BookOpenIcon },
]

const helpItems = ref([
  {
    id: 1,
    type: 'video',
    title: '如何提起民事诉讼',
    description: '详细讲解民事诉讼的基本流程和注意事项',
    views: 1234,
    duration: '15:30',
    thumbnail: '/path/to/your/thumbnail.jpg',
    videoUrl: 'https://www.bilibili.com/video/av904856681/?vd_source=76adfbd87cb34deeb43a5735a43d6113'
  },
  {
    id: 2,
    type: 'article',
    title: '《民法典》重点条款解读',
    description: '深入解析民法典中的重要条款及其实践意义',
    author: '李法官',
    date: '2024-03-15',
    readTime: '10分钟',
    externalLink: 'https://mp.weixin.qq.com/s?__biz=MzA4MTQzMDA2Mg==&mid=2649199729&idx=2&sn=335c28b3f3ea7462576bffc2bd0209fb&chksm=87862730b0f1ae2698d95b3a5a910cb83a9f339f4b242cb8d98c0db3fe76c0214901302eac41&scene=27'
  },
  {
    id: 3,
    type: 'law',
    title: '认识知识产权',
    description: '知识产权法律基础知识普及',
    category: '知识产权',
    level: '入门',
    externalLink: 'https://mp.weixin.qq.com/s?__biz=MzI0NTIwOTUwMA==&mid=2653108683&idx=5&sn=1a316887321dba739d265426b22ff5ab&chksm=f322aa9319c829411225ca5d34226415790830cf69ac071ba1a3b528d72534676b11ba5761fb&scene=27'
  },
  {
    id: 4,
    type: 'law',
    title: '《民法典》全文解读',
    description: '详细解读民法典各编章节内容，包括总则、物权、合同、人格权、婚姻家庭、继承、侵权责任等',
    category: '民法典',
    level: '进阶',
    sections: [
      {
        title: '第一编 总则',
        chapters: ['基本规定', '自然人', '法人', '非法人组织', '民事权利', '民事法律行为', '代理', '民事责任', '诉讼时效', '期间计算']
      },
      {
        title: '第二编 物权',
        chapters: ['通则', '所权', '用益物权', '担保物权', '占有']
      },
      {
        title: '第三编 合同',
        chapters: ['通则', '典型合同', '准合同']
      },
      {
        title: '第四编 人格权',
        chapters: ['一般规定', '生命权、身体权和健康权', '姓名权和名称权', '肖像权', '名誉权和荣誉权', '隐私权和个人信息保护']
      },
      {
        title: '第五编 婚姻家庭',
        chapters: ['一般规定', '结婚', '家庭关系', '离婚', '收养']
      },
      {
        title: '第六编 继承',
        chapters: ['一般规定', '法定继承', '遗嘱继承和遗赠', '遗产的处理']
      },
      {
        title: '第七编 侵权责任',
        chapters: ['一般规定', '损害赔偿', '责任主体的特殊规定', '产品责任', '机动车交通事故责任', '医疗损害责任', '环境污染和生态破坏责任', '高度危险责任', '饲养动物损害责任', '建筑物和物件损害责任']
      }
    ]
  },
  {
    id: 5,
    type: 'article',
    title: '民法典配套司法解释重要变化解读',
    description: '解读最高人民法院发布的民法典相关司法解释，包括婚姻家庭、继承、物权等重点领域的司法解释变化',
    author: '最高人民法院',
    date: '2024-03-15',
    readTime: '30分钟'
  }
])

const activeCategory = ref('all')

const filterItems = (category) => {
  activeCategory.value = category
  // 根据分类筛选内容
  const filteredItems = helpItems.value.filter(item => {
    if (category === 'all') return true
    if (category === 'video') return item.type === 'video'
    if (category === 'article') return item.type === 'article' && item.title === '《民法典》重点条款解读'
    if (category === 'law') return item.type === 'law' && item.title === '认识知识产权'
    if (category === 'civil-code') return item.type === 'article' && item.title === '《民法典》重点条款解读'
    return true
  })
  
  // 更新显示的内容
  helpItems.value = filteredItems
}

// 添加原始数据的备份
const originalHelpItems = [
  {
    id: 1,
    type: 'video',
    title: '如何提起民事诉讼',
    description: '详细讲解民事诉讼的基本流程和注意事项',
    views: 1234,
    duration: '15:30',
    thumbnail: '/path/to/your/thumbnail.jpg',
    videoUrl: 'https://www.bilibili.com/video/av904856681/?vd_source=76adfbd87cb34deeb43a5735a43d6113'
  },
  {
    id: 2,
    type: 'article',
    title: '《民法典》重点条款解读',
    description: '深入解析民法典中的重要条款及其实践意义',
    author: '李法官',
    date: '2024-03-15',
    readTime: '10分钟',
    externalLink: 'https://mp.weixin.qq.com/s?__biz=MzA4MTQzMDA2Mg==&mid=2649199729&idx=2&sn=335c28b3f3ea7462576bffc2bd0209fb&chksm=87862730b0f1ae2698d95b3a5a910cb83a9f339f4b242cb8d98c0db3fe76c0214901302eac41&scene=27'
  },
  {
    id: 3,
    type: 'law',
    title: '认识知识产权',
    description: '知识产权法律基础知识普及',
    category: '知识产权',
    level: '入门',
    externalLink: 'https://mp.weixin.qq.com/s?__biz=MzI0NTIwOTUwMA==&mid=2653108683&idx=5&sn=1a316887321dba739d265426b22ff5ab&chksm=f322aa9319c829411225ca5d34226415790830cf69ac071ba1a3b528d72534676b11ba5761fb&scene=27'
  }
]

// 在组件创建时初始化数据
onMounted(() => {
  helpItems.value = [...originalHelpItems]
})

// 在每次切换分类时重置数据
const resetAndFilterItems = (category) => {
  helpItems.value = [...originalHelpItems] // 先重置数据
  filterItems(category) // 然后进行筛选
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    showSearchDropdown.value = false
    return
  }
  
  isSearching.value = true
  // 模拟搜索延迟
  setTimeout(() => {
    searchResults.value = helpItems.value.filter(item => 
      item.title.includes(searchQuery.value) || 
      item.description.includes(searchQuery.value)
    )
    showSearchDropdown.value = true
    isSearching.value = false
  }, 300)
}

const selectSearchItem = (item) => {
  searchQuery.value = item.text
  showSearchDropdown.value = false
  handleSearch()
}

const closeSearchDropdown = () => {
  setTimeout(() => {
    showSearchDropdown.value = false
  }, 200)
}

const onSearchInput = () => {
  handleSearch()
}

// 添加处理外部链接的方法
const handleItemClick = (item) => {
  if (item.externalLink) {
    window.open(item.externalLink, '_blank')
  }
}
</script>

<template>
  <div class="help-center">
    <!-- 使用相同的侧边栏组件 -->
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
          <span>帮助中心</span>
        </div>
        <div class="right-section">
          <div class="search-bar-container">
            <div class="search-bar">
              <SearchIcon />
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="搜索帮助内容..."
                @input="onSearchInput"
                @focus="showSearchDropdown = true"
                @blur="closeSearchDropdown"
              />
              <span v-if="isSearching" class="searching-indicator">搜索中...</span>
            </div>
            
            <!-- 搜索下拉框 -->
            <div v-if="showSearchDropdown" class="search-dropdown">
              <!-- 搜索建议 -->
              <div v-if="!searchQuery && searchSuggestions.length" class="search-suggestions">
                <h4>搜索建议</h4>
                <div 
                  v-for="suggestion in searchSuggestions" 
                  :key="suggestion.id"
                  class="suggestion-item"
                  @mousedown="selectSearchItem(suggestion)"
                >
                  <ClockIcon v-if="suggestion.type === 'recent'" class="suggestion-icon" />
                  <TrendingUpIcon v-else class="suggestion-icon" />
                  {{ suggestion.text }}
                </div>
              </div>
              
              <!-- 搜索结果 -->
              <div v-else-if="searchResults.length" class="search-results">
                <div 
                  v-for="result in searchResults" 
                  :key="result.id"
                  class="result-item"
                  @mousedown="() => router.push(`/help-center/detail/${result.id}`)"
                >
                  <div class="result-icon">
                    <VideoIcon v-if="result.type === 'video'" />
                    <FileTextIcon v-else-if="result.type === 'article'" />
                    <GraduationCapIcon v-else />
                  </div>
                  <div class="result-content">
                    <h4>{{ result.title }}</h4>
                    <p>{{ result.description }}</p>
                  </div>
                </div>
              </div>
              
              <!-- 无搜索结果 -->
              <div v-else-if="searchQuery && !isSearching" class="no-results">
                未找到相关内容
              </div>
            </div>
          </div>
          <div class="user-info">
            <BellIcon class="icon" />
            <div class="user-dropdown">
              <img src="/avatar.jpg" alt="用户头像" class="avatar" />
              <span>张三</span>
              <ChevronDownIcon class="icon" />
            </div>
          </div>
        </div>
      </header>

      <!-- 主要内容区域 -->
      <main>
        <!-- 分类导航 -->
        <nav class="category-nav">
          <button 
            v-for="category in categories"
            :key="category.id"
            :class="['category-btn', { active: activeCategory === category.id }]"
            @click="resetAndFilterItems(category.id)"
          >
            <component :is="category.icon" />
            {{ category.name }}
          </button>
        </nav>

        <!-- 内容网格 -->
        <div class="content-grid">
          <div v-for="item in helpItems" :key="item.id" class="content-card">
            <!-- 视频卡片 -->
            <template v-if="item.type === 'video'">
              <router-link 
                :to="{ name: 'VideoDetail', params: { id: item.id }}" 
                class="video-card-link"
              >
                <div class="video-thumbnail">
                  <img :src="item.thumbnail" :alt="item.title" />
                  <span class="duration">{{ item.duration }}</span>
                </div>
                <div class="card-content">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.description }}</p>
                  <div class="meta">
                    <span>{{ item.views }} 次观看</span>
                  </div>
                </div>
              </router-link>
            </template>

            <!-- 文章卡片 -->
            <template v-else-if="item.type === 'article'">
              <div class="article-content" @click="handleItemClick(item)">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <div class="meta">
                  <span>作者：{{ item.author }}</span>
                  <span>{{ item.date }}</span>
                  <span>阅读时间：{{ item.readTime }}</span>
                </div>
              </div>
            </template>

            <!-- 普法知识卡片 -->
            <template v-else-if="item.type === 'law'">
              <div class="law-content" @click="handleItemClick(item)">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <div class="meta">
                  <span class="category-tag">{{ item.category }}</span>
                  <span class="level-tag">{{ item.level }}</span>
                </div>
              </div>
            </template>

            <!-- 民法典专区的特殊展示卡片 -->
            <template v-if="item.type === 'law' && item.category === '民法典'">
              <div class="law-content civil-code-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                
                <!-- 民法典章节导航 -->
                <div class="civil-code-sections">
                  <div v-for="section in item.sections" :key="section.title" class="section">
                    <h4>{{ section.title }}</h4>
                    <ul>
                      <li v-for="chapter in section.chapters" :key="chapter">
                        {{ chapter }}
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div class="meta">
                  <span class="category-tag">{{ item.category }}</span>
                  <span class="level-tag">{{ item.level }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.help-center {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
}

/* 更新侧边栏样式以保持一致性 */
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
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.top-nav {
  background-color: white;
  padding: 15px 20px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.search-bar-container {
  position: relative;
  width: 300px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  background-color: white;
  box-shadow: 0 0 0 2px #1890ff;
}

.searching-indicator {
  position: absolute;
  right: 16px;
  color: #8c8c8c;
  font-size: 12px;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.search-suggestions,
.search-results {
  padding: 12px;
}

.search-suggestions h4,
.search-results h4 {
  margin: 0 0 8px;
  color: #8c8c8c;
  font-size: 12px;
}

.suggestion-item,
.result-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.suggestion-item:hover,
.result-item:hover {
  background-color: #f5f5f5;
}

.suggestion-icon,
.result-icon {
  margin-right: 12px;
  color: #8c8c8c;
}

.result-content {
  flex: 1;
}

.result-content h4 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.result-content p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #666;
}

.no-results {
  padding: 24px;
  text-align: center;
  color: #8c8c8c;
}

.category-nav {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn.active {
  background-color: #1890ff;
  color: white;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.content-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  transition: transform 0.3s ease;
}

.content-card:hover {
  transform: translateY(-5px);
}

.video-thumbnail {
  position: relative;
  height: 180px;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.card-content,
.article-content,
.law-content {
  padding: 15px;
}

h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

p {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
}

.meta {
  display: flex;
  gap: 15px;
  color: #8c8c8c;
  font-size: 12px;
}

.category-tag,
.level-tag {
  background-color: #f0f2f5;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.level-tag {
  background-color: #e6f7ff;
  color: #1890ff;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.icon {
  color: #666;
  cursor: pointer;
}

.icon:hover {
  color: #1890ff;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

/* 添加新样式 */
.video-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.video-card-link:hover {
  text-decoration: none;
}

.law-content civil-code-content {
  padding: 15px;
}

.civil-code-sections {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.section {
  flex: 1;
}

.section h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.section ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.section li {
  padding: 4px 0;
  font-size: 14px;
}

/* 添加民法典专区相关样式 */
.civil-code-content {
  padding: 20px;
}

.civil-code-sections {
  margin: 15px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.section {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.section h4 {
  color: #1890ff;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section li {
  padding: 5px 0;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.section li:hover {
  color: #1890ff;
}

.category-tag.civil-code {
  background-color: #e6f7ff;
  color: #1890ff;
}

.law-content {
  cursor: pointer;
}

.article-content {
  cursor: pointer;
}
</style> 