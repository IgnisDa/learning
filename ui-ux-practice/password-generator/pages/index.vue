<template>
  <div class="flex items-center justify-center">
    <div class="bg-red-100">
      <div>{{ generatedPassword }}</div>
      <div>
        <div
          v-for="(action, index) in actions"
          :key="index"
          class="flex items-center"
        >
          <div>{{ action.label }}</div>
          <toggler
            :toggled="$store.state.password[action.state]"
            @click.native="action['action']()"
          ></toggler>
        </div>
      </div>
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
      length: (state) => state.password.length,
    }),
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
