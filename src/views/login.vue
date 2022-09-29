<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-4 wrapper">
    
            </div>
            <div class="col-lg-8">
                <div class="form">
                    <h2 style="font-weight:700;">Log into startup2</h2>
                    <p><button @click="signInWithGoogle" class="GoogleSignInButton">Sign in with Google</button></p>
                    <hr/>
                    <p class="tag">Email adress</p>
                    <p><input type="text" class="boxInput" v-model="email"/></p>
                    <p class="tag">Password<span id="forgotPasswordButton">Forgot Password</span></p>
                    <p><input type="password" class="boxInput" v-model="password"/></p>
                    <p v-if="errorMessage" id="error">{{ errorMessage }}</p>
                    <p><button @click="login" id="signInButton">Continue</button></p>
                    <router-link to="./signup" id="toSignUp">Not a member yet? <b style="color:#000">Sign up.</b></router-link>
                </div>
            </div>
        </div>
    </div>    
    </template>
    
    <script setup>
        import { ref } from "vue";
        import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
        import { useRouter, onBeforeRouteLeave } from "vue-router";
        const router = useRouter();
        
        const email = ref("");
        const password = ref("");
        const errorMessage = ref()
        const login = () => {
    
            const auth = getAuth();
            signInWithEmailAndPassword(auth, email.value, password.value)
                .then((data) => {
                    console.log("Logged in")
                    router.push("/dashboard")
                })
                .catch((error) => {
                    console.log(error.code)
                    console.log(error.message)
    
                    switch (error.code) {
                        case "auth/invalid-email":
                            errorMessage.value = "Invalid Email"
                            break;
                        case "auth/user-not-found":
                            errorMessage.value = "Email not registered"
                            break;
                        case "auth/wrong-password":
                            errorMessage.value = "Incorrect Password"
                            break;
                        default:
                            errorMessage.value = "Invalid Email or Password"
                            break;
                    }
                })
    
        };
    
        const signInWithGoogle = () => {
            const provider = new GoogleAuthProvider();
            signInWithPopup(getAuth(), provider)
                .then((result) => {
                    console.log(result.user)
                    router.push("/feed")
                })
                .catch((error) => {
                    console.log(error.message)
                })
        };
    </script>
    
    <style scoped>
    .wrapper { 
        background-color:#000; 
        min-height:100vh;
    }
    
    @media(max-width: 992px)
    {
        .wrapper {display:none;}
    }
    
    @media(max-width: 992px)
    {
        .form {
            width:90% !important;
        }
    }
    
    .boxInput {
        padding:8px 14px 8px 14px;
        outline:none;
        border-radius:6px;
    }
    
    #TermsConsent {padding:10px;}
    
    .form {
        margin:auto;
        width:40%;
        margin-top:20vh;
    }
    
    .boxInput {
        width:100%;
        border: 2px solid #fff;
        background-color:#f3f3f4;
    }
    
    .boxInput:focus {
         border: 2px solid #4d74f3 !important;
         box-shadow: 0px 0px 0px 4px #688bff34;
    }
    
    .boxInput:hover {
        border: 2px solid #f3f3f4;
        box-shadow: 0px 0px 0px 4px #688bff34;
        transition: .15s ease-in;
    }
    
    .GoogleSignInButton {
        padding:8px 14px 8px 14px;
        border-radius:6px;
        color: rgb(69, 69, 69);
        border:1px solid rgb(212, 212, 212);
        background-color: #fff;
        width:100%;
        font-weight:500;
    }
    
    .tag {
        font-weight:600;
        margin-bottom:5px;
        margin-top:10px;
    }
    
    #error {
        font-size:14px;
        color:rgb(218, 29, 29);
        font-weight:500;
        margin-top:5px;
    }
    
    #forgotPasswordButton {
        float:right;
        font-size:14px;
        color:#4d74f3;
    }
    
    #signInButton {
        padding:8px 14px 8px 14px;
        border-radius:6px;
        color: rgb(255, 255, 255);
        border:1px solid rgb(212, 212, 212);
        background-color: #4d74f3;
        width:100%;
        font-weight:500;
    }
    
    #toSignUp {
        text-decoration: none;
        color: rgb(76, 76, 76);
    }
    
    </style>