<script setup>
import {useRouter} from 'vue-router';
import {computed} from 'vue';

const props = defineProps({
  n: {
    type: Object,
    required: true,
  }
})
const router = useRouter()

const previewContent = computed(() => {
  if (!props.n.content) return ''

  const normalized = props.n.content.replace(/\r\n/g, '\n')

  return normalized
      .split('\n\n')
      .slice(0, 2)
      .join('\n\n')
})

const goToFullNews = () => {
  router.push(`/news/${props.n.id}`)
}
</script>

<template>
  <div class="card glass">

    <div class="card__date">
      <div class="card__date-subtitle">{{ n.relativeDate }}</div>
    </div>

    <div class="card__info">
      <div class="card__info-title">{{ n.title }}</div>
    </div>

    <div class="card__img">
      <img :src="n.image">
    </div>
    <VueMarkdown :source="previewContent" class="text-markdown"/>
    <div class="card__button">
      <button
          @click="goToFullNews"
          class="button"
      >
        Читать далее
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {

  width: clamp(300px, 90vw, 1050px);

  min-height: 0;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &__img {
    display: flex;
    justify-content: center;
    padding: 0 2rem 2rem;

    img {
      position: relative;
      object-fit: cover;
    }
  }

  &__date{
    &-subtitle{
      padding: 2rem;
      text-align: left;
      font-size: 0.9rem;
      color: var(--color-grey);
    }
  }

  &__info {
    width: 100%;

    &-title {
      text-align: left;
      overflow-wrap: break-word;
      white-space: normal;
      min-width: 0;
      margin: 0;
      padding: 0 2rem 2rem;
      font-size: 1.3rem;
    }
  }

  &__button{
    padding-bottom: 2rem;
    align-self: center;
  }
}

.text-markdown{
  padding: 0 2rem 2rem;
}

.button {
  @include neon-outline-button($color-blue);

}
</style>