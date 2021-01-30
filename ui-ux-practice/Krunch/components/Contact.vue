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
    <form class="w-full md:w-9/12">
      <div class="flex flex-wrap mx-3 w-full">
        <div class="w-full sm:w-1/2 md:pr-4 my-5">
          <input
            id="your-name"
            type="text"
            name="your-name"
            placeholder="Enter your name"
            class="rounded-sm w-full border-2 p-2"
          />
        </div>
        <div class="w-full sm:w-1/2 md:pl-4 my-5">
          <input
            id="their-name"
            type="text"
            placeholder="Enter their name"
            name="their-name"
            class="rounded-sm w-full border-2 p-2"
          />
        </div>
      </div>
      <div>
        <input
          id="email"
          type="email"
          name="your-name"
          placeholder="Enter your email address"
          class="w-full rounded-sm my-5 border-2 p-2 mx-3"
        />
      </div>
      <div>
        <textarea
          id="message"
          name="message"
          placeholder="Your Message"
          class="w-full h-60 resize-none rounded-sm my-5 border-2 p-2 mx-3"
        ></textarea>
      </div>
    </form>
    <div>
      <button
        class="uppercase bg-blue-500 mx-5 my-2 md:mx-3 p-3 text-gray-50 text-sm font-bold tracking-wide md:px-8 rounded-md hover:bg-gray-800 transition duration-200 ease-in"
      >
        Send Message
      </button>
    </div>
  </div>
</template>
