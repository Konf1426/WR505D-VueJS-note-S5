<script setup>
import { ref, onMounted, watch, computed } from "vue";
import apiClient from "@/services/axios";
import { useAuthStore } from "@/stores/auth";
import { jwtDecode } from "jwt-decode";

const authStore = useAuthStore();
const articles = ref([]);
const newArticle = ref({
  title: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  slug: "",
  tags: ""
});
const searchQuery = ref("");
const authorFilter = ref("");
const dateFilter = ref("");

// const decodedToken = jwtDecode(this.token); // 'this' context is incorrect here
// console.log("📢 UI:", decodedToken);

const user = computed(() => {
  if (authStore.token) {
    try {
      return jwtDecode(authStore.token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  return null;
});

console.log("user", user.value.username);

// 🔥 Récupérer les articles avec filtres
const fetchArticles = async () => {
  try {
    const params = {};
    if (searchQuery.value) params.title = searchQuery.value;
    if (authorFilter.value) params.author = authorFilter.value;
    if (dateFilter.value) params.createdAt = dateFilter.value;

    const response = await apiClient.get("/contents", { params });
    articles.value = response.data.member || [];
  } catch (err) {
    console.error("❌ Erreur de récupération des articles :", err);
  }
};

// ✍️ Ajouter un article (🔒 Seulement si connecté)
const postArticle = async () => {
  if (!authStore.isAuthenticated) {
    alert("⚠️ Vous devez être connecté pour publier un article !");
    return;
  }

  if (!newArticle.value.title.trim() || !newArticle.value.content.trim()) {
    alert("❌ Le titre et le contenu sont obligatoires !");
    return;
  }

  const user = user.value.username; // 🔥 Récupère l'utilisateur connecté depuis le store
  if (!user || !user.id) {
    console.error("❌ Utilisateur non récupéré");
    return;
  }

  try {
    const payload = {
      ...newArticle.value,
      tags: newArticle.value.tags.split(",").map(tag => tag.trim()),
      author: `/api/users/${user.id}` // ✅ Ajout de l'auteur
    };

    console.log("📤 Envoi de l'article :", payload);

    await apiClient.post("/contents", payload, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });

    console.log("✅ Article ajouté !");
    newArticle.value = { title: "", content: "", metaTitle: "", metaDescription: "", slug: "", tags: "" };
    fetchArticles();
  } catch (err) {
    console.error("❌ Erreur lors de la publication de l'article :", err.response?.data || err);
  }
};


// Initialisation
onMounted(() => {
  fetchArticles();
});
watch([searchQuery, authorFilter, dateFilter], fetchArticles);
</script>

<template>
  <h2>📖 Articles</h2>

  <!-- Champs de filtre -->
  <div class="filters">
    <input v-model="searchQuery" placeholder="🔍 Rechercher un article..." />
    <input v-model="authorFilter" placeholder="🖊️ Filtrer par auteur..." />
    <input v-model="dateFilter" type="date" placeholder="📅 Filtrer par date" />
  </div>

  <!-- Ajout d'un article (🔒 Seulement si connecté) -->
  <div v-if="authStore.isAuthenticated" class="add-article">
    <h3>📝 Ajouter un article</h3>
    <input v-model="newArticle.title" placeholder="Titre de l'article" />
    <textarea v-model="newArticle.content" placeholder="Contenu de l'article"></textarea>
    <input v-model="newArticle.metaTitle" placeholder="SEO Title" />
    <input v-model="newArticle.metaDescription" placeholder="Description" />
    <input v-model="newArticle.slug" placeholder="Slug" />
    <input v-model="newArticle.tags" placeholder="Tags (séparés par des virgules)" />
    <button @click="postArticle">Publier</button>
  </div>

  <div v-if="articles.length === 0">❌ Aucun article trouvé.</div>
  <div v-for="article in articles" :key="article.slug" class="article-card">
    <h1>{{ article.title }}</h1>
    <p><strong>SEO Title:</strong> {{ article.metaTitle }}</p>
    <p><strong>Description:</strong> {{ article.metaDescription }}</p>
    <p><strong>Slug:</strong> {{ article.slug }}</p>
    <p v-if="article.author"><strong>Auteur:</strong> {{ article.author.firstname }} {{ article.author.lastname }}</p>
    <router-link :to="`/articles/${article.slug}`">
      <button>Voir +</button>
    </router-link>
  </div>
</template>

<style scoped>
.article-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.filters, .add-article {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.add-article input, .add-article textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
