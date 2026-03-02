<script setup>
import {useNewsStore} from "@/entities/news/store.js";
import {computed, onMounted} from "vue";
import FeedCard from "@/entities/news/components/FeedCard.vue";

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
  <div class="page__search">
    <input
        v-model="newsStore.searchQuery"
        type="text"
        class="page__search-input glass"
        placeholder="Поиск..."
    >
  </div>
  <div class="page__grid">
    <div v-if="loading" class="">Загрузка...</div>
    <div v-else-if="news.length === 0" class="">Нет новостей</div>
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

    &-input {
      width: 100%;
      max-width: 560px;
      padding: 14px 20px;
      font-size: 18px;
      border: 2px solid var(--color-border);
      border-radius: 12px;
      color: var(--color-input-text);
      outline: none;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: var(--color-dark);
      }

      &::placeholder {
        color: var(--color-dark);
      }
    }
  }
  &__grid{
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin: 0 auto;
  }
}
</style>