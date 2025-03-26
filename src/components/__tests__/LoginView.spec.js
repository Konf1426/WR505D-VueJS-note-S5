import { mount } from '@vue/test-utils'
import LoginView from '@/views/LoginView.vue'

describe('LoginView.vue', () => {
  it('affiche le formulaire de connexion', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })
})
