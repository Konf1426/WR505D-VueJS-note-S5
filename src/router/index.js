import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import DashboardView from "@/views/DashboardView.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue"
import AdminView from "@/views/AdminView.vue";
import ArticlesView from "@/views/ArticlesView.vue";
import ArticleDetailView from "@/views/ArticleDetailView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/dashboard", component: DashboardView },
  { 
    path: "/admin",
    component: AdminView,
    meta: { requiresAuth: true, role: "admin" }
  },
  { path: "/articles", component: ArticlesView },
  { path: "/articles/:slug", component: ArticleDetailView, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.user) {
    await authStore.fetchUser(); // Charger l’utilisateur avant d’évaluer la route
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    next("/dashboard"); // Redirection si pas autorisé
  } else {
    next();
  }
});

export default router;
