<script setup>
import Header from "@/shared/components/Header.vue";
import Footer from "@/shared/components/Footer.vue";
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="layout-wrapper">
    <Header />
    <main class="layout-main" :class="{ 'width-page': !route.meta.fullWidth }">
      <router-view />
    </main>
    <Footer v-if="!route.meta.hideFooter" />
  </div>
</template>

<style lang="scss" scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.layout-main {
  flex: 1;
}
</style>