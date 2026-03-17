<script setup>
import { useNewsStore } from "@/entities/news/store.js";
import { computed, onMounted } from "vue";
import PreviewGrid from "@/entities/news/components/PreviewGrid.vue";

const newsStore = useNewsStore();
const allNews = computed(() => newsStore.filteredNewsWithRelativeDate);
const loading = computed(() => newsStore.loading);

const latestNews = computed(() => allNews.value.slice(0, 6));

onMounted(() => {
  if (allNews.value.length === 0) {
    newsStore.fetchItems();
  }
});
</script>

<template>
  <div class="home-page">
    <header class="home-page__header">
      <h1
          class="home-page__title"
      >
        новости
      </h1>
    </header>

    <PreviewGrid
        :items="latestNews"
        :loading="loading"
    />
  </div>
</template>

<style scoped lang="scss">
.home-page {
  @include header-padding(4rem);
  padding-bottom: 4rem;
  max-width: 1300px;
  margin: 0 auto;

  &__header{
    margin-bottom: 2rem;
  }
  &__title{
    @include neon-outline-text($color-pink-lite);
    align-items: center;
    display: flex;
    justify-content: center;
    font-size: 3rem;
  }
}
</style>