<template>
  <span
    class="hex-color-display"
    :style="{ backgroundColor: color, color: textColor }"
    >{{ color }}</span
  >
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  color: {
    type: String,
    required: true,
  },
});

const textColor = computed(() => {
  if (!props.color) return "#000";
  const hex = props.color.replace("#", "");
  if (hex.length !== 6) return "#000";
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 300 + g * 600 + b * 100) / 1000;
  return brightness > 128 ? "#000" : "#fff";
});
</script>

<style scoped>
.hex-color-display {
  padding: 3px 6px;
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: var(--vp-code-font-size);
}
</style>
