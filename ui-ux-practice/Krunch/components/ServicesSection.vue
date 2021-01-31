<template>
  <div
    id="services"
    class="mt-20 flex flex-col md:max-w-7xl mx-auto justify-center items-center"
  >
    <div class="mx-auto text-center">
      <div class="uppercase my-1 font-semibold text-3xl text-gray-700">
        Services
      </div>
      <div class="my-3 text-sm text-gray-800 italic md:text-lg">
        Scope of our featured premium services
      </div>
    </div>
    <div class="w-20 h-0.5 mx-auto my-4 bg-blue-400"></div>
    <div class="flex flex-wrap mx-3 md:w-11/12">
      <div
        v-for="(section, index) in sections"
        :key="index"
        class="w-full md:w-1/3 my-5 p-2"
      >
        <FontAwesomeIcon
          class="h-9 w-9 fill-current text-blue-500"
          :icon="section.icon"
        />
        <div
          class="my-3 uppercase text-xl font-bold text-gray-800 tracking-wide"
        >
          {{ section.label }}
        </div>
        <div class="text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim eros elementum tristique. Duis cursus, viverra ornare,
          eros dolor interdum nulla, commodo diam libero vitae.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    sections: [
      { label: 'Web Design', icon: ['fas', 'desktop'] },
      { label: 'Web Design', icon: ['fas', 'code'] },
      { label: 'Apps Design', icon: ['fab', 'android'] },
      { label: 'Photography', icon: ['fas', 'camera'] },
      { label: 'Branding', icon: ['fas', 'magic'] },
      { label: 'Hosting', icon: ['fas', 'globe-asia'] },
    ],
  }),
}
</script>
