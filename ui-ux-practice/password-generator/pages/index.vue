<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div
      class="flex flex-col items-center w-10/12 px-5 py-3 space-y-3 bg-gray-300 rounded-xl dark:bg-warm-gray-800 sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-5/12 2xl:1/4"
    >
      <div
        class="w-full text-lg font-extrabold tracking-wide text-left sm:text-xl md:text-2xl dark:text-gray-100"
      >
        Password Generator
      </div>
      <div
        class="w-full py-2 my-8 font-mono text-xs text-center bg-purple-400 rounded-lg shadow-2xl dark:bg-purple-700 sm:text-sm md:text-base lg:text-lg xl:text-xl"
      >
        <div
          v-if="generatedPassword.length !== 0"
          class="flex items-center justify-between w-full px-3 space-x-3 overflow-auto"
        >
          <div>
            {{ generatedPassword }}
          </div>
          <div @click="copyPasswordToClipboard()">
            <div class="relative cursor-pointer">
              <FontAwesomeIcon
                class="w-6 h-6 sm:w-8 sm:h-8"
                :icon="['fas', 'clipboard']"
              ></FontAwesomeIcon>
              <FontAwesomeIcon
                :class="{ 'opacity-0': !copied }"
                class="absolute top-0 left-0 w-3 h-3 my-auto transition-opacity duration-300 sm:w-4 sm:h-4 dark:text-lime-500 text-rose-500"
                :icon="['fas', 'check']"
              ></FontAwesomeIcon>
            </div>
          </div>
        </div>
        <div v-else class="w-6 h-6 sm:w-8 sm:h-8"></div>
      </div>
      <div
        class="flex flex-col items-center w-full space-y-3 text-xs font-display dark:text-red-100 sm:text-sm md:text-base"
      >
        <div
          class="flex flex-col items-center justify-between w-full px-3 py-2 rounded-lg sm:flex-row bg-warm-gray-400 dark:bg-warm-gray-700"
        >
          <div>Length</div>
          <div
            class="flex items-center space-x-2 font-extrabold dark:text-white"
          >
            <div>10</div>
            <input
              v-model="length"
              type="range"
              class="focus:outline-none"
              min="10"
              max="50"
              step="1"
            />
            <div>50</div>
          </div>
          <div>{{ length }}</div>
        </div>
        <div
          v-for="(action, index) in actions"
          :key="index"
          class="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-warm-gray-400 dark:bg-warm-gray-700"
        >
          <div>{{ action.label }}</div>
          <toggler
            :toggled="$store.state.password[action.state]"
            @click.native="action['action']()"
          ></toggler>
        </div>
      </div>
      <div>
        <generate-button
          @click.native="
            generateAndSetPasswordMutation()
            copied = false
          "
        >
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
      copied: false,
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
  head: () => ({
    title: 'Password Generator',
  }),
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
  methods: {
    copyPasswordToClipboard() {
      this.$copyText(this.$store.state.password.generatedPassword)
      this.copied = true
    },
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
