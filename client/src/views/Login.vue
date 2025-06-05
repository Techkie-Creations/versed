<script setup lang="ts">
import { loginUser } from '@/api/api';
import { validationSchema } from '@/utils/LoginSchema';
import { useForm, useField } from 'vee-validate';
import { RouterLink } from 'vue-router';
import { VueSpinnerBars } from 'vue3-spinners';

const {handleSubmit, errors, isSubmitting} = useForm({
    validationSchema
})

const { value: email } = useField("email");
const { value: password } = useField("password");


const onSubmit = handleSubmit(async (data) => {
    const formData = {email: data.email, password: data.password}

    const results = await loginUser(formData)
    console.log(results)
})

</script>

<template>
<h1 class="font-caveat text-center text-8xl mt-25">Log In</h1>
  <form @submit.prevent="onSubmit" class="w-[50vw] mx-auto mt-16">
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
    <RouterLink to="/auth/forgotPassword" class="text-baseRed block mb-4 hover:text-alice hover:underline">Forgot Password?</RouterLink>
    <button
    :disabled="isSubmitting"
      type="submit"
      class="w-full mb-4 rounded p-2 cursor-pointer border flex place-content-center bg-alice text-eerie hover:bg-eerie hover:text-alice"
    >
      <span v-if="isSubmitting" class="flex gap-4 items-center justify-center">Submitting...<VueSpinnerBars size="30" class="text-baseRed" /></span>
      <span v-else><i class="pi pi-user-plus text-baseRed mr-4"></i>Log In</span>
    </button>
  </form>
  <hr class="bg-alice mt-4 w-2/4 m-auto" />
  <p class="text-center my-4">Don't Have An Account Yet? <RouterLink to="/auth/signup" class="text-baseRed hover:text-alice hover:underline">Sign Up</RouterLink></p>
</template>
