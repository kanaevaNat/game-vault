<script setup>
import {ref, onMounted} from "vue";
import {useTableState} from "@/shared/composables/useTableState.js";
import EntityTable from "@/shared/components/EntityTable.vue";
import EntityForm from "@/shared/components/EntityForm.vue";

const props = defineProps({
  title: {type: String, required: true},
  store: {type: Object, required: true},
  entityType: String
})

const {search, page, itemsPerPage, sortBy, resetTableState} = useTableState(props.store, {
  defaultPerPage: 10,
  resetOnSearch: true
})

onMounted(() => {
  props.store.fetchItems()
})

const formModal = ref({
  open: false,
  mode: 'create',
  item: null
})

const handleEdit = (item) => {
  formModal.value = {open: true, mode: 'edit', item}
}

const handleCreate = () => {
  formModal.value = {open: true, mode: 'create', item: null}
}

const handleCloseForm = () => {
  formModal.value.open = false
  formModal.value.item = null
}
</script>

<template>
  <div class="entity-list">
    <div class="entity-list__header">
      <h2 class="header__title">{{ title }}</h2>

      <v-text-field
          v-model="search"
          label="Поиск..."
          clearable
          hide-details
          single-line
          variant="solo"
          density="compact"
          class="header__search"
      />

      <v-btn
          v-show="search || sortBy?.length"
          prepend-icon="mdi-refresh"
          variant="text"
          color="grey"
          @click="resetTableState"
          class="header__reset"
      >
        Сбросить
      </v-btn>

      <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="handleCreate"
          class="header__add"
      >
        Добавить
      </v-btn>
    </div>

    <EntityTable
        :items="store.items"
        :headers="store.headers"
        :store="store"
        v-model:search="search"
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        v-model:sort-by="sortBy"
        @edit="handleEdit"
    />

    <EntityForm
        v-model="formModal.open"
        :mode="formModal.mode"
        :store="store"
        :entity-type="entityType"
        :item="formModal.item"
        @close="handleCloseForm"
    />
  </div>
</template>
<style lang="scss">
.entity-list {
  &__header {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "title reset"
      "search add";
    gap: 0.5rem 1rem;
    align-items: center;
    margin-bottom: 1rem;
  }
}

.header__title { grid-area: title; }
.header__add   { grid-area: add; }
.header__search {
  grid-area: search;
  min-width: 0;
}
.header__reset { grid-area: reset; }
</style>