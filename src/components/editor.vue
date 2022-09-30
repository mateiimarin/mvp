<template>


        <div v-for="(element, index) in appCode" class="codeBlock">
            {{ blocks[element.id].name }}
            <span v-if="blocks[element.id].has_slot" :id="index" contenteditable="true" @keyup="updateBlock(index)"> {{ element.content}}  </span>
            <font-awesome-icon icon="fa-solid fa-xmark" style="float:right; color: #a9a9a9; " @click="deleteBlock(index)"/>
        </div>


        <div id="blocksList">
            <div v-for="(block, index) in blocks">
            <span @click="addBlock(index)">{{block.name}}</span>
        </div>
        </div>

</template>

<style lang="scss">
    .codeBlock {
        padding: 4px 10px;
        background-color: #F5F5F5;
        border-radius: 5px;
        margin-bottom: 5px
    }

    #blocksList {
        
         div {
            display: inline-block;
            margin-right: 10px;
            background-color: #76DCC2;
            padding: 2px 8px;
            border-radius: 3px;
            margin-top: 6px;

         }
    }
</style>

<script setup>

    import { ref, watch } from 'vue';
    import { isModelLoaded, appCode, currentUserProject, jsScript } from '../store'

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
        },
        {
            name: 'write',
            start_tag: 'document.getElementById("writeFunctionField").innerText += ',
            end_tag: ';',
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

    const deleteBlock = (index) => {
        appCode.value.splice(index, 1);
    }

    
    const build = () => {
        jsScript.value="";
        for(let i=0; i<appCode.value.length; i++) {
            jsScript.value += blocks[appCode.value[i].id].start_tag;
            jsScript.value += appCode.value[i].content;
            jsScript.value += blocks[appCode.value[i].id].end_tag; 
        }
    }

    watch(isModelLoaded, () => {
  getModelData(currentUserProject.value)
  .then((value) => {
    CLASSES.value = value.classes.slice();
    datacollectors.value = value.classes.length;
    appCode.value = value.template.slice();
    jsScript.value = value.script;
  })

})


</script>