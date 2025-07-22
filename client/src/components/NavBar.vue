<script setup lang="ts">
import { checkAuth, logout } from "@/api/api";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { VueSpinnerBars } from "vue3-spinners";
import { useToast } from "vue-toastification";
import router from "@/router";

const userInfo = ref({ name: "", avatar: "", isAuth: false });

const isLoading = ref(false);
const showNames = ref(false);

const toast = useToast();

onMounted(async () => {
  const results = await checkAuth();
  userInfo.value = {
    name: results.name,
    avatar: results.avatar,
    isAuth: results.success,
  };
});

const linkObjects = {
  bars: {
    icon: "pi pi-bars",
    name: "Bars",
  },
  dashboard: {
    icon: "pi pi-desktop",
    name: "Dashboard",
  },
  notifications: {
    icon: "pi pi-bell",
    name: "Notifications",
  },
  verses: {
    icon: "pi pi-book",
    name: "Verses",
  },
  exam: {
    icon: "pi pi-pencil",
    name: "Exam",
  },
  newsfeed: {
    icon: "pi pi-globe",
    name: "Newsfeed",
  },
  shop: {
    icon: "pi pi-shop",
    name: "Shop",
  },
  settings: {
    icon: "pi pi-cog",
    name: "Settings",
  },
  logout: {
    icon: "pi pi-sign-out",
    name: "Logout",
  },
};

const handleLogout = async () => {
  const results = await logout();
  if (results.success) {
    toast.success(results.message);
    setTimeout(() => {
      router.push("/");
    }, 500);
    return;
  }
  return toast.error(results.message);
};
</script>

<template>
  <header
    class="w-full px-8 py-4 flex justify-between items-center fixed border-b top-0 left-0 bg-eerie"
  >
    <img
      src="@/assets/logo.svg"
      alt="logo"
      :class="`${userInfo.isAuth && 'justify-self-center mx-auto'} w-[6rem]`"
    />
    <nav class="w-1/3" v-if="!userInfo.isAuth">
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
        <RouterLink to="/auth/login"
          ><i
            class="pi pi-user border-2 p-2 rounded text-2xl hover:cursor-pointer hover:bg-alice hover:text-eerie"
          >
          </i
        ></RouterLink>
      </ul>
    </nav>
    <nav class="w-1/3" v-if="userInfo.isAuth">
      <ul class="flex justify-end gap-4 items-center">
        <li
          class="hover:bg-alice hover:text-eerie p-2 rounded-md flex items-center ease-in-out duration-300"
        >
          <RouterLink
            to="/my-account"
            class="flex items-center gap-2 hover:underline font-bold"
            >{{ userInfo.name
            }}<img
              :src="userInfo.avatar"
              class="w-[3rem] h-[3rem] rounded-[50%] object-fill object-center border-2 border-alice"
              alt="avatar"
          /></RouterLink>
        </li>
      </ul>
    </nav>
  </header>
  <aside
    class="w-auto fixed h-full z-99 top-0 left-0 bg-eerie"
    v-if="userInfo.isAuth"
  >
    <nav
      :class="`border-r-2 flex flex-col gap-4 p-4 ${
        showNames ? 'items-start' : 'items-center'
      } h-full`"
    >
      <li
        v-for="(list, i) in linkObjects"
        :key="i"
        :class="`${
          ['Logout', 'Bars'].indexOf(list.name) >= 0 &&
          'hover:cursor-pointer my-auto hover:bg-alice hover:text-eerie p-2 rounded-md flex items-center ease-in-out duration-300'
        } list-none ${
          list.name !== 'Bars'
            ? 'w-full'
            : ' justify-self-center mx-auto w-auto'
        } ${
          list.name === 'Logout' &&
          isLoading &&
          'hover:bg-gray-500 hover:cursor-not-allowed!'
        } ${!isLoading && ' '}}`"
        @click="
          (list.name === 'Bars' && (showNames = !showNames)) ||
            (list.name === 'Logout' && handleLogout())
        "
      >
        <div class="flex justify-center items-center">
          <i
            v-if="list.name === 'Bars'"
            :class="!showNames ? list.icon : 'pi pi-times'"
            style="font-size: 1.6rem"
          ></i>
        </div>
        <RouterLink
          v-if="['Logout', 'Bars'].indexOf(list.name) === -1"
          :to="'/'"
          class="hover:bg-alice hover:text-eerie p-2 rounded-md flex items-center ease-in-out duration-300"
        >
          <div class="flex gap-2">
            <i :class="list.icon" style="font-size: 1.6rem"></i>
            <p v-if="showNames">{{ list.name }}</p>
          </div>
        </RouterLink>
        <div class="flex gap-2" v-if="list.name === 'Logout' && !isLoading">
          <i :class="list.icon" style="font-size: 1.6rem"></i>
          <p v-if="showNames">{{ list.name }}</p>
        </div>
        <span v-if="list.name === 'Logout' && isLoading" class="flex gap-2">
          <p v-if="showNames">Logging Out...</p>
          <VueSpinnerBars size="30" class="text-baseRed" />
        </span>
      </li>
      <!-- <li class="list-none justify-self-end m-auto">
        <i class="pi pi-sign-out" style="font-size: 1.6rem"></i>
      </li> -->
    </nav>
  </aside>
</template>
