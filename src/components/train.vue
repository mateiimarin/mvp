<template>
    <p>{{status}}</p>
    <video id="webcam" autoplay ref="VIDEO"></video>


        <div id="classList">
          <div v-for="i in datacollectors">
            <div class="classItem">
              <span class="dataCounter">{{dataCount[i-1]}}</span>
              <span contenteditable="true" @keyup="updateClass(i-1)" :id="i">{{ CLASSES[i-1] }}</span>
              <button class="dataCollector" :data-1hot="i" :data-name="i" @click="gatherDataForClass(i-1)" @touchend="gatherDataForClass(i-1)"><font-awesome-icon icon="fa-solid fa-plus" /></button>
            </div>
          </div>
    </div>
    
    <button id="enableCam" @click="enableCam">Enable Webcam</button>
    <button id="addClass" @click="addClass"><font-awesome-icon icon="fa-solid fa-plus" /></button>
    <button id="train" @click="trainAndPredict">Train</button>
    <button id="reset" @click="reset">Reset</button>
</template>

<style lang="scss" scoped>
#webcam {
  max-width: 100% !important;
  border-radius: 5px;
}

.classItem {
  padding: 5px 10px;
  background-color: #eeeeee;
  border-radius: 5px;
  margin-bottom: 5px;
  min-height:  32px;

  .dataCollector {
    float: right;
    border: none;
    border-radius: 3px;
    font-size: 14px;
    background-color: rgb(231, 231, 231);
  }

  .dataCounter {
    font-size: 12px;
    font-weight: 700;
    padding: 3px 6px;
    background-color: powderblue;
    border-radius: 5px;
    
  }

}

#classList {
    max-height: 120px;
    overflow: auto;
  }

#enableCam, #train, #reset, #addClass {
  border: none;
  padding: 4px 8px;
  margin-right: 5px;
  border-radius: 3px;
}


#train, #reset {
 float: right;

}

#train {
  margin-right: 0px !important;
}
</style>

<script setup>

import { ref, watch } from 'vue';
import { isModelLoaded, rawDataInputs, rawHotPoints, dataClasses, getModelData, currentUserProject } from '../store'

const status = ref("Loading tensorflow.js");
const datacollectors = ref(3);
const VIDEO = ref();
const CLASSES = ref(['Class 1', 'Class 2', 'Class 3']);
const stopCollection = -1;

let mobilenet = undefined;
let gatherDataState = stopCollection;
let videoIsPlaying = false;
let inputData = [];
let outputData = [];
const dataCount = ref([0, 0, 0]);
let predict = false;

  const loadMobileNetFeatureModel = async () => {
  const URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
  mobilenet = await tf.loadGraphModel(URL, {fromTFHub: true});
  status.value = 'Model is ready';

  tf.tidy(() => {
    let answer = mobilenet.predict(tf.zeros([1, 224, 224, 3]));
    console.log(answer.shape);

    isModelLoaded.value = true;
    console.log("Converted")
    
  });
}

loadMobileNetFeatureModel();

const updateClass = (index) => {
  let iid = index+1;
  let sid = iid.toString();
  CLASSES.value[index] = document.getElementById(sid).innerText;
  dataClasses.value[index] = CLASSES.value[index];
} 


const addClass = () => {
  let vl = datacollectors.value + 1;
  let stringvl = vl.toString();
  CLASSES.value.push('Class ' + stringvl);
  dataClasses.value.push('Class ' + stringvl);
  dataCount.value.push(0);
  datacollectors.value++;
}

let model = tf.sequential();
model.add(tf.layers.dense({inputShape: [1024], units: 128, activation: 'relu'}));
model.add(tf.layers.dense({units: CLASSES.value.length, activation: 'softmax'}));

model.summary();

model.compile({ optimizer: 'adam', loss: (CLASSES.value.length === 2) ? 'binaryCrossentropy': 'categoricalCrossentropy', 
  metrics: ['accuracy']  
});


const userMediaAccepted = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}


