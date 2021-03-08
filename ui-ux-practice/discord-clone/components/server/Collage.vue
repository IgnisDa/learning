<template>
  <div class="grid grid-cols-2 grid-rows-2 mx-auto p-1">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="flex justify-center items-center"
    >
      <img
        v-if="image !== ''"
        class="rounded-full p-0.5"
        :src="require(`~/assets/server-icons/${image}`)"
        :alt="`${image}-icon`"
      />
      <ServerInfoInitials
        v-else
        class="p-0.5"
        style="font-size: 10px"
        :server-name="image"
      ></ServerInfoInitials>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
}
</script>
