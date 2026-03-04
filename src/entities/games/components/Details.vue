<script setup>
import {useGameStore} from "@/entities/games/store.js";
import {useRoute} from "vue-router";
import {computed, onMounted} from "vue";

import steamIcon from '@/shared/icons/Steam.svg';
import epicIcon from '@/shared/icons/EpicGames.svg';

const route = useRoute();
const gameStore = useGameStore();
const gameId = computed(() => route.params.id);

const game = computed(() => gameStore.findItemById(gameId.value));

onMounted(async () => {
  if (!game.value) {
    await gameStore.fetchItemById(gameId.value);
  }
});

const storeLinks = computed(() => {
  const rawDesc = game.value?.description;
  if (!rawDesc) return [];

  const regex = /\[STORE:\s*([^:\]]+?)\s*:\s*([^\]]+?)\s*\]/g;

  const matches = [...rawDesc.matchAll(regex)];

  return matches.map(match => ({
    store: match[1].trim().toLowerCase(),
    url: match[2].trim()
  }));
});

const cleanDescription = computed(() => {
  const raw = game.value?.description;
  if (!raw) return '';

  const regex = /\[STORE:\s*([^:\]]+?)\s*:\s*([^\]]+?)\s*\]/g;

  return raw
      .replace(regex, '')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/^\s*\n\s*\n/, '')
      .trim();
});

const storeConfig = {
  steam: {icon: steamIcon, label: 'Купить в Steam'},
  epic: {icon: epicIcon, label: 'Купить в Epic Games'},
};
</script>

<template>

  <div v-if="!game" class="loading">Загрузка...</div>
  <div v-else class="game-page">
    <div class="game-page__top">


      <div class="game-page__img-wrapper">
        <img :src="game.preview" :alt="game.name" class="game-img"/>
      </div>


      <h1 class="game-title">{{ game.name }}</h1>


      <div class="game-page__categories">
        <div class="game-page__categories-list">
          <span
              v-for="category in game.categories_details"
              :key="category.id"
              class="game-page__categories-tag glass"
          >
            {{ category.name }}
          </span>
        </div>
      </div>


      <div class="game-page__info">
        <div class="info-item">
          <div class="info-item__content">
            <span class="info-item__label">Студия</span>
            <span class="info-item__value">{{ game.studio_details?.name || '—' }}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-item__content">
            <span class="info-item__label">Издатель</span>
            <span class="info-item__value">{{ game.publisher_details?.name || '—' }}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-item__content">
            <span class="info-item__label">Год выхода</span>
            <span class="info-item__value">{{ game.release_year || game.year }}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-item__content">
            <span class="info-item__label">DLC</span>
            <span class="info-item__value">{{ game.dls_count }}</span>
          </div>
        </div>
      </div>

      <div class="game-page__stores glass">
        <div class="price-block">Цена</div>
        <div class="links-block" v-if="storeLinks.length">
          <a
              v-for="link in storeLinks"
              :key="link.url"
              :href="link.url"
              class="links-block__button"
              target="_blank"
              rel="noopener noreferrer"
          >
            <img
                :src="storeConfig[link.store]?.icon"
                :alt="storeConfig[link.store]?.label"
                class="links-block__button-icon"
            />
            <span class="links-block__button-label">{{ storeConfig[link.store]?.label }}</span>
          </a>
        </div>
      </div>

    </div>
    <div class="game-page__description">
      <h2 class="description-title">Описание</h2>
      <VueMarkdown :source="cleanDescription" class="text-markdown"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-page {
  max-width: 1200px;
  margin: 0 auto;
  @include header-padding(4rem);
  padding-bottom: 4rem;
  padding-inline: 2rem;

  &__top {
    display: grid;
    grid-template-columns: 300px 1fr 330px;
    grid-template-rows: auto auto 1fr;
    gap: 3rem;
    align-items: start;
    grid-auto-flow: dense;
  }

  &__img-wrapper {
    grid-row: 1 / 4;
    grid-column: 1;

    .game-img {
      width: 100%;
      border-radius: 1rem;
      display: block;
    }
  }
  .game-title {
    grid-column: 2 / 4;
    grid-row: 1;
    font-size: 1.5rem;
    line-height: 1.2;
    text-transform: uppercase;
  }

  &__description {
    padding-top: 3rem;

    .description-title {
      font-size: 1.5rem;
      margin: 0 0 1.5rem 0;
    }

    .description-text {
      font-size: 1.2rem;
      line-height: 1.8;
      white-space: pre-line;
    }
  }

  &__stores {
    grid-column: 3;
    grid-row: 3;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border: 2px solid transparent;
    border-radius: 0.75rem;
    padding: 1rem;
    height: 100%;

    .price-block {
      width: 100%;
      text-align: center;
      font-size: 1.2rem;
      display: flex;
      flex-direction: column;
      margin: auto 0;
    }

    .links-block {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      &__button {
        @include neon-outline-button($color-blue);
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 1.5rem;
        text-decoration: none;
        border-radius: 0.75rem;

        &-icon {
          width: 24px;
          height: 24px;
          object-fit: contain;
          flex-shrink: 0;
          color: #FFFFFF;
        }

        &-label {
          white-space: nowrap;
        }
      }
    }
  }

  &__info {
    grid-column: 2;
    grid-row: 3;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin: 0 0 1.5rem 0;

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;

      &__content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      &__label {
        font-size: 0.8rem;
        color: var(--color-input-text);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        flex-shrink: 0;
        min-width: 100px;
      }

      &__value {
        font-size: 1.1rem;
        word-break: break-word;
      }
    }
  }

  &__categories {
    grid-column: 2 / 4;
    grid-row: 2;

    &-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    &-tag {
      border: 1px solid var(--color-input-text);
      color: #fff;
      display: block;
      padding: 0.3rem 1rem;
      font-size: 0.8rem;
      border-radius: 0.75rem;
      text-align: center;
      align-items: center;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        @include neon-outline-button($color-yellow);
        border-radius: 0.75rem;

      }
    }
  }
}

@media (max-width: 1010px) {
  .game-page {
    padding-inline: 1rem;

    &__top {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      align-items: center;
    }

    &__img-wrapper {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;

      .game-img {
        width: 100%;
        display: block;
      }
    }

    .game-title {
      grid-column: 1;
      grid-row: auto;
      font-size: 2rem;
      text-align: center;
      margin: 0 !important;
    }

    &__categories {
      grid-column: 1;
      grid-row: auto;

      &-list {
        margin: 0 !important;
        justify-content: center;
      }
    }

    &__info {
      grid-column: 1;
      grid-row: auto;
      margin: 0 !important;
      align-items: center;
      text-align: center;
    }

    &__stores {
      grid-column: 1;
      grid-row: auto;
      margin: 0 !important;
      max-width: 100%;
    }

    &__description {
      grid-column: 1;
      grid-row: auto;
    }
  }
}
</style>