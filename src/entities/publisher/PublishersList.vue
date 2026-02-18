<script setup>
import EntityList from '@/shared/components/EntityList.vue'
import {usePublishersStore} from "@/entities/publisher/store.js";

const publishersStore = usePublishersStore()
</script>

<template>
  <div>
    <EntityList
        title="Издатели"
        :store="publishersStore"
        entity-type="издателя"
    />
  </div>
</template>

<style scoped lang="scss">

</style>