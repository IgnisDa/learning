<template>
  <div
    id="blog"
    class="mt-20 flex flex-col mx-auto justify-center items-center md:w-5/6 lg:w-7/12 scroll-margin-top"
  >
    <div class="mx-auto text-center md:max-w-7xl">
      <div class="uppercase my-1 font-semibold text-3xl text-gray-700">
        Latest News
      </div>
      <div class="my-3 text-sm text-gray-700 italic md:text-lg">
        Check out our latest news and activities
      </div>
    </div>
    <div class="w-20 h-0.5 mx-auto my-4 bg-blue-400"></div>
    <div class="flex flex-wrap">
      <div
        v-for="(section, index) in sections"
        :key="index"
        class="w-11/12 md:w-1/3 mx-auto my-3 md:p-3"
      >
        <div>
          <img
            :src="require(`~/assets/images/news-${index + 1}.jpg`)"
            :alt="`news-${index + 1}.jpg`"
            class="h-full w-full object-cover"
          />
          <div class="text-gray-800 text-lg font-bold my-2">
            {{ section.text }}
          </div>
          <div
            class="italic text-gray-700 text-sm tracking-tight opacity-50 font-semibold"
          >
            {{ section.date | formatDate }}
          </div>
          <div class="text-gray-600 my-2">
            {{ section.body }}
          </div>
          <div
            class="uppercase text-sm text-blue-500 font-semibold cursor-pointer"
          >
            Read More &#8594;
          </div>
        </div>
      </div>
    </div>
    <div>
      <button
        class="mt-10 p-2 text-center mx-auto px-7 rounded-md font-semibold uppercase border border-blue-400 hover:text-gray-200 hover:bg-blue-400 transition duration-200 ease-in"
      >
        Read Our Blog
      </button>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    formatDate(date) {
      // console.log(date)
      const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
        date
      )
      const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(
        date
      )
      const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
      return `${day} ${month}, ${year}`
    },
  },
  data: () => ({
    sections: [
      {
        text: 'Tempor incidunt labore dolor',
        date: new Date('August 24, 2021'),
        body:
          'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
      {
        text: 'Eiusmod tempor labore aliqua',
        date: new Date('August 20, 2021'),
        body:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        text: 'Conseqntur distinctio ipsum',
        date: new Date('August 18, 2021'),
        body:
          'Aenean commodo ligula eget dolor sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
      },
    ],
  }),
}
</script>
