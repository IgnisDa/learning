<template>
  <div
    id="team"
    class="mt-20 flex flex-col md:max-w-7xl mx-auto justify-center items-center"
  >
    <div class="mx-auto text-center">
      <div class="uppercase my-1 font-semibold text-3xl text-gray-700">
        Awesome Team
      </div>
      <div class="my-3 text-sm text-gray-700 italic md:text-lg">
        Setibulum rutrum quam vitae fringilla tincidunt
      </div>
    </div>
    <div class="w-20 h-0.5 mx-auto my-4 bg-blue-400"></div>
    <div class="flex flex-wrap mx-3 md:w-5/6 lg:w-11/12">
      <div
        v-for="(person, index) in people"
        :key="index"
        class="w-full my-4 md:w-1/2 lg:w-1/4 md:p-3"
      >
        <div>
          <img
            :src="require(`~/assets/images/team-${index + 1}.jpg`)"
            :alt="`team-${index + 1}.jpg`"
            class="h-full w-full object-cover"
          />
          <div class="text-center text-gray-800 mt-3 font-bold">
            {{ person.name }}
          </div>
          <div class="text-center text-gray-600 my-1">
            {{ person.position }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    people: [
      { name: 'MICHAEL THOMAS', position: 'Creative Director' },
      { name: 'ALEXA MEYER', position: 'Graphic Designer' },
      { name: 'JEFFREY STEWARD', position: 'Web Designer' },
      { name: 'BRUCE MOORE', position: 'Web Designer' },
    ],
  }),
}
</script>
