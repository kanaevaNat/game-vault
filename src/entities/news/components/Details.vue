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
}
.recommendations{
  width: clamp(300px, 90vw, 1050px);
  margin: 0 auto;
}
</style>