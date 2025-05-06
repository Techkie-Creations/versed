<script setup></script>

<template>
  <h1 class="font-caveat text-center text-8xl mt-25">SignUp</h1>
  <form class="w-[50vw] mx-auto mt-16">
    <div class="flex justify-between mb-4 gap-2">
      <div class="first w-1/2">
        <label for="first name" class="block mb-2">First Name:</label>
        <input
          class="border rounded p-2 w-full"
          type="text"
          name="fname"
          placeholder="John"
        />
      </div>
      <div class="second w-1/2">
        <label for="lst name" class="block mb-2">Last Name:</label>
        <input
          class="border rounded p-2 w-full"
          type="text"
          name="lname"
          placeholder="Doe"
        />
      </div>
    </div>
    <div class="mb-4 w-full">
      <label for="email" class="block mb-2">Email:</label>
      <input type="email" name="email" class="border rounded p-2 w-full" />
    </div>
    <div class="mb-4 w-full">
      <label for="username" class="block mb-2">Username:</label>
      <input type="text" name="username" class="border rounded p-2 w-full" />
    </div>
    <div class="mb-4 w-full">
      <label for="password" class="block mb-2">Password:</label>
      <input type="password" name="pwd" class="border rounded p-2 w-full" />
    </div>
    <div class="mb-4 w-full">
      <label for="confirm password" class="block mb-2">Confirm Password:</label>
      <input type="password" name="cfmpwd" class="border rounded p-2 w-full" />
    </div>
    <div class="mb-4 w-full">
      <label for="bible verse" class="block mb-2">Favorite Bible Verse:</label>
      <div class="flex justify-between items-center gap-2">
        <select name="version" id="version" class="rounded p-2 border w-full">
          <option value="nkjv">NKJV</option>
        </select>
        <select name="book" id="book" class="rounded p-2 border w-full">
          <option value="genesis">Genesis</option>
        </select>
        <select name="chapter" id="chapter" class="rounded p-2 border w-1/3">
          <option value="1">1</option>
        </select>
        <select name="verse" id="verse" class="rounded p-2 border w-1/3">
          <option value="1">1</option>
        </select>
      </div>
    </div>
    <div class="mb-4 w-full">
      <label class="block mb-2 dark:text-white" for="avatar">Upload file</label>
      <div class="flex justify-between items-center gap-2">
        <input
          class="border rounded w-full p-2 text-alice file:mr-5 file:py-1 file:px-3 file:border-[1px] file:rounded file:bg-eerie file:text-alice hover:file:cursor-pointer hover:file:bg-alice hover:file:text-eerie transition duration-500 ease-in-out"
          aria-describedby="file_input_help"
          id="avatar"
          type="file"
        />
      </div>
      <p class="mt-1 dark:text-gray-300" id="file_input_help">
        SVG, PNG, JPG or GIF (MAX. 800x400px).
      </p>
    </div>
    <button type="submit">SignUp</button>
  </form>
</template>
