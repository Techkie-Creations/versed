<script lang="ts" setup>
import { useField, useForm } from "vee-validate";
import validationSchema from "@/utils/RegisterSchema";
import { imageObject, allBooks } from "@/utils/Types";
import { fileObject, defaultAvatar } from "@/utils/FileObject";
import { onMounted, ref } from "vue";
import { registerUser } from "@/api/api";
import { VueSpinnerBars } from "vue3-spinners";

const file = ref(defaultAvatar);

const { handleSubmit, errors,  isSubmitting } = useForm({
  validationSchema
});

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
    const { fileUrl, fileName, fileType } = imageObject[0];
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

const onSubmit = handleSubmit(async (data) => {
  const formData = new FormData()

  console.log(data)

  const fileReturn = await fileObject(imageObject[0])
  console.log('FILE RETURN', fileReturn[0])

  formData.append('avatar', data.avatar.length === 0 ? fileReturn[0] : data.avatar[0])
  formData.append('firstName', data.firstName)
  formData.append('lastName', data.lastName)
  formData.append('email', data.email)
  formData.append('password', data.password)
  formData.append('version', data.version)
  formData.append('book', data.book)
  formData.append('chapter', data.chapter)
  formData.append('verse', data.verse)
  formData.append('defaultAvatar', file.value !== defaultAvatar ? 'false' : 'true')

  const results = await registerUser(formData)
  console.log(results)
})

</script>

