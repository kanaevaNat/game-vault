<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="search">
    <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        class="search-input glass"
        placeholder="Поиск..."
    />
  </div>
</template>

<style scoped lang="scss">
.search{
  display: flex;
  justify-content: center;

  .search-input {
    max-width: 560px;
  }
}
</style>