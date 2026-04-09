<script setup>
import {useNewsStore} from "@/entities/news/store.js";
import {computed, onMounted} from "vue";
import FeedCard from "@/entities/news/components/FeedCard.vue";
import Search from "@/shared/components/Search.vue";

const newsStore = useNewsStore();
const news = computed(() => newsStore.filteredNewsWithRelativeDate);
const loading = computed(() => newsStore.loading);

onMounted(() => {
  if (news.value.length === 0) {
    newsStore.fetchItems()
  }
})
</script>

<template>
<div class="page">
  <Search
      :model-value="newsStore.searchQuery"
      @update:model-value="newsStore.searchQuery = $event"
      class="page__search"
  />

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
  padding-block: 4rem;
  display: flex;
  flex-direction: column;
  &__search{
    display: flex;
    justify-content: center;
    @include header-margin;
    margin-inline: 1.5rem;
    margin-bottom: 4rem;
  }
  &__grid{
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin: 0 auto;
  }
}
</style>