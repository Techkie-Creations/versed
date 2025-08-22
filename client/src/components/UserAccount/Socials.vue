<script setup lang="ts">
import { getUserSocials, updateUserSocials } from "@/api/useraccApi";
import { inputFocus, solidButton } from "@/utils/exports";
import { InputGroupAddon, InputGroup } from "primevue";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";

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

const defaultVals = ref({
  facebook: "",
  x: "",
  instagram: "",
  web: "",
  linkedin: "",
});
const defaults = ref(
  Object.keys(socials.value).filter(
    (val1) => socials.value[val1] === defaultVals.value[val1]
  ).length === 5
);

const toast = useToast();

const errMsg = {
  facebook: "Must be only username such as: @johndoe or @john.doe",
  x: "Must be only username such as: @johndoe or @john_doe12",
  web: "Invalid site URL",
  linkedin: "Invalid LinkedIn profile URL",
  instagram: "Must be only username such as: @johndoe or @john_doe12",
};

onMounted(async () => {
  const results = await getUserSocials();
  if (results.success) {
    if (results.socials) {
      socials.value = {
        linkedin: results.socials.linkedIn || "",
        web: results.socials.web || "",
        instagram: results.socials.instagram || "",
        x: results.socials.x || "",
        facebook: results.socials.facebook || "",
      };
      defaultVals.value = {
        linkedin: results.socials.linkedIn || "",
        web: results.socials.web || "",
        instagram: results.socials.instagram || "",
        x: results.socials.x || "",
        facebook: results.socials.facebook || "",
      };
    }
  }
});

const handleChange = (link: string, re: RegExp) => {
  defaults.value =
    Object.keys(socials.value).filter(
      (val1) => socials.value[val1] === defaultVals.value[val1]
    ).length === 5;
  if (socials.value[link].length >= 1 && !socials.value[link].match(re)) {
    socialsErr.value[link] = errMsg[link];
  } else {
    socialsErr.value[link] = "";
  }
};

const socialLinks = [
  {
    name: "Facebook",
    placeholder: "@janehella",
    icon: "pi pi-facebook",
    regex: /^(\@)([a-z0-9A-Z_.-]{1,15})$/gi,
  },
  {
    name: "Instagram",
    placeholder: "@john.doe",
    icon: "pi pi-instagram",
    regex: /^(\@)[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/gi,
  },
  {
    name: "X",
    placeholder: "@thomas",
    icon: "pi pi-twitter",
    regex: /^(\@)(\w{1,15})$/gi,
  },
  {
    name: "LinkedIn",
    placeholder: "https://za.linkedin.com/in/john-doe",
    icon: "pi pi-linkedin",
    regex:
      /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)\/([a-zA-Z_-]+)/gi,
  },
  {
    name: "Web",
    placeholder: "https://www.mysite.com",
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

const onSubmit = async () => {
  if (
    Object.values(socialsErr.value)
      .filter((val) => val.length >= 1)
      .join("").length >= 1 ||
    Object.values(socials.value).filter((val) => val.length === 0).length ===
      5 ||
    defaults.value
  )
    return;

  const formData = {
    facebook: socials.value.facebook,
    x: socials.value.x,
    linkedIn: socials.value.linkedin,
    web: socials.value.web,
    instagram: socials.value.instagram,
  };
  const results = await updateUserSocials(formData);
  if (results.success) {
    toast.success(results.message);
    defaults.value = true;
    return;
  }
  toast.error(results.message);
  return;
};
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
        } rounded-l-none rounded-md p-2 w-full ${inputFocus}`"
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
      socialsErr.web.length !== 0 ||
      defaults
        ? 'hover:cursor-not-allowed bg-gray-700 border-gray-800'
        : solidButton
    } border-2 p-2 rounded-md w-full mt-2 flex justify-center items-center gap-2`"
    @click="onSubmit"
  >
    <i class="pi pi-link"></i>Add Links
  </button>
</template>
