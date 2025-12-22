<script setup>
import {useGameStore} from "@/entities/games/store.js";
import {computed, onMounted} from "vue";
import Card from "@/entities/games/components/Card.vue";

const gameStore = useGameStore();
const games = computed(() => gameStore.games);
const loading = computed(() => gameStore.loading);

onMounted(() => {
  if (games.value.length === 0) {
    gameStore.fetchGames()
  }
})
</script>

<template>
  <div class="games-grid">
    <div v-if="loading" class="">Загрузка</div>
    <div v-else-if="games.length === 0" class="">Нет игр</div>
    <Card
      v-for="game in games"
      :key="game.id"
      :game="game"
    />
  </div>
</template>

<style scoped>
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 4.5rem;
  padding: 80px;
  align-items: stretch;
}
</style>