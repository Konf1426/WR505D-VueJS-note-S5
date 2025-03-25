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
const user = ref(null);
const userProfile = ref(null);
const userEmail = computed(() => userProfile.value?.email || null);

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

watch(() => authStore.token, async (newToken) => {
  if (newToken) {
    try {
      const decoded = jwtDecode(newToken);
      user.value = decoded;
      const { data } = await apiClient.get("/users", {
        params: { email: decoded.username },
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      userProfile.value = data.member?.[0] || null;
      console.log("✅ Profil utilisateur :", userProfile.value);
    } catch (error) {
      console.error("❌ Erreur lors du décodage ou de la récupération utilisateur :", error);
      user.value = null;
      userProfile.value = null;
    }
  }
}, { immediate: true });

const postArticle = async () => {
  if (!authStore.isAuthenticated) {
    alert("⚠️ Vous devez être connecté pour publier un article !");
    return;
  }

  if (!newArticle.value.title.trim() || !newArticle.value.content.trim()) {
    alert("❌ Le titre et le contenu sont obligatoires !");
    return;
  }

  const userData = userProfile.value;
  if (!userData?.id) {
    console.error("❌ Impossible de récupérer l'ID utilisateur !");
    return;
  }

  try {
    const payload = {
      ...newArticle.value,
      tags: newArticle.value.tags.split(",").map(tag => tag.trim()),
      author: `/api/users/${userData.id}`
    };

    console.log("📦 Payload envoyé à l'API :", payload);

    await apiClient.post("/contents", payload, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });

    newArticle.value = { title: "", content: "", metaTitle: "", metaDescription: "", slug: "", tags: "" };
    fetchArticles();
  } catch (err) {
    console.error("❌ Erreur lors de la publication de l'article :", err.response?.data || err);
  }
};

onMounted(() => {
  fetchArticles();
});
watch([searchQuery, authorFilter, dateFilter], fetchArticles);
</script>

<template>
  <h2>📖 Articles</h2>

  <div class="filters">
    <input v-model="searchQuery" placeholder="🔍 Rechercher un article..." />
    <input v-model="authorFilter" placeholder="🖊️ Filtrer par auteur..." />
    <input v-model="dateFilter" type="date" placeholder="📅 Filtrer par date" />
  </div>

  <div v-if="authStore.isAuthenticated" class="add-article">
    <h3>📝 Ajouter un article</h3>
    <input v-model="newArticle.title" placeholder="Titre de l'article" @input="() => console.log('✏️ title → content.title')" />
    <textarea v-model="newArticle.content" placeholder="Contenu de l'article" @input="() => console.log('✏️ content → content.content')"></textarea>
    <input v-model="newArticle.metaTitle" placeholder="SEO Title" @input="() => console.log('✏️ metaTitle → content.meta_title')" />
    <input v-model="newArticle.metaDescription" placeholder="SEO Description" @input="() => console.log('✏️ metaDescription → content.meta_description')" />
    <input v-model="newArticle.slug" placeholder="Slug" @input="() => console.log('✏️ slug → content.slug (Gedmo)')" />
    <input v-model="newArticle.tags" placeholder="Tags (séparés par des virgules)" @input="() => console.log('✏️ tags → content.tags')" />
    <button @click="postArticle">Publier</button>
  </div>

  <div v-if="articles.length === 0">❌ Aucun article trouvé.</div>
  <div v-for="article in articles" :key="article.slug" class="article-card">
    <h1>Titre de l'article : {{ article.title }}</h1>
    <p><strong>SEO Title:</strong> {{ article.metaTitle }}</p>
    <p><strong>SEO Description:</strong> {{ article.metaDescription }}</p>
    <p><strong>Slug:</strong> {{ article.slug }}</p>
    <p><strong>Auteur:</strong> {{ article.author?.email || "Inconnu" }}</p>
    <p><strong>Tags:</strong> {{ article.tags }}</p>
    <router-link :to="`/articles/${article.slug}`">
      <button>Voir +</button>
    </router-link>
    <pre>{{ article }}</pre>
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
