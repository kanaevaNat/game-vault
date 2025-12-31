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
      <button
        @click="adminStore.closeLogin"
        class="login-modal__close"
      >
        &times;
      </button>
      <form class="login-modal__form">
        <div class="login-modal__form-div">
          <input class="login-modal__form-input" type="text"/>
          <input class="login-modal__form-input" type="password"/>
        </div>
        <button class="login-modal__form-submit">Войти</button>
      </form>
    </div>
  </div>
</Teleport>
</template>

<style lang="scss">
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

  &__content{

    position: relative;
    width: 90%;
    max-width: 400px;
    padding: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    @include neon-outline-button($color-pink);
    background-color: var(--color-input);
  }

  &__form{

    &-div{
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;

    }

    &-input{
      padding: 0.25rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      color: var(--color-light);
      background-color: var(--color-input);
      border-color: var(--color-light);
    }

    &-submit{
      margin-top: 2rem;
      padding: 0.6rem 2rem;
      @include neon-outline-button($color-pink);
    }
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