const enableCam = () => {
  if (userMediaAccepted()) {
    navigator.mediaDevices.getUserMedia({
      video: true,
      width: 640, 
      height: 480 

    }).then((stream) => {
      VIDEO.value.srcObject = stream;
      VIDEO.value.addEventListener('loadeddata', () => {
        videoIsPlaying = true;
      });
    });
  } else {
    console.warn('Your browser doesnt support getUserMedia()');
  }
}

const gatherDataForClass = (classId) => {3

  if(gatherDataState === classId) gatherDataState = stopCollection;
  else gatherDataState = classId;
  dataGatherLoop();
}

const calculateFeaturesOnCurrentFrame = () => {
  return tf.tidy(() => {
    let videoFrameAsTensor = tf.browser.fromPixels(VIDEO.value);
    let resizedTensorFrame = tf.image.resizeBilinear(
        videoFrameAsTensor, 
        [224, 224],
        true
    );

    let normalizedTensorFrame = resizedTensorFrame.div(255);

    return mobilenet.predict(normalizedTensorFrame.expandDims()).squeeze();
  });
}


watch(isModelLoaded, () => {
  getModelData(currentUserProject.value)
  .then((value) => {
    console.log()
    CLASSES.value = value.classes.slice();
    dataClasses.value = value.classes.slice();


    datacollectors.value = value.classes.length;
  })

})


 const dataGatherLoop = () => {

  if (videoIsPlaying && gatherDataState !== stopCollection) {
    let imageFeatures = calculateFeaturesOnCurrentFrame();

    inputData.push(imageFeatures);
    outputData.push(gatherDataState);

    if (dataCount.value[gatherDataState] === undefined) {
      dataCount.value[gatherDataState] = 0;
    }

    dataCount.value[gatherDataState]++;

    status.value = '';
    
    for (let i = 0; i < CLASSES.value.length; i++) {
      status.value += CLASSES.value[i] + ' data count: ' + dataCount.value[i] + '. ';
      console.log( CLASSES.value[i] + ' data count: ' + dataCount.value[i] + '. ')
    }

    window.requestAnimationFrame(dataGatherLoop);
  }
}

const trainAndPredict = async () => {
  predict = false;
  tf.util.shuffleCombo(inputData, outputData);

  let outputsAsTensor = tf.tensor1d(outputData, 'int32');
  let oneHotOutputs = tf.oneHot(outputsAsTensor, CLASSES.value.length);
  let inputsAsTensor = tf.stack(inputData);


  /*JSON encoding test */

  let dx = inputsAsTensor.arraySync();
  let xd = JSON.stringify(dx);
  let xdd = JSON.parse(xd);

  rawDataInputs.value = JSON.stringify(dx);

  let xddd = tf.tensor(xdd);
    
  let dx2 = oneHotOutputs.arraySync();
  let xd2 = JSON.stringify(dx2);
  let xdd2 = JSON.parse(xd2);

  rawHotPoints.value = xd2;

  let xddd2 = tf.tensor(xdd2);
  
  let results = await model.fit(xddd, xddd2, {
    shuffle: true,
    batchSize: 15,
    epochs: 40,
    callbacks: {onEpochEnd: displayProgress}
  });
  

  outputsAsTensor.dispose();
  oneHotOutputs.dispose();
  inputsAsTensor.dispose();
  
  predict = true;
  predictLoop();
  
}

const displayProgress = (epoch, logs) => {
  console.log('Epoch: ' + epoch, logs);
}

const predictLoop = () => {
  if (predict) {
    tf.tidy(() => {
      let imageFeatures = calculateFeaturesOnCurrentFrame();
      let prediction = model.predict(imageFeatures.expandDims()).squeeze();
      let highestIndex = prediction.argMax().arraySync();
      let predictionArray = prediction.arraySync();
      status.value = CLASSES.value[highestIndex] + ' with ' + Math.floor(predictionArray[highestIndex] * 100) + '% confidence';
    });

    window.requestAnimationFrame(predictLoop);
  }
}

</script>