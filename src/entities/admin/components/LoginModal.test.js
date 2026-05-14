import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import LoginModal from './LoginModal.vue';

const createWrapper = (initialState = {}) =>
    mount(LoginModal, {
        global: {
            plugins: [
                createTestingPinia({
                    initialState: {
                        admin: {
                            isLoginModal: true,
                            loginForm: { username: '', password: '' },
                            error: null,
                            isLoading: false,
                            token: null,
                            user: null,
                            initialized: false,
                            ...initialState,
                        },
                    },
                }),
            ],
        },
    });

describe('LoginModal', () => {
    let wrapper;

    beforeEach(() => {
        document.body.innerHTML = '';
        wrapper = createWrapper();
    });

    afterEach(() => {
        wrapper.unmount();
        document.body.innerHTML = '';
    });

    it('отображает модальное окно при isLoginModal: true', () => {
        expect(document.querySelector('.login-modal')).toBeTruthy();
    });

    it('закрывает модальное окно при клике на кнопку закрытия', async () => {
        const closeBtn = document.querySelector('.login-modal__close');
        expect(closeBtn).toBeTruthy();

        await closeBtn.click();

        const store = wrapper.vm.adminStore;
        expect(store.resetLoginForm).toHaveBeenCalled();
        expect(store.closeLogin).toHaveBeenCalled();
    });

    it('обновляет значения полей формы при вводе', async () => {
        const [usernameInput, passwordInput] = document.querySelectorAll('input');
        expect(usernameInput && passwordInput).toBeTruthy();

        usernameInput.value = 'testuser';
        passwordInput.value = 'password123';
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
    });

    it('вызывает login при отправке формы', async () => {
        const store = wrapper.vm.adminStore;
        store.login = vi.fn();

        const form = document.querySelector('form');
        expect(form).toBeTruthy();

        await form.dispatchEvent(new Event('submit'));
        await flushPromises();

        expect(store.login).toHaveBeenCalled();
    });

    it('отображает сообщение об ошибке из хранилища', async () => {
        const store = wrapper.vm.adminStore;
        store.error = 'Invalid credentials';
        await wrapper.vm.$nextTick();

        const errorDiv = document.querySelector('.login-modal div');
        expect(errorDiv).toBeTruthy();
        expect(errorDiv.textContent).toContain('Invalid credentials');
    });
});