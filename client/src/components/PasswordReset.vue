<script setup lang="ts">
import { forgotPassword } from "@/api/api";
import { passwordResetSchema } from "@/utils/ValidationSchemas";
import { useField, useForm } from "vee-validate";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import OTP from "./OTP.vue";
import PasswordConfirmation from "./PasswordConfirmation.vue";
import { VueSpinnerBars } from "vue3-spinners";
import router from "@/router";

const props = defineProps({
  email: {
    type: String,
    default: "",
  },
});

const correctCode = ref(false);
const isLoading = ref(false);
const userEmail = ref(props.email);

const toast = useToast();

const { handleSubmit, isSubmitting, errors } = useForm({
  validationSchema: passwordResetSchema,
});

const { value: password } = useField("password");
const { value: confirmPassword } = useField("confirmPassword");

const handleCode = async (code: string, resend: boolean = false) => {
  const formData = { code, section: "code", email: props.email, resend };
  isLoading.value = true;
  const results = await forgotPassword(formData);
  if (resend && results.success) {
    isLoading.value = false;
    return toast.success(results.message);
  }

  if (results.success) {
    correctCode.value = true;
    toast.success(results.message);
    userEmail.value = results.email;
    isLoading.value = false;
    return;
  }
  toast.error(results.message);
  isLoading.value = false;
  return;
};

const handlePasswordReset = handleSubmit(async (data) => {
  const formData = {
    section: "pwdReset",
    password: data.password,
    confirmPassword: data.confirmPassword,
    email: userEmail.value,
  };
  const results = await forgotPassword(formData);
  if (results.success) {
    correctCode.value = true;
    toast.success(results.message);
    router.push("/auth/login");
    return;
  }
  toast.error(results.message);
  return;
});
</script>

<template>
  <div class="text-center">
    <label for="codeOrPwd" class="text-center block text-4xl mt-10 mb-6">{{
      correctCode ? "Reset Password" : "Enter Code"
    }}</label>
    <div v-if="!correctCode" class="text-center">
      <OTP
        :length="5"
        @entered="(v) => handleCode(v)"
        :isdisabled="isLoading"
      />
      <div v-if="isLoading" class="flex gap-4 items-center justify-center">
        Checking...<VueSpinnerBars size="30" class="text-baseRed" />
      </div>
      <p class="text-center">
        Didn't Receive Code?
        <span
          class="text-baseRed hover:text-alice hover:underline hover:cursor-pointer"
          @click="handleCode('', true)"
          >Resend Code</span
        >
      </p>
    </div>
    <form
      @submit.prevent="handlePasswordReset"
      v-if="correctCode"
      class="w-[50vw] mx-auto"
    >
      <PasswordConfirmation
        v-model:confirm-password="confirmPassword"
        v-model:password="password"
        v-model:errors="errors"
      />
      <button
        :disabled="isSubmitting"
        type="submit"
        class="w-full mb-4 rounded p-2 cursor-pointer border flex place-content-center bg-alice text-eerie hover:bg-eerie hover:text-alice"
      >
        <span v-if="isSubmitting" class="flex gap-4 items-center justify-center"
          >Reseting...<VueSpinnerBars size="30" class="text-baseRed"
        /></span>
        <span v-else
          ><i class="pi pi-lock text-baseRed mr-4"></i>Reset Password</span
        >
      </button>
    </form>
  </div>
</template>
