<script setup>
const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="card glass">
    <div class="card__top">
      <a href="/" class="card__img">
        <img :src="game.preview" alt="{{game.name}}">
      </a>
    </div>
    <div class="card__bottom">
      <div class="card__info">
        <div class="card__info-title">{{game.name}}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card{
  margin-top: 4rem;
  width: clamp(200px, 80vw, 250px);

  min-height: 0;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &__top{
    aspect-ratio: 1 / 1;
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