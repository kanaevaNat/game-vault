<script setup>
import PreviewCard from "@/entities/news/components/PreviewCard.vue";

defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="preview-grid">

    <div v-if="loading" class="preview-grid__status">
      Загрузка новостей...
    </div>

    <div v-else-if="items.length === 0" class="preview-grid__status">
      Новостей пока нет.
    </div>

    <div v-else class="preview-grid__container">
      <PreviewCard
          v-for="item in items"
          :key="item.id"
          :n="item"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preview-grid {
  max-width: 1300px;
  margin: 0 auto;
  &__status {
    text-align: center;
    padding: 4rem 0;
    color: var(--color-grey);
    font-size: 1.1rem;
  }

  &__container {
    display: grid;
    gap: 2rem;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  }
}
</style>