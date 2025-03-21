<template>
  <div v-if="isAuthenticated" class="dashboard-container">
    <div class="dashboard-header">
      <h1>Tableau de bord</h1>
    </div>

    <RoleGuard role="admin">
      <div class="admin-section">
        <h2>Section Admin</h2>
        <button @click="manageUsers">👤 Gérer les utilisateurs</button>
        <button @click="managePosts">📝 Gérer les articles</button>
      </div>
    </RoleGuard>

    <Profile />

    <div class="dashboard-content">
      <h2>Gestion des fichiers</h2>
      <UploadFile />
    </div>
  </div>
  <div v-else>
    <h1>Vous devez être connecté pour voir cette page.</h1>
  </div>
</template>

<script>
import Profile from '../components/Profile.vue';
import UploadFile from "@/components/UploadFile.vue";
import { useAuthStore } from '../stores/auth';
import { computed } from 'vue';

export default {
  components: {
    UploadFile,
    Profile,
  },
  setup() {
    const authStore = useAuthStore();
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    return {
      isAuthenticated,
    };
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  /* background-color: #f8f9fa; */
  padding: 20px;
}

.dashboard-header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.dashboard-content {
  width: 100%;
  max-width: 700px;
}
</style>
