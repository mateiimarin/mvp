<template>

    <!-- Import TensorFlow.js library -->

    <div class="container-fluid app-wrapper" >
        <div class="row">
            <div class="col-lg-3" style="background-color: #ECEEEE; min-height: 100vh; padding-top: 20px; position: relative;">
            <workspace />
            <Controls/>

            </div>
            <div class="col-lg-9">
                <iframe :src="getURL()" id="appPreview" :key="updateKey"></iframe>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { currentUserProject, updateKey} from '../store';
import workspace from '../components/workspace.vue'
import Controls from '../components/controls.vue'

const getURL = () => {
    return 'http://127.0.0.1:5173/p/' + currentUserProject.value;
}


</script>

<style lang="scss">
    .app-wrapper {
        min-height: 100vh;

        #appPreview {
            min-width: 100%;
            height: 100vh;
        }


    }
</style>


