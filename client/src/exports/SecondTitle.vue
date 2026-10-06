<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <h2 class="text-2xl font-bold italic my-4">{{ text }}</h2>
</template>
