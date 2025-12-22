<script setup>

import {useAdminStore} from "@/entities/admin/store.js";

const adminStore = useAdminStore();
</script>

<template>
<Teleport to="body">
  <div
      v-if="adminStore.isLoginModal"
      class="login-modal"
      @click="adminStore.closeLogin"
  >
    <div class="login-modal__content" @click.stop>
      <h2 class="login-modal__title">Авторизация</h2>
      <form>
        <input/>
        <input/>
        <button>Войти</button>
      </form>
      <button
        @click="adminStore.closeLogin"
      >
        &times;
      </button>
    </div>
  </div>
</Teleport>
</template>

<style scoped>

</style>