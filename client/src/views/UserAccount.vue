<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import Profile from "@/components/UserAccount/Profile.vue";
import { useField } from "vee-validate";
import { onMounted, ref } from "vue";
import VerseSelector from "@/components/VerseSelector.vue";
import PasswordReset from "@/components/PasswordReset.vue";
import { InputGroup, InputGroupAddon, Button } from "primevue";
import Socials from "@/components/UserAccount/Socials.vue";
import { solidButton } from "@/utils/Types";

const currentPassword = ref("");
const viewPwd = ref(false);
const errVerse = ref({
  book: "",
  chapter: "",
  verse: "",
  currentPassword: "",
});
const pwdReset = ref(false);
const userEmail = ref("");

const { setValue: setVersion, value: version } = useField("version");
const { setValue: setBook, value: book } = useField("book");
const { setValue: setChapter, value: chapter } = useField("chapter");
const { setValue: setVerse, value: verse } = useField("verse");

// const noErrs = {
//   social:

// };

onMounted(() => {
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
      <div class="mb-4 w-full">
        <label for="email" class="block mb-2"
          ><i class="pi pi-envelope text-baseRed mr-4"></i> Current Password
          <span class="text-baseRed">*</span> :</label
        >
        <InputGroup>
          <input
            v-model="currentPassword"
            :type="viewPwd ? 'text' : 'password'"
            name="password"
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
          } border-2 p-2 rounded-md w-full mt-2`"
        >
          Change Password
        </button>
      </div>
      <PasswordReset v-if="pwdReset" :email="userEmail" schema="change" />
      <p class="text-gray-600">
        Your Favorite Verse is used to reset your password when you forgot your
        password during login.
      </p>
      <p class="text-baseRed">
        NOTE: You will not be able to change your favorite verse for 1 month!
      </p>
      <div>
        <VerseSelector
          title="Favorite Verse"
          v-model:version="version"
          v-model:book="book"
          v-model:chapter="chapter"
          v-model:verse="verse"
          v-model:errors="errVerse"
          :tip="true"
          :show-version="true"
        />
        <button type="button" :class="solidButton">
          Change Favorite Verse
        </button>
      </div>
    </section>
    <section id="delete" class="w-1/2">
      <p class="border-t-2 border-b-2 mt-10 text-center text-[1.2rem]">
        Delete Account
      </p>
      <div class="bg-baseRed rounded-md mt-4">
        <p class="text-black font-bold text-center py-4">
          <i class="pi pi-exclamation-triangle" style="font-size: 6rem"></i>
          <span class="font-bolder block">NOTE:</span>
          Once confirmed, your account will be deleted forever.
        </p>
        <button
          type="button"
          class="w-1/2 border-2 mx-auto rounded-md hover:bg-alice hover:text-baseRed font-bold hover:cursor-pointer flex justify-center items-center gap-4"
        >
          <i class="pi pi-user-minus"></i> DELETE ACCOUNT
        </button>
      </div>
    </section>
  </div>
</template>
