<script setup lang="ts">
import { solidButton, typicalLink } from "@/utils/exports";
import { Dialog } from "primevue";
import { ref } from "vue";

const showDialog = defineModel("showDialog", { type: Boolean });
const isLoading = defineModel("isLoading", { type: Boolean });

const examFn = defineEmits(["submitExam", "getSchedule"]);

const exam = defineProps({
  title: String,
  totalVerses: { default: 7 },
  failedVerses: Boolean,
  length: { default: 5 },
  verses: { default: 7 },
  header: String,
  type: String,
  mode: { default: "Newbie" },
});

const includeFailed = ref(exam.failedVerses);
const duration = ref(exam.length);
const numofverses = ref(exam.verses);
</script>

<template>
  <Dialog
    v-model:visible="showDialog"
    modal
    :header="exam.header"
    class="w-[30rem] p-4 border-2 bg-alice"
    position="bottom"
  >
    <div class="w-full my-4 flex flex-col gap-4">
      <p class="flex items-center gap-4">
        <span class="font-bold">Title: </span>{{ title }}
      </p>
      <div class="flex items-center gap-4">
        <label class="font-bold">Duration:</label>
        <button
          class="border-2 border-eerie px-2 rounded hover:bg-eerie hover:text-alice hover:cursor-pointer"
          @click="duration === 5 ? duration : (duration -= 5)"
        >
          <i class="pi pi-minus"></i>
        </button>
        <input
          type="range"
          name="duration"
          min="5"
          step="5"
          :max="60"
          v-model="duration"
          class="accent-eerie"
        />
        <button
          class="border-2 border-eerie px-2 rounded hover:bg-eerie hover:text-alice hover:cursor-pointer"
          @click="duration >= 60 ? duration : (duration += 5)"
        >
          <i class="pi pi-plus"></i>
        </button>
        <p class="text-lg font-bold">{{ duration }} mins</p>
      </div>
      <div class="flex items-center gap-4">
        <label class="font-bold">Number of Verses:</label>
        <button
          class="border-2 border-eerie px-2 rounded hover:bg-eerie hover:text-alice hover:cursor-pointer"
          @click="numofverses === 7 ? (numofverses = 7) : (numofverses -= 1)"
        >
          <i class="pi pi-minus"></i>
        </button>
        <input
          type="range"
          name="numofverses"
          min="7"
          :max="totalVerses"
          v-model="numofverses"
          class="accent-eerie"
        />
        <button
          class="border-2 border-eerie px-2 rounded hover:bg-eerie hover:text-alice hover:cursor-pointer"
          @click="numofverses >= totalVerses ? numofverses : (numofverses += 1)"
        >
          <i class="pi pi-plus"></i>
        </button>
        <p class="text-xl font-bold">{{ numofverses }}</p>
      </div>

      <button
        v-if="
          exam.type === 'create' ||
          duration !== exam.length ||
          includeFailed !== exam.failedVerses ||
          numofverses !== exam.verses
        "
        :class="solidButton"
        @click="examFn('submitExam', duration, numofverses, includeFailed)"
      >
        <div v-if="!isLoading">
          <span v-if="exam.type === 'create'" class="mr-2"> Start Now </span>
          <span v-if="exam.type === 'edit'" class="mr-2"> Edit </span>
          <i class="pi pi-pencil"></i>
        </div>
        <div v-if="isLoading">
          <i class="pi pi-spin pi-spinner"></i>
          <span v-if="exam.type === 'create'" class="mr-2"> Starting... </span>
          <span v-if="exam.type === 'edit'" class="mr-2"> Editing... </span>
        </div>
      </button>
      <button
        v-if="
          exam.type === 'edit' &&
          duration === exam.length &&
          includeFailed === exam.failedVerses &&
          numofverses === exam.verses
        "
        :class="
          solidButton +
          ' hover:bg-gray-500 hover:text-alice hover:cursor-not-allowed'
        "
      >
        <span class="mr-2">Edit Exam</span><i class="pi pi-pencil"></i>
      </button>
      <div class="text-center text-grey-600">
        <p>HIGHER MODES, MORE CUSTOMIZATION</p>
        <RouterLink to="#" :class="typicalLink"
          >Learn More About Modes <i class="pi pi-info-circle"></i
        ></RouterLink>
      </div>
    </div>
  </Dialog>
</template>
