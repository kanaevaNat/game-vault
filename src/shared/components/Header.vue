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
          <router-link :to="{ name: 'news'}" class="header__menu-link">Новости</router-link>
        </li>
        <li class="header__menu-item">
          <router-link
              v-if="adminStore.isAuthenticated"
              :to="{ name: 'admin'}"
              class="header__menu-link"
          >
            Админ
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="header__actions">
      <span v-if="adminStore.isAuthenticated" class="header__user-greeting">Hello, {{ adminStore.user?.username }}</span>
      <button
          v-if="adminStore.isAuthenticated"
          @click="adminStore.logout"
          class="button"
          type="button"
      >
        Выход
      </button>
      <button
          v-else
          @click="adminStore.openLogin"
          class="button"
          type="button"
      >
        Вход
      </button>
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
  font-size: 1.1rem;

  &__menu {
    &-list {
      display: flex;
      gap: 50px;
      flex-wrap: nowrap;
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
    height: 20px;
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
  &__user-greeting{
    margin-right: 20px;
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
@media(min-width: 1000px) {
  .header {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "logo . actions";
    justify-items: start;

    &__logo {
      grid-area: logo;
    }

    &__menu {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      &-list {
        display: flex;
        gap: 20px;
        justify-content: center;
      }
    }

    &__actions {
      grid-area: actions;
      justify-self: end;
    }
  }
}
@media (800px <= width <= 1000px) {
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
        gap: 20px;
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

@media (max-width: 800px) {
  .header {
    grid-template-columns: 1fr auto;
    grid-template-rows: var(--header-mobile-height) 0fr 0fr;
    grid-template-areas:
      "logo burger"
      "menu menu"
      "actions actions";
    gap: 0;
    align-items: center;
    min-height: var(--header-mobile-height);
    font-size: 0.8rem;

    &__logo {
      grid-area: logo;
    }

    &__burger {
      grid-area: burger;
      display: flex;
    }

    &__menu {
      grid-area: menu;
      overflow: hidden;
      display: flex;
      justify-content: center;

      &-list {
        flex-direction: column;
        gap: 30px;
        align-items: center;
      }
    }

    &__actions {
      grid-area: actions;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }

    .button {
      margin-bottom: 20px;
    }
    &__user-greeting{
      margin-top: 30px;
      margin-right: 0;
    }
    &_is-open {
      grid-template-rows: var(--header-mobile-height) 1fr auto;
      .header__menu,
      .header__actions {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
    }

    &__menu,
    &__actions {
      opacity: 0;
      visibility: hidden;
      transform: translateY(-100px);
      transition:
          opacity 0.2s ease,
          visibility 0.3s ease,
          transform 0.3s ease;
    }
  }
}
</style>