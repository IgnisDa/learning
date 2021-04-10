<template>
  <div class="flex items-center justify-center">
    <div class="bg-red-100">
      <div>{{ generatedPassword }}</div>
      <div>{{ config }}</div>
      <div>
        <button
          class="appearance-none"
          @click="generateAndSetPasswordMutation()"
        >
          Generate
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      generatedPassword: (state) => state.password.generatedPassword,
      config: (state) => state.password.config,
    }),
  },
  mounted() {},
  methods: {
    ...mapMutations({
      generateAndSetPasswordMutation: 'password/generateAndSetPassword',
      togglePasswordIncludeUppercaseMutation:
        'password/togglePasswordIncludeUppercase',
    }),
  },
}
</script>
