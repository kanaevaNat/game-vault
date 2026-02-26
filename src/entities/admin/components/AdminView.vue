<script setup>
import { ref, computed } from 'vue'
import { RouterView } from 'vue-router'
import { useDisplay } from 'vuetify'

const { width } = useDisplay()
const drawer = ref(true)
const isMobile = computed(() => width.value < 800)

const items = [
  { title: 'Игры', name: 'games-admin'},
  { title: 'Издатели', name: 'publishers'},
  { title: 'Категории', name: 'categories' },
  { title: 'Новости', name: 'news' },
  { title: 'Страны', name: 'countries' },
  { title: 'Студии', name: 'studios'},
]
</script>

<template>
  <v-app class="admin-panel">
    <v-app-bar
        color="purple-darken-2"
        density="compact"
        class="mobile-header"
    >
      <v-btn
          color="primary"
          @click.stop="drawer = !drawer"
      >
        Меню
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        :temporary="isMobile"
        :permanent="!isMobile"
        color="purple-darken-2"
        class="admin-panel__nav"
    >
      <v-list>
        <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="{name: item.name}"
            :title="item.title"
            link
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="admin-panel__content">
      <div class="admin-panel__container">
        <RouterView/>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped lang="scss">

.admin-panel{
  height: auto;
  position: relative;
  width: 100%;
  background-color: transparent;

  &__nav{
    padding-top: 2rem;
    @include header-margin;
  }

  &__container{
    padding-inline: 3rem;
    padding-bottom: 3rem;
    padding-top: calc(var(--header-height) + 3rem);
    @media (max-width: 800px) {
      padding: 2rem 1rem 2rem;
    }
  }
}
.mobile-header {
  @include header-padding(2rem);
  padding-left: 1rem;
  @media (min-width: 800px) {
    display: none !important;
  }
}
</style>