<script setup lang="ts">
import { forgotPassword } from "@/api/authApi";
import { changePassword } from "@/api/useraccApi";
import { passwordResetSchema } from "@/utils/ValidationSchemas";
import { useField, useForm } from "vee-validate";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import PasswordConfirmation from "./PasswordConfirmation.vue";
import { VueSpinnerBars } from "vue3-spinners";
import router from "@/router";
import Vue2FACodeInput from "@loltech/vue3-2fa-code-input";

const props = defineProps({
  email: {
    type: String,
    default: "",
  },
  schema: {
    type: String,
    default: "forgot",
  },
  codeSend: {
    type: Boolean,
    default: true,
  },
});

const code = ref("");

const correctCode = ref(false);
const isLoading = ref(false);
const userEmail = ref(props.email);

const toast = useToast();

const emitted = defineEmits(["pwdReset"]);

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
  if (props.schema === "forgot") {
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
      setTimeout(() => {
        router.push("/auth/login");
      }, 500);
      return;
    }
    toast.error(results.message);
    return;
  }
  if (props.schema === "change") {
    const formData = { section: "pwdReset", password: password.value };
    const results = await changePassword(formData);
    if (results.success) {
      toast.success(results.message);
      emitted("pwdReset", false);
      return;
    }
    toast.error(results.message);
    return;
  }
});
</script>

<template>
  <div class="text-center">
    <label
      v-if="codeSend"
      for="codeOrPwd"
      class="text-center block text-4xl mt-10 mb-6"
      >{{ correctCode ? "Reset Password" : "Enter Code" }}</label
    >
    <div v-if="!correctCode && codeSend" class="text-center">
      <!-- <OTP
        :length="5"
        @entered="(v) => handleCode(v)"
        :isdisabled="isLoading"
      /> -->
      <Vue2FACodeInput
        v-if="!isLoading"
        v-model="code"
        @update:model-value="handleCode(code)"
        class="**:border-2 **:rounded-md flex **:w-1/10 justify-center **:h-10 **:text-center gap-2 my-4"
        inputmode="numeric"
      />
      <div
        v-if="isLoading"
        class="flex gap-4 items-center justify-center text-4xl"
      >
        Checking...<VueSpinnerBars size="30" class="text-baseRed" />
      </div>
      <p class="text-center" v-if="!isLoading">
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
      v-if="correctCode || !codeSend"
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
