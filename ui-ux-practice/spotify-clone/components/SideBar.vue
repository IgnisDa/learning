<template>
  <div id="sidebar" class="w-[232px] bg-dark-black">
    <div class="flex flex-col">
      <img
        :src="require('~/assets/images/logo-written.png')"
        alt="spotify-logo"
        class="object-contain h-10 m-6"
      />
      <div class="flex flex-col mx-2 space-y-1">
        <div
          v-for="(area, index) in areas"
          :key="index"
          class="flex items-center px-2 py-[6px] rounded-sm cursor-pointer hover:bg-light-black space-x-[1rem]"
        >
          <ig-icon
            :id="`${area.icon}-icon`"
            :name="area.icon"
            class="text-gray-100"
          ></ig-icon>
          <div class="font-semibold capitalize text-gray-50">
            {{ area.label }}
          </div>
        </div>
      </div>
      <div class="flex flex-col mx-2 mt-6">
        <div class="flex flex-col space-y-1">
          <div
            v-for="(action, index) in actions"
            :key="index"
            class="flex items-center px-2 cursor-pointer space-x-[1rem]"
          >
            <ig-icon
              :id="`${action.icon}-icon`"
              :name="action.icon"
              class="text-gray-100"
            ></ig-icon>
            <div class="font-semibold capitalize text-gray-50">
              {{ action.label }}
            </div>
          </div>
        </div>
        <div class="h-[1px] w-full bg-gray-800 my-4"></div>
        <div class="flex flex-col mx-2 space-y-2">
          <div v-for="(playlist, index) in playlists" :key="index">
            <span class="text-sm tracking-wide text-gray-200 capitalize">{{
              playlist
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    areas: [
      { label: 'Home', icon: 'home' },
      { label: 'Search', icon: 'search' },
      { label: 'Your Library', icon: 'bookmark' },
    ],
    actions: [
      { label: 'Create Playlist', icon: 'plus' },
      { label: 'Liked Songs', icon: 'heart' },
    ],
    playlists: [
      'Liked from Radio',
      'My Playlist #2',
      'This is Lindsey Sterling',
      'Workout',
      'Power WorkOut',
    ],
  }),
}
</script>
