<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl w-full">
      <!-- Hero Section -->
      <div class="bg-white shadow-xl rounded-lg p-10 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <SpeakerWaveIcon class="h-8 w-8 text-red-500 mr-2" /> Bienvenue sur notre CMS Headless !
        </h1>
        <p class="text-gray-600 mb-6">
          Gère ton contenu efficacement avec notre système moderne et sécurisé basé sur Vue.js et un backend performant.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap justify-center gap-4">
          <router-link
            v-if="!authStore.token"
            to="/register"
            class="btn-primary"
          >
            📝 Créer un compte
          </router-link>
          <router-link
            v-if="!authStore.token"
            to="/login"
            class="btn-secondary"
          >
            🔑 Se connecter
          </router-link>
          <router-link
            to="/articles"
            class="btn-dark"
          >
            📚 Voir les articles
          </router-link>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="feature-card">
          <BookOpenIcon class="h-10 w-10 text-blue-600 mx-auto mb-2" />
          <h3 class="text-xl font-semibold text-gray-900">Articles</h3>
          <p class="text-gray-600 mt-2">Crée, modifie et gère tes articles facilement.</p>
        </div>
        <div class="feature-card">
          <ChatBubbleLeftRightIcon class="h-10 w-10 text-green-600 mx-auto mb-2" />
          <h3 class="text-xl font-semibold text-gray-900">Commentaires</h3>
          <p class="text-gray-600 mt-2">Interagis avec ta communauté grâce aux commentaires.</p>
        </div>
        <div class="feature-card">
          <KeyIcon class="h-10 w-10 text-yellow-600 mx-auto mb-2" />
          <h3 class="text-xl font-semibold text-gray-900">Authentification</h3>
          <p class="text-gray-600 mt-2">Connexion sécurisée avec JWT et gestion des utilisateurs.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { SpeakerWaveIcon, BookOpenIcon, ChatBubbleLeftRightIcon, KeyIcon } from '@heroicons/vue/24/solid';

const authStore = useAuthStore();
</script>

<style scoped>
/* Boutons stylés */
.btn-primary {
  @apply px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition;
}
.btn-secondary {
  @apply px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition;
}
.btn-dark {
  @apply px-5 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition;
}

/* Cards de fonctionnalités */
.feature-card {
  @apply bg-white shadow-md rounded-lg p-6 text-center;
}
</style>
