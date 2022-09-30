<template>
<div :key="openedTab" id="#component">
    <div id="menu">
        <div @click="updateMenu(1)" :class="[{ active: isActive(1) }]">Train</div>
        <div @click="updateMenu(2)" :class="[{ active: isActive(2) }]">Blocks</div>
        <div @click="updateMenu(3)" :class="[{ active: isActive(3) }]">Code</div>
    </div>
    <div id="editCard">
        <trainer v-if="isActive(1)"/>
        <editor v-if="isActive(2)"/>
        <js-editor v-if="isActive(3)" />
    </div>
</div>
</template>

<script setup>
import trainer from '../components/train.vue'
import editor from '../components/editor.vue'
import { loggedInUser, openedTab } from '../store';

const isActive = (id) => {
    return openedTab.value == id;
}

const updateMenu = (id) => {
    openedTab.value = id;
}

</script>

<style lang="scss">

    #menu {
        display: flex;
        background-color: #fff;
        padding: 10px;

        div {
            padding: 5px 15px;
            border-radius: 2px;
            background-color: rgb(222, 222, 222);
            color: #212121;
            margin-right: 5px;
            cursor: pointer;
            transition: .15s ease-in;
        
            &:hover {
                background-color: rgb(209, 209, 209);
            }
        }

        .active {
            background-color: #000;
            color: #f5f5f5;

            &:hover {
                background-color: rgb(0, 0, 0);
            }
        }
    }

    #editCard {
        background-color: white;
        margin-bottom: 40px;
        padding: 10px;
    }



</style>