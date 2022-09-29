<template>
    <div id="controls">
        <div >
            <div class="row">
                <div class="col-sm-5">
                    <input placeholder="New project" />
                    <button>Create new Project</button>
                </div>
                <div class="col-sm-5">
                    <div v-for="project in userProjects" @click="updateCurrentUserProject(project.name)"> {{project.name}} </div>
                </div>
            </div>
        </div>
        <div id="projectControls">
            <button>Save</button>
            <div>{{ currentUserProject }}</div>
        </div>
    </div>
</template>

<script setup>
import { userProjects, currentUserProject } from '../store'

const updateCurrentUserProject = (id) => {
    localStorage.setItem("currentUserProject", id);
    currentUserProject.value = id;
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