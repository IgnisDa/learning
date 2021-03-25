<template>
  <svg
    v-if="name"
    class="inline-block stroke-2"
    :class="{
      'h-4 w-4': size === 'xs',
      'h-5 w-5': size === 'sm',
      'h-6 w-6': size === 'base',
      'h-8 w-8': size === 'lg',
      'h-16 w-16': size === 'xl',
    }"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <g v-html="icons[name]" />
  </svg>
</template>

<script>
import featherIcons from 'feather-icons/dist/icons.json'
const validator = {
  sizes: ['xs', 'sm', 'base', 'lg', 'xl'],
}
export default {
  validator,
  props: {
    name: {
      required: true,
      type: String,
      validator: (value) =>
        Object.prototype.hasOwnProperty.call(featherIcons, value),
    },
    size: {
      default: 'base',
      type: String,
      validator: (value) => validator.sizes.includes(value),
    },
  },
  data: () => ({
    icons: featherIcons,
  }),
}
</script>
