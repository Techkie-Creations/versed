<script setup lang="ts">
import { ref } from "vue";
import { InputGroup, InputGroupAddon, Button } from "primevue";

const password = defineModel("password");
const confirmPassword = defineModel("confirmPassword");
const errors = defineModel("errors", { type: Object });

const viewPwd = ref(false);
const viewPwdC = ref(false);
</script>

<template>
  <div class="mb-4 w-full">
    <label for="password" class="block mb-2 text-left"
      ><i class="pi pi-lock text-baseRed mr-4"></i> Password
      <span class="text-baseRed">*</span> :</label
    >
    <InputGroup>
      <input
        v-model="password"
        :type="viewPwd ? 'text' : 'password'"
        name="password"
        :class="`${
          errors.password
            ? 'border-2 border-red-500 focus:outline-hidden'
            : 'border'
        } rounded-l p-2 w-full`"
        placeholder="**********"
      />
      <InputGroupAddon
        :class="`${
          errors.password
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
    <span class="text-red-500 mt-2 block text-sm text-left">{{
      errors.password
    }}</span>
  </div>
  <div class="mb-4 w-full">
    <label for="confirmPassword" class="block mb-2 text-left"
      ><i class="pi pi-lock text-baseRed mr-4"></i> Confirm Password
      <span class="text-baseRed">*</span> :</label
    >
    <InputGroup>
      <input
        v-model="confirmPassword"
        :type="viewPwdC ? 'text' : 'password'"
        name="confirmPassword"
        :class="`${
          errors.confirmPassword
            ? 'border-2 border-red-500 focus:outline-hidden'
            : 'border'
        } rounded-l p-2 w-full`"
        placeholder="**********"
      />
      <InputGroupAddon
        :class="`${
          errors.confirmPassword
            ? 'border-2 border-red-500 bg-red-500 text-alice'
            : 'text-baseRed'
        }`"
      >
        <Button
          class="text-baseRed active:scale-y-75"
          :icon="`pi pi-${viewPwdC ? 'eye-slash' : 'eye'}`"
          variant="text"
          @click="viewPwdC = !viewPwdC"
        />
      </InputGroupAddon>
    </InputGroup>
    <span class="text-red-500 mt-2 block text-sm text-left">{{
      errors.confirmPassword
    }}</span>
  </div>
</template>
