<template>
  <div id="video-wrapper">
    <video
      ref="video"
      autoplay
      :style="{ display: $store.state.captured ? 'none' : 'block' }"
    ></video>

    <canvas ref="canvas"></canvas>

    <ProcessImage v-if="$store.state.captured" :raw-image-data="rawImageData" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from "@vue/runtime-core";
import { useStore } from "vuex";
import Types from "@/store/types";
import ProcessImage from "./ProcessImage.vue";

export default defineComponent({
  props: {
    detectObject: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const video = ref<HTMLVideoElement>();
    const canvas = ref<HTMLCanvasElement>();
    const rawImageData = ref("");

    let stream: MediaStream | undefined;

    const capture = async (): Promise<void> => {
      if (!video.value || !canvas.value) return;
      store.dispatch(Types.SET_CAPTURE, true);

      const width = video.value.clientWidth;
      const height = video.value.clientHeight;

      canvas.value.width = width;
      canvas.value.height = height;

      const ctx = canvas.value.getContext("2d");
      ctx?.drawImage(video.value, 0, 0, width, height);

      // const imageData = ctx?.getImageData(0, 0, width, height);
      // console.log(imageData?.data);
      rawImageData.value = canvas.value.toDataURL("image/jpeg");

      stream?.getTracks().forEach((track) => track.stop());

      props.detectObject(
        rawImageData.value.replace("data:image/jpeg;base64,", "")
      );
    };

    const setupCamera = async (): Promise<void> => {
      store.dispatch(Types.SET_CAPTURE, false);

      store.dispatch(Types.SET_FILTER, {});
      store.dispatch(Types.SET_PARENTS, {});
      store.dispatch(Types.SET_DETECTED_OBJECTS, []);

      stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (video.value) {
        video.value.srcObject = stream;
      }
    };

    onMounted(async () => {
      setupCamera();
    });

    onBeforeUnmount(() => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });

    return { video, capture, canvas, setupCamera, rawImageData };
  },
  components: { ProcessImage },
});
</script>

<style scoped>
#video-wrapper {
  position: relative;
  margin: auto;
  max-width: 640px;
}

canvas {
  display: none;
}
</style>
