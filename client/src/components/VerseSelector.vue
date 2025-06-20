<script setup lang="ts">
import { allBooks } from "@/utils/Types";
import { tooltipTheme } from "@/utils/FileObject";

defineProps({
  title: String,
  tip: {
    type: Boolean,
    default: false,
  },
  showVersion: {
    type: Boolean,
    default: false,
  },
});

const version = defineModel("version");
const book = defineModel("book");
const chapter = defineModel("chapter");
const verse = defineModel("verse");

const bibleVersions = ["NKJV", "KJV", "AMP", "NIV", "MSG", "NLT", "CEV"].sort();

// type VerseError = {book: string, chapter: string, verse: string}

const errors = defineModel("errors", { type: Object });
</script>

<template>
  <div class="mb-4 w-full">
    <div class="w-full flex justify-between items-center">
      <label for="bible verse" class="block mb-2"
        ><i class="pi pi-book text-baseRed mr-4"></i> {{ title }}
        <span class="text-baseRed">*</span> :</label
      >
      <i
        v-if="tip"
        v-tooltip.top="{
          value: 'Will be used to reset your password',
          ...tooltipTheme,
        }"
        class="pi pi-question text-1xl p-1 border hover:cursor-pointer rounded-full hover:bg-alice hover:text-eerie"
      ></i>
    </div>
    <div class="flex justify-between items-center gap-2">
      <select
        v-if="showVersion"
        v-model="version"
        name="version"
        id="version"
        class="rounded p-2 border w-2/4 bg-eerie"
      >
        <option v-for="version in bibleVersions" :value="version">
          {{ version }}
        </option>
      </select>
      <select
        v-model="book"
        name="book"
        id="book"
        :class="`${
          errors.book
            ? 'border-2 border-red-500 focus:outline-hidden'
            : 'border'
        } rounded p-2 w-3/4 bg-eerie`"
      >
        <option value="Select Book" disabled hidden>Select Book</option>
        <option v-for="book in allBooks" :value="book">
          {{ book }}
        </option>
      </select>
      <select
        v-model="chapter"
        name="chapter"
        id="chapter"
        :class="`${
          errors.chapter
            ? 'border-2 border-red-500 focus:outline-hidden'
            : 'border'
        } rounded p-2 w-1/3 bg-eerie`"
      >
        <option value="Chapter" disabled hidden>Chapter</option>
        <option value="1">1</option>
      </select>

      <select
        v-model="verse"
        name="verse"
        id="verse"
        :class="`${
          errors.verse
            ? 'border-2 border-red-500 focus:outline-hidden'
            : 'border'
        } rounded p-2 w-1/3 bg-eerie`"
      >
        <option value="Verse" disabled hidden>Verse</option>
        <option value="1">1</option>
      </select>
    </div>
    <span
      class="text-red-500 block mt-2 text-sm"
      v-if="errors.book || errors.chapter || errors.verse"
      >The following is required: {{ errors.book && "Book" }}
      {{ errors.chapter && "Chapter" }} {{ errors.verse && "Verse" }}</span
    >
  </div>
</template>
