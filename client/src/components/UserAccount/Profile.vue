<script setup lang="ts">
import { onMounted, ref } from "vue";
import Avatar from "../Avatar.vue";
import { defaultAvatar, fileObject } from "@/utils/FileObject";
import { useField, useForm } from "vee-validate";
import { DatePicker } from "primevue";
import countries from "@/assets/countries.json";
import { changeInfo } from "@/utils/ValidationSchemas";
import { VueSpinnerBars } from "vue3-spinners";
import { getUserProfile, updateUserProfile } from "@/api/api";
import { imageObject } from "@/utils/Types";
import { solidButton } from "@/utils/exports";
import { useToast } from "vue-toastification";

const file = ref(defaultAvatar);
const bio = ref({
  bio: "",
  defaultBio: "",
  bioError: "",
});

const defaultData = ref({
  firstName: "",
  lastName: "",
  email: "",
  avatar: "",
  country: "",
  dob: "",
});

const toast = useToast();

const maxDate = ref(new Date());
maxDate.value.setFullYear(new Date().getFullYear() - 10);

const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: changeInfo,
});

const { setValue: setFirstName, value: firstName } = useField("firstName");
const { setValue: setLastName, value: lastName } = useField("lastName");
const { setValue: setEmail, value: email } = useField("email");
const { setValue: setDob, value: dob } = useField<Date>("dob");
const { setValue: setCountry, value: country } = useField("country");

onMounted(async () => {
  const results = await getUserProfile();
  if (results.success) {
    bio.value.bio = results.profile.bio || "";
    bio.value.defaultBio = results.profile.bio;
    setFirstName(results.profile.firstName);
    setLastName(results.profile.lastName);
    setEmail(results.profile.email);
    setCountry(results.profile.country || "Select Country");
    file.value = results.profile.avatar;
    if (results.profile.dob) setDob(new Date(results.profile.dob));
    defaultData.value = {
      firstName: results.profile.firstName,
      lastName: results.profile.lastName,
      dob: results.profile.dob,
      email: results.profile.email,
      country: results.profile.country,
      avatar: results.profile.avatar,
    };
  }
});

const bioChange = () => {
  if (bio.value.bio.length < 10) {
    bio.value.bioError = "Bio must be at least 10 characters";
  } else bio.value.bioError = "";
};

const bioSubmit = async () => {
  if (bio.value.bio === bio.value.defaultBio) return;
  if (bio.value.bioError) return;
  const formData = { schema: "bio", bio: bio.value.bio };
  const results = await updateUserProfile(formData, "bio");
  results.success
    ? toast.success(results.message)
    : toast.error(results.message);
  return;
};

const onSubmit = handleSubmit(async (data, actions) => {
  if (data.country === "Select Country")
    return actions.setFieldError("country", "Select a country");

  if (
    defaultData.value.avatar === file.value &&
    firstName.value === defaultData.value.firstName &&
    lastName.value === defaultData.value.lastName &&
    dob.value.toLocaleDateString() === defaultData.value.dob &&
    email.value === defaultData.value.email &&
    country.value === defaultData.value.country
  )
    return;

  const formData = new FormData();

  const fileReturn = await fileObject(imageObject[0]);
  formData.append("avatar", fileReturn[0]);
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("email", data.email);
  formData.append("dob", data.dob.toLocaleDateString());
  formData.append("country", data.country);
  formData.append("schema", "personal");
  formData.append(
    "defaultAvatar",
    file.value === defaultData.value.avatar ? "true" : "false"
  );
  formData.append("avatarUrl", file.value);
  const results = await updateUserProfile(formData, "personal");
  if (!results.success) {
    toast.error(results.message);
    if (results.field) actions.setFieldError("email", results.message);
    return;
  }
  toast.success(results.message);
  return;
});

// Pa$$w0rd!
</script>

<template>
  <form @submit.prevent="onSubmit" class="mt-4 w-full">
    <div class="my-4">
      <label for="email" class="mb-2 flex justify-between"
        ><span><i class="pi pi-info-circle text-baseRed mr-4"></i> Bio :</span>
        <p class="italic text-gray-600 text-sm">
          Count: {{ bio.bio.length }} / 500
        </p></label
      >
      <textarea
        v-model="bio.bio"
        @input="bioChange"
        name="bio"
        maxlength="500"
        :class="`${
          bio.bioError ? 'border-red-500 focus:outline-hidden' : 'border-alice'
        } border-2 w-full rounded-md resize-none h-30 p-2`"
      ></textarea>
      <span class="text-red-500 my-2 block text-sm">{{ bio.bioError }}</span>
      <button
        type="button"
        :class="`${solidButton} flex items-center gap-2 justify-center`"
        @click="bioSubmit"
      >
        <i class="pi pi-info-circle text-baseRed"></i>Change Bio
      </button>
    </div>
    <Avatar v-model:file="file" text="Change Avatar" :size="4" :avatar="file" />
    <div class="flex justify-between mb-4 gap-2">
      <div class="w-full">
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
      <div class="second w-full">
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

    <div class="flex-auto mb-4">
      <label for="dob" class="block mb-2"
        ><i class="pi pi-calendar text-baseRed mr-4"></i> Birth Date
        <span class="text-baseRed">*</span> :</label
      >
      <DatePicker
        v-model="dob"
        showIcon
        fluid
        :manual-input="false"
        iconDisplay="input"
        :class="`${
          errors.dob ? 'border-2 border-red-500 focus:outline-hidden' : 'border'
        } border rounded-md p-2`"
        :max-date="maxDate"
        placeholder="02/12/2002"
      />
      <span class="text-red-500 mt-2 block text-sm">{{ errors.dob }}</span>
    </div>

    <div class="mb-4 w-full">
      <label for="country" class="block mb-2"
        ><i class="pi pi-globe text-baseRed mr-4"></i> Country :</label
      >
      <div class="flex items-center gap-2 w-full">
        <img
          :src="
            countries.find((o) => o.name === country)?.flag ||
            'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWFydGh8ZW58MHx8MHx8fDA%3D'
          "
          alt="flag of country"
          class="w-[4rem] h-auto rounded-md border"
        />
        <select
          v-model="country"
          name="country"
          id="country"
          :class="`${
            errors.country ? 'border-2 border-red-500' : 'border'
          } border rounded-md p-2 bg-eerie w-full`"
        >
          <option value="Select Country" disabled hidden>Select Country</option>
          <option v-for="(count, i) in countries" :value="count.name" :key="i">
            {{ count.name }}
          </option>
        </select>
      </div>
      <span class="text-red-500 mt-2 block text-sm">{{ errors.country }}</span>
    </div>

    <button
      :disabled="isSubmitting"
      type="submit"
      :class="`${solidButton} flex place-content-center`"
    >
      <span v-if="isSubmitting" class="flex gap-4 items-center justify-center"
        >Updating...<VueSpinnerBars size="30" class="text-baseRed"
      /></span>
      <span v-else
        ><i class="pi pi-user-edit text-baseRed mr-4"></i>Update Info</span
      >
    </button>
  </form>
</template>
