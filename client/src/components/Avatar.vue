<script setup lang="ts">
import { defaultAvatar, fileObject, tooltipTheme } from "@/utils/FileObject";
import { defaultFileObj, imageObject } from "@/utils/Types";
import { Button } from "primevue";

const file = defineModel("file");
const props = defineProps({
  text: String,
  size: {
    type: Number,
    default: 4,
  },
  avatar: {
    type: String,
    default: defaultAvatar,
  },
});

const handleFileChange = async (e) => {
  if (e.target.files?.length !== 0) {
    const image = e.target.files ? e.target.files[0] : new Blob();
    const imageUrl = URL.createObjectURL(image);
    file.value = imageUrl;

    const { name, type } =
      image instanceof File ? image : { name: "", type: "" };

    imageObject[0] = {
      fileUrl: imageUrl,
      fileName: name,
      fileType: type,
    };
  } else {
    const { fileUrl, fileName, fileType } =
      imageObject.length > 0 ? imageObject[0] : defaultFileObj;
    const file = document.getElementById("file");

    if (fileUrl && fileName) {
      if (file instanceof HTMLInputElement) {
        file.files = await fileObject({ fileUrl, fileName, fileType }, false);
        // console.log(
        //   "OBJ",
        //   await fileObject({ fileUrl, fileName, fileType }, false)
        // );
      }
    }
  }
};

const handleRemoval = async () => {
  const files = document.getElementById("file");
  if (files instanceof HTMLInputElement) {
    files.value = "";
    file.value = props.avatar;
    const { fileUrl, fileName, fileType } = imageObject[0];
    URL.revokeObjectURL(fileUrl);
    await fileObject({ fileUrl, fileName, fileType }, true);
    imageObject.pop();
    files.files = await fileObject(defaultFileObj, false);
  }
};
</script>

<template>
  <div class="mb-6 w-full">
    <label class="block mb-2 dark:text-white" for="avatar"
      ><i class="pi pi-user text-baseRed mr-4 mb-2"></i> {{ text }}</label
    >
    <div class="flex justify-between items-center gap-2">
      <img
        :src="`${file}`"
        alt="avatar"
        :class="`w-[${size}rem] h-[4rem] rounded-[50%] object-fit object-center border-1 border-alice`"
      />
      <input
        @change="handleFileChange($event)"
        class="border rounded w-full p-2 text-alice file:mr-5 file:py-1 file:px-3 file:border-[1px] file:rounded file:bg-eerie file:text-alice hover:file:cursor-pointer hover:file:bg-alice hover:file:text-eerie transition duration-500 ease-in-out"
        aria-describedby="image"
        name="avatar"
        type="file"
        ref="fileInput"
        accept="image/png, image/jpeg"
        id="file"
      />
      <Button
        v-if="file !== props.avatar"
        icon="pi pi-times"
        v-tooltip.top="{
          value: 'Remove image',
          ...tooltipTheme,
        }"
        class="border p-2 rounded hover:bg-alice hover:text-eerie"
        @click="handleRemoval"
      />
    </div>
    <p class="mt-2 text-sm">PNG, JPG (MAX. 800x400px).</p>
  </div>
</template>
