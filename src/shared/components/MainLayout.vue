<script setup>
import Header from "@/shared/components/Header.vue";
import Footer from "@/shared/components/Footer.vue";
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="layout">
    <Header />
    <main class="layout-main">
      <router-view />
    </main>
    <Footer v-if="!route.meta.hideFooter"/>
  </div>
</template>

<style scoped>

</style>