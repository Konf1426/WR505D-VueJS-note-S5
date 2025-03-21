<template>
    <div class="profile-card">
      <h2 class="text-xl font-bold text-gray-800">👤 Profil utilisateur</h2>
  
      <div v-if="tokenPayload" class="mt-4">
        <p><strong>Nom d'utilisateur :</strong> {{ tokenPayload.username || 'Non renseigné' }}</p>
        <p><strong>Rôles :</strong> {{ tokenPayload.roles ? tokenPayload.roles.join(', ') : 'Aucun rôle' }}</p>
      </div>
      <div v-else class="text-red-600">
        <p>⚠️ Aucun utilisateur connecté.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue';
  import { useAuthStore } from '../stores/auth';
  
  const authStore = useAuthStore();
  
  const tokenPayload = computed(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Token Payload:", payload);
        return payload;
      }
      return null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  });
  
  // Vérifie si l'utilisateur est bien défini
  const user = computed(() => authStore.user);
  
  const getRoles = () => {
    return user.value?.roles?.join(', ') || 'Aucun rôle';
  };
  
  // Charger les données utilisateur au montage du composant
  onMounted(async () => {
    console.log("🚀 Chargement du profil...");
    await authStore.fetchUser();
    console.log("📊 Données après chargement :", authStore.user);
  });
  </script>
  
  <style scoped>
  .profile-card {
    @apply bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-6;
  }
  </style>
  