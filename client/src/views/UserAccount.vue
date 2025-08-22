<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import Profile from "@/components/UserAccount/Profile.vue";
import { useField } from "vee-validate";
import { onMounted, ref } from "vue";
import VerseSelector from "@/components/VerseSelector.vue";
import PasswordReset from "@/components/PasswordReset.vue";
import { InputGroup, InputGroupAddon, Button } from "primevue";
import Socials from "@/components/UserAccount/Socials.vue";
import { solidButton } from "@/utils/exports";
import {
  changePassword,
  deleteUserAccount,
  getSecVerse,
  updateSecVerse,
} from "@/api/api";
import { useToast } from "vue-toastification";
import Dialog from "primevue/dialog";
import router from "@/router";

const currentPassword = ref("");
const viewPwd = ref(false);
const errVerse = ref({
  book: "",
  chapter: "",
  verse: "",
  currentPassword: "",
  rootPass: "",
  rootVerse: "",
});
const pwdReset = ref(false);
const showModal = ref(false);
const isLoading = ref(false);

const toast = useToast();

const { setValue: setVersion, value: version } = useField<string>("version");
const { setValue: setBook, value: book } = useField<string>("book");
const { setValue: setChapter, value: chapter } = useField<string>("chapter");
const { setValue: setVerse, value: verse } = useField<string>("verse");

const defaultVals = ref({ version: "", book: "", chapter: "", verse: "" });
const defaults = ref();
const confirmDelete = ref("");

onMounted(async () => {
  const results = await getSecVerse();
  if (results.success) {
    setVersion(results.verse.version);
    setBook(results.verse.book);
    setChapter(results.verse.chapter);
    setVerse(results.verse.verse);
    defaultVals.value = {
      version: results.verse.version,
      chapter: results.verse.chapter,
      book: results.verse.book,
      verse: results.verse.verse,
    };
    defaults.value =
      version.value === defaultVals.value.version &&
      book.value === defaultVals.value.book &&
      chapter.value === defaultVals.value.chapter &&
      verse.value === defaultVals.value.verse;
    return;
  }
  setVersion("NKJV");
  setBook("Select Book");
  setChapter("Chapter");
  setVerse("Verse");
});

const links = [
  {
    name: "Personal Info",
    link: "#personal",
  },
  {
    name: "Social Links",
    link: "#socials",
  },
  {
    name: "Security",
    link: "#security",
  },
  {
    name: "Delete Account",
    link: "#delete",
  },
];

const submitCurrentPwd = async () => {
  if (
    errVerse.value.currentPassword.length > 0 ||
    currentPassword.value.length === 0
  )
    return;
  const formData = {
    section: "check",
    password: currentPassword.value,
  };
  const results = await changePassword(formData);
  if (results.success) {
    toast.success(results.message);
    currentPassword.value = "";
    pwdReset.value = true;
    return;
  }
  if (results.field) errVerse.value.currentPassword = results.message;
  if (results.root) {
    errVerse.value.rootPass = results.message;
    currentPassword.value = "";
  }
  return;
};

const submitVerseChange = async () => {
  defaults.value =
    version.value === defaultVals.value.version &&
    book.value === defaultVals.value.book &&
    chapter.value === defaultVals.value.chapter &&
    verse.value === defaultVals.value.verse;
  if (defaults.value) return;
  const formData = {
    verse: verse.value,
    version: version.value,
    chapter: chapter.value,
    book: book.value,
  };
  const results = await updateSecVerse(formData);
  if (results.success) {
    defaultVals.value = {
      version: version.value,
      book: book.value,
      chapter: chapter.value,
      verse: verse.value,
    };
    toast.success(results.message);
    return;
  }
  if (results.root) errVerse.value.rootVerse = results.message;
  return;
};

