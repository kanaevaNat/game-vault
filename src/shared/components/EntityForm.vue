<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  mode: { type: String, required: true },
  entityType: { type: String, required: true },
  store: { type: Object, required: true },
  item: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const dialog = ref(false)
const form = ref({})
const formRef = ref(null)

watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal
  if (newVal && props.mode === 'edit' && props.item) {
    form.value = { ...props.item }
  } else if (newVal && props.mode === 'create') {
    form.value = {}
  }
})

const getFieldComponent = (field) => {
  switch (field.component || field.type) {
    case 'select': return 'v-select'
    case 'checkbox': return 'v-checkbox'
    case 'textarea': return 'v-textarea'
    default: return 'v-text-field'
  }
}

const getFieldProps = (field) => {
  const baseProps = {
    label: field.label,
    rules: field.rules || [],
    variant: 'outlined',
    required: field.required !== false
  }

  if (field.component === 'select') {
    return {
      ...baseProps,
      items: field.items || [],
      'item-title': field.itemTitle || 'name',
      'item-value': field.itemValue || 'id'
    }
  }

  return baseProps
}

const cancel = () => {
  emit('update:modelValue', false)
}

const submit = async () => {

    try {
      if (props.mode === 'create') {
        await props.store.createItem(form.value)
      } else {
        await props.store.updateItem(props.item.id, form.value)
      }
      emit('saved')
      emit('update:modelValue', false)
    } catch (error) {
      console.error('Save error:', error)
    }

}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card class="entity-form">
      <v-card-title>
        {{ mode === 'create' ? 'Создать' : 'Редактировать' }} {{ entityType }}
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef">
          <component
              v-for="field in store.formFields"
              :is="getFieldComponent(field)"
              :key="field.key"
              v-model="form[field.key]"
              v-bind="getFieldProps(field)"
          ></component>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel">Отмена</v-btn>
        <v-btn color="primary" @click="submit">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">

</style>