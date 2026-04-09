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

</script>

<template>
  <div class="card-news glass">

    <div class="card-news__date">
      <div class="card-news__date-subtitle">{{ n.relativeDate }}</div>
    </div>

    <div class="card-news__info">
      <div class="card-news__info-title">{{ n.title }}</div>
    </div>

    <div class="card-news__img">
      <img :src="n.image">
    </div>
    <VueMarkdown :source="previewContent" class="text-markdown"/>
    <div class="card-news__button">
      <RouterLink
          :to="`/news/${n.id}`"
          class="button"
      >
        Читать далее
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-news {
  min-height: 0;

  &__button{
    padding-bottom: 2rem;
    align-self: center;
  }
}

.button {
  @include neon-outline-button($color-blue);
}
</style>