const deleteAccount = async () => {
  if (confirmDelete.value !== "delete-my-account") return;
  isLoading.value = true;
  const results = await deleteUserAccount();
  if (results.success) {
    toast.success(results.message);
    setTimeout(() => {
      router.replace("/auth/login");
    }, 500);
  } else toast.error(results.message);
  isLoading.value = false;
  showModal.value = false;
  confirmDelete.value = "";
  return;
};
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <NavBar />
    <h1 class="font-caveat text-center text-6xl mt-25">User Account</h1>
    <p class="font-light text-center">Manage your account info</p>
    <nav class="w-full mt-10 bg-alice text-eerie sticky top-20 z-10">
      <ul class="flex w-1/2 justify-between m-auto">
        <li v-for="(link, i) in links" :key="i">
          <a
            :href="link.link"
            class="hover:bg-eerie hover:text-alice p-2 block"
            >{{ link.name }}</a
          >
        </li>
      </ul>
    </nav>
    <section id="personal" class="w-1/2 mt-10">
      <p class="border-t-2 border-b-2 text-center text-[1.2rem]">
        Personal Info
      </p>

      <Profile class="w-full" />
    </section>
    <section id="socials" class="w-1/2">
      <p class="border-t-2 border-b-2 mt-10 text-center text-[1.2rem]">
        Social Links
      </p>
      <p class="text-gray-600 mt-4 text-center">
        Add your social links so people can connect and link with you!
      </p>
      <Socials />
    </section>
    <section id="security" class="w-1/2 flex flex-col gap-4">
      <p class="border-t-2 border-b-2 mt-10 text-center text-[1.2rem]">
        Security
      </p>
      <p class="text-gray-600">
        To change password, enter current password, you will be sent an email
        with OTP when entered, you can then change your password.
      </p>
      <p class="text-baseRed">
        NOTE: Once you change your password, you won't be able to change it for
        the next 7 days, therefore try your best to remember it.
      </p>
      <span class="text-red-500 mt-2 block text-xl text-center">{{
        errVerse.rootPass
      }}</span>
      <div class="mb-4 w-full" v-if="!pwdReset">
        <label for="email" class="block mb-2"
          ><i class="pi pi-lock text-baseRed mr-4"></i> Current Password
          <span class="text-baseRed">*</span> :</label
        >
        <InputGroup>
          <input
            v-model="currentPassword"
            :type="viewPwd ? 'text' : 'password'"
            name="password"
            @input="errVerse.currentPassword = ''"
            :class="`${
              errVerse.currentPassword
                ? 'border-2 border-red-500 focus:outline-hidden'
                : 'border'
            } rounded-l p-2 w-full`"
            placeholder="**********"
          />
          <InputGroupAddon
            :class="`${
              errVerse.currentPassword
                ? 'border-2 border-red-500 bg-red-500 text-alice'
                : 'text-baseRed'
            }`"
          >
            <Button
              class="text-baseRed active:scale-y-75"
              :icon="`pi pi-${viewPwd ? 'eye-slash' : 'eye'}`"
              variant="text"
              @click="viewPwd = !viewPwd"
            />
          </InputGroupAddon>
        </InputGroup>
        <span class="text-red-500 mt-2 block text-sm">{{
          errVerse.currentPassword
        }}</span>
        <button
          type="button"
          :class="`${
            currentPassword.length < 8
              ? 'hover:cursor-not-allowed bg-gray-700 border-gray-800'
              : solidButton
          } border-2 p-2 rounded-md w-full mt-2 flex gap-2 items-center justify-center`"
          @click="submitCurrentPwd"
        >
          <i class="pi pi-lock"></i> Change Password
        </button>
      </div>
      <PasswordReset
        v-if="pwdReset"
        schema="change"
        :code-send="false"
        @pwd-reset="(v) => (pwdReset = v)"
      />
      <p class="text-gray-600">
        Your Favorite Verse is used to reset your password when you forgot your
        password during login.
      </p>
      <p class="text-baseRed">
        NOTE: You will not be able to change your favorite verse for 1 month!
      </p>
      <span class="text-red-500 mt-2 block text-xl text-center">{{
        errVerse.rootVerse
      }}</span>
      <div class="mt-2">
        <VerseSelector
          title="Security Verse"
          v-model:version="version"
          v-model:book="book"
          v-model:chapter="chapter"
          v-model:verse="verse"
          v-model:errors="errVerse"
          :tip="true"
          :show-version="true"
        />
        <button
          type="button"
          :class="solidButton + ' flex justify-center items-center gap-2'"
          @click="submitVerseChange"
        >
          <i class="pi pi-key text-baseRed"></i>Change Security Verse
        </button>
      </div>
    </section>
    <section id="delete" class="w-1/2 mb-10">
      <p class="border-t-2 border-b-2 mt-10 text-center text-[1.2rem]">
        Delete Account
      </p>
      <div class="bg-baseRed rounded-md mt-4 py-4">
        <p class="text-black font-bold text-center py-4">
          <i class="pi pi-exclamation-triangle" style="font-size: 6rem"></i>
          <span class="font-bolder block">NOTE:</span>
          Once confirmed, your account will be deleted permanently.
        </p>
        <button
          type="button"
          class="w-1/2 border-2 p-2 mx-auto rounded-md hover:bg-alice hover:text-baseRed font-bold hover:cursor-pointer flex justify-center items-center gap-4"
          @click="showModal = true"
        >
          <i class="pi pi-user-minus"></i> DELETE ACCOUNT
        </button>
      </div>
      <Dialog
        v-model:visible="showModal"
        modal
        header="Delete Account"
        class="w-[25rem] p-4 border-2"
      >
        <div class="w-full flex flex-col gap-2 mt-10">
          <div class="mb-4 w-full">
            <label for="delete" class="block mb-2"
              ><i class="pi pi-user-minus text-baseRed mr-4"></i> Type "<i
                class="text-baseRed"
                >delete-my-account</i
              >"
            </label>
            <input
              v-model="confirmDelete"
              type="text"
              name="delete"
              class="border rounded p-2 w-full"
              autocomplete="off"
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="border-2 border-eerie rounded-md p-2 hover:cursor-pointer hover:bg-eerie hover:text-alice"
              @click="showModal = false"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="deleteAccount"
              :class="`${
                confirmDelete === 'delete-my-account'
                  ? 'hover:cursor-pointer bg-eerie border-2 hover:bg-baseRed hover:text-alice text-alice'
                  : 'bg-gray-600 text-alice hover:cursor-not-allowed'
              } border-2 p-2 rounded-md`"
            >
              <span
                class="flex justify-center gap-2 items-center"
                v-if="!isLoading"
                ><i class="pi pi-trash"></i>Delete</span
              >
              <span
                class="flex justify-center gap-2 items-center"
                v-if="isLoading"
                ><i class="pi pi-spin pi-spinner"></i>Deleting...</span
              >
            </button>
          </div>
        </div>
      </Dialog>
    </section>
  </div>
</template>
