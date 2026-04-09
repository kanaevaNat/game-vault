<script setup>
import {useAdminStore} from "@/entities/admin/store.js"

const adminStore = useAdminStore()

const close = () => {
  adminStore.resetLoginForm()
  adminStore.closeLogin()
}

const submit = async () => {
  await adminStore.login()
}
</script>

<template>
<Teleport to="body">
  <div
      v-if="adminStore.isLoginModal"
      class="login-modal"
      @click="close"
  >
    <div class="login-modal__content glass" @click.stop>
      <h2 class="login-modal__title">Авторизация</h2>
      <button
        @click="close"
        class="login-modal__close"
      >
        &times;
      </button>
      <form class="login-modal__form" @submit.prevent="submit">
        <div class="login-modal__fields">
          <input
              v-model="adminStore.loginForm.username"
              class="login-modal__field search-input"
              type="text"
              placeholder="Логин"
          />
          <input
              v-model="adminStore.loginForm.password"
              class="login-modal__field search-input"
              type="password"
              placeholder="Пароль"
          />
        </div>
        <div v-if="adminStore.error">{{adminStore.error}}</div>
        <button
            type="submit"
            class="login-modal__submit"
        >
          Войти
        </button>
      </form>
    </div>
  </div>
</Teleport>
</template>

<style lang="scss" scoped>
.login-modal{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(var(--background), 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  // такое большое число чтобы перекрыть стандартные слои vuetify в админке
  z-index: 2500;

  &__content{
    position: relative;
    width: 90%;
    max-width: 400px;
    padding: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    border-radius: 12px;
  }
  &__title{
    color: var(--color-input-text);
  }
  &__fields{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

  }
  &__field{
    padding-block: 0.5rem;
    padding-left: 1rem;
    border-radius: 12px;
    font-size: 1rem;
  }
  &__submit{
      margin-top: 2rem;
      padding: 0.3rem 2rem;
      @include neon-outline-button($color-pink-lite);
  }
  &__close{
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #999;
    cursor: pointer;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>