<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import { bibleVersions } from "@/utils/Types";
import {
  checkVerses,
  fitVerseIn,
  hollowButton,
  solidButton,
} from "@/utils/exports";
import { onMounted, ref } from "vue";
import ConfirmPopup from "@/components/ConfirmPopup.vue";
import {
  deleteVerses,
  getVerses,
  getVerseSec,
  saveVerses,
  updateVerseSec,
} from "@/api/api";
import AddVerse from "@/components/VerseManager/AddVerse.vue";
import { useToast } from "vue-toastification";
import { Popover } from "primevue";
import ViewNew from "@/components/VerseManager/ViewNew.vue";
import ViewOld from "@/components/VerseManager/ViewOld.vue";
import { Button, InputGroupAddon, InputGroup } from "primevue";

const toast = useToast();

const copyId = ref(false);
const showModal = ref(false);
const showRemoveModal = ref(false);
const isLoading = ref(false);

const errVerse = ref({
  book: "",
  chapter: "",
  verse: "",
  versePass: "",
  email: "",
});

const track = ref(JSON.parse(localStorage.getItem("track") || "{}"));
const verses = ref({});
const trackNew = ref(
  JSON.parse(localStorage.getItem("trackNew") || "{}") || {}
);
const removedVerses = ref(
  JSON.parse(localStorage.getItem("removed") || "{}") || {}
);
const numOfVerses = ref(0);
const numOfNewVerses = ref(Object.keys(trackNew.value).length);
const numOfRemoved = ref(Object.keys(removedVerses.value).length);
const numOfTrack = ref(Object.keys(track.value).length);

const mode = ref("");
const globalV = ref("");
const verseId = ref("");
const viewOrder = ref("new");
const popOver = ref();

const verseVisible = ref("private");
const versePass = ref("");
const viewPass = ref(false);
const passModal = ref(false);
const verseAccess = ref<string[]>([]);
const verseDef = ref({
  versePass: "",
  verseAccess: [""],
});
const error = ref({ msg: "", key: "" });

const email = ref("");

const arrangeVerses = (schema: "track" | "new" | "sort", id: number) => {
  const versesKeys = Object.keys(verses.value);
  let arrange = {};
  if (schema === "track") {
    for (let i = 0; i < versesKeys.length; i++) {
      if (parseInt(versesKeys[i]) > id) {
        arrange[parseInt(versesKeys[i]) - 1] =
          verses.value[parseInt(versesKeys[i])];
        continue;
      } else {
        arrange[parseInt(versesKeys[i])] =
          verses.value[parseInt(versesKeys[i])];
        continue;
      }
    }
  }
  const trackNewKeys = Object.keys(trackNew.value);
  if (schema === "new") {
    for (let i = 0; i < trackNewKeys.length; i++) {
      if (parseInt(trackNewKeys[i]) > id) {
        arrange[parseInt(trackNewKeys[i]) - 1] =
          trackNew.value[parseInt(trackNewKeys[i])];
        continue;
      } else {
        arrange[parseInt(trackNewKeys[i])] =
          trackNew.value[parseInt(trackNewKeys[i])];
        continue;
      }
    }
  }
  if (schema === "sort") {
    for (let i = 0; i < trackNewKeys.length; i++) {
      arrange[numOfNewVerses.value + numOfVerses.value - 1] =
        trackNew.value[trackNewKeys[i]];
    }
  }

  return arrange;
};

onMounted(async () => {
  const results = await getVerses();
  if (results.success) {
    mode.value = results.mode || "Newbie";
    globalV.value = results.globalV;
    verseId.value = results.verseId;
    verses.value = results.verses;
    numOfVerses.value = Object.keys(verses.value).length;
  }

  if (results.mode === "Newbie") {
    const getSec = await getVerseSec();
    //if (getSec.success) {
    versePass.value = getSec.versePass;
    verseVisible.value = getSec.verseVisibility || "private";
    verseAccess.value = getSec.verseAccess;
    verseDef.value.versePass = getSec.versePass;
    //}
  }

  const versesKey = Object.keys(verses.value);
  const removedKeys = Object.keys(removedVerses.value);
  const trackKeys = Object.keys(track.value);

  for (let i = 0; i < removedKeys.length; i++) {
    for (let j = 0; j < versesKey.length; j++) {
      const removedId = removedVerses.value[removedKeys[i]];
      const verseId = verses.value[versesKey[j]];
      if (!verseId) continue;
      if (
        removedId["Book"] === verseId["Book"] &&
        removedId["Chapter"] === verseId["Chapter"] &&
        removedId["Verse"] === verseId["Verse"] &&
        removedId["To"] === verseId["To"]
      ) {
        delete verses.value[versesKey[j]];
        numOfVerses.value--;
        verses.value = arrangeVerses("track", j);
      }
    }
  }
  for (let i = 0; i < trackKeys.length; i++) {
    const verseId = verses.value[trackKeys[i]];
    const trackId = track.value[trackKeys[i]];
    verseId["Version"] = trackId["Version"] || verseId["Version"];
    verseId["Book"] = trackId["Book"] || verseId["Book"];
    verseId["Chapter"] = trackId["Chapter"] || verseId["Chapter"];
    verseId["Verse"] = trackId["Verse"] || verseId["Verse"];
    verseId["To"] = trackId["To"] || verseId["To"];
  }
  verses.value = verses.value;
});

