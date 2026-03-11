<script setup>
import { useStudiosStore } from '@/entities/studio/store';
import { usePublishersStore } from '@/entities/publisher/store';
import { useCategoriesStore } from '@/entities/category/store';
import { onMounted } from 'vue';
import FilterSelect from "@/entities/games/components/FilterSelect.vue";
import FilterRange from "@/entities/games/components/FilterRange.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      studios: [],
      publishers: [],
      categories: [],
      year: { min: null, max: null }
    })
  }
});

const emit = defineEmits(['update:modelValue']);
const studiosStore = useStudiosStore();
const publishersStore = usePublishersStore();
const categoriesStore = useCategoriesStore();

onMounted(async () => {
  await Promise.all([
    studiosStore.items.length === 0 && studiosStore.fetchItems(),
    publishersStore.items.length === 0 && publishersStore.fetchItems(),
    categoriesStore.items.length === 0 && categoriesStore.fetchItems(),
  ]);
});

const updateFilter = (key, value) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
};
</script>

<template>
  <div class="filters-grid">
    <FilterSelect
        v-model="modelValue.studios"
        :items="studiosStore.items"
        label="Студии"
        placeholder="Выберите студию..."
        @update:model-value="updateFilter('studios', $event)"
    />

    <FilterSelect
        v-model="modelValue.publishers"
        :items="publishersStore.items"
        label="Издатели"
        placeholder="Выберите издателя..."
        @update:model-value="updateFilter('publishers', $event)"
    />

    <FilterSelect
        v-model="modelValue.categories"
        :items="categoriesStore.items"
        label="Категории"
        placeholder="Выберите категорию..."
        @update:model-value="updateFilter('categories', $event)"
    />
    <FilterRange
        v-model="modelValue.year"
        label="Год"
        @update:model-value="updateFilter('year', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 10;
  background-color: transparent;
  border-radius: 1rem;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    backdrop-filter: blur(12px);
    background-color: rgba(var(--background, 255, 255, 255), 0.5);
    border-radius: inherit;
    z-index: -1;
    pointer-events: none;
  }
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
}
</style>