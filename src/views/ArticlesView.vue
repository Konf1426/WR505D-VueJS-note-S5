<script setup>
import { ref, onMounted, watch, computed } from "vue";
import apiClient from "@/services/axios";
import { useAuthStore } from "@/stores/auth";
import { jwtDecode } from "jwt-decode";

const authStore = useAuthStore();
const articles = ref([]);
const selectedFile = ref(null);
const newArticle = ref({
  title: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  slug: "",
  tags: "",
  cover: null
});

const searchQuery = ref("");
const authorFilter = ref("");
const dateFilter = ref("");
const user = ref(null);
const userProfile = ref(null);

const userEmail = computed(() => userProfile.value?.email || null);

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0];
  console.log("📸 Fichier sélectionné :", selectedFile.value?.name);
};

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
      console.error("❌ Erreur utilisateur :", error);
      user.value = null;
      userProfile.value = null;
    }
  }
}, { immediate: true });

const uploadImage = async () => {
  if (!selectedFile.value) return null;

  const formData = new FormData();
  formData.append("file", selectedFile.value);

  try {
    const response = await apiClient.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    console.log('✅ Upload réussi :', response.data);
    return response.data['@id'];
  } catch (error) {
    console.error('❌ Erreur upload image :', error.response?.data || error);
    throw error;
  }
};

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
    const coverIri = await uploadImage();
    if (coverIri) {
      newArticle.value.cover = coverIri;
    }

    const payload = {
      ...newArticle.value,
      tags: newArticle.value.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      author: userData['@id']
    };

    console.log("📦 Payload envoyé à l'API :", payload);

    await apiClient.post("/contents", payload, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });

    newArticle.value = {
      title: "", content: "", metaTitle: "", metaDescription: "", slug: "", tags: "", cover: null
    };
    selectedFile.value = null;
    fetchArticles();
  } catch (err) {
    console.error("❌ Erreur publication article :", err.response?.data || err);
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
    <input v-model="authorFilter" placeholder="💊 Filtrer par auteur..." />
    <input v-model="dateFilter" type="date" placeholder="🗓️ Filtrer par date" />
  </div>

  <div v-if="authStore.isAuthenticated" class="add-article">
    <h3>📝 Ajouter un article</h3>
    <input v-model="newArticle.title" placeholder="Titre de l'article" />
    <textarea v-model="newArticle.content" placeholder="Contenu de l'article"></textarea>
    <input v-model="newArticle.metaTitle" placeholder="SEO Title" />
    <input v-model="newArticle.metaDescription" placeholder="SEO Description" />
    <!-- <input v-model="newArticle.slug" placeholder="Slug" /> -->
    <input v-model="newArticle.tags" placeholder="Tags (séparés par des virgules)" />
    <input type="file" @change="handleFileChange" />
    <button @click="postArticle">Publier</button>
  </div>

  <div v-if="articles.length === 0">❌ Aucun article trouvé.</div>
  <div v-for="article in articles" :key="article.slug" class="article-card">
    <h1>{{ article.title }}</h1>
    <p>
      <img
        :src="'http://localhost:8000'+article.cover?.path"
        alt="cover"
        width="150"
        v-if="article.cover"
      />
    </p>
    <p><strong>SEO Title:</strong> {{ article.metaTitle }}</p>
    <p><strong>SEO Description:</strong> {{ article.metaDescription }}</p>
    <p><strong>Slug:</strong> {{ article.slug }}</p>
    <p><strong>Auteur:</strong> {{ article.author?.email || "Inconnu" }}, {{ article.author?.firstname || "Pas de prénom" }}</p>
    <p><strong>Tags:</strong> {{ article.tags.join(', ') }}</p>
    <router-link :to="`/articles/${article.slug}`">
      <button>Voir +</button>
    </router-link>
  </div>
</template>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.article-card:hover {
  transform: translateY(-3px);
}

.article-card h1 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.article-card p {
  margin: 4px 0;
  font-size: 0.95rem;
  color: #555;
}

.article-card img {
  border-radius: 10px;
  margin-top: 5px;
}

.filters,
.add-article {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
  margin-bottom: 25px;
}

.filters input,
.add-article input,
.add-article textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
}

.add-article textarea {
  min-height: 120px;
  resize: vertical;
}

.add-article h3 {
  grid-column: 1 / -1;
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #2c3e50;
}

.add-article button {
  padding: 12px;
  background-color: #42b883;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  grid-column: 1 / -1;
}

.add-article button:hover {
  background-color: #42b883;
}

button {
  padding: 10px 15px;
  background-color: #16cd5c;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #2f8860;
}

</style>