const toggle = (e: Event) => {
  popOver.value.toggle(e);
};

const verseIdClick = () => {
  navigator.clipboard.writeText(verseId.value);
  copyId.value = true;
  setTimeout(() => {
    copyId.value = false;
  }, 3000);
};

const handleSave = async () => {
  arrangeVerses("new", numOfVerses.value);
  let allVerses = checkVerses(verses.value, trackNew.value);
  allVerses = checkVerses(removedVerses.value, trackNew.value);
  const formdata = {
    newVerses: allVerses.data,
    verses: verses.value,
    track: JSON.parse(localStorage.getItem("track") || "{}"),
  };

  const results = await saveVerses(formdata);
  if (results.success) {
    verses.value = results.verses;
    numOfVerses.value = numOfVerses.value + numOfNewVerses.value;
    numOfRemoved.value = 0;
    numOfNewVerses.value = 0;
    localStorage.setItem("trackNew", "{}");
    toast.success(results.message);
    showModal.value = false;
    return;
  }
  toast.error(results.message);
  showModal.value = false;
  return;
};

const handleRemoval = (id: number, schema: "new" | "track") => {
  const removedKeys = Object.keys(removedVerses.value);

  console.log(typeof id);

  if (schema === "track") {
    for (let i = 0; i < removedKeys.length; i++) {
      const removedId = removedVerses.value[removedKeys[i]];
      const verseId = verses.value[id];
      if (
        removedId["Book"] === verseId["Book"] &&
        removedId["Chapter"] === verseId["Chapter"] &&
        removedId["Verse"] === verseId["Verse"] &&
        removedId["Part"] === "track"
      ) {
        delete verses.value[id];
        numOfVerses.value--;
        return;
      }
    }
    removedVerses.value[removedKeys.length] = verses.value[id];
    removedVerses.value[removedKeys.length]["Part"] = "track";
    removedVerses.value[removedKeys.length]["Id"] = id;
    delete verses.value[id];
    delete track.value[id];
    verses.value = arrangeVerses("track", id);
    trackNew.value = arrangeVerses("new", 0);
    numOfVerses.value--;
    numOfRemoved.value++;
    localStorage.setItem("removed", JSON.stringify(removedVerses.value));
    localStorage.setItem("track", JSON.stringify(track.value));
    localStorage.setItem("trackNew", JSON.stringify(trackNew.value));
  }

  if (schema === "new") {
    for (let i = 0; i < removedKeys.length; i++) {
      const removedId = removedVerses.value[removedKeys[i]];
      const newId = trackNew.value[id];
      if (
        removedId["Book"] === newId["Book"] &&
        removedId["Chapter"] === newId["Chapter"] &&
        removedId["Verse"] === newId["Verse"] &&
        removedId["Part"] === "new"
      ) {
        delete trackNew.value[id];
        numOfNewVerses.value--;
        return;
      }
    }
    removedVerses.value[removedKeys.length] = trackNew.value[id];
    removedVerses.value[removedKeys.length]["Part"] = "new";
    delete trackNew.value[id];
    trackNew.value = arrangeVerses("new", 0);
    numOfNewVerses.value--;
    numOfRemoved.value++;
    localStorage.setItem("removed", JSON.stringify(removedVerses.value));
    localStorage.setItem("trackNew", JSON.stringify(trackNew.value));
  }
};

