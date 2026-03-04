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
        class="search__input glass"
        placeholder="Поиск..."
    />
  </div>
</template>

<style scoped lang="scss">
.search{
  display: flex;
  justify-content: center;
  @include header-margin;

  &__input {
    width: 100%;
    max-width: 560px;
    padding: 14px 20px;
    font-size: 1rem;
    border-radius: 12px;
    color: var(--color-input-text);
    outline: none;
    transition: border-color 0.3s ease;
    border: 2px solid transparent;

    &:focus {
      border-color: var(--color-input-text);
    }

    &::placeholder {
      color: var(--color-input-text);
      font-size: 1rem;
    }
  }
}
</style>