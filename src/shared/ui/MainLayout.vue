<script setup>
import Header from "@/shared/ui/Header.vue";
</script>

<template>
  <div class="layout">
    <Header />
    <main class="layout-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>

</style>