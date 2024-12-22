<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>{{ isEditing ? '编辑案件' : '新建案件' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="number">案件号</label>
          <input type="text" id="number" v-model="caseData.number" required>
        </div>
        <div class="form-group">
          <label for="title">案件名称</label>
          <input type="text" id="title" v-model="caseData.title" required>
        </div>
        <div class="form-group">
          <label for="type">案件类型</label>
          <select id="type" v-model="caseData.type" required>
            <option value="">请选择</option>
            <option value="民事案件">民事案件</option>
            <option value="刑事案件">刑事案件</option>
            <option value="行政案件">行政案件</option>
          </select>
        </div>
        <div class="form-group">
          <label for="court">承办法院</label>
          <input type="text" id="court" v-model="caseData.court" required>
        </div>
        <div class="form-group">
          <label for="judge">承办法官</label>
          <input type="text" id="judge" v-model="caseData.judge" required>
        </div>
        <div class="form-group">
          <label for="date">立案日期</label>
          <input type="date" id="date" v-model="caseData.date" required>
        </div>
        <div class="form-group">
          <label for="status">状态</label>
          <select id="status" v-model="caseData.status" required>
            <option value="">请选择</option>
            <option value="completed">已完成</option>
            <option value="in_progress">进行中</option>
            <option value="not_started">未开始</option>
          </select>
        </div>
        <button type="submit">{{ isEditing ? '保存' : '创建' }}</button>
        <button type="button" @click="closeModal">取消</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CaseModal',
  props: {
    visible: Boolean,
    isEditing: Boolean,
    caseData: Object
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    submitForm() {
      this.$emit('submit', this.caseData);
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background: #42b983;
  color: white;
}

button[type="button"] {
  background: #ccc;
}
</style>