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
const fileError = ref('')
const serverError = ref('')

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp']

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
  if (!newVal) {
    currentImageUrl.value = null
    selectedFile.value = null
    resetValidation()
    return
  }
  validationReady.value = false

  if (props.mode === 'edit' && props.item) {
    form.value = props.store.formFields.reduce((acc, field) => {
      const fieldKey = field.key
      const itemValue = props.item[fieldKey]
      const detailsKey = `${fieldKey}_details`

      if (props.item[detailsKey] && typeof props.item[detailsKey] === 'object') {
        acc[fieldKey] = Array.isArray(props.item[detailsKey])
            ? props.item[detailsKey].map(item => item.id)
            : props.item[detailsKey].id
      } else if (field.type === 'file' || field.component === 'file') {
        acc[fieldKey] = null
        if (props.item[fieldKey]) currentImageUrl.value = props.item[fieldKey]
      } else {
        acc[fieldKey] = itemValue
      }
      return acc
    }, {})
  } else {
    form.value = props.store.formFields.reduce((acc, field) => {
      acc[field.key] = field.component === 'multiselect' ? [] : null
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
  form.value = {}
  fileError.value = ''
  serverError.value = ''
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
  const baseProps = { label, variant: 'outlined', required: validation?.required || false }
  const typeProps = {
    select: { items, 'item-title': itemTitle || 'name', 'item-value': itemValue || 'id', clearable: true },
    multiselect: { items, 'item-title': itemTitle || 'name', 'item-value': itemValue || 'id', multiple: true, chips: true, closableChips: true, clearable: true, placeholder: 'Выберите...', returnObject: false },
    date: { type: 'date', prependIcon: 'mdi-calendar' },
    textarea: { rows: rows || 4, counter: true }
  }
  const fieldType = component || type
  return { ...baseProps, ...(typeProps[fieldType] || {}) }
}

const handleFileChange = (key, event) => {
  const file = event.target.files?.[0]
  fileError.value = ''
  serverError.value = ''

  if (file) {
    const isValidType = ALLOWED_IMAGE_TYPES.includes(file.type)
    const ext = file.name.split('.').pop().toLowerCase()
    const isValidExt = ALLOWED_EXTENSIONS.includes(ext)

    if (!isValidType && !isValidExt) {
      fileError.value = 'Разрешены только изображения: JPG, PNG, GIF, BMP, TIFF, WebP'
      event.target.value = ''
      selectedFile.value = null
      form.value[key] = null
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      fileError.value = 'Размер файла не должен превышать 2 МБ'
      event.target.value = ''
      selectedFile.value = null
      form.value[key] = null
      return
    }

    selectedFile.value = file
    form.value[key] = file
  }
}

const imagePreviewSrc = computed(() => {
  if (selectedFile.value) return URL.createObjectURL(selectedFile.value)
  return currentImageUrl.value || ''
})

const clearImage = () => {
  const fileKey = props.store.formFields.find(f => f.type === 'file' || f.component === 'file')?.key
  if (fileKey) form.value[fileKey] = null
  selectedFile.value = null
  currentImageUrl.value = null
  fileError.value = ''
  serverError.value = ''

  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) fileInput.value = ''
}

const cancel = () => {
  emit('update:modelValue', false)
}

const submit = async () => {
  if (!validationReady.value) return
  fileError.value = ''
  serverError.value = ''

  await $v.value.$validate()
  if ($v.value.$invalid || fileError.value) return

  pending.value = true
  try {
    const payload = { ...form.value }

    props.store.formFields.forEach(field => {
      if (field.component === 'multiselect' || field.type === 'multiselect') {
        const val = payload[field.key]
        if (!val) payload[field.key] = []
        else if (!Array.isArray(val)) payload[field.key] = [val]
        payload[field.key] = payload[field.key].map(id => Number(id))
      }
    })

    if (selectedFile.value) payload.image = selectedFile.value
    else if (!currentImageUrl.value) payload.image = null

    const action = props.mode === 'create'
        ? props.store.createItem(payload)
        : props.store.updateItem(props.item.id, payload)

    await action
    emit('saved')
    emit('update:modelValue', false)
  } catch (error) {
    const status = error.response?.status

    if (status === 400 || status === 422) {
      const msg = error.response?.data?.preview || error.response?.data?.message || error.response?.data?.image
      serverError.value = msg || 'Проверьте правильность данных (дубль, неверный формат или обязательные поля)'
    } else if (!error.response) {
      serverError.value = 'Нет подключения к интернету или сервер недоступен'
    } else if (error.code === 'ECONNABORTED') {
      serverError.value = 'Сервер долго не отвечает. Попробуйте позже.'
    } else if (status === 413) {
      fileError.value = 'Размер файла превышает лимит сервера (2 МБ)'
    } else {
      serverError.value = 'Произошла ошибка при сохранении. Попробуйте ещё раз.'
    }
    console.error('Save error:', error.response?.data || error)
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <v-dialog
      v-model="dialog"
      max-width="500px"
      @after-leave="resetValidation"
      @update:modelValue="emit('update:modelValue', $event)"
  >
    <v-card class="entity-form">
      <v-card-title class="entity-form__title">
        {{ mode === 'create' ? 'Создать' : 'Редактировать' }} {{ entityType }}
      </v-card-title>

      <v-card-text>
        <v-form class="form">
          <template v-for="field in store.formFields" :key="field.key">
            <div v-if="field.type === 'file' || field.component === 'file'" class="file-input-wrapper mb-4">
              <label :for="`file-${field.key}`" class="v-field-label">{{ field.label }}</label>
              <input
                  type="file"
                  :id="`file-${field.key}`"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff,.tif,.webp,image/jpeg,image/png,image/gif,image/bmp,image/tiff,image/webp"
                  @change="(e) => handleFileChange(field.key, e)"
                  class="file-input"
              />
              <div v-if="fileError" class="field-error">
                {{ fileError }}
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
                class="form__fields"
            />
          </template>
        </v-form>

        <div v-if="imagePreviewSrc" class="mt-4 text-center">
          <img :src="imagePreviewSrc" alt="Preview" class="preview-image" />
          <v-btn size="small" variant="text" color="error" @click="clearImage" class="mt-2">
            Удалить
          </v-btn>
        </div>

        <div v-if="serverError" class="server-error" role="alert">
          {{ serverError }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="cancel">Отмена</v-btn>
        <v-btn
            color="primary"
            @click="submit"
            :disabled="validationState.isInvalid || !!fileError"
            :loading="pending"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.entity-form {
  @include header-margin;
  &__title { margin: 20px 0 20px 25px; font-size: 1.3rem; }
}

.form { &__fields { margin-bottom: 20px; } }

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.file-input-wrapper {
  position: relative;
}

.v-field-label {
  display: block;
  padding-left: 1rem;
  margin-bottom: 8px;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.15px;
  font-weight: 400;
  color: rgba(var(--v-theme-on-surface), 0.6);
  transition: color 0.2s ease-in-out;
  cursor: pointer;
}

.file-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.3);
  border-radius: 4px;
  background: transparent;
  font-size: 1rem;
  color: rgba(var(--v-theme-on-surface), 0.87);
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    border-color: rgba(var(--v-theme-on-surface), 0.4);
  }

  &:focus {
    outline: none;
    border-color: rgb(var(--v-theme-primary));
    box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.12);
  }

  &::-webkit-file-upload-button {
    cursor: pointer;
    padding: 6px 12px;
    border: none;
    background: rgba(var(--v-theme-primary), 0.1);
    color: rgb(var(--v-theme-primary));
    border-radius: 4px;
    font-weight: 500;
    margin-right: 8px;
    transition: background 0.2s;
  }

  &::-webkit-file-upload-button:hover {
    background: rgba(var(--v-theme-primary), 0.2);
  }
}

.field-error {
  color: rgb(var(--v-theme-error)) !important;
  font-size: 0.75rem;
  padding-left: 1rem;
  margin-top: 6px;
  min-height: 1.25rem;
}

.server-error {
  background: rgba(211, 47, 47, 0.08);
  border: 1px solid rgba(211, 47, 47, 0.3);
  color: #d32f2f;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  margin: 20px 0 0;
}
</style>