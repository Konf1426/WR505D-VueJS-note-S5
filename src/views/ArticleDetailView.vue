<template>
    <div class="container">
      <div v-if="loading">Chargement de l'article...</div>
      <div v-else-if="error">❌ {{ error }}</div>
      <div v-else>
        <h1>{{ article.title || "❌ Pas de titre" }}</h1>
        <p>{{ article.content || "❌ Pas de contenu" }}</p>
  
        <h2>💬 Commentaires</h2>
        <div v-if="comments.length === 0">Aucun commentaire.</div>
        <div v-for="comment in comments" :key="comment.id" class="comment">
        <p><strong>{{ comment.author?.firstname || "Anonyme" }} {{ comment.author?.lastname || "" }}</strong> : {{ comment.message }}</p>
        </div>

  
        <div v-if="authStore.isAuthenticated">
          <h3>Ajouter un commentaire</h3>
          <textarea v-model="newComment" placeholder="Écrivez votre commentaire..."></textarea>
          <button @click="postComment">Envoyer</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch } from "vue";
  import { useRoute } from "vue-router";
  import apiClient from "@/services/axios";
  import { useAuthStore } from "@/stores/auth";
  
  export default {
    setup() {
      const route = useRoute();
      const article = ref(null);
      const comments = ref([]);
      const newComment = ref("");
      const loading = ref(true);
      const error = ref(null);
      const authStore = useAuthStore();
  
      // 🔥 **Récupération de l'article**
      const fetchArticle = async () => {
        if (!route.params.slug) {
          console.error("❌ Slug introuvable !");
          error.value = "Article introuvable.";
          loading.value = false;
          return;
        }
  
        try {
          console.log("🔍 Slug récupéré :", route.params.slug);
          const response = await apiClient.get(`/content/${route.params.slug}`);
          article.value = response.data;
          console.log("✅ Article chargé :", article.value);
        } catch (err) {
          console.error("❌ Erreur de récupération de l'article :", err);
          error.value = "Erreur de chargement de l'article.";
        } finally {
          loading.value = false;
        }
      };
  
      // 🔥 **Récupération des commentaires**
      const fetchComments = async () => {
        if (!article.value || !article.value.id) {
            console.error("❌ ID de l'article introuvable !");
            return;
        }

        try {
            console.log("📥 Chargement des commentaires...");
            const response = await apiClient.get(`/comments?contentId=${article.value.id}`, {
            headers: {
                Authorization: `Bearer ${authStore.token}`, // 🔥 Ajoute le token ici
            },
            });
            comments.value = response.data.member || [];
            console.log("✅ Commentaires chargés :", comments.value);
        } catch (err) {
            console.error("❌ Erreur de chargement des commentaires :", err.response?.data || err);
        }
        };

  
      // ✍️ **POST d'un commentaire**
      const postComment = async () => {
  if (!authStore.isAuthenticated) {
    alert("⚠️ Vous devez être connecté pour commenter !");
    return;
  }

  if (!newComment.value.trim()) {
    alert("❌ Le commentaire ne peut pas être vide !");
    return;
  }

  if (!article.value || !article.value.id) {
    alert("❌ Impossible de poster le commentaire, article introuvable !");
    return;
  }

  try {
    const payload = {
      message: newComment.value,
      contentId: article.value.id, // ✅ Correction ici → l'API attend contentId
    };

    console.log("📤 Envoi du commentaire :", payload);

    await apiClient.post("/comments", payload, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/ld+json",
      },
    });

    console.log("✅ Commentaire ajouté !");
    newComment.value = "";
    fetchComments(); // 🔥 Recharge les commentaires après ajout
  } catch (err) {
    console.error("❌ Erreur lors de l'envoi du commentaire :", err.response?.data || err);
  }
};



  
      onMounted(() => {
        fetchArticle();
      });
  
      watch(article, (newArticle) => {
        if (newArticle) {
          fetchComments();
        }
      });
  
      return { article, comments, newComment, postComment, loading, error, authStore };
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
  
  .comment {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  
  textarea {
    width: 100%;
    min-height: 80px;
    margin-top: 10px;
  }
  
  button {
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  