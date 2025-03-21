<template>
    <div class="auth-container">
      <h2>Inscription</h2>
      <form @submit.prevent="handleRegister">
        <div>
          <label>Nom</label>
          <input type="text" v-model="name" required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label>Mot de passe</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      <p>Déjà un compte ? <router-link to="/login">Se connecter</router-link></p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const name = ref('');
  const email = ref('');
  const password = ref('');
  
  const handleRegister = async () => {
    try {
      await authStore.register({ name: name.value, email: email.value, password: password.value });
      router.push('/login'); // Redirige après inscription
    } catch (error) {
      alert("Échec de l'inscription. Vérifie tes informations.");
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
  