<template>
  <h1 class="font-caveat text-center text-8xl mt-25">Sign Up</h1>
  <form @submit.prevent="onSubmit" class="w-[50vw] mx-auto mt-16">
    <div class="flex justify-between mb-4 gap-2">
      <div class="first w-1/2">
        <label for="first name" class="block mb-2"><i class="pi pi-user text-baseRed mr-4"></i> First Name <span class="text-baseRed">*</span> :</label>
        <input
          v-model="firstName"
          class="border rounded p-2 w-full"
          type="text"
          name="firstName"
          placeholder="John"
        />
        <span class="text-baseRed mt-2 block text-sm">{{ errors.firstName }}</span>
      </div>
      <div class="second w-1/2">
        <label for="lst name" class="block mb-2"><i class="pi pi-user text-baseRed mr-4"></i> Last Name <span class="text-baseRed">*</span> :</label>
        <input
          v-model="lastName"
          class="border rounded p-2 w-full"
          type="text"
          name="lastName"
          placeholder="Doe"
        />
        <span class="text-baseRed mt-2 block text-sm">{{ errors.lastName }}</span>
      </div>
    </div>
    <div class="mb-4 w-full">
      <label for="email" class="block mb-2"><i class="pi pi-envelope text-baseRed mr-4"></i> Email <span class="text-baseRed">*</span> :</label>
      <input
        v-model="email"
        type="email"
        name="email"
        class="border rounded p-2 w-full"
        placeholder="john@doe.com"
      />
        <span class="text-baseRed mt-2 block text-sm">{{ errors.email }}</span>
    </div>
    <div class="mb-4 w-full">
      <label for="password" class="block mb-2"><i class="pi pi-lock text-baseRed mr-4"></i> Password <span class="text-baseRed">*</span> :</label>
      <input
        v-model="password"
        type="password"
        name="password"
        class="border rounded p-2 w-full"
        placeholder="**********"
      />
        <span class="text-baseRed mt-2 block text-sm">{{ errors.password }}</span>
    </div>
    <div class="mb-4 w-full">
      <label for="confirm password" class="block mb-2"
        ><i class="pi pi-lock text-baseRed mr-4"></i> Confirm Password <span class="text-baseRed">*</span> :</label
      >
      <input
        v-model="confirmPassword"
        type="password"
        name="confirmPassword"
        class="border rounded p-2 w-full"
        placeholder="**********"
      />
        <span class="text-baseRed mt-2 block text-sm">{{ errors.confirmPassword }}</span>
    </div>
    <div class="mb-4 w-full">
      <div class="w-full flex justify-between items-center">
        <label for="bible verse" class="block mb-2"
          ><i class="pi pi-book text-baseRed mr-4"></i> Favorite Bible Verse <span class="text-baseRed">*</span> :</label
        >
        <div class="relative group">
            <i class="pi pi-question text-1xl p-1 border hover:cursor-pointer rounded-full hover:bg-alice hover:text-eerie"></i>
            <div
                class="absolute bottom-full left-1/2 
                       transform -translate-x-1/2 mb-2 
                       w-max px-2 py-1 text-sm text-white
                       bg-baseRed rounded shadow-lg 
                       opacity-0 group-hover:opacity-100">
                       Will Be Used To Reset Your Password
            </div>
        </div>
      </div>
      <div class="flex justify-between items-center gap-2">
        <select
          v-model="version"
          name="version"
          id="version"
          class="rounded p-2 border w-2/4 bg-eerie"
        >
          <option value="NKJV">NKJV</option>
          <option value="AMP">AMP</option>
        </select>
        <select
          v-model="book"
          name="book"
          id="book"
          class="rounded p-2 border w-3/4 bg-eerie"
        >
          <option value="Select Book" disabled hidden>
            Select Book
          </option>
          <option v-for="book in allBooks" :value="book">
            {{ book }}
          </option>
        </select>
        <select
          v-model="chapter"
          name="chapter"
          id="chapter"
          class="rounded p-2 border w-1/3 bg-eerie"
        >
          <option value="Chapter" disabled hidden>Chapter</option>
          <option value="1">1</option>
        </select>
        
          <select
          v-model="verse"
          name="verse"
          id="verse"
          class="rounded p-2 border w-1/3 bg-eerie"
        >
          <option value="Verse" disabled hidden>Verse</option>
          <option value="1">1</option>
        </select>
      </div>
      <span class="text-baseRed block mt-2 text-sm" v-if="errors.book || errors.chapter || errors.verse">The following is required: {{ errors.book && 'Book' }} - {{ errors.chapter && 'Chapter' }} - {{ errors.verse && 'Verse' }}</span>
    </div>
    <div class="mb-6 w-full">
      <label class="block mb-2 dark:text-white" for="avatar"><i class="pi pi-user text-baseRed mr-4"></i> Upload file</label>
      <div class="flex justify-between items-center gap-2">
        <img
          :src="file"
          alt="avatar"
          class="w-[4rem] h-[4rem] rounded-[50%] object-fill object-center"
        />
        <input
          @change="handleFileChange($event)"
          class="border rounded w-full p-2 text-alice file:mr-5 file:py-1 file:px-3 file:border-[1px] file:rounded file:bg-eerie file:text-alice hover:file:cursor-pointer hover:file:bg-alice hover:file:text-eerie transition duration-500 ease-in-out"
          aria-describedby="file_input_help"
          name="avatar"
          type="file"
          ref="fileInput"
          accept="image/png, image/jpeg"
          id="file"
        />
      </div>
      <p class="mt-1 dark:text-gray-300" id="file_input_help">
        SVG, PNG, JPG (MAX. 800x400px).
      </p>
    </div>
    <button
    :disabled="isSubmitting"
      type="submit"
      class="w-full mb-4 rounded p-2 cursor-pointer border flex place-content-center bg-alice text-eerie hover:bg-eerie hover:text-alice"
    >
      <span v-if="isSubmitting" class="flex gap-4 items-center justify-center">Submitting...<VueSpinnerBars size="30" class="text-baseRed" /></span>
      <span v-else><i class="pi pi-user-plus text-baseRed mr-4"></i>Sign Up</span>
    </button>
  </form>
  <hr class="bg-alice mt-4 w-2/4 m-auto" />
  <p class="text-center my-4">Already Have An Account? <RouterLink to="/auth/login" class="text-baseRed hover:text-alice hover:underline">Log In</RouterLink></p>
</template>
