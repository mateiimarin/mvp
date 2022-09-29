<template>
<div>
    <div>
        <div>Train</div>
        <div>Code</div>
        <div> {{loggedInUser }} </div>
    </div>
    <div>
        <trainer />
        <editor />
    </div>
</div>
</template>

<script setup>
import trainer from '../components/train.vue'
import editor from '../components/editor.vue'
import { loggedInUser } from '../store';

</script>