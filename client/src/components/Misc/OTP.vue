<script setup lang="ts">
import { onMounted, ref } from "vue";

const optProps = defineProps({
  length: {
    type: Number,
    default: 4,
  },
  isdisabled: {
    type: Boolean,
    default: false,
  },
});

const optEmit = defineEmits(["entered"]);

const optArray = ref<string[] | null[]>([]);
const container = ref();

onMounted(() => {
  for (let i = 0; i < optProps.length; i++) {
    optArray.value[i] = null;
  }
});

const handleKeyUp = (e, i) => {
  const children = container.value.children;
  const keyPressed = e.key;

  if (i > 0 && (keyPressed === "Backspace" || keyPressed === "Delete")) {
    optArray.value[i] = null;
    setTimeout(() => {
      children[i - 1].focus();
    }, 100);
    handleCheck();
  } else {
    const matched = keyPressed.match(/^[0-9]$/);
    if (!matched) {
      optArray.value[i] = null;
      return;
    } else if (i < optProps.length - 1) {
      setTimeout(() => {
        children[i + 1].focus();
      }, 100);
    }
    handleCheck();
  }
};

const handleCheck = () => {
  const children = container.value.children;
  let flag = true;
  for (let i = 0; i < optProps.length; i++) {
    if (optArray.value[i] === null) {
      children[i].classList.add("border-red-500");
      flag = false;
    } else {
      children[i].classList.remove("border-red-500");
    }
  }
  if (flag) {
    for (let i = 0; i < optProps.length; i++) {
      if (optProps.isdisabled) {
        children[i].classList.add("border-gray-500");
        children[i].setAttribute("disabled", "true");
      } else {
        children[i].classList.remove("border-gray-500");
        children[i].removeAttribute("disabled");
      }
    }
    optEmit("entered", optArray.value.join(""));
  }
};
</script>

<template>
  <div
    ref="container"
    class="flex gap-4 place-content-center border-alice my-6"
  >
    <input
      v-for="n in length"
      type="text"
      name="code"
      :key="n"
      v-model="optArray[n - 1]"
      maxlength="1"
      class="border rounded-md w-10 p-2 text-center"
      @keyup="(e) => handleKeyUp(e, n - 1)"
    />
  </div>
</template>
