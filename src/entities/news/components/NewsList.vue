<script setup>
import EntityList from '@/shared/components/EntityList.vue'
import { useNewsStore } from '../store.js'

const newsStore = useNewsStore()
</script>

<template>
  <div>
    <EntityList
        title="Новости"
        :store="newsStore"
        entity-type="новость"
    />
  </div>
</template>

<style scoped lang="scss">

</style>