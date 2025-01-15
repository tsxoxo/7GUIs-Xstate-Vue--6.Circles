<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { circlesMachine } from './circlesMachine'
import { createBrowserInspector } from '@statelyai/inspect'
import { computed } from 'vue';


const { inspect } = createBrowserInspector({
  // Comment out the line below to start the inspector
  autoStart: false
});

const { snapshot, send } = useMachine(circlesMachine, {
  inspect
})
const circles = computed(() => snapshot.value.context.states[snapshot.value.context.stateHistory[snapshot.value.context.currentPosInStateHistory]])

// const lastClickCoordinates = ref({x: 0, y: 0})
const handleClick = (e: MouseEvent) => {
  // lastClickCoordinates.value = {x: e.offsetX, y: e.offsetY}
  send({ type: 'leftClickOnCanvas', coordinates: { x: e.offsetX, y: e.offsetY } })
}
// watch(() => snapshot.value, (snapshot) => console.log(snapshot.value)
// )
</script>

<template>
  <main>
    <button @click="send({ type: 'changeCircle' })">change circle</button>
    <div id="canvas" @click="handleClick">
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <circle v-for="(circle, index) in circles" :cx="circle.coordinates.x" :cy="circle.coordinates.y"
          :r="circle.radius" class="circle"
          :class="[index === snapshot.context.indexOfSelectedCircle ? 'selected' : '']" :key="circle.id" />

      </svg>
    </div>

    <div id="menu">
      <div id="slider-div">
        <input @input="(e: Event) => {
          const target = e.target as HTMLInputElement
          send({ type: 'changeRadius', newRadius: Number(target.value) })
        }" type="range" id="radius-slider" name="radius-slider" min="1" max="1000"
          :value="circles[snapshot.context.indexOfSelectedCircle]?.radius || 0" step="1"
          :disabled="snapshot.context.indexOfSelectedCircle === -1" />
      </div>
      <div id="buttons">
        <template v-if="snapshot.value === 'ready'">
        <button @click="send({ type: 'undo', })" :disabled="snapshot.context.currentPosInStateHistory === 0">
          Undo
        </button>
        <button @click="send({ type: 'redo', })"
          :disabled="snapshot.context.stateHistory[snapshot.context.currentPosInStateHistory] === snapshot.context.states.length - 1">
          Redo
        </button>
        </template>
        <template v-else-if="snapshot.value === 'changingCircle'">
          <button @click="send({ type: 'cancel', })">Cancel</button>
          <button @click="send({ type: 'confirm', })">Confirm</button>
        </template>
      </div>
    </div>
  </main>
</template>