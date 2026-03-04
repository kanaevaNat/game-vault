<script setup>
import EntityList from '@/shared/components/EntityList.vue'
import {useGameStore} from "@/entities/games/store.js";

const gamesStore = useGameStore()
</script>

<template>
  <div>
    <EntityList
        title="Игры"
        :store="gamesStore"
        entity-type="игру"
    />
  </div>
</template>

<style scoped lang="scss">

</style>