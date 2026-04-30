<script setup>
import {useNewsStore} from "@/entities/news/store.js";
import {computed, onMounted} from "vue";
import FeedCard from "@/entities/news/components/FeedCard.vue";
import Search from "@/shared/components/Search.vue";
import Icon from "@/shared/icons/Icon.vue";

const newsStore = useNewsStore();
const news = computed(() => newsStore.filteredNewsWithRelativeDate);
const loading = computed(() => newsStore.loading);

const hasActiveFilters = computed(() => {
  return (
      newsStore.searchQuery?.trim()
  );
});

const reset = () => {
  newsStore.searchQuery = '';
};

onMounted(() => {
  if (news.value.length === 0) {
    newsStore.fetchItems()
  }
})
</script>

<template>
<div class="page">
  <div class="filters-controls">
  <Search
      :model-value="newsStore.searchQuery"
      @update:model-value="newsStore.searchQuery = $event"
  />
  <div class="filter-buttons">
  <button
      class="filter-button glass reset-btn"
      :class="{ 'reset-btn--visible': hasActiveFilters }"
      @click="reset"
  >
    <Icon name="close" class="icon"/>
  </button>
  </div>
  </div>
  <div class="page__grid">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="news.length === 0" class="loading">Нет новостей</div>
    <FeedCard
        v-for="n in news"
        :key="n.id"
        :n="n"
    />
  </div>
</div>
</template>

<style scoped lang="scss">
.page {
  .filters-controls {
    gap: 1rem;
    padding-inline: 4rem 1rem;

    .search, .filter-buttons {
      margin-bottom: 4rem;
    }

    @media (max-width: 800px) {
      padding-inline: 4rem 1.5rem;

      .search, .filter-buttons {
        margin-bottom: 2rem;
      }
    }
  }

  &__grid{
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin: 0 auto;

    @media (max-width: 800px) {
      gap: 1rem;
    }
  }
}
</style>