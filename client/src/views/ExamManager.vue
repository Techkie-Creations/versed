<script setup lang="ts">
import NavBar from "@/components/Misc/NavBar.vue";
import PageTitle from "@/exports/PageTitle.vue";
import SecondTitle from "@/exports/SecondTitle.vue";
import { onMounted, ref } from "vue";

import {
  checkboxDesign,
  hollowButton,
  solidButton,
  titleText,
} from "@/utils/exports";
import {
  createMockExams,
  createOfficialExams,
  deleteMockExams,
  editMockExams,
  getMockExams,
  getNumOfVerses,
  startMockExam,
} from "@/api/exam-mgmr";
import { useToast } from "vue-toastification";
import type { ExamType } from "@/utils/Types";
import ExamDetailDialog from "@/components/ExamManager/ExamDetailDialog.vue";
import MockExamSchedule from "@/components/ExamManager/MockExamSchedule.vue";
import ConfirmPopup from "@/components/Misc/ConfirmPopup.vue";

const toast = useToast();

const mode = ref("");

const seeAllPast = ref(false);
const filterPastExams = ref(["passed"]);
const filterPastMockExams = ref(["passed"]);

const upcomingexams = ref<ExamType[]>([]);
const pastMockExams = ref<ExamType[]>([]);
const pastOfficialExams = ref<ExamType[]>([]);

const showExamDetails = ref<boolean>(false);
const showingDetails = ref<string>("");

const showCreateExam = ref(false);
const totalVerses = ref(30);
const createLoading = ref<boolean>(false);

const editMockExam = ref(false);
const showingEdit = ref("");
const editLoading = ref<boolean>(false);

const removeMock = ref<boolean>(false);
const showingRemove = ref("");
const removeLoading = ref<boolean>(false);

onMounted(async () => {
  const getExams = await getMockExams();
  if (getExams.success) {
    upcomingexams.value = getExams.upcomingExams;
    pastMockExams.value = getExams.pastMockExams;
  } else toast.error("Failed to load correctly! Please reload page!");

  const getVerses = await getNumOfVerses();
  if (getVerses.success) {
    // totalVerses.value = getVerses.numofverses;
    mode.value = getVerses.mode;
  } else toast.error("Failed to load correctly! Please reload page!");
});

const createMockExam = async (
  duration: string,
  numofverses: number,
  includeFailed: boolean,
) => {
  createLoading.value = true;
  const formData = {
    duration,
    includeFailed,
    numofverses,
    status: "in-progress",
  };
  const results = await createMockExams(formData);
  if (results.success) {
    showCreateExam.value = false;
    upcomingexams.value = results.mockExams;
    createLoading.value = false;
    toast.success(results.message);
  } else {
    createLoading.value = false;
    toast.error(results.message);
  }
  return;
};

const mockExamEdit = async (
  duration: string,
  numofverses: number,
  includeFailed: boolean,
  title: string,
  examid: String,
) => {
  editLoading.value = true;
  const formData = {
    duration,
    includeFailed,
    numofverses,
    status: "in-progress",
    title,
    examid,
  };
  const results = await editMockExams(formData);
  if (results.success) {
    const index = upcomingexams.value.findIndex(
      (exam) => exam.examid === results.updated.examid,
    );
    console.log(results.updated);

    if (index !== -1) {
      upcomingexams.value[index] = {
        ...upcomingexams.value[index],
        ...results.updated,
      };
    }
    editMockExam.value = false;
    editLoading.value = false;
    toast.success(results.message);
  } else {
    editLoading.value = false;
    toast.error(results.message);
  }
};

const removeMockExam = async (examid: string) => {
  removeLoading.value = true;
  const results = await deleteMockExams(examid);
  if (results.success) {
    upcomingexams.value = results.deleted;
    removeLoading.value = false;
    removeMock.value = false;
    toast.success(results.message);
  } else {
    removeMock.value = false;
    removeLoading.value = false;
    toast.error(results.message);
  }
};

const setExamTime = async (examid: string, duration: number) => {
  const results = await startMockExam({ examid, duration, setDate: true });
  if (results.success) {
    upcomingexams.value = results.mockExams;
    removeLoading.value = false;
    removeMock.value = false;
    toast.success(results.message);
  } else {
    removeMock.value = false;
    removeLoading.value = false;
    toast.error(results.message);
  }
};

