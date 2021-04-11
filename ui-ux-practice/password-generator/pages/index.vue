<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div
      class="flex flex-col items-center w-10/12 px-5 py-3 space-y-3 bg-gray-300 rounded-xl dark:bg-warm-gray-800 sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-5/12 2xl:1/4"
    >
      <div
        class="w-full text-lg font-extrabold tracking-wide text-left sm:text-xl md:text-2xl"
      >
        Password Generator
      </div>
      <div class="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
        <span v-if="generatedPassword.length !== 0">
          {{ generatedPassword }}
        </span>
        <span v-else>Click Generate</span>
      </div>
      <div class="flex flex-col items-center w-full space-y-1">
        <div>
          <input
            v-model="length"
            type="range"
            class="focus:outline-none"
            min="10"
            max="50"
            step="1"
          />
        </div>
        <div
          v-for="(action, index) in actions"
          :key="index"
          class="flex items-center justify-between w-full px-3"
        >
          <div>{{ action.label }}</div>
          <toggler
            :toggled="$store.state.password[action.state]"
            @click.native="action['action']()"
          ></toggler>
        </div>
      </div>
      <div>
        <generate-button @click.native="generateAndSetPasswordMutation()">
        </generate-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Toggler from '~/components/Toggler.vue'

export default {
  components: { Toggler },
  data() {
    return {
      actions: [
        {
          label: 'Include Uppercase',
          state: 'uppercase',
          action: this.togglePasswordIncludeUppercaseMutation,
        },
        {
          label: 'Include Lowercase',
          state: 'lowercase',
          action: this.togglePasswordIncludeLowercaseMutation,
        },
        {
          label: 'Include Numbers',
          state: 'numbers',
          action: this.togglePasswordIncludeNumbersMutation,
        },
        {
          label: 'Include Symbols',
          state: 'symbols',
          action: this.togglePasswordIncludeSymbolsMutation,
        },
      ],
    }
  },
  computed: {
    ...mapState({
      generatedPassword: (state) => state.password.generatedPassword,
    }),
    length: {
      get() {
        return this.$store.state.password.length
      },
      set(newValue) {
        return this.$store.commit('password/setPasswordLength', newValue)
      },
    },
  },
  mounted() {},
  methods: {
    ...mapMutations({
      generateAndSetPasswordMutation: 'password/generateAndSetPassword',
      togglePasswordIncludeUppercaseMutation:
        'password/togglePasswordIncludeUppercase',
      togglePasswordIncludeLowercaseMutation:
        'password/togglePasswordIncludeLowercase',
      togglePasswordIncludeNumbersMutation:
        'password/togglePasswordIncludeNumbers',
      togglePasswordIncludeSymbolsMutation:
        'password/togglePasswordIncludeSymbols',
      setPasswordLengthMutation: 'password/setPasswordLength',
    }),
  },
}
</script>
