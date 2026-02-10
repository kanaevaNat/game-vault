<script setup>
import {ref, onMounted} from "vue";
import EntityTable from "@/shared/components/EntityTable.vue";
import EntityForm from "@/shared/components/EntityForm.vue";

const props = defineProps({
  title: {
    type: String,
    required:true
  },
  store: {
    type: Object,
    required:true
  },
  entityType: String
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
  formModal.value = {
    open: true,
    mode: 'edit',
    item
  }
}

const handleCreate = () => {
  formModal.value = {
    open: true,
    mode: 'create',
    item: null
  }
}

</script>

<template>
  <div class="entity-list">
    <div class="entity-list__header">
      <h2>{{ title }}</h2>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        class="entity-list__button"
        @click="handleCreate"
      >
      Добавить
      </v-btn>
    </div>
    <EntityTable
        :items="store.items"
        :columns="store.columns"
        :store="store"
        @edit="handleEdit"
    />
    <EntityForm
        v-model="formModal.open"
        :mode="formModal.mode"
        :store="store"
        :entity-type="entityType"
        :item="formModal.item"
    />
  </div>
</template>

<style scoped lang="scss">
.entity-list{
  &__header{
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    margin-bottom: 2rem;
  }
}
</style>