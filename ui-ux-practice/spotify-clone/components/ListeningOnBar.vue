<template>
  <div
    v-show="listeningOnOtherDevice"
    id="listening-on-bar"
    class="h-6 bg-spotify-green"
  >
    NavBar
  </div>
</template>

<script>
export default { data: () => ({ listeningOnOtherDevice: false }) }
</script>
