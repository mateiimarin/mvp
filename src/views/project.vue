<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-5">
                <p>{{status}}</p>
                <video id="webcam" autoplay ref="VIDEO"></video>
                <button id="enableCam" @click="enableCam">Enable Webcam</button>
            </div>
            <div class="col-lg-5">
                <h1>Print results here!!!</h1>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

</style>

<script setup>
import { ref, watch } from 'vue';
import { isModelLoaded, rawDataInputs, rawHotPoints, getModelData, getModelInputs, getModelHotPoints } from '../store'
import { useRoute } from 'vue-router';

const route = useRoute();
const projectId = route.params.projectId;


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

    isModelLoaded.value = true;
    console.log("Converted")
    
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

const trainAndPredict = async () => {
  predict = false;


  getModelInputs(projectId)
  .then((inputsString) => {
    getModelHotPoints(projectId)
    .then( async (hotPointsString) => {
        let modelInputs = tf.tensor(JSON.parse(inputsString));
        let modelHotPoints = tf.tensor(JSON.parse(hotPointsString));
        let results = await model.fit(modelInputs, modelHotPoints, {
            shuffle: true,
            batchSize: 5,
            epochs: 15,
            callbacks: {onEpochEnd: displayProgress}
        });
        
        predict = true;
        predictLoop();
        
    })
  })

}

const displayProgress = (epoch, logs) => {
  console.log('Epoch: ' + epoch, logs);
}

const currentClass = ref("");
const predictLoop = () => {
  if (predict) {
    tf.tidy(() => {
      let imageFeatures = calculateFeaturesOnCurrentFrame();
      let prediction = model.predict(imageFeatures.expandDims()).squeeze();
      let highestIndex = prediction.argMax().arraySync();
      let predictionArray = prediction.arraySync();

      status.value = CLASSES.value[highestIndex] + ' with ' + Math.floor(predictionArray[highestIndex] * 100) + '% confidence';
      
      currentClass.value = CLASSES.value[highestIndex];




    });

    window.requestAnimationFrame(predictLoop);
  }
}

watch(isModelLoaded, () => {
  getModelData(projectId)
  .then((value) => {
    CLASSES.value = value.classes.slice();

    datacollectors.value = value.classes.length;
  })

})

trainAndPredict();




watch(currentClass, (newValue, oldValue) => {
  let code = `
        function notify(title) {
          Notification.requestPermission().then(perm => {
            if(perm === 'granted') {
              let notif = new Notification(title, {
                body: 'New Notification from AIM',

              })
            }
          })
        }

        let x=10;
        let y = 4;
        if(x+y==14) notify("Lorem ipsum", "Dolor sit amet")
      `;

      let f = new Function(code);
      f();
})



</script>