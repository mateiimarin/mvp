<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-4 wrapper">

            </div>
            <div class="col-lg-8">
                <div class="form">
                    <h2 style="font-weight:700;">Sign up to startup2</h2>
                    <button @click="signUpWithGoogle" class="GoogleSignUpButton">&nbsp Sign up with Google</button>
                    <hr/>
                    <p class="tag">Full Name</p>
                    <p><input type="text" class="boxInput" v-model="name"/></p>
                    <p class="tag">Email adress</p>
                    <p><input type="text" class="boxInput" v-model="email"/></p>
                    <p class="tag">Password</p>
                    <p><input type="password" class="boxInput" v-model="password"/></p>
                    <label><input type="checkbox" id="TermsConsent" v-model="consent"/> By continuing you accept our Privacy Policy and Terms of Use</label>
                    <p v-if="errorMessage" id="error">{{ errorMessage }}</p>
                    <p><button @click="signup" id="signUpButton">Continue</button></p>
                    <div style="align-content:center;"><router-link to="./login" id="toLogin">Already have an account? <b style="color:#000">Log in.</b></router-link></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue";
    import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    import { useRouter } from "vue-router";
    import { getFirestore, doc, setDoc} from "firebase/firestore";
    const router = useRouter();
    const db = getFirestore();

    const name = ref("");
    const email = ref("");
    const password = ref("");
    const consent = ref("");
    const errorMessage = ref()

    const signup = () => {

        const auth = getAuth();
        if(name.value != "" && consent.value != "")
        {
            createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((data) => {

                setDoc(doc(db, "users", data.user.uid), {
                name: name.value,
                });
                console.log(data.user.uid)
                router.push("/dashboard")
            })
            .catch((error) => {
                console.log(error.code)
                console.log(error.message)

                switch (error.code) {
                    case "auth/invalid-email":
                        errorMessage.value = "Invalid Email"
                        break;
                    case "auth/email-already-in-use":
                        errorMessage.value = "Email already registered"
                        break;
                    case "auth/weak-password":
                        errorMessage.value = "Password should be at least 6 characters long"
                        break;
                    default:
                        errorMessage.value = "Invalid Email or Password"
                        break;
                }
            })


        } else {
        
            if(name.value == "") errorMessage.value = "Name field can't be blank";
            if(consent.value == "") errorMessage.value = "You have to accept our terms of use"        
        
        }
        
    };

    const signUpWithGoogle = () => {
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

.GoogleSignUpButton {
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

#signUpButton {
    padding:8px 14px 8px 14px;
    border-radius:6px;
    color: rgb(255, 255, 255);
    border:1px solid rgb(212, 212, 212);
    background-color: #4d74f3;
    width:100%;
    font-weight:500;
}

#toLogin {
    text-decoration: none;
    color: rgb(76, 76, 76);
}

</style>

