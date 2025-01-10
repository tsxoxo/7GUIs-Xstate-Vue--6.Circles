<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { circlesMachine } from './circlesMachine'
import { createBrowserInspector } from '@statelyai/inspect'
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { Person } from './types'
import type { Circle } from './types'


const { inspect } = createBrowserInspector({
  // Comment out the line below to start the inspector
  autoStart: false
});

const { snapshot, send } = useMachine(circlesMachine, {
  inspect
})

const lastClickCoordinates = ref()
const handleClick = e => {
  lastClickCoordinates.value = [e.offsetX, e.offsetY]
  send({ type: 'CLICK', coordinates: lastClickCoordinates.value })
}


// function checkIfIntersectsWithAny() {
//   const deltasOfX: number[] = snapshot.value.context.circles.map(circle => Math.abs(circle.coordinates[0] - lastClickCoordinates.value[0]))
//   const smallestX: number = Math.min(...deltasOfX)
//   // check if there are more of this smallest X
//   const allX: number[] = getAllIndexes(deltasOfX, smallestX)
//   // what index do these have?

//   const circleWinnersX: Circle[] = allX.map(indexOfCircle => snapshot.value.context.circles[indexOfCircle])
//   const isClickInside: boolean[] = circleWinnersX.map(({ coordinates, radius }) => {
//     const distance = Math.hypot(coordinates[0] - lastClickCoordinates.value[0], coordinates[1] - lastClickCoordinates.value[1])
//     return (distance < radius ? true : false)
//   })
// }
</script>

<template>
  <main>
    <div id="canvas" @click="handleClick">
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <circle v-for="(circle, index) in snapshot.context.circles" :cx="circle.coordinates[0]"
          :cy="circle.coordinates[1]" :r="circle.radius" class="circle"
          :class="[index === snapshot.context.indexOfSelectedCircle ? 'selected' : '']" :key="circle.id" />

      </svg>
    </div>

    <div id="buttons">
      <button>
        Undo
      </button>
      <button>
        Redo
      </button>
    </div>
  </main>
</template>