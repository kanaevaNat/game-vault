<script setup>
import EntityList from '@/shared/components/EntityList.vue'
import { useStudiosStore } from './store'

const studiosStore = useStudiosStore()
</script>

<template>
  <div>
    <EntityList
        title="Студии"
        :store="studiosStore"
        entity-type="студию"
    />
  </div>
</template>

<style scoped lang="scss">

</style>