<template>
    <div>
      <h1>Admin Dashboard</h1>
      <p v-if="authStore.user">Bienvenue, {{ authStore.user.firstname }} ({{ authStore.user.roles }})</p>
  
      <RoleGuard role="ROLE_ADMIN">
        <button @click="manageUsers">Gérer les utilisateurs</button>
        <button @click="logout">Se déconnecter</button>
      </RoleGuard>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from "@/stores/auth";
  import RoleGuard from "@/components/RoleGuard.vue";
  import { onMounted } from "vue";
  
  export default {
    components: { RoleGuard },
    setup() {
      const authStore = useAuthStore();
  
      // Chargement des infos utilisateur
      onMounted(async () => {
        if (!authStore.user) {
          await authStore.fetchUser();
          console.log("Utilisateur actuel :", authStore.user); // 🔍 DEBUG
        }
      });
  
      // Déconnexion
      const logout = () => {
        authStore.logout();
        window.location.href = "/login"; // Redirection après déconnexion
      };
  
      return { authStore, logout, manageUsers: () => console.log("Gestion des utilisateurs") };
    },
  };
  </script>
  