<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <!-- Navigation Bar -->
    <Disclosure as="nav" class="bg-green-600 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left Section -->
          <div class="flex items-center space-x-4">
            <router-link to="/" class="nav-link">
              <HomeIcon class="h-6 w-6" /> Accueil
            </router-link>
            <router-link to="/articles" class="nav-link">
              <DocumentTextIcon class="h-6 w-6" /> Articles
            </router-link>
            <!-- <button @click="handleAdminClick" class="nav-link">
              <DocumentTextIcon class="h-6 w-6" /> Admin
            </button> -->
          </div>

          <!-- Right Section -->
          <div class="flex items-center space-x-4">
            <router-link v-if="!authStore.token" to="/login" class="nav-link">
              <KeyIcon class="h-6 w-6" /> Connexion
            </router-link>
            <router-link v-if="authStore.token" to="/dashboard" class="nav-link">
              <ChartBarIcon class="h-6 w-6" /> Dashboard
            </router-link>
            <button
              v-if="authStore.token"
              @click="authStore.logout"
              class="btn-danger"
            >
              <ArrowRightOnRectangleIcon class="h-6 w-6" /> Déconnexion
            </button>
          </div>
        </div>
      </div>
    </Disclosure>

    <!-- Page Content -->
    <div class="container mx-auto p-6">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
        <template v-if="!Component">
          <NotFound />
        </template>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';
import { Disclosure } from '@headlessui/vue';
import {
  HomeIcon,
  DocumentTextIcon,
  KeyIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/solid';
import NotFound from './views/NoFound.vue';

const authStore = useAuthStore();
const router = useRouter();

const handleAdminClick = async () => {
  if (!authStore.token) {
    console.warn("🚨 L'utilisateur n'est pas connecté.");
    return router.push('/');
  }

  try {
    console.log("🔍 Vérification du rôle admin...");
    console.log("AuthStore ==", authStore.isAdmin)
    await authStore.fetchUser(); // Assure-toi que le rôle est bien à jour

    if (authStore.isAdmin) {
      console.log("✅ Accès admin autorisé !");
      await router.push('/admin');
    } else {
      console.warn("⛔ Accès refusé, redirection vers l'accueil...");
      await router.push('/');
    }
  } catch (error) {
    console.error("🚨 Erreur lors de la vérification de l'admin:", error);
    await router.push('/');
  }
};
</script>

<style scoped>
/* TailwindCSS utility classes used directly */
.nav-link {
  @apply text-white flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-green-700 transition;
}

.btn-danger {
  @apply text-white bg-red-600 px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-red-700 transition;
}
</style>
