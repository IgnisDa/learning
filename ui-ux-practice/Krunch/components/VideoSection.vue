<template>
  <div
    id="video"
    class="mt-20 flex flex-col mx-auto justify-center items-center scroll-margin-top"
  >
    <div>
      <div class="flex">
        <FontAwesomeIcon
          class="fill-current text-white mx-auto cursor-pointer"
          :icon="['fas', 'play-circle']"
          size="6x"
        ></FontAwesomeIcon>
      </div>
      <div
        class="mx-auto mt-3 md:mt-6 text-center text-lg md:text-xl text-white w-9/12 md:w-full leading-loose italic"
      >
        <div>
          Aenean commodo ligula eget dolor sociis natoque penatibus et magnis
        </div>
        <div>dis parturient montes, nascetur ridiculus consectetur muse.</div>
      </div>
    </div>
    <button
      class="uppercase mt-10 bg-blue-500 my-2 md:mx-3 p-3 text-gray-50 text-sm font-bold tracking-wide px-8 rounded-md hover:bg-gray-800 transition duration-200 ease-in"
    >
      Download Now
    </button>
  </div>
</template>

<style scoped>
#video {
  min-height: 470px;
  background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.7)
    ),
    url('~assets/images/video-bg.jpg');
  @apply bg-local bg-center bg-no-repeat bg-cover;
}
</style>
