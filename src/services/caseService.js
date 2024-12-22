import axios from 'axios'

const API_URL = 'http://localhost:8888/api'

export const caseService = {
  // 获取案件列表
  async getCases({ page, size, searchQuery, filters }) {
    const response = await axios.get(`${API_URL}/cases/getByPage`, {
      params: {
        page,
        size,
        search: searchQuery,
        ...filters
      }
    })
    return response.data
  },

  // 获取单个案件详情
  async getCaseById(id) {
    const response = await axios.get(`${API_URL}/cases/getDetail/${id}`)
    return response.data
  },

  // 创建案件
  async createCase(data) {
    const response = await axios.post(`${API_URL}/cases`, data)
    return response.data
  },

  // 更新案件
  async updateCase(id, data) {
    const response = await axios.put(`${API_URL}/cases/${id}`, data)
    return response.data
  },

  // 删除案件
  async deleteCases(ids) {
    const response = await axios.delete(`${API_URL}/cases`, {
      data: { ids }
    })
    return response.data
  },

  // 导出案件
  async exportCases(ids) {
    const response = await axios.post(`${API_URL}/cases/export`, { ids }, {
      responseType: 'blob'
    })
    return response.data
  }
} 