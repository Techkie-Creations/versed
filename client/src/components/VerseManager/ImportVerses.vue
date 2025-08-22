<script setup lang="ts">
import { versesImport } from "@/api/api";
import { checkVerses, hollowButton, solidButton } from "@/utils/exports";
import { Dialog } from "primevue";
import { ref } from "vue";

const props = defineProps({
  globalVersion: {
    type: String,
    required: true,
  },
});

const showModal = defineModel("showModal", { default: false });

const verseList = ref({});
const errVerse = ref({ verses: "", password: "" });
const verseId = ref("");
const section = ref("verseId");
const password = ref("");
const toGbV = ref(false);
const selected = ref([]);

const isLoading = ref(false);

const importedVerses = ref({});
const verses = defineModel("verses", { default: Object });
const trackNew = defineModel("trackNew", { default: Object });
const numOfVerses = defineModel("numOfVerses", { default: 0 });

const msg = ref("");

const importVerses = async () => {
  if (verseId.value.length < 7)
    return (errVerse.value.verses = "Invalid Verse ID");
  else errVerse.value.verses = "";
  if (section.value === "password" && password.value.length === 0)
    return (errVerse.value.password = "Password is required!");
  else errVerse.value.password = "";
  const results = await versesImport({
    schema: section.value,
    verseId: verseId.value,
    versePass: password.value,
  });
  console.log(results);
  if (results.success) {
    console.log(verseId.value);
    if (results.pass) return (section.value = "versePass");
    verseList.value = results.verses;
    console.log(verseList.value);
    return;
  }
  errVerse.value.verses = results.message;
};

const arrange = (verseArr: number[] | string[] = []) => {
  for (let i = 0; i < verseArr.length; i++) {
    importedVerses.value[numOfVerses.value] = {
      Version: toGbV.value
        ? props.globalVersion
        : verseList.value[verseArr[i]]["Version"],
      Book: verseList.value[verseArr[i]]["Book"],
      Chapter: verseList.value[verseArr[i]]["Chapter"],
      Verse: verseList.value[verseArr[i]]["Verse"],
      To: verseList.value[verseArr[i]]["To"],
    };
    numOfVerses.value++;
  }
};

const arrangeNew = () => {
  const arrange = {};
  const trackNewKeys = Object.keys(trackNew.value);
  if (trackNewKeys.length > 0) {
    for (let i = 0; i < trackNewKeys.length; i++) {
      arrange[numOfVerses.value] = trackNew.value[parseInt(trackNewKeys[i])];
      numOfVerses.value++;
    }
    trackNew.value = arrange;
    localStorage.setItem("trackNew", JSON.stringify(arrange));
  }
};

const importSelected = async () => {
  isLoading.value = true;
  arrange(selected.value);
  arrangeNew();
  console.log(importedVerses.value);
  const allVerses = checkVerses(verses.value, importedVerses.value);
  if (!allVerses.status) {
    isLoading.value = false;
    msg.value = allVerses.data["msg"];
    setTimeout(() => {
      showModal.value = false;
      msg.value = "";
    }, 3000);
    return;
  }
  const results = await versesImport({
    schema: "submit",
    verses: { ...verses.value, ...allVerses.data },
    verseId: verseId.value,
  });
  isLoading.value = false;
  if (results.success) {
    verses.value = results.verses;
    msg.value = results.message;
  }
  setTimeout(() => {
    showModal.value = false;
    msg.value = "";
  }, 3000);
  return;
};

const importAll = async () => {
  isLoading.value = true;
  arrange(Object.keys(verseList.value));
  arrangeNew();
  const allVerses = checkVerses(verses.value, importedVerses.value);
  if (!allVerses.status) msg.value = allVerses["data"]["msg"];
  else {
    const results = await versesImport({
      schema: "submit",
      verses: { ...verses.value, ...allVerses.data },
      verseId: verseId.value,
    });
    if (results.success) {
      verses.value = results.verses;
      msg.value = results.message;
    }
  }
  isLoading.value = false;

  setTimeout(() => {
    showModal.value = false;
    msg.value = "";
  }, 5000);
  return;
};
</script>

