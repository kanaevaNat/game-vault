<script setup>
import EntityList from '@/shared/components/EntityList.vue'
import { useCountriesStore } from './store'

const countriesStore = useCountriesStore()
</script>

<template>
  <div>
    <EntityList
        title="Страны"
        :store="countriesStore"
        entity-type="страну"
    />
  </div>
</template>

<style scoped lang="scss">

</style>