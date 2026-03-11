<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 24 }
});

const icons = {
  filter: '<path fill="currentColor" d="M8.75 13.5a3.25 3.25 0 0 1 3.163 2.5h9.337a.75.75 0 0 1 .102 1.493l-.102.007h-9.337a3.251 3.251 0 0 1-6.326 0H2.75a.75.75 0 0 1-.102-1.493L2.75 16h2.837a3.25 3.25 0 0 1 3.163-2.5m6.5-9.5a3.25 3.25 0 0 1 3.163 2.5h2.837a.75.75 0 0 1 .102 1.493L21.25 8h-2.837a3.251 3.251 0 0 1-6.326 0H2.75a.75.75 0 0 1-.102-1.493L2.75 6.5h9.337A3.25 3.25 0 0 1 15.25 4"/>',
  close: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m18 18l-6-6m0 0L6 6m6 6l6-6m-6 6l-6 6"/>',
  arrowDown: '<path fill="currentColor" d="M21.886 5.536A1.002 1.002 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13a.998.998 0 0 0 1.644 0l9-13a.998.998 0 0 0 .064-1.033M12 17.243L4.908 7h14.184z"/>'
};
</script>

<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      class="icons"
      v-html="icons[name]"
  />
</template>

<style scoped>
.icons {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
  stroke: currentColor;
}
</style>