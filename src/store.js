import { ref } from "vue";
import { getAuth } from "firebase/auth";
import { getFirestore, Timestamp, updateDoc } from "firebase/firestore";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// db connection

const db = getFirestore();

//storage connection
const storage = getStorage();

// Return current page route
// const currentRoute = useRoute().path;

// Return current user uid
const auth = getAuth();
const user = auth.currentUser;
const uid = ref("");
if(user) { uid.value = user.uid; }
const loggedInUser = uid.value;

const userProjects = ref([]);


//Fetching User Projects
if(user) 
{
    getDocs(collection(db, "users/" + loggedInUser + "/projects"))
        .then((snapshot) => {
            let projects = [];
            snapshot.docs.forEach((doc) => {
                projects.push(doc.data());
            })
            userProjects.value = projects;
        })
}

const currentUserProject = ref("");

export {
    loggedInUser,
    db, 
    userProjects,
    currentUserProject
}