<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { circlesMachine } from './circlesMachine'
import { createBrowserInspector } from '@statelyai/inspect'
import { watch } from 'vue';


const { inspect } = createBrowserInspector({
  // Comment out the line below to start the inspector
  autoStart: false
});

const { snapshot, send } = useMachine(circlesMachine, {
  inspect
})

// const lastClickCoordinates = ref({x: 0, y: 0})
const handleClick = (e: MouseEvent) => {
  // lastClickCoordinates.value = {x: e.offsetX, y: e.offsetY}
  send({ type: 'leftClickOnCanvas', coordinates: { x: e.offsetX, y: e.offsetY } })
}
watch(() => snapshot.value.context, (context) => console.log(context)
)
</script>

<template>
  <main>
    <div id="canvas" @click="handleClick">
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <circle
          v-for="(circle, index) in snapshot.context.states[snapshot.context.stateHistory[snapshot.context.currentPosInStateHistory]]"
          :cx="circle.coordinates.x" :cy="circle.coordinates.y" :r="circle.radius" class="circle"
          :class="[index === snapshot.context.indexOfSelectedCircle ? 'selected' : '']" :key="circle.id" />

      </svg>
    </div>

    <div id="buttons">
      <button @click="send({ type: 'undo', })" :disabled="snapshot.context.currentPosInStateHistory === 0">
        Undo
      </button>
      <button @click="send({ type: 'redo', })"
        :disabled="snapshot.context.stateHistory[snapshot.context.currentPosInStateHistory] === snapshot.context.states.length - 1">
        Redo
      </button>
    </div>
  </main>
</template>