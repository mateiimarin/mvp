<template>
    <div id="controls" >
        <div id="projectView" :class="{ hidden: isHidden }">
            <div class="container-fluid">
                <div class="row">
               
                        <input placeholder="New project" v-model="pageName" id="newInp"/>
                        <button @click="createPage" id="newBtn">Create</button>
                        <span> {{errorMessage}}</span>
               
            
                        <div v-for="project in userProjects" @click="updateCurrentUserProject(project.name)"> {{project.name}} </div>

                </div>
            </div>
        </div>
        <div id="projectControls">
            <button @click="saveProject">Save</button>
            <div @click="isHidden = !isHidden">{{ currentUserProject }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { db, userProjects, currentUserProject, loggedInUser, dataClasses, appCode, jsScript, updateKey, htmlC } from '../store'
import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { rawDataInputs, rawHotPoints, storage } from '../store';
import { ref as refr, uploadString } from "firebase/storage";

const updateCurrentUserProject = (id) => {
    localStorage.setItem("currentUserProject", id);
    currentUserProject.value = id;
}

const saveProject = () => {
    if(rawDataInputs.value != "" && rawHotPoints.value != "")
    {
        uploadString(refr(storage, 'projects/' + currentUserProject.value + '/data/dataInputs'), rawDataInputs.value)
        .then((snap) => {
            console.log('uploaded data inputs');
        });
        uploadString(refr(storage, 'projects/' + currentUserProject.value + '/data/dataHotPoints'), rawHotPoints.value)
        .then((snapx) => {
            console.log('uploadede data hotpoints');
        });
    }

    const update = async () => {
        const projectRef = doc(db, "projects", currentUserProject.value);
        console.log(dataClasses.value)
        await updateDoc(projectRef, {
            classes: dataClasses.value,
            template: appCode.value,
            script: jsScript.value,
            html_code: htmlC.value,
        });
    }

    updateKey.value++;


    update();

}

const pageName = ref("");
const errorMessage = ref("");
const isHidden = ref(true);

const classesTemplate = ["Class 1", "Class 2"]

const createPage = () => {
    if(pageName.value != "") {
        if(!pageName.value.includes(' ')) {
	    let pageRef = doc(db, "projects", pageName.value);
            getDoc(pageRef)
                .then((projectSnap) => {
                if(!projectSnap.exists()) {
                    setDoc(pageRef, {
                        name: pageName.value,
			            uid: loggedInUser,  
                        classes: classesTemplate,
                    });  

                    setDoc(doc(db, "users/" + loggedInUser + "/projects", pageName.value), {
                        name: pageName.value,
                    });  
                             
                    updateCurrentUserProject(pageName.value)
                    pageName.value = "";
                    errorMessage.value = "";
                    
                } else errorMessage.value = "A project with this ID already exists";
            })
        } else errorMessage.value = "Name can't contain spaces";
    } else errorMessage.value = "Name can't be blank"; 
}

</script>

<style lang="scss" scoped>
    #controls {
        background-color: white;
        padding: 10px;

        #projectControls {
            display: flex;

            margin-top: 20px;
             button {
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                background-color: #0a9d67;
                color: white;
                margin-left: auto ;
                order: 2;
             }
              div {
                padding: 5px 10px;
                background-color: #f1f1f1;

              }
        }

        #projectView {
            bottom: 0;
            transition: .3s ease-in;

        }
    }

    .hidden {
        max-height: 0;
        overflow: hidden;
        margin:0;
    }

    #newInp {
        width: 100%;
        border: none;
        background-color: #f5f5f5;
        border-radius: 4px;
        margin-bottom: 5px;
        padding: 10px;
        outline: none;
    }

    #newBtn {
        width: 100%;
        border: none;
        padding: 3px 10px;
        background-color: #76DCC2;
        border-radius: 4px;
    }


</style>