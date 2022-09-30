<template>
    <textarea id="codeEditor" @keyup="saveChanges()" placeholder="Write HTML and CSS code here" v-model="codeField">

    </textarea>
</template>

<style lang="scss" scoped>
    #codeEditor {
        resize: vertical;
        outline: none;
        border:none;
        width: 100%;
        background-color: #f5f5f5;
        border-radius: 6px;
        padding: 10px;
    }
</style>
<script setup>
import { ref } from 'vue';
import { htmlC } from '../store';

const codeField = ref("");
const saveChanges = () => {
    htmlC.value = codeField.value;
}

</script>