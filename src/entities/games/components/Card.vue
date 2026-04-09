<script setup>
defineProps({
  game: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <RouterLink :to="`/games/${game.id}`"  class="card glass">
    <div class="card__top">
      <div class="card__img">
        <img :src="game.preview" :alt="game.name">
      </div>
    </div>
    <div class="card__bottom">
      <div class="card__info">
        <div class="card__info-title">{{game.name}}</div>
      </div>
    </div>
  </RouterLink>
</template>

<style lang="scss" scoped>
.card{
  max-width: 300px;
  min-height: 0;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.6s ease;

  &:hover{
    transform: scale(1.1);
  }

  &__top{
    aspect-ratio: 1 / 1.5;
    width: 100%;
    position: relative;

  }
  &__bottom{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1rem;
  }
  &__img{
    display: block;
    width: 100%;
    height: 100%;
    img {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      object-fit: cover;
      display: block;
    }
  }
  &__info{
    width: 100%;

  }
  &__info-title{
    text-align: left;
    overflow-wrap: break-word;
    white-space: normal;
    min-width: 0;
    margin: 0;
    padding: 0;
  }
}
</style>