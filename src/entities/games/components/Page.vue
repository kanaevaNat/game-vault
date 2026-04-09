<script setup>
import Search from "@/shared/components/Search.vue";
import Grid from "@/entities/games/components/Grid.vue";
import {useGameStore} from "@/entities/games/store.js";
import {computed, onMounted, ref} from "vue";
import FiltersGrid from "@/entities/games/components/FiltersGrid.vue";
import Icon from "@/shared/icons/Icon.vue";

const gameStore = useGameStore();
const games = computed(() => gameStore.filteredGames.items);
const totalPages = computed(() => gameStore.filteredGames.totalPages);
const currentPage = computed(() => gameStore.pagination.page);
const loading = computed(() => gameStore.loading);
const filtersVisible = ref(false);

const VISIBLE_PAGES_COUNT = 3;

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  let pages = [];

  if (total <= VISIBLE_PAGES_COUNT) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    let start = Math.max(1, current - Math.floor(VISIBLE_PAGES_COUNT / 2));
    let end = Math.min(total, start + VISIBLE_PAGES_COUNT - 1);

    if (end - start + 1 < VISIBLE_PAGES_COUNT) {
      start = Math.max(1, end - VISIBLE_PAGES_COUNT + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
  }
  return pages;
});

const showLeftEllipsis = computed(() => {
  return visiblePages.value[0] > 1;
});

const showRightEllipsis = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < totalPages.value;
});

const hasActiveFilters = computed(() => {
  const f = gameStore.filters;
  return (
      f.studios.length > 0 ||
      f.publishers.length > 0 ||
      f.categories.length > 0 ||
      f.year.min !== null ||
      f.year.max !== null ||
      gameStore.searchQuery?.trim()
  );
});

const toggleFilters = () => {
  filtersVisible.value = !filtersVisible.value;
};

const resetAllFilters = () => {
  gameStore.resetFilters();
};

onMounted(() => {
  if (games.value.length === 0) {
    gameStore.fetchItems();
  }
});
</script>

<template>
  <div class="page">
    <div class="filters-controls">
      <Search
          :model-value="gameStore.searchQuery"
          @update:model-value="gameStore.searchQuery = $event"
          class="search"
      />

      <div class="filter-buttons">
        <button
            class="filter-button glass"
            @click="toggleFilters"
            :class="{ 'active': filtersVisible || hasActiveFilters }"
        >
          <Icon name="filter" class="icon"/>
        </button>

        <button
            class="filter-button glass reset-btn"
            :class="{ 'reset-btn--visible': hasActiveFilters }"
            @click="resetAllFilters"
        >
          <Icon name="close" class="icon"/>
        </button>
      </div>
    </div>

    <Transition name="slide">
      <FiltersGrid
          v-if="filtersVisible"
          v-model="gameStore.filters"
          @update:model-value="applyFilters"
          class="filter"
          :class="{ 'is-open': filtersVisible }"
      />
    </Transition>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="games.length === 0" class="loading">Нет игр</div>
    <Grid v-else class="game-grid" :games="games"></Grid>

    <div v-if="totalPages > 1" class="pagination">

      <button
          @click="gameStore.setPage(1)"
          :disabled="currentPage === 1"
          class="pagination__btn glass pagination__btn--edge"
          title="В начало"
      >
        |←
      </button>

      <button
          :disabled="currentPage === 1"
          @click="gameStore.setPage(currentPage - 1)"
          class="pagination__btn glass"
      >
        ←
      </button>

      <div class="pagination__numbers">
        <span v-if="showLeftEllipsis" class="pagination__ellipsis">...</span>
        <button
            v-for="page in visiblePages"
            :key="page"
            @click="gameStore.setPage(page)"
            class="pagination__btn glass pagination__btn--number"
            :class="{ 'pagination__btn--active': page === currentPage }"
        >
          {{ page }}
        </button>

        <span v-if="showRightEllipsis" class="pagination__ellipsis">...</span>
      </div>

      <button
          :disabled="currentPage === totalPages"
          @click="gameStore.setPage(currentPage + 1)"
          class="pagination__btn glass"
      >
        →
      </button>

      <button
          @click="gameStore.setPage(totalPages)"
          :disabled="currentPage === totalPages"
          class="pagination__btn glass pagination__btn--edge"
          title="В конец"
      >
        →|
      </button>

    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  padding-bottom: 4rem;

  .filters-controls {
    @include header-padding(4rem);
    display: grid;
    grid-template-columns: minmax(200px, 560px) auto;
    gap: 2rem;
    justify-content: center;
    align-items: stretch;
    padding-inline: 3.5rem 1rem;

    .search, .filter-buttons{
      margin-bottom: 4rem;
    }

    .filter-buttons {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;

      .reset-btn {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;

        &--visible {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1);
        }
      }
    }
  }

  .game-grid {
    margin-top: 2rem;
    transition: margin-top 0.5s ease;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
  overflow: hidden;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding-inline: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;

  &__numbers {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  &__ellipsis {
    color: var(--color-input-text);
    padding: 0 0.5rem;
    user-select: none;
  }

  &__btn {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 12px;
    border: 2px solid var(--color-input-text);
    color: var(--color-input-text);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      border-color: var(--color-input-text);
    }

    &:hover:not(:disabled) {
      background: var(--color-input-text);
      color: var(--color-input-placeholder);
    }

    &--active {
      background: var(--color-input-text);
      color: var(--color-input-placeholder);
      border-color: var(--color-input-text);
      cursor: default;

      &:hover {
        transform: none;
      }
    }

    &--edge {
      width: 2.5rem;
      svg, .icon-small {
        width: 1rem;
        height: 1rem;
        fill: currentColor;
      }
    }
  }
}

@media (max-width: 800px) {
  .page{
    .filters-controls {
      gap: 0.5rem;
      padding-inline: 3.5rem 0.5rem;
      .search, .filter-buttons{
        margin-bottom: 1rem;
      }
    }
  }
  .pagination {
    gap: 0.3rem;
    margin-top: 1rem;

    &__btn {
      width: 2rem;
      height: 2rem;
      font-size: 0.8rem;
    }
    &__ellipsis {
      padding: 0 0.2rem;
    }
    &__btn--edge {
      display: none;
    }
  }
}
</style>