<script setup lang="ts">
import { verseChange } from "@/utils/exports";
import { hollowButton } from "@/utils/exports";
import VerseSelector from "../VerseSelector.vue";

const numOfNewVerses = defineModel("numOfNewVerses", { default: 0 });
const errVerse = defineModel("errVerse");
const trackNew = defineModel("trackNew", { default: Object });
const error = defineModel("errText", { default: Object });
const handleRemove = defineEmits(["handleRemove"]);
</script>

<template>
  <div class="w-full" v-if="numOfNewVerses > 0">
    <p class="text-center font-bold text-eerie">New Verses</p>
    <div class="w-full" v-for="key in Object.keys(trackNew)">
      <div class="flex items-center gap-2 w-full">
        <p class="font-bold text-eerie">{{ parseInt(key) + 1 }}.</p>

        <VerseSelector
          :version="trackNew[parseInt(key)]['Version']"
          @update:version="
          (text: string) => verseChange(parseInt(key), text, 'Version', 'new')
        "
          :book="trackNew[parseInt(key)]['Book']"
          @update:book="(text: string) => verseChange(parseInt(key), text, 'Book', 'new') "
          :chapter="trackNew[parseInt(key)]['Chapter']"
          @update:chapter="
          (text: string) => verseChange(parseInt(key), text, 'Chapter', 'new') 
        "
          :verse="trackNew[parseInt(key)]['Verse']"
          @update:verse="
          (text: string) => verseChange(parseInt(key), text, 'Verse', 'new') 
        "
          :to-verse="trackNew[parseInt(key)]['To']"
          @update:to-verse="
          (text: string) => verseChange(parseInt(key), text, 'To', 'new') 
        "
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
      <span
        class="text-red-500 block mt-2 text-sm"
        v-if="error.msg && error.key === key"
        >{{ error.msg }}</span
      >
    </div>
  </div>
</template>
