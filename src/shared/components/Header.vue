<script setup>
import Gamepad from "@/shared/icons/Gamepad.vue";
import { ref } from 'vue'
import {useAdminStore} from "@/entities/admin/store.js";
import LoginModal from "@/entities/admin/components/LoginModal.vue";

const adminStore = useAdminStore();
const isMenuOpen = ref(false)
</script>

<template>
  <header class="header glass" :class="{ 'header_is-open': isMenuOpen }">
    <a href="/" class="header__logo">
      <div class="header__icon">
        <Gamepad :size="50"></Gamepad>
      </div>
    </a>

    <button
        class="header__burger"
        @click="isMenuOpen = !isMenuOpen"
        :aria-expanded="isMenuOpen"
        aria-controls="header-menu"
        aria-label="Открыть меню"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="header__menu" id="header-menu">
      <ul class="header__menu-list">
        <li class="header__menu-item">
          <router-link :to="{ name: 'home'}" class="header__menu-link">Главная</router-link>
        </li>
        <li class="header__menu-item">
          <router-link :to="{ name: 'games'}" class="header__menu-link">Игры</router-link>
        </li>
        <li class="header__menu-item">
          <router-link :to="{ name: 'games'}" class="header__menu-link">Новости</router-link>
        </li>
      </ul>
    </nav>

    <div class="header__actions">
      <button @click="adminStore.openLogin" class="button" type="button">Вход</button>
    </div>
    <LoginModal/>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  padding-inline: 32px;
  min-height: var(--header-height);

  display: grid;
  align-items: center;
  transition: all 0.3s ease;

  &__menu {
    &-list {
      display: flex;
      gap: 50px;
      flex-wrap: wrap;
    }

    &-link {
      display: inline-flex;
      align-items: center;
      text-transform: uppercase;
      gap: 7px;
    }
  }
  &__burger {
       display: none;
       flex-direction: column;
       justify-content: space-around;
       width: 30px;
       height: 24px;
       background: transparent;
       border: none;
       cursor: pointer;
       z-index: 1001;

       span {
         width: 100%;
         height: 2px;
         background: var(--color-light);
         border-radius: 2px;
         transition: all 0.3s ease;
         transform-origin: center;
       }
     }
}



  .header_is-open {
    .header__burger {
      span:nth-child(1) {
        transform: rotate(50deg) translate(5px, 5px);
      }
      span:nth-child(2) {
        opacity: 0;
      }
      span:nth-child(3) {
        transform: rotate(-50deg) translate(5px, -5px);
      }
    }
}

.icon {
  @include neon-effect-icon($color-pink);
}

.button {
  @include neon-outline-button($color-pink);

}

@media (min-width: 769px) {
  .header {
    grid-template-columns: auto 1fr auto;
    grid-template-rows: 1fr;
    grid-template-areas: "logo menu actions";
    gap: 20px;

    &__logo {
      grid-area: logo;
    }

    &__menu {
      grid-area: menu;
      justify-self: center;

      &-list {
        justify-content: center;
      }
    }

    &__actions {
      grid-area: actions;
      justify-self: end;
    }

    &__burger {
      display: none !important;
    }
  }
}

@media (max-width: 768px) {
  .header {
    grid-template-columns: 1fr auto;
    grid-template-rows: var(--header-height) 0fr 0fr;
    grid-template-areas:
      "logo burger"
      "menu menu"
      "actions actions";
    gap: 0;
    align-items: start;
    transition: grid-template-rows 0.35s cubic-bezier(0.3, 0, 0.7, 1);

    &__logo {
      grid-area: logo;
      align-self: center;
    }

    &__burger {
      grid-area: burger;
      display: flex;
      align-self: center;
    }

    &__menu {
      grid-area: menu;
      overflow: hidden;
      padding: 0 20px;
      display: flex;
      justify-content: center;

      &-list {
        flex-direction: column;
        gap: 15px;
        align-items: center;
        padding: 20px 0;
      }

      &-link {
        padding: 10px 0;
      }
    }

    &__actions {
      grid-area: actions;
      overflow: hidden;
      display: flex;
      justify-content: center;
      padding: 0 20px;

      .button {
        margin: 20px 0;
      }
    }

    &_is-open {
      grid-template-rows: var(--header-height) 1fr auto;

      .header__menu,
      .header__actions {
        opacity: 1;
        visibility: visible;
      }
    }

    &__menu,
    &__actions {
      opacity: 0;
      visibility: hidden;
    }
  }
}
</style>