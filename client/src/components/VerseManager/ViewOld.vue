<script setup lang="ts">
import { verseChange } from "@/utils/exports";
import { hollowButton } from "@/utils/exports";
import VerseSelector from "../VerseSelector.vue";

const numOfVerses = defineModel("numOfVerses", { default: 0 });
const numOfTrack = defineModel("numOfTrack", { default: 0 });
const verses = defineModel("verses", { type: Object });
const errVerse = defineModel("errVerse");
const handleRemove = defineEmits(["handleRemove"]);
</script>

<template>
  <div v-if="numOfVerses > 0" class="w-full">
    <p class="text-center font-bold text-eerie">Your Verses</p>
    <div
      class="flex gap-2 items-center"
      v-for="(key, i) in Object.keys(verses)"
    >
      <p class="font-bold text-eerie">{{ i + 1 }}.</p>
      <VerseSelector
        :version="verses[key].Version"
        @update:version="
                (text: string) => {verseChange(i, text, 'Version', 'track'); numOfTrack++}
              "
        :book="verses[key].Book"
        @update:book="(text: string) => {verseChange(i, text, 'Book', 'track'); numOfTrack++}"
        :chapter="verses[key].Chapter"
        @update:chapter="
                (text: string) => {verseChange(i, text, 'Chapter', 'track'); numOfTrack++}
              "
        :verse="verses[key].Verse"
        @update:verse="(text: string) => {verseChange(i, text, 'Verse', 'track'); numOfTrack++}"
        :to-verse="verses[key].To"
        @update:to-verse="(text: string) => {verseChange(i, text, 'To', 'track'); numOfTrack++}"
        v-model:errors="errVerse"
        :show-version="true"
        :show-to-verse="true"
        colors="bg-alice! border-eerie text-eerie **:text-eerie"
        label-color="text-eerie font-caveat"
        :show-select-title="true"
      />

      <button
        type="button"
        :class="hollowButton + ' w-auto! h-10 mt-2'"
        @click="() => handleRemove('handleRemove', key)"
      >
        X
      </button>
    </div>
  </div>
</template>
