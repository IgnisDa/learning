<template>
  <div>
    <ig-icon name="sun" :class="[classes]" variant="black"></ig-icon>
  </div>
</template>

<script>
export default {
  props: {
    classes: {
      type: String,
      default: 'h-8 w-8',
    },
  },
}
</script>
