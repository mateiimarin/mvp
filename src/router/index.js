import {createRouter, createWebHistory} from "vue-router";
import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import { triggerRef, ref } from "vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path:"/", component: () => import("../views/home.vue")},
        {path:"/signup", component: () => import("../views/signup.vue")},
        { path:"/login", component: () => import("../views/login.vue") },
        {
            path:"/dashboard", 
            component: () => import("../views/dashboard.vue"),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path:"/p/:projectId",
            component: () => import("../views/project.vue"),
        }
    ],
});

export { router };