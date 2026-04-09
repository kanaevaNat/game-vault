<script setup>
import { ref, onMounted } from 'vue';

const STORAGE_KEY = 'newsletter_subscribed';

const email = ref('');
const isLoading = ref(false);
const status = ref('idle');
const errorMessage = ref('');

onMounted(() => {
  const subscribedEmail = localStorage.getItem(STORAGE_KEY);
  if (subscribedEmail) {
    status.value = 'success';
    email.value = subscribedEmail;
  }
});

const submitSubscription = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.value)) {
    status.value = 'error';
    errorMessage.value = 'Пожалуйста, введите корректный email';
    return;
  }

  status.value = 'idle';
  isLoading.value = true;
  errorMessage.value = '';

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.setItem(STORAGE_KEY, email.value);
    status.value = 'success';

  } catch (e) {
    status.value = 'error';
    errorMessage.value = 'Что-то пошло не так. Попробуйте позже.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section class="newsletter">
    <div class="newsletter__content glass">

      <div class="newsletter__text">
        <h2 class="newsletter__title">Не пропускай новинки!</h2>
        <p class="newsletter__description">
          Подпишись на еженедельную рассылку лучших игр и свежих новостей.
        </p>
      </div>

      <form @submit.prevent="submitSubscription" class="newsletter__form">
        <div class="input-wrapper">
          <input
              v-model="email"
              type="email"
              placeholder="tvoj@email.com"
              class="search-input"
              :disabled="isLoading || status === 'success'"
          />
        </div>
        <button
            type="submit"
            class="newsletter__btn button"
            :disabled="isLoading || status === 'success'"
        >
          Подписаться
      </button>
      </form>

      <transition name="fade">
        <div v-if="status === 'error'" class="newsletter__message newsletter__message--error">
          {{ errorMessage }}
        </div>
        <div v-else-if="status === 'success'" class="newsletter__message newsletter__message--success">
          <span>Спасибо! Вы успешно подписаны на рассылку</span>
        </div>
      </transition>
    </div>
  </section>
</template>

<style scoped lang="scss">
.newsletter {
  padding-block: 4rem;
  display: flex;
  justify-content: center;

  &__content {
    max-width: 800px;
    width: 100%;
    padding: 2rem;
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2rem;
    position: relative;
    overflow: hidden;
  }

  &__title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--color-text);
  }

  &__description {
    color: var(--color-grey);
    font-size: 1rem;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
  }

  .input-wrapper {
    position: relative;
    flex: 1;
    width: 100%;
    max-width: 500px;

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.2rem;
      height: 1.2rem;
      fill: var(--color-grey);
      pointer-events: none;
    }
  }

  &__btn {
    white-space: nowrap;
    @include neon-outline-button($color-pink-lite);
    transition: all 0.3s;
    width: 100%;
    max-width: 200px;
  }

  &__message {
    font-size: 0.9rem;
    margin-top: 0.5rem;
    font-weight: 500;

    &--error { color: #ff4d4d; }
    &--success { color: var(--color-input-text); }
  }
}
.button{
  border: 2px solid $color-pink-lite;
  border-radius: 12px;
  height: 3rem;
}

@media (max-width: 600px) {
  .newsletter{
    padding-block: 2rem;
    .newsletter__form {
      flex-direction: column;
    }
  }
  .input-wrapper, .newsletter__btn {
    width: 100%;
  }
}
</style>