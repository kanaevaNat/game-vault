<script setup>

</script>

<template>
<div class="not-found">
  <h1 class="not-found__error">404</h1>
  <p class="not-found__text">Страница не найдена</p>
</div>
</template>

<style lang="scss" scoped>
.not-found{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  &__error{
    font-size: 5rem;
  }
  &__text{
    font-size: 2rem;
  }
}
</style>