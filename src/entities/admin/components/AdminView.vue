<script setup>
import { RouterView } from 'vue-router'

const items = [
  { title: 'Издатели', name: 'publishers'},
  { title: 'Категории', name: 'categories' },
  { title: 'Страны', name: 'countries' },
  { title: 'Студии', name: 'studios'},
]
</script>

<template>
  <v-app class="admin-panel">
    <v-navigation-drawer permanent color="purple-darken-2" class="admin-panel__nav">
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
  margin-top: var(--header-height);
  position: fixed;
  width: 100%;
  &__nav{
    margin-top: var(--header-height);
    padding-top: 3rem;
  }
  &__content{

  }
  &__container{

    padding: 3rem 3rem 0px;
  }
}

</style>