<template>
  <div class="input-group">
    <input
      type="file"
      accept=".png, .jpg, .jpeg"
      @change="(e) => $emit('change', e)"
      ref="fileInput"
    />

    <div class="select-file" @click="fileInput?.click()">
      <span v-if="!modelValue">Choose Image ...</span>
      <div v-else>
        <div>{{ modelValue.name }}</div>
        <div style="margin-top: 10px">
          ({{ (modelValue.size / 1024).toFixed(2) }} KB)
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  props: {
    modelValue: {
      type: File,
    },
  },

  setup() {
    const fileInput = ref<HTMLInputElement>();

    return { fileInput };
  },
});
</script>

<style scoped>
input {
  display: none;
}

.select-file {
  padding: 10px 20px;
  width: 100%;
  border: 2px solid black;
  border-radius: 5px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.select-file:hover {
  color: white;
  background-color: rgb(67, 67, 67);
}
</style>
