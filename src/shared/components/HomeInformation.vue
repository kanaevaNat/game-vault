<script setup>
import {ref, onMounted} from 'vue'
import {useHeroStats} from "@/shared/composables/useStats.js";
import Icon from "@/shared/icons/Icon.vue";

const logoRef = ref(null)
const {stats, isLoading, fetchAll} = useHeroStats()

function onMove(e) {
  if (!logoRef.value) return
  const rect = logoRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5

  logoRef.value.style.transform = `
    perspective(650px)
    rotateY(${x * 25}deg)
    rotateX(${-y * 6}deg)
    scale3d(1.01, 1.01, 1.01)
  `
}

function onLeave() {
  if (!logoRef.value) return
  logoRef.value.style.transform = 'perspective(650px) rotateY(0) rotateX(0) scale3d(1, 1, 1)'
}

onMounted(() => {
  fetchAll()
})
</script>

<template>
  <section class="home-hero" @mousemove="onMove" @mouseleave="onLeave">
    <div ref="logoRef" class="home-hero__logo">
      <span class="home-hero__logo-text">
        GAME<span class="home-hero__logo-highlight">VAULT</span>
      </span>
    </div>

    <div class="home-hero__stats">

      <template v-if="isLoading">
        <div v-for="i in 5" :key="i" class="home-hero__stat home-hero__stat--skeleton">
          <div class="home-hero__stat-icon--skeleton"></div>
          <div class="home-hero__stat-value--skeleton"></div>
          <div class="home-hero__stat-label--skeleton"></div>
        </div>
      </template>

      <template v-else>
        <div v-for="(s, i) in stats" :key="i" class="home-hero__stat">
          <Icon
              :name="s.icon"
              :size="54"
              class="home-hero__stat-icon"
              aria-hidden="true"
          />
          <span class="home-hero__stat-value">
            {{ typeof s.value === 'number' ? s.value.toLocaleString('ru') : s.value }}
          </span>
          <span class="home-hero__stat-label">{{ s.label }}</span>
        </div>
      </template>

    </div>
  </section>
</template>

<style scoped lang="scss">
.home-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 4rem 1rem;
  gap: 2.5rem;
  background: transparent;
  overflow: hidden;
  transition: transform 0.12s ease-out;
}

.home-hero__logo {
  display: flex;
  justify-content: center;
  transition: transform 0.2s ease;
  will-change: transform;
  margin-bottom: 3rem;
  cursor: default;
}

.home-hero__logo-text {
  font-size: clamp(2.8rem, 8vw, 5.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.02em;
  display: inline-block;
  color: #ffffff;
}

.home-hero__logo-highlight {
  color: $color-pink;
  text-shadow: 0 0 20px rgba($color-pink, 0.6), 0 0 20px rgba($color-pink, 0.3);
}

.home-hero:hover {
  .home-hero__logo-text,
  .home-hero__logo-highlight {
    text-shadow:
        0 0 15px currentColor,
        0 0 35px currentColor,
        0 0 70px currentColor;
  }
}

.home-hero__stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
  max-width: 920px;
  margin: 0 auto;
  padding: 0 1rem;
}

.home-hero__stat {
  flex: 0 0 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.2s, border-color 0.2s, transform 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba($color-pink-lite, 0.4);
    transform: translateY(-2px);
  }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .home-hero__stat {
    flex: 0 0 215px;
  }
}

@media (min-width: 1024px) {
  .home-hero__stat {
    flex: 0 0 160px;
  }
}

.home-hero__stat-icon {
  width: clamp(40px, 6vw, 54px);
  height: clamp(40px, 6vw, 54px);
  color: var(--color-input-text);
  transition: color 0.2s;

  .home-hero__stat:hover & {
    color: $color-pink-lite;
  }
}

.home-hero__stat-value {
  font-size: clamp(1.2rem, 3.5vw, 2rem);
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 8px rgba($color-pink-lite, 0.4);
  line-height: 1.2;
}

.home-hero__stat-label {
  font-size: clamp(0.75rem, 2vw, 0.85rem);
  color: #666677;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.3;
}

.home-hero__stat--skeleton {
  pointer-events: none;

  .home-hero__stat-icon--skeleton,
  .home-hero__stat-value--skeleton,
  .home-hero__stat-label--skeleton {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .home-hero__stat-icon--skeleton {
    width: 54px;
    height: 54px;
    margin-bottom: 0.3rem;
  }

  .home-hero__stat-value--skeleton {
    width: 60px;
    height: 1.8rem;
    margin: 0.2rem 0;
  }

  .home-hero__stat-label--skeleton {
    width: 100px;
    height: 0.9rem;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
}

@media (max-width: 800px) {
  .home-hero {
    padding: 0;
    gap: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero,
  .home-hero__logo,
  .home-hero__stat {
    transition: none !important;
  }
  .home-hero__letter {
    transition: none !important;
  }
}
</style>