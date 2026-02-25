<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, integer } from '@/plugins/vuelidate.js'
import { VTextField, VSelect, VTextarea } from 'vuetify/components'

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
const pending = ref(false)
const validationReady = ref(false)

const currentImageUrl = ref(null)
const selectedFile = ref(null)

const rules = computed(() => {
  return props.store.formFields.reduce((acc, field) => {
    if (field.validation) {
      acc[field.key] = {}
      if (field.validation.required) acc[field.key].required = required
      if (field.validation.minLength) acc[field.key].minLength = minLength(field.validation.minLength)
      if (field.validation.maxLength) acc[field.key].maxLength = maxLength(field.validation.maxLength)
      if (field.validation.integer) acc[field.key].integer = integer
    }
    return acc
  }, {})
})

const $v = useVuelidate(rules, form)

const validationState = computed(() => ({
  isInvalid: !validationReady.value || $v.value?.$invalid,
  getError: (prop) => {
    if (!validationReady.value) return ''
    return $v.value?.[prop]?.$errors[0]?.$message || ''
  }
}))

watch(() => props.modelValue, async (newVal) => {
  dialog.value = newVal
  if (!newVal) return
  currentImageUrl.value = null
  selectedFile.value = null
  validationReady.value = false

  if (props.mode === 'edit' && props.item) {
    form.value = props.store.formFields.reduce((acc, field) => {
      const fieldKey = field.key
      const itemValue = props.item[fieldKey]

      const detailsKey = `${fieldKey}_details`

      if (props.item[detailsKey] && typeof props.item[detailsKey] === 'object') {
        if (Array.isArray(props.item[detailsKey])) {
          acc[fieldKey] = props.item[detailsKey].map(item => item.id)
        }
        else {
          acc[fieldKey] = props.item[detailsKey].id
        }
      }
      else if (field.type === 'file' || field.component === 'file') {
        acc[fieldKey] = null
        if (props.item[fieldKey]) currentImageUrl.value = props.item[fieldKey]
      }
      else {
        acc[fieldKey] = itemValue
      }
      return acc
    }, {})
  } else {
    form.value = props.store.formFields.reduce((acc, field) => {
      if (field.component === 'multiselect') {
        acc[field.key] = []
      } else {
        acc[field.key] = null
      }
      return acc
    }, {})
  }

  await nextTick()
  if ($v.value) {
    props.mode === 'edit' ? $v.value.$touch() : $v.value.$reset()
    validationReady.value = true
  }
})

const handleBlur = (key) => {
  if (validationReady.value && $v.value?.[key]) {
    $v.value[key].$touch()
  }
}

const resetValidation = () => {
  validationReady.value = false
  $v.value?.$reset()
}

const getFieldComponent = (field) => {
  const typeMap = {
    select: VSelect,
    multiselect: VSelect,
    textarea: VTextarea,
    date: VTextField
  }
  return typeMap[field.component || field.type] || VTextField
}

const getFieldProps = (field) => {
  const { label, validation, component, type, items, itemTitle, itemValue, rows } = field
  const baseProps = {
    label,
    variant: 'outlined',
    required: validation?.required || false
  }

  const typeProps = {
    select: {
      items,
      'item-title': itemTitle || 'name',
      'item-value': itemValue || 'id',
      clearable: true
    },
    multiselect: {
      items,
      'item-title': itemTitle || 'name',
      'item-value': itemValue || 'id',
      multiple: true,
      chips: true,
      closableChips: true,
      clearable: true,
      placeholder: 'Выберите...',
      returnObject: false,
    },
    date: { type: 'date', prependIcon: 'mdi-calendar' },
    textarea: { rows: rows || 4, counter: true }
  }

  const fieldType = component || type
  return { ...baseProps, ...(typeProps[fieldType] || {}) }
}

const handleFileChange = (key, event) => {
  const file = event.target.files?.[0]
  if (file) {
    selectedFile.value = file
    form.value[key] = file
  }
}

const imagePreviewSrc = computed(() => {
  if (selectedFile.value) {
    return URL.createObjectURL(selectedFile.value)
  }
  return currentImageUrl.value || ''
})

const clearImage = () => {
  form.value.image = null
  selectedFile.value = null
  currentImageUrl.value = null

  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) fileInput.value = ''
}

const cancel = () => {
  emit('update:modelValue', false)
}

const submit = async () => {
  if (!validationReady.value) return
  await $v.value.$validate()
  if ($v.value.$invalid) return

  pending.value = true
  try {
    const payload = { ...form.value }

    props.store.formFields.forEach(field => {
      if (field.component === 'multiselect' || field.type === 'multiselect') {
        const val = payload[field.key]
        if (!val) {
          payload[field.key] = []
        } else if (!Array.isArray(val)) {
          payload[field.key] = [val]
        }
        payload[field.key] = payload[field.key].map(id => Number(id))
      }
    })

    if (selectedFile.value) {
      payload.image = selectedFile.value
    } else if (!currentImageUrl.value) {
      payload.image = null
    }

    const action = props.mode === 'create'
        ? props.store.createItem(payload)
        : props.store.updateItem(props.item.id, payload)

    await action
    emit('saved')
    emit('update:modelValue', false)
  } catch (error) {
    console.error('Save error:', error.response?.data || error)
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500px" @after-leave="resetValidation">
    <v-card class="entity-form">
      <v-card-title>
        {{ mode === 'create' ? 'Создать' : 'Редактировать' }} {{ entityType }}
      </v-card-title>

      <v-card-text>
        <v-form>
          <template v-for="field in store.formFields" :key="field.key">
            <div v-if="field.type === 'file' || field.component === 'file'" class="mb-4">
              <v-label class="text-body-2 mb-2 d-block">{{ field.label }}</v-label>
              <input
                  type="file"
                  :accept="field.accept || 'image/*'"
                  @change="(e) => handleFileChange(field.key, e)"
                  class="file-input"
              />
              <div v-if="validationState.getError(field.key)" class="text-error text-caption mt-1">
                {{ validationState.getError(field.key) }}
              </div>
            </div>

            <component
                v-else
                :is="getFieldComponent(field)"
                v-model="form[field.key]"
                @blur="handleBlur(field.key)"
                v-bind="getFieldProps(field)"
                :error-messages="validationState.getError(field.key)"
                :error="!!validationState.getError(field.key)"
            />
          </template>
        </v-form>

        <div v-if="imagePreviewSrc" class="mt-4 text-center">
          <img
              :src="imagePreviewSrc"
              alt="Preview"
              class="preview-image"
          />
          <v-btn size="small" variant="text" color="error" @click="clearImage" class="mt-2">
            Удалить
          </v-btn>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="cancel">Отмена</v-btn>
        <v-btn
            color="primary"
            @click="submit"
            :disabled="validationState.isInvalid"
            :loading="pending"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.file-input {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(0,0,0,0.38);
  border-radius: 4px;

  &::-webkit-file-upload-button {
    cursor: pointer;
  }
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>