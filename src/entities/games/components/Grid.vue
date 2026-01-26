<script setup>
import {useGameStore} from "@/entities/games/store.js";
import {computed, onMounted} from "vue";
import Card from "@/entities/games/components/Card.vue";

const gameStore = useGameStore();
const games = computed(() => gameStore.filteredGames);
const loading = computed(() => gameStore.loading);

onMounted(() => {
  if (games.value.length === 0) {
    gameStore.fetchGames()
  }
})
</script>

<template>
  <div class="page">
    <div class="page__search">
      <input
        v-model="gameStore.searchQuery"
        type="text"
        class="page__search-input glass"
        placeholder="Поиск..."
      />
    </div>
    <div class="page__grid">
      <div v-if="loading" class="">Загрузка</div>
      <div v-else-if="games.length === 0" class="">Нет игр</div>
      <Card
        v-for="game in games"
        :key="game.id"
        :game="game"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding: 40px 20px;
  &__search{
    display: flex;
    justify-content: center;
    margin-top: 100px;

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
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 4.5rem;
    padding: 80px;
    align-items: stretch;
  }
}
</style>