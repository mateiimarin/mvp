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

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        );
    });
};

router.beforeEach(async (to, from, next) => {
    if(to.matched.some((record) => record.meta.requiresAuth)) {
        if(await getCurrentUser()) {
            next();
        } else {
            next("/signup");
        }
    } else {
        next();
    }
});

export { router };