<script setup lang="ts">
defineProps({
  text: String,
});
</script>

<template>
  <h1 class="font-caveat text-center text-8xl mt-25">{{ text }}</h1>
</template>
