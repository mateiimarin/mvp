import { ref, watch } from "vue";
import { getAuth } from "firebase/auth";
import { getFirestore, Timestamp, updateDoc } from "firebase/firestore";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { ref as refr, getStorage, getDownloadURL } from "firebase/storage";
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
const isModelLoaded = ref(false);

//Fetching User Projects
if(user) 
{
    watch(isModelLoaded, () => {
        console.log("START")
        getDocs(collection(db, "users/" + loggedInUser + "/projects"))
        .then((snapshot) => {
            let projects = [];
            snapshot.docs.forEach((doc) => {
                projects.push(doc.data());
            })
            userProjects.value = projects;
            console.log("FINISH")
        })
    })
}

const currentUserProject = ref("");
if(localStorage.currentUserProject != null ) currentUserProject.value = localStorage.getItem("currentUserProject");
const rawDataInputs = ref("");
const rawHotPoints = ref("");

const getModelData = (projectId) => {
    return new Promise((resolve) => {
        getDoc(doc(db, "projects", projectId))
        .then((projectSnap) => {
            resolve(projectSnap.data())
        })
    })
}

const getModelInputs = (projectId) => {
    return new Promise((resolve) => {
        getDownloadURL(refr(storage, 'projects/' + projectId + '/data/dataInputs'))
        .then((url) => {
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'text';
            xhr.onload = (event) => {
              resolve(xhr.response)
              
            };
            xhr.open('GET', url);
            xhr.send();
        })
    })
}

const getModelHotPoints = (projectId) => {
    return new Promise((resolve) => {
        getDownloadURL(refr(storage, 'projects/' + projectId + '/data/dataHotPoints'))
        .then((url) => {
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'text';
            xhr.onload = (event) => {
              resolve(xhr.response)
            };
            xhr.open('GET', url);
            xhr.send();
        })
    })
}

export {
    loggedInUser,
    db, 
    storage,
    userProjects,
    currentUserProject,
    isModelLoaded,
    getModelData, 
    rawDataInputs,
    rawHotPoints,
    getModelInputs,
    getModelHotPoints
}