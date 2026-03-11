<script setup>
import Card from "@/entities/games/components/Card.vue";

defineProps({
  games: {
    type: Object,
    required:true,
  }
})
</script>

<template>
  <div class="page">
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
    grid-template-columns: repeat(auto-fit, 300px);
    gap: 2rem;
    justify-content: center;
    align-items: stretch;
  }
}
</style>