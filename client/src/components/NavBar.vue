<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <header class="w-full px-8 py-4 flex justify-between items-center border-b">
    <img src="@/assets/logo.svg" alt="logo" class="w-[6rem]" />
    <nav class="w-1/3">
      <ul class="flex justify-between items-center">
        <li>
          <RouterLink
            to="#"
            class="p-2 border-2 rounded bg-alice text-eerie hover:border-2 hover:border-alice hover:bg-eerie hover:text-alice"
            >Home</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="#"
            class="p-2 border-2 rounded bg-alice text-eerie hover:border-2 hover:border-alice hover:bg-eerie hover:text-alice"
            >About</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="#"
            class="p-2 border-2 rounded bg-alice text-eerie hover:border-2 hover:border-alice hover:bg-eerie hover:text-alice"
            >Contact Us</RouterLink
          >
        </li>
        <RouterLink to="/"
          ><i
            class="pi pi-user border-2 p-2 rounded text-2xl hover:cursor-pointer hover:bg-alice hover:text-eerie"
          >
          </i
        ></RouterLink>
      </ul>
    </nav>
  </header>
</template>