const handleUndo = () => {
  const removedKeys = Object.keys(removedVerses.value);

  if (
    removedVerses.value[removedKeys[removedKeys.length - 1]]["Part"] === "track"
  ) {
    verses.value = fitVerseIn(
      verses.value,
      removedVerses.value[removedKeys[removedKeys.length - 1]],
      parseInt(removedVerses.value[removedKeys[removedKeys.length - 1]]["Id"])
    );
    verses.value = arrangeVerses(
      "track",
      parseInt(removedVerses.value[removedKeys[removedKeys.length - 1]]["Id"])
    );
    numOfVerses.value++;
    delete removedVerses.value[removedKeys[removedKeys.length - 1]];
    numOfRemoved.value--;
    localStorage.setItem("removed", JSON.stringify(removedVerses.value));
  }

  if (
    removedVerses.value[removedKeys[removedKeys.length - 1]]["Part"] === "new"
  ) {
    trackNew.value[numOfNewVerses.value + numOfVerses.value] =
      removedVerses.value[removedKeys[removedKeys.length - 1]];
    delete trackNew.value[numOfNewVerses.value + numOfVerses.value]["Part"];
    delete removedVerses.value[removedKeys[removedKeys.length - 1]];
    numOfNewVerses.value++;
    localStorage.setItem("trackNew", JSON.stringify(trackNew.value));
  }
  delete removedVerses.value[removedKeys[removedKeys.length - 1]];
  numOfRemoved.value--;

  localStorage.setItem("removed", JSON.stringify(removedVerses.value));
};

const handleCancel = () => {
  const removedKeys = Object.keys(removedVerses.value);
  for (let i = 0; i < removedKeys.length; i++) {
    const removedId = removedVerses.value[removedKeys[i]];
    if (removedId["Part"] === "track") {
      verses.value = fitVerseIn(
        verses.value,
        removedId,
        parseInt(removedId["Id"])
      );
      verses.value = arrangeVerses("track", parseInt(removedId["Id"]));
    }
  }
  trackNew.value = {};
  removedVerses.value = {};
  track.value = {};

  numOfNewVerses.value = 0;
  numOfRemoved.value = 0;
  numOfTrack.value = 0;

  localStorage.setItem("track", JSON.stringify(track.value));
  localStorage.setItem("trackNew", JSON.stringify(trackNew.value));
  localStorage.setItem("removed", JSON.stringify(removedVerses.value));
};

const handleDelete = async () => {
  const results = await deleteVerses();
  if (results.success) {
    verses.value = {};
    numOfNewVerses.value = 0;
    numOfRemoved.value = 0;
    numOfVerses.value = 0;
    trackNew.value = {};
    localStorage.setItem("trackNew", "{}");
    localStorage.setItem("removed", "{}");
    toast.success(results.message);
    showRemoveModal.value = false;
    return;
  }
  toast.error(results.message);
  showRemoveModal.value = false;
  return;
};

const verseClick = () => {
  if (
    versePass.value === verseDef.value.versePass ||
    versePass.value.trim() === ""
  )
    return;
  if (
    !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(versePass.value)
  )
    return (errVerse.value.versePass =
      "Make pass more complex with 8+ characters");
  errVerse.value.versePass = "";
  return (passModal.value = true);
};

const changeVPass = async () => {
  const results = await updateVerseSec({
    schema: "password",
    versePass: versePass.value,
  });
  if (results.success) {
    versePass.value = results.versePass;
    verseDef.value.versePass = results.versePass;
    toast.success(results.message);
    showModal.value = false;
    return;
  }
  toast.error(results.message);
  showModal.value = false;
  return;
};

const changeVerseVisibility = async () => {
  const results = await updateVerseSec({
    schema: "visibility",
    verseVisibility: verseVisible.value,
  });
  if (!results) toast.error(results.message);
  return;
};

const addVerseUser = async () => {
  if (email.value.length === 0)
    return (errVerse.value.email = "Email required!");
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(email.value)) {
    return (errVerse.value.email = "Invalid email");
  }
  if (verseAccess.value.indexOf(email.value) >= 0)
    return (errVerse.value.email = "Already in the list!");

  verseAccess.value.push(email.value);
  errVerse.value.email = "";
  email.value = "";
  const results = await updateVerseSec({
    schema: "addUser",
    verseAccess: verseAccess.value,
  });
  if (!results.success) toast.error(results.message);
  return;
};

const removeVerseUser = async (userMail: string) => {
  verseAccess.value.splice(verseAccess.value.indexOf(userMail), 1);
  const results = await updateVerseSec({
    schema: "removeUser",
    verseAccess: verseAccess.value,
  });
  if (!results.success) toast.error(results.message);
  return;
};
</script>

