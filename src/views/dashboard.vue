<template>

    <!-- Import TensorFlow.js library -->

    <div class="container-fluid app-wrapper" >
        <div class="row">
            <div class="col-lg-3" style="background-color: #f5f5f5; min-height: 100vh">
            <workspace />
            <Controls />

            </div>
            <div class="col-lg-9">
                <iframe :src="getURL()" id="appPreview"></iframe>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { currentUserProject } from '../store';
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


