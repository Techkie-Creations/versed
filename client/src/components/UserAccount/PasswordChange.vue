<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import VerseSelector from "../VerseSelector.vue";

const currentPassword = ref("");

const { handleSubmit, errors, isSubmitting } = useForm();

const { setValue: setVersion, value: version } = useField("version");
const { setValue: setBook, value: book } = useField("book");
const { setValue: setChapter, value: chapter } = useField("chapter");
const { setValue: setVerse, value: verse } = useField("verse");
const { value: newPassword } = useField("newPassword");
const { value: confirmPassword } = useField("confirmPassword");

onMounted(() => {
  setVersion("NKJV");
  setBook("Select Book");
  setChapter("Chapter");
  setVerse("Verse");
});
</script>

<template>
  <VerseSelector
    title="Favorite Verse"
    v-model:version="version"
    v-model:book="book"
    v-model:chapter="chapter"
    v-model:verse="verse"
    v-model:errors="errors"
    :tip="true"
    :show-version="true"
  />
</template>
