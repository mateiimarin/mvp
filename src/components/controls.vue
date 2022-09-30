<template>
    <div id="controls">
        <div id="projectView" >
            <div class="row">
                <div class="col-sm-5">
                    <input placeholder="New project" v-model="pageName"/>
                    <button @click="createPage">Create new Project</button>
                    <span> {{errorMessage}}</span>
                </div>
                <div class="col-sm-5">
                    <div v-for="project in userProjects" @click="updateCurrentUserProject(project.name)"> {{project.name}} </div>
                </div>
            </div>
        </div>
        <div id="projectControls">
            <button @click="saveProject">Save</button>
            <div>{{ currentUserProject }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { db, userProjects, currentUserProject, loggedInUser, dataClasses, appCode } from '../store'
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
        console.log("STARTEDDD")
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
            js_code: jsScript.value,
        });
    }


    update();

}

const pageName = ref("");
const errorMessage = ref("");

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
    }
</style>