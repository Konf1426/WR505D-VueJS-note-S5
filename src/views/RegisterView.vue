<template>
  <div class="auth-container">
    <h2>Inscription</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Prénom</label>
        <input type="text" v-model="firstname" required />
      </div>
      <div>
        <label>Nom</label>
        <input type="text" v-model="lastname" required />
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

const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');

const handleRegister = async () => {
  console.log('Tentative d’inscription avec les données suivantes :', {
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    password: password.value
  });

  try {
    const result = await authStore.register({
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value
    });
    console.log('✅ Inscription réussie :', result);
    router.push('/login');
  } catch (error) {
    console.error('❌ Erreur lors de l’inscription :', error);
    if (error.response) {
      console.error('➡️ Détail réponse serveur :', error.response);
    }
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
