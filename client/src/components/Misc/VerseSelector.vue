<script setup lang="ts">
import { allBooks } from "@/utils/Types";
import { tooltipTheme } from "@/utils/FileObject";
import { bibleVersions } from "@/utils/Types";

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
  showToVerse: {
    type: Boolean,
    default: false,
  },
  colors: {
    type: String,
    default: "",
  },
  labelColor: {
    type: String,
    default: "",
  },
  showSelectTitle: {
    type: Boolean,
    default: false,
  },
});

const version = defineModel("version");
const book = defineModel("book");
const chapter = defineModel("chapter");
const verse = defineModel("verse");
const toVerse = defineModel("toVerse");

const errors = defineModel("errors", { type: Object });
</script>

<template>
  <div class="mb-4 w-full">
    <div class="w-full flex justify-between items-center">
      <label v-if="title" for="bible verse" :class="labelColor + ' block mb-2'"
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
      <div class="flex flex-col justify-center w-1/3">
        <label
          v-if="showSelectTitle"
          for="version"
          :class="labelColor + ' block'"
          >Version:</label
        >
        <select
          v-if="showVersion"
          v-model="version"
          name="version"
          id="version"
          :class="colors + ' rounded p-2 w-full bg-eerie border'"
        >
          <option v-for="version in bibleVersions" :value="version">
            {{ version }}
          </option>
        </select>
      </div>
      <div class="flex flex-col justify-center w-3/4">
        <label v-if="showSelectTitle" for="book" :class="labelColor + ' block'"
          >Book:</label
        >
        <select
          v-model="book"
          name="book"
          id="book"
          :class="
            colors +
            ` ${
              errors.book
                ? 'border-2 border-red-500 focus:outline-hidden'
                : 'border'
            } rounded p-2 w-full bg-eerie`
          "
        >
          <option value="Select Book" disabled hidden>Select Book</option>
          <option v-for="book in allBooks" :value="book">
            {{ book }}
          </option>
        </select>
      </div>
      <div class="flex flex-col justify-center w-1/3">
        <label
          v-if="showSelectTitle"
          for="chapter"
          :class="labelColor + ' block'"
          >Chapter:</label
        >
        <select
          v-model="chapter"
          name="chapter"
          id="chapter"
          :class="
            colors +
            ` ${
              errors.chapter
                ? 'border-2 border-red-500 focus:outline-hidden'
                : 'border'
            } rounded p-2 w-full bg-eerie`
          "
        >
          <option value="Chapter" disabled hidden>Chapter</option>
          <option v-for="num in [...Array(100).keys()]" :value="`${num + 1}`">
            {{ num + 1 }}
          </option>
        </select>
      </div>
      <div class="flex flex-col justify-center w-1/3">
        <label v-if="showSelectTitle" for="verse" :class="labelColor + ' block'"
          >Verse:</label
        >
        <select
          v-model="verse"
          name="verse"
          id="verse"
          :class="
            colors +
            ` ${
              errors.verse
                ? 'border-2 border-red-500 focus:outline-hidden'
                : 'border'
            } rounded p-2 w-full bg-eerie`
          "
        >
          <option value="Verse" disabled hidden>Verse</option>
          <option v-for="num in [...Array(100).keys()]" :value="`${num + 1}`">
            {{ num + 1 }}
          </option>
        </select>
      </div>
      <div class="flex flex-col justify-center w-1/3" v-if="showToVerse">
        <label
          v-if="showSelectTitle"
          for="toVerse"
          :class="labelColor + ' block'"
          >To:</label
        >
        <select
          v-model="toVerse"
          name="toVerse"
          id="toVerse"
          :class="colors + ' rounded p-2 w-full bg-eerie border '"
        >
          <option value="To" disabled hidden>To</option>
          <option value="*">*</option>
          <option value=".">.</option>
          <option
            v-for="num in [...Array(100).keys()].slice(
              parseInt(`${verse}` || '0')
            )"
            :value="num + 1"
          >
            {{ num + 1 }}
          </option>
        </select>
      </div>
    </div>
    <span
      class="text-red-500 block mt-2 text-sm"
      v-if="errors.book || errors.chapter || errors.verse"
      >The following is required: {{ errors.book && "Book" }} -
      {{ errors.chapter && "Chapter" }} - {{ errors.verse && "Verse" }}</span
    >
  </div>
</template>
