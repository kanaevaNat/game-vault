<script setup>
import { useNewsStore } from "@/entities/news/store.js";
import { useGameStore } from "@/entities/games/store.js";
import { computed, onMounted } from "vue";
import HomeInformation from "@/shared/components/HomeInformation.vue";
import PreviewGrid from "@/entities/news/components/PreviewGrid.vue";
import Grid from "@/entities/games/components/Grid.vue";
import EmailSubscribeForm from "@/shared/components/EmailSubscribeForm.vue";

const newsStore = useNewsStore();
const allNews = computed(() => newsStore.filteredNewsWithRelativeDate);
const loadingNews = computed(() => newsStore.loading);
const latestNews = computed(() => allNews.value.slice(0, 6));

const gameStore = useGameStore();
const latestGames = computed(() => gameStore.latestGames);
const loadingGames = computed(() => gameStore.loading);

onMounted(() => {
  if (allNews.value.length === 0) {
    newsStore.fetchItems();
  }
  if (gameStore.items.length === 0) {
    gameStore.fetchItems();
  }
});
</script>

<template>
  <div class="home-page">
    <HomeInformation />
    <div class="home-page__header">
      <h1
          class="home-page__title"
      >
        новые игры
      </h1>
    </div>

    <Grid
        :games="latestGames"
        :loading="loadingGames"
    />

    <div class="home-page__header">
      <h1
          class="home-page__title"
      >
        свежие новости
      </h1>
    </div>

    <PreviewGrid
        :items="latestNews"
        :loading="loadingNews"
    />
    <div>
      <EmailSubscribeForm/>
    </div>
    <div class="icon-wrapper">
      <img src="@/shared/icons/output-onlinegiftools (1).gif" class="icon-gif">
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  &__header{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block: 3rem;

    &:first-child{
      padding-top: 0;
    }
  }

  &__title{
    @include neon-outline-text($color-pink-lite);
    font-size: 3rem;
    text-wrap: wrap;
  }
  .icon-wrapper{
    display: flex;
    justify-content: center;

    .icon-gif{
      display: block;
      justify-content: center;
      align-items: center;
      align-content: center;
      width: 20rem;
    }
  }
}
</style>