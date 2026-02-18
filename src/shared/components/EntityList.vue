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
      <h2>{{ title }}</h2>
      <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="handleCreate"
          class="ml-2"
      >
        Добавить
      </v-btn>

      <v-text-field
          v-model="search"
          label="Поиск..."
          clearable
          hide-details
          single-line
          variant="solo"
          density="compact"
          class="search-field"
      />

      <v-btn
          v-if="search || sortBy?.length"
          prepend-icon="mdi-refresh"
          variant="text"
          color="grey"
          @click="resetTableState"
          class="ml-2"
      >Сбросить
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
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
}
</style>
