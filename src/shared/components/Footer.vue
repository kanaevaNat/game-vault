<script setup>
import Gamepad from "@/shared/icons/Gamepad.vue";
import Icon from '@/shared/icons/Icon.vue';

const navLinks = [
  {name: 'Главная', to: '/'},
  {name: 'Игры', to: '/games'},
  {name: 'Новости', to: '/news'},
];

const socials = [
  { name: 'Telegram', icon: 'telegram', url: 'https://t.me/Natasha_Kanaeva' },
  { name: 'Github', icon: 'github', url: 'https://github.com/kanaevaNat' },
  { name: 'VK', icon: 'vk', url: 'https://vk.com/id259099448' },
];
</script>

<template>
  <footer class="footer">
    <div class="footer-wrapper glass">
      <div class="content">

        <div class="footer-col">
          <Gamepad :size="50" class="icon"></Gamepad>
          <div class="logo-text">GAME<span class="highlight">VAULT</span></div>
        </div>
        <div class="footer-col navigation">
          <h4 class="col-title">Разделы</h4>
          <ul class="nav-list">
            <li v-for="link in navLinks" :key="link.name">
              <router-link :to="link.to">{{ link.name }}</router-link>
            </li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 class="col-title">Социальные сети</h4>
          <div class="social-links">
            <a
                v-for="social in socials"
                :key="social.name"
                :href="social.url"
                class="social-link"
                :aria-label="social.name"
            >
              <Icon :name="social.icon" class="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  position: relative;
  width: 100%;
  margin-top: auto;

  .footer-wrapper {
    position: static;
    width: 100%;
    padding: 2rem;

    .content {
      max-width: 1300px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      justify-content: space-between;
      gap: 4rem;

      .footer-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        gap: 2rem;

        &:first-child {
          justify-content: center;
        }
        .logo-text {
          font-size: 1.1rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: 1px;

          .highlight {
            @include neon-outline-text($color-pink);
            color: $color-pink;
          }
        }
        .col-title {
          color: #fff;
          font-size: 1rem;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          display: inline-block;

          &::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--color-input-text);
            box-shadow: 0 0 5px var(--color-input-text);
          }
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
          color: #FFFFFF;


          a {
            color: var(--color-grey);
            text-decoration: none;

            &:hover {
              color: var(--color-input-text);
              text-shadow: 0 0 8px var(--color-input-text);
            }
          }
        }

        .social-links {
          display: flex;
          gap: 1rem;

          @media (max-width: 900px) {
            justify-content: center;
          }
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;

          .social-icon {
            width: 50px;
            height: 50px;
            @include neon-effect-icon($color-pink-lite);
            filter: none;
          }
        }

        @media (max-width: 900px) {
          align-items: center;
        }
      }
    }
  }
}

.icon {
  @include neon-effect-icon($color-pink);
}

@media (max-width: 800px) {
  .footer {
    .footer-wrapper {
      padding: 1rem;

      .content {
        grid-template-columns: 1fr;
        gap: 1.5rem;

        .footer-col {
          gap: 1rem;

          .logo-text {
            font-size: 0.9rem;
          }

          .col-title {
            font-size: 0.85rem;
            margin-bottom: 0.5rem;
          }

          .nav-list {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;

            a {
              font-size: 0.85rem;
            }
          }

          .social-links {
            gap: 0.5rem;
          }

          .social-link {
            width: 32px;
            height: 32px;

            .social-icon {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }
  }
  .icon {
    width: 40px;
    height: 40px;
  }
}
</style>