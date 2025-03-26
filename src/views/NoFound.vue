<template>
  <div class="not-found">
    <span class="code">404</span>
    <h1>Page non trouvée</h1>
    <p>La page que vous recherchez n'existe pas.</p>
    <p>C'est fou comment internet c'est grand !</p>
    <router-link to="/">Retour à l'accueil</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: sans-serif;
  text-align: center;
}

.code {
  font-size: 5em;
  font-weight: bold;
  color: #999;
}

h1 {
  font-size: 2em;
  margin: 10px 0;
}

p {
  font-size: 1.2em;
  margin-bottom: 30px;
}

a {
  color: #007bff;
  text-decoration: none;
  font-size: 1.2em;
}

a:hover {
  text-decoration: underline;
}
</style>
