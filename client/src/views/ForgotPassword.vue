<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { onMounted } from "vue";
import VerseSelector from "@/components/VerseSelector.vue";
import { VueSpinnerBars } from "vue3-spinners";
import { ref } from "vue";
import { ForgotPasswordSchema } from "@/utils/ValidationSchemas";
import { forgotPassword } from "@/api/authApi";
import { useToast } from "vue-toastification";
import PasswordReset from "@/components/PasswordReset.vue";
import NavBar from "@/components/NavBar.vue";

const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: ForgotPasswordSchema,
});
const userEmail = ref("");
const toCode = ref(false);

const toast = useToast();

const { value: email } = useField("email");
const { value: encryptedVerse } = useField("encryptedVerse");
const { setValue: setBook, value: book } = useField("book");
const { setValue: setChapter, value: chapter } = useField("chapter");
const { setValue: setVerse, value: verse } = useField("verse");

onMounted(() => {
  setBook("Select Book");
  setChapter("Chapter");
  setVerse("Verse");
});

const onSubmit = handleSubmit(async (data, action) => {
  const formData = {
    email: data.email,
    encryptedVerse: data.encryptedVerse,
    book: data.book,
    chapter: data.chapter,
    verse: data.verse,
    section: "email",
  };

  if (
    data.book === "Select Book" ||
    data.chapter === "Chapter" ||
    data.verse === "Verse"
  )
    return action.setErrors({
      chapter: chapter.value === "Chapter" ? "Required" : "",
      book: book.value === "Select Book" ? "Required" : "",
      verse: verse.value === "Verse" ? "Required" : "",
    });

  const results = await forgotPassword(formData);
  if (results.success) {
    toCode.value = true;
    userEmail.value = results.email;
    toast.success(results.message);
    return;
  }
  toast.error(results.message);
  return;
});
</script>

<template>
  <NavBar />
  <h1 class="font-caveat text-center text-8xl mt-25">Forgot Password</h1>
  <RouterLink
    to="/auth/login"
    class="border-2 border-alice flex items-center gap-4 justify-center w-1/7 mx-auto mt-5 p-2 rounded-md hover:bg-alice hover:text-eerie"
    ><i class="pi pi-arrow-left"></i>Back To Login
  </RouterLink>
  <form v-if="!toCode" @submit.prevent="onSubmit" class="w-[50vw] mx-auto mt-6">
    <div class="mb-4 w-full">
      <label for="email" class="block mb-2"
        ><i class="pi pi-envelope text-baseRed mr-4"></i> Email
        <span class="text-baseRed">*</span> :</label
      >
      <input
        v-model="email"
        type="email"
        name="email"
        :class="`${
          errors.email
            ? 'border-2 border-red-500 focus:outline-hidden'
            : 'border'
        } rounded p-2 w-full`"
        placeholder="john@doe.com"
      />
      <span class="text-red-500 mt-2 block text-sm">{{ errors.email }}</span>
    </div>
    <div class="mb-4 w-full">
      <label for="email" class="block mb-2"
        ><i class="pi pi-envelope text-baseRed mr-4"></i> Verse Code
        <span class="text-baseRed">*</span> :</label
      >
      <input
        v-model="encryptedVerse"
        type="text"
        name="encryptedVerse"
        :class="`${
          errors.encryptedVerse
            ? 'border-2 border-red-500 focus:outline-hidden'
            : 'border'
        } rounded p-2 w-full`"
        placeholder="07091409190519_1271"
      />
      <span class="text-red-500 mt-2 block text-sm">{{
        errors.encryptedVerse
      }}</span>
    </div>
    <VerseSelector
      title="Corresponding Verse"
      v-model:book="book"
      v-model:chapter="chapter"
      v-model:errors="errors"
      v-model:verse="verse"
    />
    <button
      :disabled="isSubmitting"
      type="submit"
      class="w-full mb-4 rounded p-2 cursor-pointer border flex place-content-center bg-alice text-eerie hover:bg-eerie hover:text-alice"
    >
      <span v-if="isSubmitting" class="flex gap-4 items-center justify-center"
        >Submitting...<VueSpinnerBars size="30" class="text-baseRed"
      /></span>
      <span v-else
        ><i class="pi pi-user-plus text-baseRed mr-4"></i>Forgot Password</span
      >
    </button>
  </form>

  <PasswordReset v-if="toCode" :email="userEmail" />
</template>
