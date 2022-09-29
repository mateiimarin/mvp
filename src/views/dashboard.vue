<template>

    <!-- Import TensorFlow.js library -->

    <div class="container-fluid app-wrapper" >
        <div class="row">
            <div class="col-lg-4" style="background-color: #f5f5f5; min-height: 100vh">
            <workspace />
            <Controls />

            </div>
            <div class="col-lg-8">

            </div>
        </div>
    </div>
</template>

<script setup>
import workspace from '../components/workspace.vue'
import Controls from '../components/controls.vue'


</script>

<style lang="scss">
    .app-wrapper {
        min-height: 100vh;

    }
</style>


