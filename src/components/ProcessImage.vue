<template>
  <img :src="rawImageData" alt="image" />

  <div
    v-if="
      $store.state.detectedObjects && $store.state.detectedObjects.length > 0
    "
    id="object-overlays"
  >
    <div
      v-for="(object, i) in $store.state.detectedObjects"
      :key="i + object.name"
      class="overlay-box"
      :style="{
        left: `${object.bounding_box.left}px`,
        top: `${object.bounding_box.top}px`,
        width: `${object.bounding_box.right - object.bounding_box.left}px`,
        height: `${object.bounding_box.bottom - object.bounding_box.top}px`,
      }"
    >
      <div
        v-if="$store.state.filter[object.parent]"
        class="overlay-box-border"
        :style="{ borderColor: $store.state.parents[object.parent][0] }"
      ></div>
      <div
        v-if="$store.state.filter[object.parent]"
        class="overlay-box-name"
        :style="{
          backgroundColor: $store.state.parents[object.parent][0],
          color:
            $store.state.parents[object.parent][1] >= 0.5 ? 'black' : 'white',
          zIndex: $store.state.detectedObjects.length - i,
        }"
      >
        <div>{{ object.parent }}</div>
        <div>
          {{ object.name }}: {{ (object.confidence * 100).toFixed(2) }}%
        </div>
      </div>
    </div>
  </div>
  <div v-else id="object-overlays-loading">Processing...</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: {
    rawImageData: {
      type: String,
    },
  },
});
</script>

<style scoped>
#object-overlays,
#object-overlays-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#object-overlays-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
}

.overlay-box {
  position: absolute;
}

.overlay-box-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-width: 3;
  border-style: solid;
  z-index: 0;
}

.overlay-box-name {
  position: absolute;
  padding: 2px;
  top: -26px;
  left: 0;
  font-size: 10px;
  color: white;
  text-align: left;
  background-color: red;
  white-space: nowrap;
}
</style>
