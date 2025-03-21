<template>
    <div v-if="isAuthorized">
      <slot></slot>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from "@/stores/auth";
  import { computed, onMounted } from "vue";
  
  export default {
    props: {
      role: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const authStore = useAuthStore();
      
      // Charger l’utilisateur si ce n’est pas encore fait
      onMounted(async () => {
        if (!authStore.user) {
          await authStore.fetchUser();
        }
      });
  
      const isAuthorized = computed(() => authStore.user?.role === props.role || authStore.isAdmin);
  
      return { isAuthorized };
    },
  };
  </script>
  