<template>
    <div class="auth-container">
      <h2>Connexion</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label>Email</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label>Mot de passe</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Se connecter</button>
      </form>
      <p>Pas encore inscrit ? <router-link to="/register">Créer un compte</router-link></p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const email = ref('');
  const password = ref('');
  
  const handleLogin = async () => {
    try {
      await authStore.login({ email: email.value, password: password.value });
      router.push('/dashboard'); // Redirige après connexion
    } catch (error) {
      alert('Échec de la connexion. Vérifie tes informations.');
    }
  };
  </script>
  
  <style scoped>
  .auth-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background: #f9f9f9;
  }
  input {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
  }
  button {
    width: 100%;
    padding: 10px;
    background: #42b883;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background: #369b71;
  }
  </style>
  