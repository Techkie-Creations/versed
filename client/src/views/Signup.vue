<script lang="ts" setup>
import { useField, useForm } from "vee-validate";
import { imageObject, defaultFileObj } from "@/utils/Types";
import { fileObject, defaultAvatar, tooltipTheme } from "@/utils/FileObject";
import { onMounted, ref } from "vue";
import { registerUser } from "@/api/api";
import { VueSpinnerBars } from "vue3-spinners";
import { Button } from "primevue";
import { useToast } from "vue-toastification";
import { RegistrationSchema } from "@/utils/ValidationSchemas";
import VerseSelector from "@/components/VerseSelector.vue";
import PasswordConfirmation from "@/components/PasswordConfirmation.vue";
import router from "@/router";
import NavBar from "@/components/NavBar.vue";

const file = ref(defaultAvatar);

const { handleSubmit, errors, isSubmitting, setFieldError } = useForm({
  validationSchema: RegistrationSchema,
});

const toast = useToast();

const { value: firstName } = useField("firstName");
const { value: lastName } = useField("lastName");
const { value: email } = useField("email");
const { value: password } = useField("password");
const { value: confirmPassword } = useField("confirmPassword");
const { setValue: setVersion, value: version } = useField("version");
const { setValue: setBook, value: book } = useField("book");
const { setValue: setChapter, value: chapter } = useField("chapter");
const { setValue: setVerse, value: verse } = useField("verse");
const { setValue: setAvatar } = useField("avatar");

onMounted(() => {
  const setFile = async () => {
    setVersion("NKJV");
    setBook("Select Book");
    setChapter("Chapter");
    setVerse("Verse");
    setAvatar(await fileObject(imageObject[0]));
    const image = document.getElementById("file");
    if (image instanceof HTMLInputElement) {
      image.files = await fileObject(imageObject[0], false);
    }
  };
  setFile();
});

const handleFileChange = async (e) => {
  if (e.target.files?.length !== 0) {
    const image = e.target.files ? e.target.files[0] : new Blob();
    const imageUrl = URL.createObjectURL(image);
    file.value = imageUrl;

    const { name, type } =
      image instanceof File ? image : { name: "", type: "" };

    imageObject[0] = {
      fileUrl: imageUrl,
      fileName: name,
      fileType: type,
    };
  } else {
    const { fileUrl, fileName, fileType } =
      imageObject.length > 0 ? imageObject[0] : defaultFileObj;
    const file = document.getElementById("file");

    if (fileUrl && fileName) {
      if (file instanceof HTMLInputElement) {
        file.files = await fileObject({ fileUrl, fileName, fileType }, false);
        console.log(
          "OBJ",
          await fileObject({ fileUrl, fileName, fileType }, false)
        );
      }
    }
  }
};

const handleRemoval = async () => {
  const files = document.getElementById("file");
  if (files instanceof HTMLInputElement) {
    files.value = "";
    file.value = defaultAvatar;
    const { fileUrl, fileName, fileType } = imageObject[0];
    URL.revokeObjectURL(fileUrl);
    await fileObject({ fileUrl, fileName, fileType }, true);
    imageObject.pop();
    files.files = await fileObject(defaultFileObj, false);
  }
};

const onSubmit = handleSubmit(async (data, action) => {
  const formData = new FormData();

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

  console.log(data);

  const fileReturn = await fileObject(imageObject[0]);
  console.log("FILE RETURN", fileReturn[0]);

  console.log(data.avatar[0], "NEW");

  formData.append(
    "avatar",
    data.avatar.length !== 0 ? fileReturn[0] : data.avatar[0]
  );
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("version", data.version);
  formData.append("book", data.book);
  formData.append("chapter", data.chapter);
  formData.append("verse", data.verse);
  formData.append(
    "defaultAvatar",
    file.value !== defaultAvatar ? "false" : "true"
  );

  const results = await registerUser(formData);
  if (!results.success) {
    toast.error(`${results.message}`);
    if (results.level === "email")
      return setFieldError("email", "Email Already Exists!");
  } else if (results.success) {
    toast.success(`${results.message}`);
    setTimeout(() => {
      router.push("/");
    }, 500);
    return;
  }
});
</script>