<template>
  <NavBar />
  <div
    class="ml-[90px] mt-25 flex flex-col items-center justify-center mx-auto gap-4"
  >
    <h1 class="font-caveat text-6xl text-center">Verse Manager</h1>
    <p class="flex items-center gap-2">
      <span
        class="font-caveat text-xl font-bold italic hover:underline p-2 rounded-md hover:cursor-pointer hover:bg-alice hover:text-eerie"
        @click="verseIdClick"
        >{{ verseId }}</span
      >
      <span v-if="copyId" class="text-sm font-bold text-red-700">Copied</span>
    </p>

    <div class="mt-8 flex justify-between w-full">
      <p>
        Mode: <span class="text-red-700">{{ mode }}</span>
      </p>
      <div>
        <label for="global-version" class="mr-4">Global Version: </label>
        <select
          name="global-version"
          id="global-version"
          class="rounded p-2 border w-auto bg-eerie"
          v-model="globalV"
        >
          <option v-for="version in bibleVersions" :value="version">
            {{ version }}
          </option>
        </select>
      </div>
    </div>
    <section id="verse-cud" class="w-[40rem]">
      <p class="text-baseRed text-center">
        NOTE: The design and features change based on mode!
      </p>
      <AddVerse
        v-model:verses="verses"
        v-model:track-new="trackNew"
        v-model:num-of-new-verses="numOfNewVerses"
        v-model:num-of-verses="numOfVerses"
      />
      <div class="flex justify-between items-center mt-3">
        <div class="flex gap-4 items-center">
          <p class="font-bold font-caveat text-xl italic text-gray-600">
            # of Verses: {{ numOfVerses + numOfNewVerses }}
          </p>
          <i
            class="pi pi-sliders-v hover:cursor-pointer hover:text-baseRed"
            @click="toggle"
          ></i>
        </div>
        <Popover ref="popOver" class="m-5! mt-2!">
          <div class="border-1 p-2">
            <div
              class="w-full hover:bg-baseRed p-2 hover:text-alice hover:cursor-pointer rounded-md hover:border-1"
              v-for="order in [
                ['New First', 'new'],
                ['Old First', 'old'],
              ]"
              @click="viewOrder = order[1]"
            >
              {{ order[0] }}
            </div>
          </div>
        </Popover>
        <div
          class="flex gap-4 items-center"
          v-if="numOfNewVerses > 0 || numOfRemoved > 0 || numOfTrack > 0"
        >
          <button
            type="button"
            :class="solidButton + ' flex items-center gap-2'"
            @click="showModal = true"
          >
            <i class="pi pi-check"></i>Save
          </button>
          <button
            type="button"
            :class="hollowButton + ' flex items-center gap-2'"
            @click="handleCancel"
          >
            <i class="pi pi-ban"></i>Cancel
          </button>
        </div>
        <button
          type="button"
          :class="solidButton + ' bg-baseRed! flex gap-2 items-center w-auto!'"
          @click="showRemoveModal = true"
          v-if="numOfVerses > 0"
        >
          <i class="pi pi-trash"></i>Remove All
        </button>
        <ConfirmPopup
          v-model:show-modal="showRemoveModal"
          v-bind:is-loading="isLoading"
          success-icon="trash"
          success-text="Remove All"
          dialog-text="Are you sure you want to delete all your verses?"
          @success-click="handleDelete"
        />
      </div>
      <p
        v-if="numOfRemoved > 0"
        class="text-alice hover:underline hover:cursor-pointer flex items-center w-[5rem] rounded-md border-1"
        @click="handleUndo"
      >
        <i class="pi pi-undo p-2"></i> Undo
      </p>
      <div
        :class="`border-2 p-2 bg-alice rounded-md my-4 max-h-100 relative overflow-scroll overflow-x-auto w-full overflow-y-auto flex flex-col${
          viewOrder === 'new' ? '' : '-reverse'
        }`"
        v-if="numOfNewVerses > 0 || numOfRemoved > 0 || numOfVerses > 0"
      >
        <ViewNew
          v-model:num-of-new-verses="numOfNewVerses"
          v-model:err-verse="errVerse"
          v-model:track-new="trackNew"
          v-model:error="error"
          @handle-remove="(e) => handleRemoval(e, 'new')"
        />
        <ViewOld
          v-model:num-of-verses="numOfVerses"
          v-model:num-of-track="numOfTrack"
          v-model:err-verse="errVerse"
          v-model:verses="verses"
          @handle-remove="(e) => handleRemoval(e, 'track')"
        />
      </div>
      <ConfirmPopup
        v-model:is-loading="isLoading"
        v-model:show-modal="showModal"
        v-on:success-click="handleSave"
        dialog-text="Are you happy with the new verses added?"
      />
    </section>
    <section
      class="w-[40rem] flex flex-col items-center justify-self-start gap-4 *:w-full mb-4"
    >
      <p class="border-t-2 border-b-2 mt-10 text-center text-[1.2rem]">
        Verses Security
      </p>
      <div class="" v-if="mode === 'Newbie'">
        <p class="font-bold flex items-center gap-2">
          Verse Visibility:
          <span class="text-gray-500">P{{ verseVisible.substring(1) }}</span>
        </p>
      </div>
      <div class="" v-if="mode === 'Mature'">
        <p class="font-bold flex items-center gap-2">
          Verse Visibility:
          <select
            name="verseVisible"
            id="verseVisible"
            class="p-2 border-2 rounded-md bg-eerie text-alice"
            v-model="verseVisible"
            @change="changeVerseVisibility"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </p>
        <p class="font-bold text-baseRed" v-if="verseVisible === 'public'">
          Everyone can access your verse list unless there is a password
        </p>
        <p class="font-bold text-baseRed" v-else>
          Only users in <i>Access List</i> can access your verse list
        </p>
      </div>
      <div class="w-full" v-if="mode === 'Mature' && verseVisible === 'public'">
        <label for="email" class="block mb-2"
          ><i class="pi pi-lock text-baseRed mr-2"></i> Verse Password
          <span class="text-baseRed">*</span> :</label
        >
        <div class="flex gap-2 w-full items-center">
          <InputGroup>
            <input
              v-model="versePass"
              :type="viewPass ? 'text' : 'password'"
              name="password"
              @input="errVerse.versePass = ''"
              :class="`${
                errVerse.versePass
                  ? 'border-2 border-red-500 focus:outline-hidden'
                  : 'border'
              } rounded-l p-2 w-full`"
              placeholder="**********"
            />
            <InputGroupAddon
              :class="`${
                errVerse.versePass
                  ? 'border-2 border-red-500 bg-red-500 text-alice'
                  : 'text-baseRed'
              }`"
            >
              <Button
                class="text-baseRed active:scale-y-75"
                :icon="`pi pi-${viewPass ? 'eye-slash' : 'eye'}`"
                variant="text"
                @click="viewPass = !viewPass"
              />
            </InputGroupAddon>
          </InputGroup>
          <button
            type="button"
            :class="solidButton + ' w-1/3!'"
            @click="verseClick"
          >
            Change Password
          </button>
        </div>
        <span class="text-red-500 mt-2 block text-sm">{{
          errVerse.versePass
        }}</span>
        <ConfirmPopup
          success-icon="pi pi-check"
          success-text="Change"
          dialog-text="Are you sure you want to change password?"
          v-model:show-modal="passModal"
          header="Change Verse Password"
          submit-text="Changing..."
          @success-click="changeVPass"
        />
      </div>
      <div
        class="w-full mt-4"
        v-if="mode === 'Mature' && verseVisible === 'private'"
      >
        <p class="text-xl">Access List</p>
        <div class="my-4 w-full">
          <label for="email" class="block mb-2"
            ><i class="pi pi-envelope text-baseRed mr-2"></i> Enter User Email
            <span class="text-baseRed">*</span> :</label
          >
          <div class="flex gap-2 items-center">
            <input
              v-model="email"
              type="email"
              name="email"
              :class="`${
                errVerse.email
                  ? 'border-2 border-red-500 focus:outline-hidden'
                  : 'border'
              } rounded p-2 w-full`"
              placeholder="john@doe.com"
            />
            <button
              type="button"
              :class="solidButton + ' w-1/3!'"
              @click="addVerseUser"
            >
              <i class="pi pi-plus"></i>
              Add User
            </button>
          </div>
          <span class="text-red-500 mt-2 block text-sm">{{
            errVerse.email
          }}</span>
        </div>

        <p class="text-baseRed text-center" v-if="verseAccess.length === 0">
          Access list empty!
        </p>
        <div
          class="w-1/2 border-2 p-2 rounded-md overflow-y-auto overflow-x-hidden max-h-[20rem]"
          v-if="verseAccess.length > 0"
        >
          <div
            class="w-full flex items-center gap-2 justify-between my-2"
            v-for="access in verseAccess"
          >
            <p>{{ access }}</p>
            <button
              type="button"
              :class="solidButton + ' w-auto!'"
              @click="() => removeVerseUser(access)"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
