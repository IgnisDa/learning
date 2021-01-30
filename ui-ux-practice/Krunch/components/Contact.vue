<template>
  <div
    id="contact"
    class="mt-20 flex flex-col md:max-w-7xl mx-auto justify-center items-center"
  >
    <div class="mx-auto text-center">
      <div class="uppercase my-1 font-semibold text-3xl text-gray-700">
        Keep in Touch
      </div>
      <div class="my-3 text-sm text-gray-700 italic md:text-lg">
        Setibulum rutrum quam vitae fringilla tincidunt
      </div>
    </div>
    <div class="w-20 h-0.5 mx-auto my-4 bg-blue-400"></div>
    <form class="w-full sm:w-9/12">
      <div class="flex flex-wrap w-full px-3 mb-5">
        <div class="w-full sm:w-1/2 sm:pr-4">
          <input
            id="your-name"
            type="text"
            name="your-name"
            placeholder="Enter your name"
            class="rounded-sm w-full border-2 p-2"
          />
        </div>
        <div class="w-full sm:w-1/2 sm:pl-4">
          <input
            id="their-name"
            type="text"
            placeholder="Enter their name"
            name="their-name"
            class="rounded-sm w-full border-2 p-2"
          />
        </div>
      </div>
      <div class="w-full p-3 my-2">
        <input
          id="email"
          type="email"
          name="your-name"
          placeholder="Enter your email address"
          class="w-full rounded-sm border-2 p-2"
        />
      </div>
      <div class="w-full p-3">
        <textarea
          id="message"
          name="message"
          placeholder="Your Message"
          class="w-full h-60 resize-none rounded-sm border-2 p-2"
        ></textarea>
      </div>
    </form>
    <div class="my-10">
      <button
        class="uppercase bg-blue-500 mx-5 my-2 md:mx-3 p-3 text-gray-50 text-sm font-bold tracking-wide px-8 rounded-md hover:bg-gray-800 transition duration-200 ease-in"
      >
        Send Message
      </button>
    </div>
  </div>
</template>
