<script setup>
const props = defineProps({
  message: String,
  type: Boolean,
})
</script>

<template>
  <div
    :class="
      props.type == true ? 'text-green-800' : props.type == false ? 'text-red-800' : 'text-blue-800'
    "
  >
    {{ props.message }}
  </div>
</template>

<style scoped></style>