<template>
  <NavBar />
  <h1 class="font-caveat text-center text-8xl mt-25">Sign Up</h1>
  <form @submit.prevent="onSubmit" class="w-[50vw] mx-auto mt-16">
    <div class="flex justify-between mb-4 gap-2">
      <div class="w-1/2">
        <label for="firstName" class="block mb-2"
          ><i class="pi pi-user text-baseRed mr-4"></i> First Name
          <span class="text-baseRed">*</span> :</label
        >
        <input
          v-model="firstName"
          :class="`${
            errors.firstName
              ? 'border-2 border-red-500 focus:outline-hidden'
              : 'border'
          } rounded p-2 w-full`"
          type="text"
          name="firstName"
          placeholder="John"
        />
        <span class="text-red-500 mt-2 block text-sm">{{
          errors.firstName
        }}</span>
      </div>
      <div class="second w-1/2">
        <label for="lastName" class="block mb-2"
          ><i class="pi pi-user text-baseRed mr-4"></i> Last Name
          <span class="text-baseRed">*</span> :</label
        >
        <input
          v-model="lastName"
          :class="`${
            errors.lastName
              ? 'border-2 border-red-500 focus:outline-hidden'
              : 'border'
          } rounded p-2 w-full`"
          type="text"
          name="lastName"
          placeholder="Doe"
        />
        <span class="text-red-500 mt-2 block text-sm">{{
          errors.lastName
        }}</span>
      </div>
    </div>
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

    <PasswordConfirmation
      v-model:confirm-password="confirmPassword"
      v-model:password="password"
      v-model:errors="errors"
    />

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
    <div class="mb-6 w-full">
      <label class="block mb-2 dark:text-white" for="avatar"
        ><i class="pi pi-user text-baseRed mr-4 mb-2"></i> Upload file</label
      >
      <div class="flex justify-between items-center gap-2">
        <img
          :src="file"
          alt="avatar"
          class="w-[5.5em] h-[5rem] rounded-[50%] object-fill object-center"
        />
        <input
          @change="handleFileChange($event)"
          class="border rounded w-full p-2 text-alice file:mr-5 file:py-1 file:px-3 file:border-[1px] file:rounded file:bg-eerie file:text-alice hover:file:cursor-pointer hover:file:bg-alice hover:file:text-eerie transition duration-500 ease-in-out"
          aria-describedby="image"
          name="avatar"
          type="file"
          ref="fileInput"
          accept="image/png, image/jpeg"
          id="file"
        />
        <Button
          v-if="file !== defaultAvatar"
          icon="pi pi-times"
          v-tooltip.top="{
            value: 'Remove image',
            ...tooltipTheme,
          }"
          class="border p-2 rounded hover:bg-alice hover:text-eerie"
          @click="handleRemoval"
        />
      </div>
      <p class="mt-1 dark:text-gray-300">PNG, JPG (MAX. 800x400px).</p>
    </div>
    <button
      :disabled="isSubmitting"
      type="submit"
      class="w-full mb-4 rounded p-2 cursor-pointer border flex place-content-center bg-alice text-eerie hover:bg-eerie hover:text-alice"
    >
      <span v-if="isSubmitting" class="flex gap-4 items-center justify-center"
        >Submitting...<VueSpinnerBars size="30" class="text-baseRed"
      /></span>
      <span v-else
        ><i class="pi pi-user-plus text-baseRed mr-4"></i>Sign Up</span
      >
    </button>
  </form>
  <hr class="bg-alice mt-4 w-2/4 m-auto" />
  <p class="text-center my-4">
    Already Have An Account?
    <RouterLink
      to="/auth/login"
      class="text-baseRed hover:text-alice hover:underline"
      >Log In</RouterLink
    >
  </p>
</template>
