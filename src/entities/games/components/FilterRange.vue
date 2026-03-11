<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import Icon from "@/shared/icons/Icon.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({min: null, max: null})
  },
  label: {type: String, default: 'Год'},
  minYear: {type: Number, default: 1999},
  maxYear: {type: Number, default: 2026}
});

const emit = defineEmits(['update:modelValue']);

const years = Array.from(
    {length: props.maxYear - props.minYear + 1},
    (_, i) => props.maxYear - i
);

const isMinOpen = ref(false);
const isMaxOpen = ref(false);
const filterRef = ref(null);

const updateMin = (year) => {
  emit('update:modelValue', {
    ...props.modelValue,
    min: year
  });
  isMinOpen.value = false;
};

const updateMax = (year) => {
  emit('update:modelValue', {
    ...props.modelValue,
    max: year
  });
  isMaxOpen.value = false;
};

const clear = () => {
  emit('update:modelValue', {min: null, max: null});
};

const handleClickOutside = (event) => {
  if (filterRef.value && !filterRef.value.contains(event.target)) {
    isMinOpen.value = false;
    isMaxOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <div class="filter-wrapper" ref="filterRef">
    <div class="filter">
      <label class="filter__label">
        {{ label }}
        <button v-if="modelValue.min || modelValue.max" @click="clear" class="filter__clear">✕</button>
      </label>

      <div class="filter__inputs">
        <div class="year-dropdown">
          <div
              class="search-input"
              @click="isMinOpen = !isMinOpen"
              :class="{ 'search-input--open': isMinOpen }"
          >
            {{ modelValue.min || 'От' }}
            <span class="year-arrow">
              <Icon name="arrowDown" :size="12"/>
            </span>
          </div>
          <div v-show="isMinOpen" class="option-wrapper glass">
            <div class="options">
              <div
                  v-for="year in years"
                  :key="year"
                  @click="updateMin(year)"
                  class="option-item"
                  :class="{ 'year-option--selected': modelValue.min === year }"
              >
                {{ year }}
              </div>
            </div>
          </div>
        </div>

        <span class="year-separator">—</span>
        <div class="year-dropdown">
          <div
              class="search-input"
              @click="isMaxOpen = !isMaxOpen"
              :class="{ 'search-input--open': isMaxOpen }"
          >
            {{ modelValue.max || 'До' }}
            <span class="year-arrow">
              <Icon name="arrowDown" :size="12"/>
            </span>
          </div>
          <div v-show="isMaxOpen" class="option-wrapper glass">
            <div class="options">
              <div
                  v-for="year in years"
                  :key="year"
                  @click="updateMax(year)"
                  class="option-item"
                  :class="{ 'option-item--selected': modelValue.max === year }"
              >
                {{ year }}
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
  &__inputs {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }
}

.year-dropdown {
  flex: 1;
  position: relative;
  padding-top: 2rem;
}

.search-input {
  display: flex;
  position: relative;
  max-width: 200px;
  flex: 1;
  justify-content: space-between;
  height: 3rem;
  min-width: 0;
  border-color: var(--color-input-text);
  z-index: 1;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  text-align: center;
  text-align-last: center;
  padding: 10px;
  margin-right: 10px;

  &--open {
    color: var(--color-input-placeholder);
    background-color: var(--color-input-text);
  }
}

.option-item {
  text-align: center;
}

.year-arrow {
  font-size: 0.7rem;
  opacity: 0.7;
  transition: transform 0.2s;
  display: flex;
  align-items: center;

  .search-input--open & {
    transform: rotate(180deg);
  }
}

.year-separator {
  color: var(--color-input-text);
  opacity: 0.7;
  font-size: 1.2rem;
  flex-shrink: 0;
  padding-top: 2rem;
}
</style>