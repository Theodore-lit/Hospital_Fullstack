import { defineStore } from 'pinia'

export const useNeedStore = defineStore('need', {
  state: () => ({
    numberNeedRoom: null,
    needRoom: [],
  }),

  persist: {
  },

  actions: {
    giveNumber(number) {
      this.numberNeedRoom = number
    },
  },
})
