<script setup lang="ts">
import { hollowButton, solidButton } from "@/utils/exports";
import { onMounted, ref } from "vue";
import VerseSelector from "../VerseSelector.vue";
import { getVerses } from "@/api/api";
import ImportVerses from "./ImportVerses.vue";

const verses = defineModel("verses", { type: Object });
const trackNew = defineModel("trackNew", { type: Object });
const numOfVerses = defineModel("numOfVerses", { default: 0 });
const numOfNewVerses = defineModel("numOfNewVerses", { default: 0 });

const showModal = ref(false);

const globalV = ref("");
const version = ref(globalV || "NKJV");
const book = ref("Select Book");
const chapter = ref("Chapter");
const verse = ref("Verse");
const toVerse = ref("To");
const errVerse = ref({ book: "", chapter: "", verse: "" });
const errText = ref("");

onMounted(async () => {
  const results = await getVerses();
  if (results.success) {
    globalV.value = results.globalV;
  }
});

const addVerse = (key: number) => {
  // const position = track.value[Object.keys(track.value).length - 1];
  const errs: string[] = [];
  toVerse.value = toVerse.value === "To" ? "." : toVerse.value;

  if (book.value === "Select Book") {
    errs.push("Book");
    errVerse.value.book = "Book";
  } else errVerse.value.book = "";
  if (chapter.value === "Chapter") {
    errs.push("Chapter");
    errVerse.value.chapter = "Chapter";
  } else errVerse.value.chapter = "";
  if (verse.value === "Verse") {
    errs.push("Verse");
    errVerse.value.verse = "Verse";
  } else errVerse.value.verse = "";
  if (errs.length > 0) return;
  else errText.value = "";

  const versesKeys = Object.keys(verses.value);
  const trackNewKeys = Object.keys(trackNew.value);

  // const checkedVerse = checkExistingVerse(
  //   verses.value,
  //   trackNew.value,
  //   book.value,
  //   chapter.value,
  //   verse.value,
  //   toVerse.value,
  //   versesKeys,
  //   trackNewKeys
  // );

  // console.log(checkedVerse);
  // if (!checkedVerse["status"]) return (errText.value = checkedVerse["message"]);

  for (let i = 0; i < trackNewKeys.length; i++) {
    const trackNewId = trackNew.value[trackNewKeys[i]];
    if (
      trackNewId["Book"] === book.value &&
      trackNewId["Chapter"] === chapter.value &&
      trackNewId["Verse"] === verse.value &&
      (trackNewId["To"] === toVerse.value ||
        trackNewId["To"] === "*" ||
        parseInt(trackNewId["To"]) >= parseInt(toVerse.value))
    ) {
      errText.value = "Verse Already Covered";
      return;
    } else if (
      trackNewId["Book"] === book.value &&
      trackNewId["Chapter"] === chapter.value &&
      trackNewId["Verse"] === verse.value &&
      (trackNewId["To"] === "." ||
        parseInt(trackNewId["To"]) > parseInt(verse.value)) &&
      toVerse.value === "*"
    ) {
      errText.value = "* Covers A Verse That Already Exists";
      return;
    } else errText.value = "";
  }

  for (let i = 0; i < versesKeys.length; i++) {
    const trackId = verses.value[versesKeys[i]];
    if (
      trackId["Book"] === book.value &&
      trackId["Chapter"] === chapter.value &&
      trackId["Verse"] === verse.value &&
      (trackId["To"] === toVerse.value ||
        trackId["To"] === "*" ||
        parseInt(trackId["To"]) >= parseInt(toVerse.value))
    ) {
      errText.value = "Verse Already Covered";
      return;
    } else if (
      trackId["Book"] === book.value &&
      trackId["Chapter"] === chapter.value &&
      trackId["Verse"] === verse.value &&
      (trackId["To"] === "." ||
        parseInt(trackId["To"]) > parseInt(verse.value)) &&
      toVerse.value === "*"
    ) {
      errText.value = "* Covers A Verse That Already Exists";
      return;
    } else errText.value = "";
  }

  trackNew.value[key] = {
    Version: version.value,
    Book: book.value,
    Chapter: chapter.value,
    Verse: verse.value,
    To: toVerse.value,
  };

  version.value = globalV.value;
  book.value = "Select Book";
  chapter.value = "Chapter";
  verse.value = "Verse";
  toVerse.value = "To";

  numOfNewVerses.value++;
  localStorage.setItem("trackNew", JSON.stringify(trackNew.value));
};
</script>

<template>
  <p class="border-t-2 border-b-2 mt-10 text-center text-[1.2rem]">
    Add or Edit Verses
  </p>
  <p class="text-gray-500 mt-4">
    Add or edit your verses. Deleted verses can be undone for both old and new.
    You can sort by view.
  </p>

  <VerseSelector
    v-model:version="version"
    v-model:book="book"
    @update:book="errVerse.book = ''"
    v-model:chapter="chapter"
    @update:chapter="errVerse.chapter = ''"
    v-model:verse="verse"
    @update:verse="errVerse.verse = ''"
    v-model:to-verse="toVerse"
    v-model:errors="errVerse"
    :tip="false"
    :show-version="true"
    :show-to-verse="true"
    class="w-full mt-4"
  />
  <span v-if="errText" class="text-red-600 text-sm">{{ errText }}</span>
  <div class="flex items-center justify-between mt-4">
    <button
      type="button"
      :class="hollowButton + ' w-auto! flex items-center gap-2'"
      @click="showModal = true"
    >
      <i class="pi pi-download"></i>
      Import Verses
    </button>
    <button
      type="button"
      :class="solidButton + ' w-auto! flex items-center gap-2'"
      @click="() => addVerse(numOfVerses + numOfNewVerses)"
    >
      <i class="pi pi-plus"></i>Add Verse
    </button>
  </div>
  <ImportVerses
    v-model:show-modal="showModal"
    :global-version="globalV"
    :num-of-verses="numOfVerses"
    v-model:track-new="trackNew"
    v-model:verses="verses"
  />
</template>
