<script setup lang="ts">
import { hollowButton } from "@/utils/exports";
import { Dialog } from "primevue";

const props = defineProps({
  successText: {
    type: String,
    default: "Save",
  },
  successIcon: {
    type: String,
    default: "check",
  },
  dialogText: String,
  header: {
    type: String,
    default: "Save New Verses",
  },
  submitText: {
    type: String,
    default: "Saving...",
  },
});

const successClick = defineEmits(["successClick"]);

const showModal = defineModel("showModal", { type: Boolean });
const isLoading = defineModel("isLoading");
</script>

<template>
  <Dialog
    v-model:visible="showModal"
    modal
    :header="header"
    class="w-[25rem] p-4 border-2 bg-alice"
  >
    <div class="w-full flex flex-col gap-2 mt-10">
      <p class="text-gray-700">{{ props.dialogText }}</p>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="border-2 border-eerie rounded-md p-2 hover:cursor-pointer hover:bg-eerie hover:text-alice"
          @click="showModal = false"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="successClick('successClick')"
          :class="hollowButton"
        >
          <span class="flex justify-center gap-2 items-center" v-if="!isLoading"
            ><i :class="`pi pi-${props.successIcon}`"></i
            >{{ props.successText }}</span
          >
          <span class="flex justify-center gap-2 items-center" v-if="isLoading"
            ><i class="pi pi-spin pi-spinner"></i>{{ submitText }}</span
          >
        </button>
      </div>
    </div>
  </Dialog>
</template>
