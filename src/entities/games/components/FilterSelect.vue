<script setup>
import {computed, ref, onMounted, onBeforeUnmount} from 'vue';

const props = defineProps({
  modelValue: {type: Array, default: () => []},
  items: {type: Array, default: () => []},
  label: {type: String, default: 'Фильтр'},
  placeholder: {type: String, default: 'Выберите...'},
  itemLabel: {type: String, default: 'name'},
  itemValue: {type: String, default: 'id'}
});

const emit = defineEmits(['update:modelValue']);

const searchQuery = ref('');
const isOpen = ref(false);
const filterRef = ref(null);

const allItems = computed(() => props.items);

const filteredItems = computed(() => {
  if (!searchQuery.value) return allItems.value.slice(0, 10);
  return allItems.value.filter(item =>
      item[props.itemLabel]?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectedItems = computed(() =>
    allItems.value.filter(item =>
        props.modelValue.includes(item[props.itemValue])
    )
);

const addItem = (item) => {
  const value = item[props.itemValue];
  if (!props.modelValue.includes(value)) {
    emit('update:modelValue', [...props.modelValue, value]);
  }
  searchQuery.value = '';
};

const removeItem = (value) => {
  emit('update:modelValue', props.modelValue.filter(v => v !== value));
};

const handleClickOutside = (event) => {
  if (filterRef.value && !filterRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

const clear = () => {
  emit('update:modelValue', []);
  searchQuery.value = '';
  isOpen.value = false;
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <div class="filter-wrapper">
    <div class="filter">
      <label class="filter__label">{{ label }}
        <button v-if="selectedItems.length > 0" @click="clear" class="filter__clear">✕</button>
      </label>

      <div class="filter__container">
        <div class="selected-tags">
        <span
            v-for="item in selectedItems"
            :key="item[itemValue]"
            class="tag"
            @click="removeItem(item[itemValue])"
        >
          {{ item[itemLabel] }}
        </span>

        </div>
        <div ref="filterRef" class="input-wrapper">
          <input
              v-model="searchQuery"
              @focus="isOpen = true"
              :placeholder="placeholder"
              class="search-input"
              :class="{ 'search-input__is-open': isOpen }"
          />
          <div
              v-show="isOpen && filteredItems.length"
              class="option-wrapper glass"
              :class="{ 'option-wrapper__is-open': isOpen }"
          >
            <div class="options">
              <div
                  v-for="item in filteredItems"
                  :key="item[itemValue]"
                  @click="addItem(item)"
                  class="option-item"
                  :class="{ 'option-item--selected': modelValue.includes(item[itemValue]) }"
              >
                {{ item[itemLabel] }}
              </div>

              <div v-if="!searchQuery && allItems.length > 10" class="hint">
                Показано 10 из {{ allItems.length }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter {
  &__container {
    .selected-tags {
      padding-block: 1rem;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.75rem;
      cursor: pointer;
      word-break: break-word;
    }

    .input-wrapper {
      display: inline-block;
      position: relative;
      width: 100%;
      max-width: 360px;

      .search-input {
        display: block;
        position: relative;
        max-width: 250px;
        height: 3rem;
        border-color: var(--color-input-text);

        &__is-open {
          z-index: 20;
        }

        &:focus::placeholder {
          color: var(--color-input-placeholder);
          font-size: 1rem;
        }

        &:focus {
          color: var(--color-input-placeholder);
          background-color: var(--color-input-text);
        }
      }

      .option-wrapper {
        top: 0;
        max-height: calc(300px + 4rem);
        height: auto;

        &__is-open {
          z-index: 19;
        }
      }

      .options {
        position: relative;
        max-width: 250px;

        .option-item {
          cursor: pointer;
          word-break: break-word;

          &--selected {
            background: var(--color-input-text);
            color: var(--color-input-placeholder);
          }
        }

        .hint {
          background-color: transparent;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          color: var(--color-input-text);
        }
      }
    }
  }
}
</style>