const createOfficialExam = async () => {
  const results = await createOfficialExams();
  console.log(results);
};
</script>

<template>
  <NavBar />
  <PageTitle text="Exam Manager" />
  <div class="ml-[90px] mt-20 mx-auto gap-4 flex flex-col">
    <!-- Upcoming Exams -->
    <div class="border-b-3 border-ghost py-4">
      <SecondTitle text="Upcoming Exams" />
      <div class="grid grid-cols-4 gap-3 overflow-x-auto">
        <div
          class="border-1 border-alice rounded p-6 flex flex-col gap-1 justify-start"
          v-for="exam in upcomingexams"
        >
          <p class="italic font-bold text-lg text-center mb-2 underline">
            {{ exam.title }}
          </p>
          <p>
            <span class="font-bold mr-2">Duration: </span
            ><span class="italic">{{ exam.duration }} mins</span>
          </p>
          <p>
            <span class="font-bold mr-2">Exam Type: </span
            ><span class="italic">{{ titleText(exam.type) }}</span>
          </p>
          <p>
            <span class="font-bold mr-2">Status: </span
            ><span class="italic">{{ titleText(exam.status) }}</span>
          </p>
          <div class="flex flex-col gap-2 items-center">
            <div class="flex gap-1 items-center w-full">
              <button
                type="button"
                :class="
                  solidButton +
                  ' text-sm mt-2 p-1! flex gap-1 items-center justify-center w-2/3'
                "
                @click="() => setExamTime(exam.examid, exam.duration)"
              >
                Start<i class="pi pi-play"></i>
              </button>
              <button
                type="button"
                :class="
                  solidButton +
                  ' text-sm mt-2 p-1! flex gap-1 items-center justify-center w-fit!'
                "
                @click="
                  showExamDetails = true;
                  showingDetails = `MockExamDetail${exam.examid}`;
                "
              >
                <i class="pi pi-info-circle"></i>
              </button>
            </div>
            <button
              type="button"
              :class="
                hollowButton +
                ' text-sm flex gap-1 p-1! items-center justify-center'
              "
              @click="
                editMockExam = true;
                showingEdit = exam.examid;
              "
            >
              Edit<i class="pi pi-pencil"></i>
            </button>
            <button
              type="button"
              :class="
                hollowButton +
                ' text-sm hover:text-alice! text-alice! p-1! border-eerie! hover:border-alice! bg-baseRed! flex gap-1 items-center justify-center'
              "
              @click="
                removeMock = true;
                showingRemove = exam.examid;
              "
            >
              Delete<i class="pi pi-trash"></i>
            </button>
            <ConfirmPopup
              v-if="showingRemove === exam.examid"
              @update:show-dialog="showingRemove = ''"
              :key="exam.examid"
              :dialog-text="`Confirm below to delete ${exam.title}`"
              header="Delete Mock Exam"
              :show-modal="removeMock"
              success-icon="trash"
              success-text="Delete Mock Exam"
              :style="`hover:bg-baseRed hover:text-alice! hover:border-eerie`"
              submit-text="Deleting"
              :is-loading="removeLoading"
              @success-click="() => removeMockExam(exam.examid)"
            />
            <ExamDetailDialog
              v-if="showingDetails === `MockExamDetail${exam.examid}`"
              :show-exam-detail="showExamDetails"
              @showing-details="(e: string) => (showingDetails = e)"
              @update:show-exam-detail="showingDetails = ''"
              header-title="Mock Exam Details"
              :title="exam.title"
              :type="exam.type"
              :duration="`${exam.duration} mins`"
              :created="exam.created"
              :date="exam.examDate || 'Unknown'"
              :numofverses="Number(exam.numofverses)"
              :include-failed="Boolean(exam.includeFailed)"
              :start-time="exam.startTime || 'Unknown'"
              :end-time="exam.endTime || 'Unknown'"
              :status="exam.status"
              :timezone="exam.timezone"
              :examid="exam.examid"
            />
            <MockExamSchedule
              v-if="showingEdit === exam.examid"
              @update:show-dialog="showingEdit = ''"
              :key="exam.examid"
              header="Edit Mock Exam"
              :title="exam.title"
              :failed-verses="Boolean(exam.includeFailed)"
              :verses="Number(exam.numofverses)"
              :length="exam.duration"
              :show-dialog="editMockExam"
              :total-verses="totalVerses"
              type="edit"
              @submitExam="
                (
                  duration: string,
                  numofverses: number,
                  includeFailed: boolean,
                ) =>
                  mockExamEdit(
                    duration,
                    numofverses,
                    includeFailed,
                    exam.title,
                    exam.examid,
                  )
              "
              :is-loading="editLoading"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Past Exams -->
    <div class="border-b-3 border-ghost py-4">
      <div class="flex justify-between items-center">
        <SecondTitle text="Past Mock Exams" />
        <div class="flex items-center gap-2 text-xl">
          <div class="flex items-center gap-1">
            <input
              type="checkbox"
              name="pastExams"
              value="passed"
              :class="checkboxDesign"
              v-model="filterPastExams"
              id="passed"
            />
            <label for="passed">Passed</label>
          </div>
          <div class="flex items-center gap-1">
            <input
              type="checkbox"
              name="pastExams"
              value="failed"
              :class="checkboxDesign"
              v-model="filterPastExams"
              id="failed"
            />
            <label for="failed">Failed</label>
          </div>
        </div>
        <button
          type="button"
          :class="solidButton + ' max-w-fit'"
          v-on:click="seeAllPast = !seeAllPast"
        >
          {{ seeAllPast ? "See Less" : "See All" }}
        </button>
      </div>
      <p
        class="py-4 italic text-alice text-xl"
        v-if="pastOfficialExams.length < 1"
      >
        Create and Write Official Exam
      </p>
      <div class="grid grid-cols-4 gap-2" v-if="pastOfficialExams">
        <div
          class="border-1 border-alice rounded p-6 flex flex-col gap-1 justify-start"
          v-for="exam in pastOfficialExams"
        >
          <p class="italic font-bold text-lg text-center mb-2 underline">
            {{ exam.title }}
          </p>
          <p>
            <span class="font-bold mr-2">Date: </span
            ><span class="italic">{{ exam.examDate }}</span>
          </p>
          <p>
            <span class="font-bold mr-2">Start Time: </span
            ><span class="italic">{{ exam.startTime }}</span>
          </p>
          <p>
            <span class="font-bold mr-2">Duration: </span
            ><span class="italic">{{ exam.duration }}</span>
          </p>
          <p>
            <span class="font-bold mr-2">Exam Type: </span
            ><span class="italic">{{ titleText(exam.type) }}</span>
          </p>
          <p>
            <span class="font-bold mr-2">Status: </span
            ><span class="italic">{{ titleText(exam.status) }}</span>
          </p>
          <button
            type="button"
            :class="
              solidButton +
              ' text-sm mt-2 p-1! flex gap-1 items-center justify-center'
            "
            @click="
              showExamDetails = true;
              showingDetails = `${exam.examid}`;
            "
          >
            Details<i class="pi pi-info-circle"></i>
          </button>
          <ExamDetailDialog
            v-if="showingDetails === `${exam.examid}`"
            :show-exam-detail="showExamDetails"
            @showing-details="(e: string) => (showingDetails = e)"
            @update:show-exam-detail="showingDetails = ''"
            header-title="Official Exam Details"
            :title="exam.title"
            :type="exam.type"
            :duration="`${exam.duration} mins`"
            :created="exam.created"
            :date="exam.examDate"
            :numofverses="Number(exam.numofverses)"
            :include-failed="Boolean(exam.includeFailed)"
            :start-time="exam.startTime"
            :end-time="''"
            :status="exam.status"
            :timezone="exam.timezone"
            :examid="exam.examid"
          />
        </div>
      </div>
    </div>

    <!-- Past Mock Exams -->
    <div class="border-b-3 border-ghost py-4">
      <div class="flex justify-between items-center">
        <SecondTitle text="Past Mock Exams" />
        <div class="flex items-center gap-2 text-xl">
          <div class="flex items-center gap-1">
            <input
              type="checkbox"
              name="pastExams"
              value="passed"
              :class="checkboxDesign"
              v-model="filterPastMockExams"
              id="passed"
            />
            <label for="passed">Passed</label>
          </div>
          <div class="flex items-center gap-1">
            <input
              type="checkbox"
              name="pastExams"
              value="failed"
              :class="checkboxDesign"
              v-model="filterPastMockExams"
              id="failed"
            />
            <label for="failed">Failed</label>
          </div>
        </div>
        <button
          type="button"
          :class="solidButton + ' max-w-fit'"
          v-on:click="seeAllPast = !seeAllPast"
        >
          {{ seeAllPast ? "See Less" : "See All" }}
        </button>
      </div>
      <p class="py-4 italic text-alice text-xl" v-if="pastMockExams.length < 1">
        Create and Write Mock Exam
      </p>
      <div class="grid grid-cols-4 gap-2" v-if="pastMockExams">
        <div
          class="border-1 border-alice rounded p-6 flex flex-col gap-1 justify-start"
          v-for="exam in pastMockExams"
        >
          <p class="italic font-bold text-lg text-center mb-2 underline">
            {{ exam.title }}
          </p>
          <p>
            <span class="font-bold mr-2">Date: </span
            ><span class="italic">{{ exam.examDate }}</span>
          </p>
          <p>
            <span class="font-bold mr-2">Start Time: </span
            ><span class="italic">{{ exam.startTime }}</span>
          </p>
          <p>
            <span class="font-bold mr-2">Duration: </span
            ><span class="italic">{{ exam.duration }}</span>
          </p>
          <p>
            <span class="font-bold mr-2">Exam Type: </span
            ><span class="italic">{{ titleText(exam.type) }}</span>
          </p>
          <p>
            <span class="font-bold mr-2">Status: </span
            ><span class="italic">{{ titleText(exam.status) }}</span>
          </p>
          <button
            type="button"
            :class="
              solidButton +
              ' text-sm mt-2 p-1! flex gap-1 items-center justify-center'
            "
            @click="
              showExamDetails = true;
              showingDetails = `MockExamDetail${exam.examid}`;
            "
          >
            Details<i class="pi pi-info-circle"></i>
          </button>
          <ExamDetailDialog
            v-if="showingDetails === `MockExamDetail${exam.examid}`"
            :show-exam-detail="showExamDetails"
            @showing-details="(e: string) => (showingDetails = e)"
            @update:show-exam-detail="showingDetails = ''"
            header-title="Mock Exam Details"
            :title="exam.title"
            :type="exam.type"
            :duration="`${exam.duration} mins`"
            :created="exam.created"
            :date="exam.examDate"
            :numofverses="Number(exam.numofverses)"
            :include-failed="Boolean(exam.includeFailed)"
            :start-time="exam.startTime"
            :end-time="''"
            :status="exam.status"
            :timezone="exam.timezone"
            :examid="exam.examid"
          />
        </div>
      </div>
    </div>

    <!-- Create Mock Exams -->
    <button
      :class="
        solidButton +
        (upcomingexams.filter((exam) => exam.type === 'mock').length >= 1
          ? ' hover:cursor-not-allowed! hover:bg-gray-600! max-w-fit!'
          : ' max-w-fit!')
      "
      @click="
        upcomingexams.filter((exam) => exam.type === 'mock').length < 1
          ? (showCreateExam = true)
          : ''
      "
    >
      Create Mock Exam
    </button>
    <p
      class="italic text-alice"
      v-if="upcomingexams.filter((exam) => exam.type === 'mock').length >= 1"
    >
      Complete the created mock exam to create a new one
    </p>
    <button :class="solidButton + ' max-w-fit!'" @click="createOfficialExam">
      Create Official Exam
    </button>
    <!-- Unlock only after 14 verses have been added -->
    <MockExamSchedule
      header="Create Mock Exam"
      :title="`Mock Exam ${
        upcomingexams
          ? [
              ...upcomingexams.filter((exam) => exam.type === 'mock'),
              ...pastMockExams,
            ].length + 1
          : 1
      }`"
      :date="new Date()"
      :failed-verses="false"
      :verses="7"
      :show-dialog="showCreateExam"
      :total-verses="totalVerses"
      type="create"
      @submitExam="
        (duration: string, numofverses: number, includeFailed: boolean) =>
          createMockExam(duration, numofverses, includeFailed)
      "
      :is-loading="createLoading"
    />
  </div>
</template>
