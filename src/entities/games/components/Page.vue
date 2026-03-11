<script setup>
import Search from "@/shared/components/Search.vue";
import Grid from "@/entities/games/components/Grid.vue";
import {useGameStore} from "@/entities/games/store.js";
import {computed, onMounted, ref} from "vue";
import FiltersGrid from "@/entities/games/components/FiltersGrid.vue";
import Icon from "@/shared/icons/Icon.vue";

const gameStore = useGameStore();
const games = computed(() => gameStore.filteredGames);
const loading = computed(() => gameStore.loading);
const filtersVisible = ref(false);

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
    <div class="page-filters__wrapper"></div>
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
    <div v-else-if="games.length === 0" class="empty">Нет игр</div>
    <Grid v-else class="game-grid" :games="games"></Grid>
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

    .search {
      margin-bottom: 4rem;
    }

    .filter-buttons {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
      margin-bottom: 4rem;

      .reset-btn {
        opacity: 0;
        pointer-events: none;
        transform: scale(0.8);
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
    transition: margin-top 2s ease;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease,
  transform 0.3s ease,
  max-height 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
  overflow: hidden;
}
</style>