<template>
  <Dialog
    v-model:visible="showModal"
    modal
    header="Import Verses"
    class="w-auto p-2 border-2 bg-alice"
    @after-hide="
      () => {
        verseList = [];
        verseId = '';
        password = '';
        section = 'verseId';
      }
    "
  >
    <div class="my-4 w-full" v-if="Object.keys(verseList).length === 0">
      <label for="email" class="block mb-2"
        ><i
          :class="`pi pi-${
            section === 'verseId' ? 'address-book' : 'lock'
          } text-baseRed mr-2`"
        ></i>
        {{ section === "verseId" ? "Enter Verse ID" : "Enter Verse Password" }}
        <span class="text-baseRed">*</span> :</label
      >
      <div class="flex gap-2 items-center">
        <input
          v-if="section === 'verseId'"
          v-model="verseId"
          type="text"
          name="verseId"
          :class="`${
            errVerse.verses
              ? 'border-2 border-red-500 focus:outline-hidden'
              : 'border'
          } rounded p-2 w-full`"
        />
        <input
          v-if="section === 'versePass'"
          v-model="password"
          type="password"
          name="password"
          :class="`${
            errVerse.password
              ? 'border-2 border-red-500 focus:outline-hidden'
              : 'border'
          } rounded p-2 w-full`"
        />
        <button
          type="button"
          :class="solidButton + ' w-auto! flex items-center gap-2'"
          @click="importVerses"
        >
          <i class="pi pi-download"></i>
          Import
        </button>
      </div>
      <span class="text-red-500 mt-2 block text-sm w-70 break-words">{{
        errVerse.verses || errVerse.password
      }}</span>
    </div>
    <div
      class="flex items-center justify-between flex-wrap p-2 border-b-eerie border-b-1"
      v-if="Object.keys(verseList).length > 0 && !isLoading && !msg"
    >
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          name="toGbv"
          id="toGbv"
          v-model="toGbV"
          class="w-4 h-4 hover:cursor-pointer accent-eerie"
        />
        <label for="toGbv">To Global Version</label>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          :class="solidButton + ' w-auto!'"
          @click="importSelected"
          v-if="selected.length > 0"
        >
          Import Chosen
        </button>
        <button
          type="button"
          :class="hollowButton + ' w-auto!'"
          @click="importAll"
        >
          Import All
        </button>
      </div>
    </div>
    <div
      class="w-[30rem] min-w-50 max-h-120 h-50 border-2 rounded-md overflow-x-auto overflow-y-auto mt-4"
      v-if="Object.keys(verseList).length > 0 && !isLoading && !msg"
    >
      <div
        v-for="(key, i) in Object.keys(verseList)"
        :class="`flex items-center gap-2 justify-evenly p-2 ${
          i % 2 === 0 ? 'bg-eerie text-alice' : 'bg-alice text-eerie'
        }`"
      >
        <p>{{ toGbV ? props.globalVersion : verseList[key]["Version"] }}</p>
        <p>{{ verseList[key].Book }}</p>
        <p>{{ verseList[key].Chapter }}</p>
        <p>{{ verseList[key].Verse }}</p>
        <p>{{ verseList[key].To }}</p>
        <input
          type="checkbox"
          name="chosen"
          id="chosen"
          :class="`w-5 h-5 hover:cursor-pointer justify-self-end ${
            i % 2 === 0 ? 'accent-alice' : 'accent-eerie text-eerie'
          }`"
          :value="key"
          v-model="selected"
        />
      </div>
    </div>
    <div class="text-center text-eerie" v-if="isLoading">
      <i class="pi pi-spin pi-spinner text-5xl block"></i>
      <p>Importing...</p>
    </div>
    <p class="w-[30rem] text-center text-4xl p-4" v-if="!isLoading && msg">
      {{ msg }}
    </p>
  </Dialog>
</template>
