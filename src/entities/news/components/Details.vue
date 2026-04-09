<script setup>
import {useRoute} from 'vue-router';
import {computed, onMounted} from 'vue';
import {useNewsStore} from "@/entities/news/store.js";
import PreviewGrid from "@/entities/news/components/PreviewGrid.vue";

const route = useRoute();
const newsStore = useNewsStore();
const newsId = computed(() => route.params.id);

const news = computed(() => {
  return newsStore.findItemById(newsId.value) || newsStore.currentNews;
});

const recommendations = computed(() => {
  if (!newsStore.items.length) return [];

  return newsStore.items
      .filter(item => item.id != newsId.value)
      .slice(0, 3);
})

onMounted(async () => {
  if (!news.value) {
    await newsStore.fetchItemById(newsId.value);
  }
  if (newsStore.items.length === 0) {
    await newsStore.fetchItems();
  }
});
</script>

<template>
  <div class="card-wrapper">
    <div v-if="news" class="card-news glass">
      <div class="card-news__date">
        <div class="card-news__date-subtitle">{{ news.relativeDate }}</div>
      </div>

      <div class="card-news__info">
        <div class="card-news__info-title">{{ news.title }}</div>
      </div>

      <div class="card-news__img">
        <img :src="news.image" :alt="news.title">
      </div>

      <VueMarkdown :source="news.content" class="text-markdown"/>
    </div>
    <div v-else class="loading">
      Загрузка новости...
    </div>

    <section v-if="recommendations.length" class="recommendations">
      <h2 class="recommendations__title">Читайте также</h2>
      <PreviewGrid :items="recommendations" :loading="false"/>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.card-wrapper {
  position: relative;
  @include header-padding(4rem);
  padding-bottom: 4rem;
  padding-inline: 2rem;

  @media (max-width: 800px) {
    @include header-padding(2rem);
    padding-inline: 1rem;
    padding-bottom: 2rem;
  }
}
.recommendations{
  width: clamp(300px, 90vw, 1050px);
  margin: 0 auto;
  padding-block: 4rem;

  &__title{
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
    color: var(--color-input-text);
  }
  @media (max-width: 800px) {
    padding-block: 2rem;
    &__title{
      font-size: 1.2rem;
      margin: 0 0 1rem 0;
    }
  }
}
</style>