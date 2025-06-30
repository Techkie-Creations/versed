<script setup lang="ts">
import { solidButton } from "@/utils/Types";
import { InputGroupAddon, InputGroup } from "primevue";
import { ref } from "vue";

const socials = ref({
  facebook: "",
  x: "",
  instagram: "",
  web: "",
  linkedin: "",
});

const socialsErr = ref({
  web: "",
  facebook: "",
  x: "",
  instagram: "",
  linkedin: "",
});
const errMsg = {
  facebook: "Invalid Facebook profile URL",
  x: "Must be only username such as: @johndoe or john_doe",
  web: "Invalid site URL",
  linkedin: "Invalid LinkedIn profile URL",
  instagram: "Must be only username such as: @johndoe or john_doe or john.doe",
};

const handleChange = (link: string, re: RegExp) => {
  if (socials.value[link].length >= 1 && !re.test(socials.value[link])) {
    socialsErr.value[link] = errMsg[link];
  } else socialsErr.value[link] = "";
};

const socialLinks = [
  {
    name: "Facebook",
    placeholder: "https://fb.com/username",
    icon: "pi pi-facebook",
    regex:
      /(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/g,
  },
  {
    name: "Instagram",
    placeholder: "@john.doe",
    icon: "pi pi-instagram",
    regex: /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/,
  },
  {
    name: "X",
    placeholder: "@thomas",
    icon: "pi pi-twitter",
    regex: /^(\@)?([a-z0-9_]{1,15})$/i,
  },
  {
    name: "LinkedIn",
    placeholder: "https://fb.com/username",
    icon: "pi pi-linkedin",
    regex: /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/gm,
  },
  {
    name: "Web",
    placeholder: "https://fb.com/username",
    icon: "pi pi-link",
    regex: new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ), // fragment locator,
  },
];
</script>

<template>
  <div v-for="(social, i) in socialLinks" :key="i" class="w-full mt-4">
    <InputGroup>
      <InputGroupAddon
        :class="
          socialsErr[social.name.toLowerCase()]
            ? 'border-2 border-red-500 border-r-0 bg-eerie'
            : 'bg-eerie border-2 border-alice border-r-0'
        "
      >
        <!-- :class="`${
          errors.password
            ? 'border-2 border-red-500 bg-red-500 text-alice'
            : 'text-baseRed'
        }` -->
        <i :class="social.icon" style="font-size: larger; color: aliceblue"></i>
      </InputGroupAddon>
      <input
        v-model="socials[social.name.toLowerCase()]"
        type="text"
        :name="social.name"
        @input="handleChange(social.name.toLowerCase(), social.regex)"
        :class="`${
          socialsErr[social.name.toLowerCase()]
            ? 'border-2 border-red-500 border-l-0'
            : 'border-r-2 border-t-2 border-b-2'
        } rounded-l-none rounded-md p-2 w-full focus:outline-0`"
        :placeholder="social.placeholder"
      />
    </InputGroup>
    <span class="text-red-500 mt-2 block text-sm">{{
      socialsErr[social.name.toLowerCase()]
    }}</span>
  </div>
  <button
    type="button"
    :class="`${
      (socials.facebook.length === 0 &&
        socials.instagram.length === 0 &&
        socials.x.length === 0 &&
        socials.linkedin.length === 0 &&
        socials.web.length === 0) ||
      socialsErr.facebook.length !== 0 ||
      socialsErr.linkedin.length !== 0 ||
      socialsErr.instagram.length !== 0 ||
      socialsErr.x.length !== 0 ||
      socialsErr.web.length !== 0
        ? 'hover:cursor-not-allowed bg-gray-700 border-gray-800'
        : solidButton
    } border-2 p-2 rounded-md w-full mt-2`"
  >
    Add Links
  </button>
</template>
