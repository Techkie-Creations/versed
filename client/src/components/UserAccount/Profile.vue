<script setup lang="ts">
import { onMounted, ref } from "vue";
import Avatar from "../Avatar.vue";
import { defaultAvatar } from "@/utils/FileObject";
import { useField, useForm } from "vee-validate";
import { DatePicker } from "primevue";
import countries from "@/assets/countries.json";
import { changeInfo } from "@/utils/ValidationSchemas";
import { VueSpinnerBars } from "vue3-spinners";

const file = ref(defaultAvatar);
const bio = ref("");

const maxDate = ref(new Date());
maxDate.value.setFullYear(new Date().getFullYear() - 10);

const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: changeInfo,
});

const { value: firstName } = useField("firstName");
const { value: lastName } = useField("lastName");
const { value: email } = useField("email");
const { value: dob } = useField<Date>("dob");
const { setValue: setCountry, value: country } = useField("country");

onMounted(() => {
  setCountry("Select Country");
});

const onSubmit = handleSubmit((data) => {
  console.log(data);
});
</script>

<template>
  <form @submit.prevent="onSubmit" class="mt-4 w-full">
    <div class="my-4">
      <label for="email" class="mb-2 flex justify-between"
        ><span><i class="pi pi-info-circle text-baseRed mr-4"></i> Bio :</span>
        <p class="italic text-gray-600 text-sm">
          Count: {{ bio.length }} / 300
        </p></label
      >
      <textarea
        v-model="bio"
        name="bio"
        maxlength="300"
        class="border-2 w-full rounded-md resize-none h-30"
        minlength="30"
      ></textarea>
    </div>
    <Avatar v-model:file="file" text="Change Avatar" :size="3" />
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
          class="rounded p-2 border w-full bg-eerie"
        >
          <option value="Select Country" disabled hidden>Select Country</option>
          <option v-for="(count, i) in countries" :value="count.name" :key="i">
            {{ count.name }}
          </option>
        </select>
      </div>
    </div>

    <button
      :disabled="isSubmitting"
      type="submit"
      class="w-full mb-4 rounded p-2 cursor-pointer border flex place-content-center bg-alice text-eerie hover:bg-eerie hover:text-alice"
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
