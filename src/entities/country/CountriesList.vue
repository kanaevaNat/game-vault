<script setup>
import {onMounted} from "vue";
import EntityTable from "@/shared/components/EntityTable.vue";
import {useCountriesStore} from "@/entities/country/store.js";

const countriesStore = useCountriesStore()

onMounted(() => {
  countriesStore.fetchCountries()
})

const handleDelete = async(country) => {
  await countriesStore.deleteCountry(country.id)
}

const columns =[
{key: 'id', label: 'ID'},
{key: 'name', label: 'Название'}
]
</script>

<template>
<div>
  <h2>Страны</h2>
  <EntityTable
      :items="countriesStore.countries"
      :columns="columns"
      :on-delete="handleDelete"
  />
</div>
</template>

<style scoped lang="scss">

</style>