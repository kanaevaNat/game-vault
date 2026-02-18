<script setup>
import {ref, computed} from "vue";

const props = defineProps({
  items: {type: Array, required: true},
  headers: {type: Array, required: true},
  store: {type: Object, required: true},
  search: {type: String, default: ''},
  page: {type: Number, default: 1},
  itemsPerPage: {type: Number, default: 10},
  sortBy: {type: Array, default: () => []}
})

const emit = defineEmits(['edit', 'update:search', 'update:page', 'update:itemsPerPage', 'update:sortBy'])

const dialogDelete = ref(false)
const deleteItem = ref(null)

const tableHeaders = computed(() => [
  ...props.headers,
  {key: 'actions', title: 'Действия', sortable: false, align: 'end', width: '120px'}
])

const confirmDelete = (item) => {
  deleteItem.value = item
  dialogDelete.value = true
}

const handleDelete = async () => {
  try {
    await props.store.deleteItem(deleteItem.value.id)
    dialogDelete.value = false
    deleteItem.value = null
  } catch (error) {
    console.error('Ошибка удаления', error)
  }
}
</script>

<template>
  <v-data-table
      :headers="tableHeaders"
      :items="items"
      :search="search"
      :page="page"
      @update:page="emit('update:page', $event)"
      :items-per-page="itemsPerPage"
      @update:items-per-page="emit('update:itemsPerPage', $event)"
      :sort-by="sortBy"
      @update:sort-by="emit('update:sort-by', $event)"
      density="comfortable"
      hover
  >
    <template v-slot:item.actions="{ item }">
      <div class="text-no-wrap">
        <v-btn icon="mdi-pencil" variant="text" color="primary" size="small" @click="emit('edit', item)"
               class="mr-1"></v-btn>
        <v-btn icon="mdi-delete" variant="text" color="error" size="small" @click="confirmDelete(item)"></v-btn>
      </div>
    </template>

    <template v-slot:no-data>
      <div class="text-center py-6 text-grey">
        <v-icon icon="mdi-inbox" size="large" class="mb-2"/>
        <div>Нет данных для отображения</div>
      </div>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogDelete" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Подтверждение</v-card-title>
      <v-card-text>
        Вы уверены, что хотите удалить <strong>"{{ deleteItem?.name || deleteItem?.id }}"</strong>?
        <br>
        <span class="text-caption text-error">Это действие нельзя отменить.</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text variant="plain" @click="dialogDelete = false">Отмена</v-btn>
        <v-btn color="error" @click="handleDelete">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style lang="scss">
</style>