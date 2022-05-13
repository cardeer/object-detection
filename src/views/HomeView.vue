<template>
  <div id="layout">
    <div id="controls">
      <button
        @click="cameraMode = !cameraMode"
        class="control-button"
        :style="{ backgroundColor: !cameraMode ? '#0083ff' : 'orange' }"
      >
        Chante to {{ !cameraMode ? "Camera" : "File" }} Mode
      </button>

      <FileInput
        v-model="file"
        @change="onFileChanged"
        style="margin-top: 5px"
      />

      <button
        v-if="cameraMode && !$store.state.captured"
        @click="camera?.capture"
        class="control-button camera"
      >
        Capture
      </button>

      <button
        v-if="cameraMode && $store.state.captured"
        @click="camera?.setupCamera"
        class="control-button camera"
      >
        Reset Camera
      </button>

      <p v-if="$store.state.detectedObjects.length > 0" id="detected-types">
        Types
      </p>

      <div v-if="$store.state.detectedObjects.length > 0" id="parents">
        <CheckBox
          v-for="parent in Object.keys(parents)"
          :key="parent"
          :label="parent"
        />
      </div>
    </div>

    <div v-if="!cameraMode" id="image-show-wrapper">
      <div v-if="rawImageData !== ''" id="image-show">
        <ProcessImage :raw-image-data="rawImageData" />
      </div>
      <div v-else id="select-image">
        <div>Please select an image.</div>
      </div>
    </div>
    <div v-else id="image-show-wrapper">
      <CameraView ref="camera" :detect-object="detectObject" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRef,
  toRefs,
  watch,
} from "@vue/runtime-core";
import { ObjectDetectionResult } from "@nipacloud/nvision/dist/models/NvisionRequest";
import nvision from "@nipacloud/nvision";
import { useStore } from "vuex";

import CheckBox from "@/components/CheckBox.vue";
import ProcessImage from "@/components/ProcessImage.vue";
import CameraView from "@/components/CameraView.vue";
import Types from "@/store/types";
import FileInput from "@/components/Inputs/FileInput.vue";

export default defineComponent({
  components: { CheckBox, ProcessImage, CameraView, FileInput },

  setup() {
    const store = useStore();
    const camera = ref<InstanceType<typeof CameraView>>();

    const state = reactive({
      rawImageData: "",
      imageData: "",

      parents: {} as { [key: string]: [string, number] },
      filter: {} as { [key: string]: boolean },
      file: undefined as File | undefined,

      cameraMode: false,
    });

    const cameraMode = toRef(state, "cameraMode");

    watch(cameraMode, () => {
      state.file = undefined;
      state.rawImageData = "";
      state.imageData = "";

      store.dispatch(Types.SET_FILTER, state.filter);
      store.dispatch(Types.SET_PARENTS, state.parents);
      store.dispatch(Types.SET_DETECTED_OBJECTS, []);
    });

    const objectDetectionService = nvision.objectDetection({
      apiKey: process.env.VUE_APP_API_KEY,
    });

    const onFileChanged = (e: Event): void => {
      const target: HTMLInputElement = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (!files || files.length === 0) return;

      state.rawImageData = "";
      state.imageData = "";
      state.parents = {};
      state.filter = {};

      // reset values
      store.dispatch(Types.SET_FILTER, state.filter);
      store.dispatch(Types.SET_PARENTS, state.parents);
      store.dispatch(Types.SET_DETECTED_OBJECTS, []);

      if (files != null && files.length > 0) {
        state.file = files[0];

        // reader for reading image data
        const reader = new FileReader();

        // when finish reading
        reader.onloadend = (): void => {
          // cast result as a string before assigning to rawImageData which is a string
          state.rawImageData = reader.result as string;

          console.log(state.rawImageData);

          // delete a part of string that api doesn't need ex. data:image/jpeg;base64,
          // and assign it to new variable named imageData
          const index = state.rawImageData.indexOf(",");
          state.imageData = state.rawImageData.substring(index + 1);

          detectObject();
        };

        reader.readAsDataURL(state.file);
      }
    };

    const detectObject = async (rawData?: string): Promise<void> => {
      state.parents = {};
      state.filter = {};

      const result = await objectDetectionService.predict({
        rawData: rawData ?? state.imageData,
      });

      // result.detected_objects is undefined every time, so I have to use JSON
      let detectedObjects: ObjectDetectionResult[] = [];
      detectedObjects = JSON.parse(JSON.stringify(result)).detected_objects;

      store.dispatch(Types.SET_DETECTED_OBJECTS, detectedObjects);
      console.log(detectedObjects);

      // list all parents (no repeat)
      const tmp = new Set(detectedObjects.map((e) => e.parent));
      tmp.forEach((_, v2) => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        state.parents[v2] = [
          `rgb(${r}, ${g}, ${b})`,
          // calculate color luminance
          (0.299 * r + 0.587 * g + 0.114 * b) / 255,
        ];

        state.filter[v2] = true;
      });

      store.dispatch(Types.SET_PARENTS, state.parents);
      store.dispatch(Types.SET_FILTER, state.filter);

      console.log(state.parents);
    };

    return {
      ...toRefs(state),
      onFileChanged,
      camera,
      detectObject,
    };
  },
});
</script>

<style scoped>
#layout {
  display: flex;
  width: 100%;
  height: 100vh;
}

#controls {
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 300px;
  min-width: 300px;
  border-right: 2px solid black;
  overflow: hidden auto;
}

#parents {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  text-align: left;
}

#image-show-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 50px 20px 20px 20px;
  overflow: auto;
}

#image-show {
  position: relative;
  display: inline-block;
  margin: auto;
}

#select-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 100%;
}

.control-button {
  margin-bottom: 15px;
  padding: 10px 20px;
  color: white;
  font-weight: bold;
  background-color: black;
  border-radius: 5px;
  border: none;
  outline: none;
  cursor: pointer;
}

.control-button.camera {
  margin-top: 15px;
  margin-bottom: 0;
}

#detected-types {
  margin-top: 40px;
  margin-bottom: 0;
  font-weight: bold;
}
</style>
