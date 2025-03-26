import { mount } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'

describe('HomeView.vue', () => {
  it('affiche correctement la page d\'accueil', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.text()).toMatch(/accueil/i)
  })
})
