<script setup>
import {ref} from "vue";

const props = defineProps({
  items: {
    type: Array,
    required:true
  },
  columns: {
    type: Array,
    required: true,
    validator(value) {
      return value.every(col => col.key && col.label)
    }
  },
  onDelete: {
    type:Function,
    required:true
  }
})
const dialogDelete = ref(false)
const deleteItem = ref(null)

const confirmDelete = (item) => {
  deleteItem.value = item
  dialogDelete.value = true
}

const handleDelete = async () => {
  try {
    await props.onDelete(deleteItem.value)
    dialogDelete.value = false
    deleteItem.value = null
  } catch (error) {
    console.error('Ошибка удаления', error)
  }
}
</script>

<template>
  <v-table>
    <thead>
    <tr>
      <th v-for="column in columns" :key="column.key">
        {{column.label}}
      </th>
      <th>Действия</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item in items" :key="item.id">
      <td v-for="column in columns" :key="column.key">
        {{item[column.key]}}
      </td>
      <td>
        <v-btn
          icon="mdi-pencil"
          variant="text"
        ></v-btn>
        <v-btn
            icon="mdi-delete"
            variant="text"
            color="error"
            @click="confirmDelete(item)"
        ></v-btn>
      </td>
    </tr>
    </tbody>
  </v-table>
<v-dialog v-model="dialogDelete" max-width="400">
  <v-card>
    <v-card-title>
      Подтверждение
    </v-card-title>
    <v-card-text>
      Вы уверены, что хотите удалить "{{ deleteItem?.name }}"?
      Это действие нельзя отменить.
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="dialogDelete = false">Отмена</v-btn>
      <v-btn color="error" @click="handleDelete">Удалить</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<style scoped lang="scss">

</style>