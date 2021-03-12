<template>
  <div class="relative flex flex-col px-5 overflow-auto bg-red-100 pt-14">
    <div class="flex-grow">
      <div v-for="index in 100" :key="index">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam itaque
        optio iure ipsam perferendis possimus minima omnis soluta repellendus
        vel totam labore consequatur non vitae odio, facilis mollitia deleniti
        excepturi.
      </div>
    </div>
    <div class="flex-none" style="height: 68px">
      <MessageInput></MessageInput>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  background: transparent;
  width: 0;
}
</style>
