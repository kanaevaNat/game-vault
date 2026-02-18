<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, email } from '@/plugins/vuelidate.js'
import { VTextField, VSelect, VCheckbox, VTextarea } from 'vuetify/components'

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

watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal

  if (newVal && props.item) {
    const initialForm = {}

    props.store.formFields.forEach(field => {
      const detailsKey = `${field.key}_details`

      if (props.item[detailsKey] && typeof props.item[detailsKey] === 'object') {
        initialForm[field.key] = props.item[detailsKey].id
      }
      else {
        initialForm[field.key] = props.item[field.key]
      }
    })

    form.value = initialForm

    setTimeout(() => {
      if ($v.value) {
        props.mode === 'edit' ? $v.value.$touch() : $v.value.$reset()
        validationReady.value = true
      }
    }, 0)

  } else if (newVal && props.mode === 'create') {
    form.value = {}
    setTimeout(() => {
      if ($v.value) {
        $v.value.$reset()
        validationReady.value = true
      }
    }, 0)
  }
})

const rules = computed(() => {
  const r = {}

  props.store.formFields.forEach(field => {
    if (field.validation) {
      r[field.key] = {}

      if (field.validation.required) {
        r[field.key].required = required
      }
      if (field.validation.minLength) {
        r[field.key].minLength = minLength(field.validation.minLength)
      }
      if (field.validation.maxLength) {
        r[field.key].maxLength = maxLength(field.validation.maxLength)
      }
      if (field.validation.email) {
        r[field.key].email = email
      }
    }
  })

  return r
})

const $v = useVuelidate(rules, form)

const isSubmitDisabled = computed(() => {
  if (!validationReady.value) return true
  return $v.value?.$invalid
})

const validate = ({ prop }) => {
  if (!validationReady.value) return ''
  const fieldValidation = $v.value?.[prop]
  if (fieldValidation?.$errors?.length > 0) {
    return fieldValidation.$errors[0].$message
  }
  return ''
}

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
  switch (field.component || field.type) {
    case 'select': return VSelect
    case 'checkbox': return VCheckbox
    case 'textarea': return VTextarea
    default: return VTextField
  }
}

const getFieldProps = (field) => {
  const baseProps = {
    label: field.label,
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
  if (!validationReady.value) return

  await $v.value.$validate()

  if (!$v.value.$invalid) {
    pending.value = true

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
    } finally {
      pending.value = false
    }
  }
}
</script>

<template>
  <v-dialog
      v-model="dialog"
      max-width="500px"
      @after-leave="resetValidation"
  >
    <v-card class="entity-form">
      <v-card-title>
        {{ mode === 'create' ? 'Создать' : 'Редактировать' }} {{ entityType }}
      </v-card-title>

      <v-card-text>
        <v-form>
          <component
              v-for="field in store.formFields"
              :is="getFieldComponent(field)"
              :key="field.key"
              v-model="form[field.key]"
              @blur="handleBlur(field.key)"
              v-bind="getFieldProps(field)"
              :error-messages="validate({ prop: field.key })"
              :error="!!validate({ prop: field.key })"
          ></component>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="cancel">Отмена</v-btn>
        <v-btn
            color="primary"
            @click="submit"
            :disabled="isSubmitDisabled"
            :loading="pending"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>