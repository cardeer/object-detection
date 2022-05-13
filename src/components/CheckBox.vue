<template>
  <div class="checkbox">
    <div
      class="checkbox-input"
      @click="value = !value"
      :class="value && 'checked'"
    >
      <div
        class="checkbox-value"
        :style="{ backgroundColor: $store.state.parents[label][0] }"
      ></div>
    </div>
    <div>{{ label }}</div>
  </div>
</template>

<script lang="ts">
import Types from "@/store/types";
import { defineComponent, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const value = ref(true);

    watch(value, (v) => {
      store.dispatch(Types.UPDATE_FILTER, { label: props.label, value: v });
    });

    return { value };
  },
});
</script>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
}

.checkbox-input {
  padding: 3px;
  width: 20px;
  height: 20px;
  background-color: black;
  border-radius: 100%;
  cursor: pointer;
}

.checkbox-value {
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: 2px solid white;
  transform: scale(0);
  transition: transform 0.3s cubic-bezier(0.47, 1.64, 0.41, 0.8);
}

.checkbox-input.checked .checkbox-value {
  transform: scale(1);
}
</style>
