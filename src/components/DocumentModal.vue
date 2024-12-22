<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>{{ isEditing ? '编辑文档' : '新建文档' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">文书名称</label>
          <input type="text" id="name" v-model="localDocument.name" required>
        </div>
        <div class="form-group">
          <label for="creationTime">创建时间</label>
          <input type="date" id="creationTime" v-model="localDocument.creationTime" required>
        </div>
        <div class="form-group">
          <label for="responsible">负责人</label>
          <input type="text" id="responsible" v-model="localDocument.responsible" required>
        </div>
        <button type="submit">{{ isEditing ? '保存' : '创建' }}</button>
        <button type="button" @click="closeModal">取消</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'DocumentModal',
  props: {
    visible: Boolean,
    isEditing: Boolean,
    document: Object
  },
  setup(props, { emit }) {
    const localDocument = ref({ ...props.document })

    watch(() => props.document, (newVal) => {
      localDocument.value = { ...newVal }
    })

    const closeModal = () => {
      emit('close')
    }

    const submitForm = () => {
      emit('submit', localDocument.value)
    }

    return {
      localDocument,
      closeModal,
      submitForm
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

input {
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