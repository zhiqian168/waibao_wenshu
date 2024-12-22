<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeftIcon, 
  ThumbsUpIcon, 
  ShareIcon, 
  BookmarkIcon,
  MessageCircleIcon,
  VideoIcon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const videoId = route.params.id

// 从 HelpCenter 组件获取视频数据
const findVideoById = (id) => {
  // 这里应该从实际的数据源获取视频数据
  const videos = [
    {
      id: 1,
      title: '如何提起民事诉讼',
      description: '详细讲解民事诉讼的基本流程和注意事项',
      videoUrl: 'https://www.bilibili.com/video/av904856681/?vd_source=76adfbd87cb34deeb43a5735a43d6113',
      views: 1234,
      likes: 88,
      uploadDate: '2024-03-15',
      duration: '15:30',
      author: {
        name: '王法官',
        title: '资深法官',
        avatar: '/avatar-judge.jpg'
      }
    }
    // ... 可以添加更多视频数据
  ]
  return videos.find(video => video.id === Number(id))
}

const videoDetail = ref(findVideoById(videoId))

// 处理视频链接
const getVideoUrl = (url) => {
  if (!url) return '#'
  
  // 处理 B 站视频链接
  if (url.includes('bilibili.com')) {
    // 提取视频 ID
    const avMatch = url.match(/av(\d+)/)
    if (avMatch) {
      const avid = avMatch[1]
      // 返回 B 站嵌入播放器链接
      return `//player.bilibili.com/player.html?aid=${avid}&page=1&high_quality=1&danmaku=0`
    }
  }
  return url
}

const isBookmarked = ref(false)
const comments = ref([
  {
    id: 1,
    user: '李律师',
    avatar: '/avatar-lawyer.jpg',
    content: '视频讲解得非常清晰，对新手很有帮助！',
    time: '2天前',
    likes: 12
  },
  {
    id: 2,
    user: '张三',
    avatar: '/avatar-user.jpg',
    content: '作为非法律专业人士，看完收获很大。',
    time: '3天前',
    likes: 8
  }
])

const newComment = ref('')

const goBack = () => {
  router.back()
}

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
}

const submitComment = () => {
  if (!newComment.value.trim()) return
  
  comments.value.unshift({
    id: comments.value.length + 1,
    user: '当前用户',
    avatar: '/avatar-current.jpg',
    content: newComment.value,
    time: '刚刚',
    likes: 0
  })
  
  newComment.value = ''
}
</script>

<template>
  <div class="video-detail">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="goBack">
      <ArrowLeftIcon />
      返回
    </button>

    <!-- 视频播放区域 -->
    <div class="video-player">
      <div class="video-placeholder">
        <img 
          v-if="videoDetail?.thumbnail" 
          :src="videoDetail.thumbnail" 
          :alt="videoDetail?.title"
          class="video-thumbnail"
        />
        <div class="video-overlay">
          <h2>{{ videoDetail?.title }}</h2>
          <p>该视频需要在哔哩哔哩观看</p>
          <a 
            :href="getVideoUrl(videoDetail?.videoUrl)" 
            target="_blank" 
            rel="noopener noreferrer"
            class="watch-button"
          >
            <VideoIcon class="icon" />
            在哔哩哔哩观看完整视频
          </a>
        </div>
      </div>
    </div>

    <!-- 视频信息 -->
    <div class="video-info">
      <h1>{{ videoDetail.title }}</h1>
      
      <div class="meta-info">
        <div class="views">{{ videoDetail.views }} 次观看</div>
        <div class="upload-date">{{ videoDetail.uploadDate }}</div>
        
        <div class="actions">
          <button class="action-btn">
            <ThumbsUpIcon />
            <span>{{ videoDetail.likes }}</span>
          </button>
          <button class="action-btn">
            <ShareIcon />
            <span>分享</span>
          </button>
          <button 
            class="action-btn"
            :class="{ active: isBookmarked }"
            @click="toggleBookmark"
          >
            <BookmarkIcon />
            <span>收藏</span>
          </button>
        </div>
      </div>

      <!-- 作者信息 -->
      <div class="author-info">
        <img :src="videoDetail.author.avatar" :alt="videoDetail.author.name" class="author-avatar">
        <div class="author-details">
          <h3>{{ videoDetail.author.name }}</h3>
          <p>{{ videoDetail.author.title }}</p>
        </div>
      </div>

      <!-- 视频描述 -->
      <div class="description">
        <p>{{ videoDetail.description }}</p>
      </div>

      <!-- 评论区 -->
      <div class="comments-section">
        <h2>
          <MessageCircleIcon />
          评论区
        </h2>
        
        <!-- 评论输入框 -->
        <div class="comment-input">
          <textarea 
            v-model="newComment"
            placeholder="写下您的评论..."
            rows="3"
          ></textarea>
          <button 
            class="submit-btn"
            @click="submitComment"
            :disabled="!newComment.trim()"
          >
            发表评论
          </button>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment">
            <img :src="comment.avatar" :alt="comment.user" class="comment-avatar">
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-user">{{ comment.user }}</span>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <p>{{ comment.content }}</p>
              <div class="comment-actions">
                <button class="like-btn">
                  <ThumbsUpIcon />
                  <span>{{ comment.likes }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关视频 -->
      <div class="related-videos">
        <h2>相关视频</h2>
        <div class="related-videos-grid">
          <div 
            v-for="video in videoDetail.relatedVideos" 
            :key="video.id"
            class="related-video-card"
            @click="router.push(`/help-center/video/${video.id}`)"
          >
            <div class="thumbnail">
              <img :src="video.thumbnail" :alt="video.title">
              <span class="duration">{{ video.duration }}</span>
            </div>
            <div class="video-info">
              <h3>{{ video.title }}</h3>
              <span class="views">{{ video.views }} 次观看</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  color: #666;
  margin-bottom: 20px;
}

.back-btn:hover {
  color: #1890ff;
}

.video-player {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.video-element {
  width: 100%;
  height: 100%;
  border: none;
}

.video-placeholder {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #f0f2f5;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: white;
}

.video-overlay h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.video-overlay p {
  margin: 0 0 20px 0;
  opacity: 0.8;
}

.watch-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #1890ff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.watch-button:hover {
  background-color: #40a9ff;
  transform: translateY(-2px);
}

.watch-button .icon {
  width: 20px;
  height: 20px;
}

.video-info {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.video-info h1 {
  font-size: 24px;
  margin: 0 0 16px 0;
}

.meta-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
}

.actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: #f5f5f5;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #e6e6e6;
}

.action-btn.active {
  background: #e6f7ff;
  color: #1890ff;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-details h3 {
  margin: 0;
  font-size: 16px;
}

.author-details p {
  margin: 4px 0 0;
  color: #666;
  font-size: 14px;
}

.description {
  margin: 20px 0;
  line-height: 1.6;
  color: #333;
}

.comments-section {
  margin-top: 30px;
}

.comments-section h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  margin-bottom: 20px;
}

.comment-input {
  margin-bottom: 24px;
}

.comment-input textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 12px;
}

.submit-btn {
  padding: 8px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.comment {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-user {
  font-weight: 500;
}

.comment-time {
  color: #666;
  font-size: 12px;
}

.comment-actions {
  margin-top: 8px;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
}

.like-btn:hover {
  color: #1890ff;
}

.related-videos {
  margin-top: 30px;
}

.related-videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.related-video-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.related-video-card:hover {
  transform: translateY(-4px);
}

.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.video-info h3 {
  margin: 8px 0 4px;
  font-size: 14px;
}

.views {
  font-size: 12px;
  color: #666;
}
</style> 