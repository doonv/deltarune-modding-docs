<template>
  <figure class="caption-image">
    <img :width="width" :src="src" :alt="alt" />
    <figcaption style="color: gray; margin-top: 2px">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup>
import { computed } from "vue";

defineProps({
  src: String,
  alt: {
    type: String,
    default: "",
  },
  caption: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "50%",
  },
});
</script>

<style scoped>
.caption-image figcaption {
  color: gray;
  margin-top: 2px;
  text-align: center;
}
</style>
