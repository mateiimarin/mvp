<template>
    <p>{{status}}</p>
    <video id="webcam" autoplay ref="VIDEO"></video>
    
    <button id="enableCam" @click="enableCam">Enable Webcam</button>
    <div v-for="i in datacollectors">
      <button class="dataCollector" :data-1hot="i" :data-name="i" @mousedown="gatherDataForClass(i-1)" @mouseup="gatherDataForClass(i-1)" @touchend="gatherDataForClass(i-1)">Gather Class {{i}} Data</button>
    </div>
    <button id="train" @click="trainAndPredict">Train &amp; Predict!</button>
    <button id="reset" @click="reset">Reset</button>
</template>

<style scoped>

</style>

<script setup>

import { ref } from 'vue';

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
const dataCount = ref([]);
let predict = false;

 const loadMobileNetFeatureModel = async () => {
  const URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
  mobilenet = await tf.loadGraphModel(URL, {fromTFHub: true});
  status.value = 'Model is ready';

  tf.tidy(() => {
    let answer = mobilenet.predict(tf.zeros([1, 224, 224, 3]));
    console.log(answer.shape);
  });
}

loadMobileNetFeatureModel();



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

const gatherDataForClass = (classId) => {
  if(gatherDataState === stopCollection) gatherDataState = classId;
  else gatherDataState = stopCollection;
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
  console.log(oneHotOutputs);
  console.log(inputsAsTensor);
  let dx = inputsAsTensor.arraySync();
  let xd = JSON.stringify(dx);
  let xdd = JSON.parse(xd);
  console.log(xd);

  let xddd = tf.tensor(xdd);
    
      let dx2 = oneHotOutputs.arraySync();
  let xd2 = JSON.stringify(dx2);
  let xdd2 = JSON.parse(xd2);
  console.log(xd2);

  let xddd2 = tf.tensor(xdd2);
  
  let results = await model.fit(xddd, xddd2, {
    shuffle: true,
    batchSize: 5,
    epochs: 15,
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