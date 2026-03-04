<script setup>
import Search from "@/shared/components/Search.vue";
import Grid from "@/entities/games/components/Grid.vue";
import {useGameStore} from "@/entities/games/store.js";
import {computed, onMounted} from "vue";

const gameStore = useGameStore();
const games = computed(() => gameStore.filteredGames);
const loading = computed(() => gameStore.loading);

onMounted(() => {
  if (games.value.length === 0) {
    gameStore.fetchItems()
  }
})
</script>

<template>
  <div class="page">
    <Search
        :model-value="gameStore.searchQuery"
        @update:model-value="gameStore.searchQuery = $event"
    />
    <div v-if="loading" class="">Загрузка</div>
    <div v-else-if="games.length === 0" class="">Нет игр</div>
    <Grid v-else :games="games"></Grid>
  </div>
</template>

<style scoped>
.page {
  padding-block: 4rem;
}
</style>