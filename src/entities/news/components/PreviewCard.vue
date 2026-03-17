<script setup>
import {useRouter} from 'vue-router';

const props = defineProps({
  n: {
    type: Object,
    required: true,
  }
})

const router = useRouter()

const goToFullNews = () => {
  router.push(`/news/${props.n.id}`)
}
</script>

<template>
  <div class="hero-card" @click="goToFullNews">
    <img :src="n.image" :alt="n.title" class="hero-card__bg">

    <div class="hero-card__overlay"></div>

    <div class="hero-card__content">

      <h3 class="hero-card__title">{{ n.title }}</h3>

      <div class="hero-card__meta">
        <span class="hero-card__date">{{ n.relativeDate }}</span>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero-card {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 16 / 9;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px) scale(1.02);
  }

  &__bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    transition: transform 0.6s ease;
  }

  &:hover &__bg {
    transform: scale(1.1);
  }

  &__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70%;
    z-index: 2;
    background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.7) 40%,
            rgba(0, 0, 0, 0) 100%
    );
  }

  &__content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    z-index: 3;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  &__date {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  &__title {
    font-size: 1rem;
    line-height: 1.3;
    color: #ffffff;
    margin: 0;
    font-weight: 700;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }
}
</style>