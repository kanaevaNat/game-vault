<script setup>
import Card from "@/entities/games/components/Card.vue";

defineProps({
  games: {
    type: Object,
    required:true,
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="page">
    <div v-if="loading" class="loading">
      Загрузка игр...
    </div>

    <div v-else-if="games.length === 0" class="loading">
      Игр пока нет.
    </div>
    <div class="page__grid">
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
  max-width: 1300px;
  margin: 0 auto;

  &__grid{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 300px));
    gap: 2rem;
    justify-content: center;
    align-items: stretch;
  }
}
</style>