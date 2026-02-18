<script setup>
import EntityList from "@/shared/components/EntityList.vue";
import {useCategoriesStore} from "@/entities/category/store.js";

const categoriesStore = useCategoriesStore()
</script>

<template>
<div>
  <EntityList
      title="Категории"
      :store="categoriesStore"
      entity-type="категорию"
  />
</div>
</template>

<style scoped lang="scss">

</style>