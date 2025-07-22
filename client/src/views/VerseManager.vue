<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import { bibleVersions } from "@/utils/Types";
import { hollowButton, solidButton } from "@/utils/exports";
import { onMounted, ref } from "vue";
import ConfirmPopup from "@/components/ConfirmPopup.vue";
import { deleteVerses, getVerses, saveVerses } from "@/api/api";
import AddVerse from "@/components/VerseManager/AddVerse.vue";
import { useToast } from "vue-toastification";
import { Popover } from "primevue";
import ViewNew from "@/components/VerseManager/ViewNew.vue";
import ViewOld from "@/components/VerseManager/ViewOld.vue";

const toast = useToast();

const copyId = ref(false);
const showModal = ref(false);
const showRemoveModal = ref(false);
const isLoading = ref(false);

const errVerse = ref({ book: "", chapter: "", verse: "" });

const track = ref(JSON.parse(localStorage.getItem("track") || "{}"));
const verses = ref({});
const trackNew = ref(
  JSON.parse(localStorage.getItem("trackNew") || "{}") || {}
);
const removedVerses = ref(
  JSON.parse(localStorage.getItem("removed") || "{}") || {}
);
const numOfVerses = ref(0);
const numOfNewVerses = ref(Object.keys(trackNew.value).length);
const numOfRemoved = ref(Object.keys(removedVerses.value).length);

const mode = ref("");
const globalV = ref("");
const verseId = ref("");
const viewOrder = ref("new");
const popOver = ref();

const arrangeVerses = (schema: "track" | "new" | "sort", id: number) => {
  const versesKeys = Object.keys(verses.value);
  let arrange = {};
  if (schema === "track") {
    for (let i = 0; i < versesKeys.length; i++) {
      if (parseInt(versesKeys[i]) > id) {
        arrange[parseInt(versesKeys[i]) - 1] =
          verses.value[parseInt(versesKeys[i])];
        continue;
      } else {
        arrange[parseInt(versesKeys[i])] =
          verses.value[parseInt(versesKeys[i])];
        continue;
      }
    }
  }
  const trackNewKeys = Object.keys(trackNew.value);
  if (schema === "new") {
    for (let i = 0; i < trackNewKeys.length; i++) {
      if (parseInt(trackNewKeys[i]) > id) {
        arrange[parseInt(trackNewKeys[i]) - 1] =
          trackNew.value[parseInt(trackNewKeys[i])];
        continue;
      } else {
        arrange[parseInt(trackNewKeys[i])] =
          trackNew.value[parseInt(trackNewKeys[i])];
        continue;
      }
    }
  }
  if (schema === "sort") {
    for (let i = 0; i < trackNewKeys.length; i++) {
      arrange[numOfNewVerses.value + numOfVerses.value - 1] =
        trackNew.value[trackNewKeys[i]];
    }
  }

  return arrange;
};

onMounted(async () => {
  const results = await getVerses();
  if (results.success) {
    mode.value = results.mode || "Newbie";
    globalV.value = results.globalV;
    verseId.value = results.verseId;
    verses.value = results.verses;
    numOfVerses.value = Object.keys(verses.value).length;
  }

  const versesKey = Object.keys(verses.value);
  const removedKeys = Object.keys(removedVerses.value);
  const trackKeys = Object.keys(track.value);

  for (let i = 0; i < removedKeys.length; i++) {
    if (
      versesKey.indexOf(removedKeys[i]) >= 0 &&
      removedVerses.value[removedKeys[i]]["Part"] === "track"
    ) {
      delete verses.value[removedKeys[i]];
      numOfVerses.value--;
      verses.value = arrangeVerses("track", i);
    }
  }
  for (let i = 0; i < trackKeys.length; i++) {
    const verseId = verses.value[trackKeys[i]];
    const trackId = track.value[trackKeys[i]];
    verseId["Version"] = trackId["Version"] || verseId["Version"];
    verseId["Book"] = trackId["Book"] || verseId["Book"];
    verseId["Chapter"] = trackId["Chapter"] || verseId["Chapter"];
    verseId["Verse"] = trackId["Verse"] || verseId["Verse"];
    verseId["To"] = trackId["To"] || verseId["To"];
  }
  verses.value = verses.value;
});

const toggle = (e: Event) => {
  popOver.value.toggle(e);
};

const verseIdClick = () => {
  navigator.clipboard.writeText(verseId.value);
  copyId.value = true;
  setTimeout(() => {
    copyId.value = false;
  }, 3000);
};

