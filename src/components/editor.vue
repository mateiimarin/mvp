<template>
<div class="row">
    <div class="col-sm-6">
        <div v-for="(element, index) in appCode">
            {{ blocks[element.id].name }}
            <span v-if="blocks[element.id].has_slot" :id="index" contenteditable="true" @keyup="updateBlock(index)"> {{ element.content}} </span>

        </div>
    </div>
    <div class="col-sm-6">
        <div v-for="(block, index) in blocks">
            {{block.name}}

            <button @click="addBlock(index)">Add</button>
        </div>
    </div>
</div>
</template>

<script setup>

    import { ref } from 'vue';
    import { appCode, jsScript } from '../store'

    const blocks = [
        {
            name: 'if',
            start_tag: 'if(',
            end_tag: ') {',
            has_slot: true,
        },
        {
            name: 'if end',
            start_tag: '}',
            end_tag: '',
            has_slot: false,
        },

        {
            name: 'for',
            start_tag: 'for( let i=0; i<',
            end_tag: '; i++) {',
            has_slot: true,
        },

        {
            name: 'for end',
            start_tag: '}',
            end_tag: '',
            has_slot: false,
        },

        {
            name: 'timeout',
            start_tag: 'setTimeout(function {',
            end_tag: '',
            has_slot: false,
        },

        {
            name: 'timeout end',
            start_tag: '},',
            end_tag: ' )',
            has_slot: true,
        },

        {
            name: 'alert',
            start_tag: 'alert(',
            end_tag: ')',
            has_slot: true
        },
        {
            name: 'log',
            start_tag: 'console.log(',
            end_tag: ')',
            has_slot: true
        },
        {
            name: 'notify',
            start_tag: 'notify(',
            end_tag: ')',
            has_slot: true
        }

    ];


    const addBlock = (index) => {
        let obj = {
            id: index,
            content: ``,
        }

        if(blocks[index].has_slot) obj.content=`Slot`;

        appCode.value.push(obj);
        build();
        console.log(jsScript.value)
    }

    const updateBlock = (index) => {
        appCode.value[index].content = document.getElementById(index).innerText;
        build();
    }

    
    const build = () => {
        for(let i=0; i<appCode.value.length; i++) {
            jsScript.value += blocks[appCode.value[i].id].start_tag;
            jsScript.value += appCode.value[i].content;
            jsScript.value += blocks[appCode.value[i].id].end_tag; 
        }
    }


</script>