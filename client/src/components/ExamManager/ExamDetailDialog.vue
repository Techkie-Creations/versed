<script setup lang="ts">
import { solidButton, titleText } from "@/utils/exports";
import { Dialog } from "primevue";

const examDetails = defineProps({
  headerTitle: String,
  date: String,
  startTime: String,
  endTime: String,
  type: String,
  duration: String,
  created: String,
  timezone: String,
  includeFailed: Boolean,
  numofverses: Number,
  status: String,
  title: String,
  examid: String,
});

const showExamDetail = defineModel("showExamDetail", { type: Boolean });
// const showingDetail = defineModel("showingDetail", { type: String });
const showingDetail = defineEmits(["showingDetails"]);
</script>

<template>
  <Dialog
    modal
    :header="headerTitle"
    class="min-w-fit w-[25rem] p-4 border-2 bg-alice"
    v-model:visible="showExamDetail"
    position="center"
  >
    <p class="text-2xl text-center font-bolder underline mt-4">
      {{ examDetails.title }}
    </p>
    <p class="italic font-bold text-center my-1 text-xs">
      ID: {{ examDetails.examid }}
    </p>
    <div
      v-for="detail in Object.keys(examDetails).filter(
        (item) =>
          ![
            'headerTitle',
            'title',
            'showExamDetail',
            'showExamDetailModifiers',
          ].includes(item),
      )"
      class="mt-2"
    >
      <p
        v-if="!['created', 'examid'].includes(detail)"
        class="flex items-center gap-2"
      >
        <span class="italic font-bold">{{ titleText(detail) }}: </span>
        <span>{{ titleText(`${examDetails[detail]}`) }} </span>
      </p>
      <p v-if="detail === 'created'">
        <span class="italic font-bold">{{ titleText(detail) }}: </span>
        <span>{{ titleText(`${examDetails[detail]}`) }} </span>
      </p>
    </div>
    <button
      :class="solidButton + ' mt-2'"
      @click="
        showingDetail('showingDetails', '');
        showExamDetail = false;
      "
    >
      Close
    </button>
  </Dialog>
</template>