const handleSave = async () => {
  const formdata = {
    newVerses: trackNew.value,
    verses: verses.value,
    track: JSON.parse(localStorage.getItem("track") || "{}"),
  };

  const results = await saveVerses(formdata);
  if (results.success) {
    verses.value = results.verses;
    numOfVerses.value = numOfVerses.value + numOfNewVerses.value;
    numOfRemoved.value = 0;
    numOfNewVerses.value = 0;
    localStorage.clear();
    toast.success(results.message);
    showModal.value = false;
    return;
  }
  toast.error(results.message);
  showModal.value = false;
  return;
};

const handleRemoval = (id: number, schema: "new" | "track") => {
  const removedKeys = Object.keys(removedVerses.value);

  if (schema === "track") {
    for (let i = 0; i < removedKeys.length; i++) {
      const removedId = removedVerses.value[removedKeys[i]];
      const verseId = verses.value[id];
      if (
        removedId["Book"] === verseId["Book"] &&
        removedId["Chapter"] === verseId["Chapter"] &&
        removedId["Verse"] === verseId["Verse"] &&
        removedId["Part"] === "track"
      ) {
        delete verses.value[id];
        numOfVerses.value--;
        return;
      }
    }
    removedVerses.value[removedKeys.length] = verses.value[id];
    removedVerses.value[removedKeys.length]["Part"] = "track";
    delete verses.value[id];
    delete track.value[id];
    verses.value = arrangeVerses("track", id);
    trackNew.value = arrangeVerses("new", 0);
    numOfVerses.value--;
    numOfRemoved.value++;
    localStorage.setItem("removed", JSON.stringify(removedVerses.value));
    localStorage.setItem("track", JSON.stringify(track.value));
    localStorage.setItem("trackNew", JSON.stringify(trackNew.value));
  }

  if (schema === "new") {
    for (let i = 0; i < removedKeys.length; i++) {
      const removedId = removedVerses.value[removedKeys[i]];
      const newId = trackNew.value[id];
      if (
        removedId["Book"] === newId["Book"] &&
        removedId["Chapter"] === newId["Chapter"] &&
        removedId["Verse"] === newId["Verse"] &&
        removedId["Part"] === "new"
      ) {
        delete trackNew.value[id];
        numOfNewVerses.value--;
        return;
      }
    }
    removedVerses.value[removedKeys.length] = trackNew.value[id];
    removedVerses.value[removedKeys.length]["Part"] = "new";
    delete trackNew.value[id];
    trackNew.value = arrangeVerses("new", 0);
    numOfNewVerses.value--;
    numOfRemoved.value++;
    localStorage.setItem("removed", JSON.stringify(removedVerses.value));
    localStorage.setItem("trackNew", JSON.stringify(trackNew.value));
  }
};

const handleUndo = () => {
  const removedKeys = Object.keys(removedVerses.value);

  if (
    removedVerses.value[removedKeys[removedKeys.length - 1]]["Part"] === "track"
  ) {
    verses.value[numOfVerses.value] =
      removedVerses.value[removedKeys[removedKeys.length - 1]];
    delete verses.value[numOfVerses.value]["Part"];
    numOfVerses.value++;
    trackNew.value = arrangeVerses("sort", 0);
    localStorage.setItem("trackNew", JSON.stringify(trackNew.value));
  }

  if (
    removedVerses.value[removedKeys[removedKeys.length - 1]]["Part"] === "new"
  ) {
    trackNew.value[numOfNewVerses.value + numOfVerses.value] =
      removedVerses.value[removedKeys[removedKeys.length - 1]];
    delete trackNew.value[numOfNewVerses.value + numOfVerses.value]["Part"];
    numOfNewVerses.value++;
    localStorage.setItem("trackNew", JSON.stringify(trackNew.value));
  }
  delete removedVerses.value[removedKeys[removedKeys.length - 1]];
  numOfRemoved.value--;

  localStorage.setItem("removed", JSON.stringify(removedVerses.value));
};

const handleCancel = () => {
  let count = 0;
  while (count <= Object.keys(removedVerses.value).length) {
    handleUndo();
    count++;
  }
  trackNew.value = {};
  removedVerses.value = {};

  numOfNewVerses.value = 0;
  numOfRemoved.value = 0;

  localStorage.setItem("trackNew", JSON.stringify(trackNew.value));
  localStorage.setItem("removed", JSON.stringify(removedVerses.value));
};

const handleDelete = async () => {
  const results = await deleteVerses();
  if (results.success) {
    verses.value = results.value;
    numOfNewVerses.value = 0;
    numOfRemoved.value = 0;
    numOfVerses.value = 0;
    localStorage.clear();
    toast.success(results.message);
    showRemoveModal.value = false;
    return;
  }
  toast.error(results.message);
  showRemoveModal.value = false;
  return;
};
</script>

<template>
  <NavBar />
  <div
    class="ml-[90px] mt-25 flex flex-col items-center justify-center mx-auto gap-4"
  >
    <h1 class="font-caveat text-6xl text-center">Verse Manager</h1>
    <p class="flex items-center gap-2">
      <span
        class="font-caveat text-xl font-bold italic hover:underline p-2 rounded-md hover:cursor-pointer hover:bg-alice hover:text-eerie"
        @click="verseIdClick"
        >{{ verseId }}</span
      >
      <span v-if="copyId" class="text-sm font-bold text-red-700">Copied</span>
    </p>

    <div class="mt-8 flex justify-between w-full">
      <p>
        Mode: <span class="text-red-700">{{ mode }}</span>
      </p>
      <div>
        <label for="global-version" class="mr-4">Global Version: </label>
        <select
          name="global-version"
          id="global-version"
          class="rounded p-2 border w-auto bg-eerie"
          v-model="globalV"
        >
          <option v-for="version in bibleVersions" :value="version">
            {{ version }}
          </option>
        </select>
      </div>
    </div>
    <section id="verse-cud" class="w-[40rem]">
      <AddVerse
        v-model:verses="verses"
        v-model:track-new="trackNew"
        v-model:num-of-new-verses="numOfNewVerses"
        v-model:num-of-verses="numOfVerses"
      />
      <div class="flex justify-between items-center mt-3">
        <div class="flex gap-4 items-center">
          <p class="font-bold font-caveat text-xl italic text-gray-600">
            # of Verses: {{ numOfVerses + numOfNewVerses }}
          </p>
          <i
            class="pi pi-sliders-v hover:cursor-pointer hover:text-baseRed"
            @click="toggle"
          ></i>
        </div>
        <Popover ref="popOver" class="m-5! mt-2!">
          <div class="border-1 p-2">
            <div
              class="w-full hover:bg-baseRed p-2 hover:text-alice hover:cursor-pointer rounded-md hover:border-1"
              v-for="order in [
                ['New First', 'new'],
                ['Old First', 'old'],
              ]"
              @click="viewOrder = order[1]"
            >
              {{ order[0] }}
            </div>
          </div>
        </Popover>
        <div
          class="flex gap-4 items-center"
          v-if="numOfNewVerses > 0 || numOfRemoved > 0"
        >
          <button
            type="button"
            :class="solidButton + ' flex items-center gap-2'"
            @click="showModal = true"
          >
            <i class="pi pi-check"></i>Save
          </button>
          <button
            type="button"
            :class="hollowButton + ' flex items-center gap-2'"
            @click="handleCancel"
          >
            <i class="pi pi-ban"></i>Cancel
          </button>
        </div>
        <button
          type="button"
          :class="solidButton + ' bg-baseRed! flex gap-2 items-center w-auto!'"
          @click="showRemoveModal = true"
          v-if="numOfVerses > 0"
        >
          <i class="pi pi-trash"></i>Remove All
        </button>
        <ConfirmPopup
          v-model:show-modal="showRemoveModal"
          v-bind:is-loading="isLoading"
          success-icon="trash"
          success-text="Remove All"
          dialog-text="Are you sure you want to delete all your verses?"
          @success-click="handleDelete"
        />
      </div>
      <div
        :class="`border-2 p-2 bg-alice rounded-md my-4 max-h-100 overflow-scroll overflow-x-auto w-full overflow-y-auto flex flex-col${
          viewOrder === 'new' ? '' : '-reverse'
        }`"
        v-if="numOfNewVerses > 0 || numOfRemoved > 0 || numOfVerses > 0"
      >
        <p
          v-if="numOfRemoved > 0"
          class="text-eerie hover:underline hover:cursor-pointer flex items-center w-[4rem] justify-self-end"
          @click="handleUndo"
        >
          <i class="pi pi-undo"></i> Undo
        </p>
        <ViewNew
          v-model:num-of-new-verses="numOfNewVerses"
          v-model:err-verse="errVerse"
          v-model:track-new="trackNew"
          @handle-remove="(e) => handleRemoval(e, 'new')"
        />
        <ViewOld
          v-model:num-of-verses="numOfVerses"
          v-model:err-verse="errVerse"
          v-model:verses="verses"
          @handle-remove="(e) => handleRemoval(e, 'track')"
        />
      </div>
      <ConfirmPopup
        v-model:is-loading="isLoading"
        v-model:show-modal="showModal"
        v-on:success-click="handleSave"
        dialog-text="Are you happy with the new verses added?"
      />
    </section>
  </div>
</template>
